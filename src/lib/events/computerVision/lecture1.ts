import { part, qx, tfx, type Lecture } from "../types";

export const lecture1: Lecture = {
  id: "cv-l1",
  title: { en: "Lecture 1 — Introduction to Computer Vision", ru: "Лекция 1 — Введение в компьютерное зрение" },
  parts: [
    part(
      "cv-l1-p1",
      { en: "What computer vision is: AI, ML, DL and applications", ru: "Что такое компьютерное зрение: AI, ML, DL и применения" },
      {
        en: `## What computer vision is
**Computer vision (CV)** is about **building artificial systems that process, perceive and reason about visual data** — photos, video frames, medical scans, satellite images.
One useful way to read the three verbs of the definition:
| Verb | What the system does | Example |
|---|---|---|
| Process | turns pixels into other pixels or numbers | resize, remove noise, find edges |
| Perceive | recognizes what is in the picture | ‘this is a cat’, ‘a car on the left’ |
| Reason | draws conclusions about the scene | ‘the car is turning, so slow down’ |
The lecture opens with a collage titled **‘Computer vision is everywhere!’** — think of face unlock on phones, self-driving cars, medical scans, factory robots, space and satellite images.
## Deep learning for computer vision
The course is called ‘Deep Learning for Computer Vision’, and the lecture defines the two extra words:
- **Learning** — building artificial systems that **learn from data and experience** instead of following rules written by hand;
- **Deep** — **hierarchical learning algorithms with many ‘layers’**, **(very) loosely inspired by the brain**.
| Approach | Who decides how it works | Example |
|---|---|---|
| Hand-designed | the programmer writes the rule | Canny: an edge is where brightness changes sharply |
| Learned | the model fits its weights to labelled examples | a network trained on 10 000 photos of cats and dogs |
A hand-designed method can be very useful (edge detectors are used every day), but it **learns nothing** from data. A learned method gets better when you give it more well-labelled data.
## Where computer vision sits among AI fields
The lecture draws a Venn diagram step by step:
- **Artificial Intelligence (AI)** is the large outer circle;
- **Machine Learning (ML)** lies inside AI, and **Deep Learning (DL)** lies inside ML;
- **Computer Vision** lies inside AI and **overlaps** ML and DL but is **not contained** in them — classical CV methods such as edge detection or keypoint matching do not learn;
- **Natural Language Processing**, **Speech Recognition** and **Robotics** are other AI fields that also overlap deep learning;
- **this course** is the red region: the **intersection of computer vision and deep learning**.
= DL ⊂ ML ⊂ AI
= CV ⊂ AI, CV ∩ ML ≠ ∅, CV ⊄ ML
= this course = CV ∩ DL
## What the computer actually receives
To a program a photo is not ‘a cat’ but a **grid of numbers**. In OpenCV:
@diagram cv-image-array
= img = cv2.imread('cat.jpg')
= print(img.shape)  # (480, 640, 3)
= print(img.dtype)  # uint8
- **img.shape** is **(height, width, channels)**: rows first, then columns, then the 3 colour channels — a photo 640 wide and 480 tall gives (480, 640, 3);
- OpenCV stores the channels in **BGR** order (blue, green, red), not RGB;
- every value is an 8-bit integer (**uint8**) from **0 (dark)** to **255 (bright)**;
- a **grayscale** image has a single channel and shape **(height, width)** — there is no third number;
- if the path is wrong, **cv2.imread returns None** without an error, and the program crashes only on the next line that uses img.
= 480 × 640 × 3 = 921 600 numbers
Turning those 921 600 numbers into ‘a cat sitting on a sofa’ is the whole job of computer vision — and the reason it is hard.
## ConvNets are everywhere (2012 to present)
Since 2012 **convolutional networks (ConvNets, CNNs)** solve most vision tasks. The tasks differ in **what the output looks like**:
| Task | Output | Example from the slides |
|---|---|---|
| Image classification | one label for the whole image | ‘leopard’, ‘container ship’, with the top-5 guesses |
| Image retrieval | the images most similar to a query | rows of similar flowers, elephants, pumpkins |
| Object detection | a box, a label and a score for each object | ‘dog 0.99’, ‘person 0.99’ (Ren et al., 2015) |
| Image segmentation | a label for every pixel | road, sky, tree, building, person (Farabet et al., 2012) |
| Video classification | one label for a whole clip | two-stream ConvNet (Simonyan et al., 2014) |
| Activity recognition | what the person is doing | video frames → conv layers → softmax |
| Pose recognition | the positions of body joints | a coloured stick figure over a person (Toshev and Szegedy, 2014) |
| Image captioning | a sentence | ‘A cat sitting on a suitcase on the floor’ |
- **Two-stream video network**: a **spatial stream** ConvNet looks at a **single frame** (what is in the scene), a **temporal stream** ConvNet looks at **multi-frame optical flow** (how things move); their class scores are **fused** at the end.
- **Playing Atari games** (Guo et al., 2014): a ConvNet looks at the game screen and chooses the next move.
- **Image captioning** (Vinyals et al., 2015; Karpathy and Fei-Fei, 2015) joins vision and language: ‘A man riding a wave on top of a surfboard’.
- **DeepDream** (Mordvintsev et al., 2015) makes a network exaggerate the patterns it ‘sees’ in an image.
- **Neural style transfer** (Gatys et al., 2016) redraws a photo in the style of a painting such as Van Gogh's ‘The Starry Night’.
![Four copies of the same sunny street photo in a 2×2 grid: top left the plain photo with a car, a cyclist seen from behind and a dog; top right thin coloured rectangles around the car, the cyclist and the dog; bottom left every pixel tinted by class — road grey, car blue, cyclist red, dog orange, sky light blue, trees green; bottom right a stick figure of coloured lines over the cyclist's joints](/events/cv/l1-vision-tasks.webp)
## Still a long way to go
After all these successes the lecture warns: **despite our success, computer vision still has a long way to go**.
The example (credit: Andrej Karpathy) is a photo of a corridor: a man weighs himself on a scale, another man secretly presses the scale with his foot, and the people around laugh.
To understand the photo, a system has to:
- recognize people, a scale and **mirrors** (some people appear twice);
- know the **physics**: a foot on the platform makes the scale show more weight;
- understand **intentions**: the man on the scale cannot see the foot, and the others are in on the joke.
A classifier can output ‘people, corridor, scale’, but **reasoning about the scene** is still hard — the last verb of the definition is the hardest one.
> Computer vision is the AI field about visual data; deep learning is a part of machine learning that now powers most of it, and this course studies their intersection.
## Check yourself
?? A student says: ‘Computer vision is just a part of deep learning.’ Do you agree? Explain with the AI / ML / DL diagram.
?= No. DL ⊂ ML ⊂ AI, while computer vision is a separate AI field that only overlaps ML and DL: classical methods such as Canny edge detection or SIFT matching solve vision problems without learning. The course studies the intersection CV ∩ DL.
?? A hospital wants every pixel of a CT slice marked as ‘tumour’ or ‘healthy tissue’. Which CV task is this, and why is image classification not enough?
?= Image segmentation — the output is a label for every pixel. Classification gives one label for the whole image, so it could say ‘tumour present’ but not where the tumour is or how big it is.`,
        ru: `## Что такое компьютерное зрение
**Компьютерное зрение (computer vision, CV)** — это **создание искусственных систем, которые обрабатывают, воспринимают визуальные данные и рассуждают о них (process, perceive and reason about visual data)**: о фотографиях, кадрах видео, медицинских снимках, спутниковых изображениях.
Три глагола определения удобно читать так:
| Глагол | Что делает система | Пример |
|---|---|---|
| Process (обработать) | превращает пиксели в другие пиксели или числа | изменить размер, убрать шум, найти края |
| Perceive (воспринять) | узнаёт, что изображено на картинке | «это кошка», «слева машина» |
| Reason (рассуждать) | делает выводы о сцене | «машина поворачивает — надо притормозить» |
Лекция начинается с коллажа под заголовком **«Computer vision is everywhere!»** — вспомните разблокировку телефона по лицу, беспилотные автомобили, медицинские снимки, роботов на заводах, космические и спутниковые снимки.
## Deep learning для компьютерного зрения
Курс называется «Deep Learning for Computer Vision», и в лекции даны определения двух добавленных слов:
- **Learning (обучение)** — создание искусственных систем, которые **учатся на данных и опыте (learn from data and experience)**, а не следуют правилам, написанным вручную;
- **Deep (глубокое)** — **иерархические обучаемые алгоритмы с множеством «слоёв» (layers)**, **(очень) отдалённо вдохновлённые мозгом**.
| Подход | Кто решает, как он работает | Пример |
|---|---|---|
| Hand-designed (ручной) | программист пишет правило | Canny: край там, где яркость резко меняется |
| Learned (обучаемый) | модель подгоняет свои веса под размеченные примеры | сеть, обученная на 10 000 фото кошек и собак |
Ручной метод бывает очень полезен (детекторы краёв используют каждый день), но он **ничему не учится** на данных. Обучаемый метод становится лучше, если дать ему больше хорошо размеченных данных.
## Место компьютерного зрения среди областей AI
В лекции шаг за шагом строится диаграмма Венна:
- **Artificial Intelligence (AI, искусственный интеллект)** — большой внешний круг;
- **Machine Learning (ML, машинное обучение)** лежит внутри AI, а **Deep Learning (DL, глубокое обучение)** — внутри ML;
- **Computer Vision** лежит внутри AI и **пересекается** с ML и DL, но **не содержится** в них: классические методы CV, например поиск краёв или сопоставление ключевых точек, ничему не учатся;
- **Natural Language Processing (обработка естественного языка)**, **Speech Recognition (распознавание речи)** и **Robotics (робототехника)** — другие области AI, которые тоже пересекаются с глубоким обучением;
- **этот курс** — красная область: **пересечение компьютерного зрения и глубокого обучения**.
= DL ⊂ ML ⊂ AI
= CV ⊂ AI, CV ∩ ML ≠ ∅, CV ⊄ ML
= this course = CV ∩ DL
## Что на самом деле получает компьютер
Для программы фотография — не «кошка», а **сетка чисел**. В OpenCV:
@diagram cv-image-array
= img = cv2.imread('cat.jpg')
= print(img.shape)  # (480, 640, 3)
= print(img.dtype)  # uint8
- **img.shape** — это **(height, width, channels)**, то есть (высота, ширина, каналы): сначала строки, потом столбцы, потом 3 цветовых канала; фото шириной 640 и высотой 480 даёт (480, 640, 3);
- OpenCV хранит каналы в порядке **BGR** (синий, зелёный, красный), а не RGB;
- каждое значение — 8-битное целое (**uint8**) от **0 (тёмный)** до **255 (яркий)**;
- у **полутонового (grayscale)** изображения один канал и форма **(height, width)** — третьего числа нет;
- если путь неверный, **cv2.imread возвращает None** без ошибки, и программа падает только на следующей строке, где используется img.
= 480 × 640 × 3 = 921 600 numbers
Превратить эти 921 600 чисел в «кошка сидит на диване» — в этом и состоит вся задача компьютерного зрения, и именно поэтому она трудная.
## ConvNets повсюду (с 2012 года до наших дней)
С 2012 года **свёрточные сети (ConvNets, CNNs)** решают большинство задач зрения. Задачи отличаются тем, **как выглядит ответ (output)**:
| Задача | Ответ | Пример со слайдов |
|---|---|---|
| Image classification (классификация) | одна метка на всё изображение | «leopard», «container ship» с пятью лучшими догадками |
| Image retrieval (поиск похожих изображений) | изображения, больше всего похожие на запрос | ряды похожих цветов, слонов, тыкв |
| Object detection (детекция объектов) | рамка, метка и оценка для каждого объекта | «dog 0.99», «person 0.99» (Ren et al., 2015) |
| Image segmentation (сегментация) | метка для каждого пикселя | дорога, небо, дерево, здание, человек (Farabet et al., 2012) |
| Video classification (классификация видео) | одна метка на весь ролик | two-stream ConvNet (Simonyan et al., 2014) |
| Activity recognition (распознавание действий) | что делает человек | кадры видео → свёрточные слои → softmax |
| Pose recognition (распознавание позы) | положения суставов тела | цветной «скелет» поверх человека (Toshev and Szegedy, 2014) |
| Image captioning (подписи к изображениям) | предложение | «A cat sitting on a suitcase on the floor» |
- **Two-stream video network (двухпотоковая сеть)**: **spatial stream** ConvNet смотрит на **один кадр** (что есть в сцене), **temporal stream** ConvNet — на **optical flow (оптический поток) по нескольким кадрам** (как всё движется); их оценки классов **объединяются (fusion)** в конце.
- **Игры Atari** (Guo et al., 2014): ConvNet смотрит на экран игры и выбирает следующий ход.
- **Image captioning** (Vinyals et al., 2015; Karpathy and Fei-Fei, 2015) соединяет зрение и язык: «A man riding a wave on top of a surfboard».
- **DeepDream** (Mordvintsev et al., 2015) заставляет сеть преувеличивать узоры, которые она «видит» на изображении.
- **Neural style transfer (перенос стиля)** (Gatys et al., 2016) перерисовывает фото в стиле картины, например «Звёздной ночи» Ван Гога.
![Четыре копии одной и той же солнечной уличной фотографии в сетке 2×2: слева сверху исходное фото с машиной, велосипедистом со спины и собакой; справа сверху тонкие цветные прямоугольники вокруг машины, велосипедиста и собаки; слева снизу каждый пиксель окрашен по классу — дорога серая, машина синяя, велосипедист красный, собака оранжевая, небо голубое, деревья зелёные; справа снизу «скелет» из цветных линий поверх суставов велосипедиста](/events/cv/l1-vision-tasks.webp)
## Путь ещё долгий
После всех успехов лекция предупреждает: **despite our success, computer vision still has a long way to go** — несмотря на успехи, компьютерному зрению ещё далеко до цели.
Пример (автор — Andrej Karpathy) — фото коридора: один мужчина взвешивается на весах, другой тайком давит на весы ногой, а люди вокруг смеются.
Чтобы понять это фото, системе нужно:
- узнать людей, весы и **зеркала** (некоторые люди видны дважды);
- знать **физику**: нога на платформе заставляет весы показать больший вес;
- понимать **намерения**: человек на весах не видит ногу, а остальные в курсе шутки.
Классификатор выдаст «люди, коридор, весы», но **рассуждать о сцене** пока трудно — последний глагол определения самый сложный.
> Компьютерное зрение — область AI о визуальных данных; глубокое обучение — часть машинного обучения, на которой сейчас держится большая часть CV, а этот курс изучает их пересечение.
## Проверь себя
?? Студент говорит: «Компьютерное зрение — это просто часть глубокого обучения». Согласны? Объясните с помощью диаграммы AI / ML / DL.
?= Нет. DL ⊂ ML ⊂ AI, а компьютерное зрение — отдельная область AI, которая лишь пересекается с ML и DL: классические методы вроде детектора краёв Canny или сопоставления SIFT решают задачи зрения без обучения. Курс изучает пересечение CV ∩ DL.
?? Больница хочет, чтобы каждый пиксель среза КТ был помечен как «опухоль» или «здоровая ткань». Какая это задача CV и почему классификации изображения недостаточно?
?= Сегментация изображения (image segmentation) — ответ состоит из метки для каждого пикселя. Классификация даёт одну метку на всё изображение: она скажет «опухоль есть», но не покажет, где она и какого размера.`,
      },
      [
        qx("According to the lecture, what is computer vision about?", "Systems that process, perceive and reason about visual data", [
          ["Hierarchical algorithms with many layers inspired by the brain", "This is the lecture's definition of Deep (deep learning), not of computer vision.", "Это определение слова Deep (глубокое обучение), а не компьютерного зрения."],
          ["Systems that learn from data and experience", "This defines the word Learning; computer vision is defined by the data it works on — visual data.", "Так определяется слово Learning; компьютерное зрение определяется тем, с какими данными работает, — с визуальными."],
          ["Software that stores, compresses and displays image files", "Storing and showing images is file handling; CV must perceive and reason about what the image shows.", "Хранить и показывать изображения — это работа с файлами; CV должно понимать, что изображено, и рассуждать об этом."],
        ], "The lecture defines computer vision as building artificial systems that process, perceive and reason about visual data.", "В лекции компьютерное зрение — это создание искусственных систем, которые обрабатывают, воспринимают визуальные данные и рассуждают о них."),
        qx("In ‘Deep Learning for Computer Vision’, what does the word Deep refer to?", "Hierarchical learning algorithms with many layers", [
          ["Systems that learn from data and experience", "That is the meaning of Learning; Deep adds the hierarchy of many layers.", "Это смысл слова Learning; Deep добавляет иерархию из многих слоёв."],
          ["Training sets with millions of labelled photos from the web", "Big datasets helped deep learning, but Deep describes the model's many layers, not the size of the data.", "Большие датасеты помогли глубокому обучению, но Deep описывает многослойность модели, а не объём данных."],
          ["Networks that copy the human brain exactly", "The slide says the algorithms are (very) loosely inspired by the brain — not a copy of it.", "На слайде сказано, что алгоритмы лишь (очень) отдалённо вдохновлены мозгом, а не копируют его."],
        ], "Deep = hierarchical learning algorithms with many ‘layers’, (very) loosely inspired by the brain.", "Deep = иерархические обучаемые алгоритмы с множеством «слоёв», (очень) отдалённо вдохновлённые мозгом."),
        qx("Which of these is learning in the lecture’s sense of ‘learn from data and experience’?", "Fitting weights to thousands of labelled photos", [
          ["Writing the rule ‘an edge is a sharp brightness change’", "A rule written by a programmer is hand-designed: nothing is learned from data.", "Правило, написанное программистом, — ручной метод: из данных ничего не выучено."],
          ["Resizing every image to 224 × 224 pixels", "Resizing is a fixed preprocessing step; it has no parameters fitted to data.", "Изменение размера — фиксированный шаг предобработки, у него нет параметров, подогнанных под данные."],
          ["Converting each BGR image to grayscale", "Colour conversion is a fixed formula (0.299 R + 0.587 G + 0.114 B), not learning.", "Перевод в оттенки серого — фиксированная формула (0.299 R + 0.587 G + 0.114 B), а не обучение."],
        ], "Learning means the system adjusts its own parameters (weights) from labelled examples, so it improves with more data.", "Обучение означает, что система сама подгоняет свои параметры (веса) по размеченным примерам и становится лучше с ростом данных."),
        qx("Which relation between the fields matches the lecture’s Venn diagram?", "DL lies inside ML, and ML lies inside AI", [
          ["ML lies inside DL, and DL lies inside AI", "Swapped: deep learning is one kind of machine learning, not the other way round.", "Перепутано: глубокое обучение — разновидность машинного обучения, а не наоборот."],
          ["AI lies inside ML, and ML lies inside DL", "Reversed: AI is the largest circle and contains the others.", "Всё наоборот: AI — самый большой круг, он содержит остальные."],
          ["CV lies inside DL, and DL lies inside ML", "Computer vision only overlaps DL; much of CV, such as edge detection, uses no deep learning.", "Компьютерное зрение лишь пересекается с DL; большая часть CV, например поиск краёв, обходится без глубокого обучения."],
        ], "DL ⊂ ML ⊂ AI; computer vision is another AI field that overlaps ML and DL.", "DL ⊂ ML ⊂ AI; компьютерное зрение — отдельная область AI, пересекающаяся с ML и DL."),
        tfx("Every computer vision method is a machine learning method.", false, "In the diagram computer vision only overlaps machine learning: hand-designed methods such as Canny edge detection or SIFT matching learn nothing from data.", "На диаграмме компьютерное зрение лишь пересекается с машинным обучением: ручные методы вроде детектора краёв Canny или сопоставления SIFT ничему не учатся на данных.", "Choosing True would put the whole CV circle inside ML, but the lecture draws only an overlap.", "Ответ True поместил бы весь круг CV внутрь ML, а в лекции нарисовано только пересечение."),
        qx("Which region of the lecture’s diagram does this course, Deep Learning for Computer Vision, cover?", "Where computer vision meets deep learning", [
          ["The whole artificial intelligence circle", "AI also contains NLP, speech recognition and robotics; the course is one red region only.", "В AI входят ещё NLP, распознавание речи и робототехника; курс — только одна красная область."],
          ["Where NLP meets speech recognition", "That overlap is about language and sound, not about visual data.", "Это пересечение — про язык и звук, а не про визуальные данные."],
          ["The part of computer vision that lies outside ML", "That part is classical, hand-designed CV; the course is about its deep learning part.", "Эта часть — классическое ручное CV; курс посвящён его части с глубоким обучением."],
        ], "The red region marked ‘This class’ is the intersection of computer vision and deep learning.", "Красная область с подписью «This class» — пересечение компьютерного зрения и глубокого обучения."),
        qx("Which task needs reasoning about a scene, not just recognizing the objects in it?", "Explaining why people laugh at a photo of a scale", [
          ["Labelling a photo as cat or dog", "This is plain classification: one label for the image, no reasoning about events.", "Это обычная классификация: одна метка на изображение, без рассуждений о происходящем."],
          ["Drawing a box around every car in a frame", "Object detection finds and locates objects; it does not explain what is going on.", "Детекция находит и локализует объекты, но не объясняет, что происходит."],
          ["Converting a colour photo to grayscale", "This is processing pixels — the simplest of the three verbs in the definition.", "Это обработка пикселей — самый простой из трёх глаголов определения."],
        ], "The scale photo needs physics (a foot adds weight), mirrors and intentions — reasoning that is still hard for CV.", "Фото с весами требует физики (нога добавляет вес), понимания зеркал и намерений — таких рассуждений, которые CV пока даются трудно."),
        qx("A food app gets one photo of a dish and must output a single name such as ‘pizza’. Which task is this?", "Image classification", [
          ["Object detection", "Detection outputs a box, a label and a score for each object; one label for the photo is enough here.", "Детекция выдаёт рамку, метку и оценку для каждого объекта; здесь достаточно одной метки на фото."],
          ["Pixel-wise segmentation", "Segmentation labels every pixel; the app needs only one name for the whole photo.", "Сегментация размечает каждый пиксель; приложению нужно только одно название на всё фото."],
          ["Image retrieval", "Retrieval returns similar images from a collection, not a label.", "Поиск изображений возвращает похожие картинки из коллекции, а не метку."],
        ], "Image classification gives one label for the whole image — exactly what the food app needs.", "Классификация изображения даёт одну метку на всё изображение — именно это и нужно приложению."),
        qx("A parking camera must find every car in a frame and draw a box with a confidence score around each. Which task?", "Object detection", [
          ["Image classification", "Classification gives one label per image; it cannot say where each car is.", "Классификация даёт одну метку на изображение и не может сказать, где каждая машина."],
          ["Image segmentation", "Segmentation labels pixels instead of drawing one box per object.", "Сегментация размечает пиксели, а не рисует по рамке на объект."],
          ["Pose recognition", "Pose recognition locates the body joints of people, not boxes around cars.", "Распознавание позы находит суставы людей, а не рамки вокруг машин."],
        ], "Object detection outputs a box, a label and a score for each object, like ‘car 0.97’.", "Детекция объектов выдаёт рамку, метку и оценку для каждого объекта, например «car 0.97»."),
        qx("A self-driving car must label every pixel of the road scene as road, sidewalk, car, person or sky. Which task?", "Image segmentation", [
          ["Object detection", "Detection draws boxes; road and sky have no neat box and need a label on every pixel.", "Детекция рисует рамки; у дороги и неба нет аккуратной рамки, им нужна метка на каждом пикселе."],
          ["Image classification", "One label for the whole frame says nothing about where the road is.", "Одна метка на весь кадр ничего не говорит о том, где дорога."],
          ["Image captioning", "Captioning writes a sentence about the scene; it gives no per-pixel map.", "Подпись — это предложение о сцене, а не карта по пикселям."],
        ], "Segmentation assigns a class to every pixel, as on the Farabet et al. (2012) street scene.", "Сегментация присваивает класс каждому пикселю, как на уличной сцене Farabet et al. (2012)."),
        qx("A shop lets you upload a photo of shoes and shows the 20 most similar products. Which task is this?", "Image retrieval", [
          ["Image classification", "Classification would output a label like ‘sneaker’, not a ranked list of similar images.", "Классификация выдала бы метку вроде «кроссовок», а не список похожих изображений."],
          ["Object detection", "Detection locates objects inside one image; it does not search a collection.", "Детекция находит объекты внутри одного изображения и не ищет по коллекции."],
          ["Activity recognition", "Activity recognition says what a person in a video is doing.", "Распознавание действий говорит, что делает человек на видео."],
        ], "Image retrieval returns the images most similar to the query, like the rows of similar flowers and elephants on the slide.", "Поиск изображений возвращает картинки, больше всего похожие на запрос, как ряды похожих цветов и слонов на слайде."),
        qx("A fitness app marks the positions of a user’s elbows, knees and shoulders on every frame. Which task is this?", "Pose recognition", [
          ["Activity recognition", "Activity recognition names the action, such as squatting; joint positions are the pose.", "Распознавание действий называет действие, например приседание; положения суставов — это поза."],
          ["Object detection", "Detection gives a box around the whole person, not the positions of the joints.", "Детекция даёт рамку вокруг всего человека, а не положения суставов."],
          ["Image retrieval", "Retrieval looks for similar images; it does not locate body parts.", "Поиск изображений ищет похожие картинки и не находит части тела."],
        ], "Pose recognition (Toshev and Szegedy, 2014) outputs the positions of body joints, drawn as a stick figure.", "Распознавание позы (Toshev and Szegedy, 2014) выдаёт положения суставов, нарисованные как «скелет»."),
        qx("In the two-stream video network (Simonyan et al., 2014), what does the temporal stream ConvNet receive?", "Optical flow computed over several frames", [
          ["A single frame of the video", "A single frame goes to the spatial stream, which sees what is in the scene.", "Один кадр получает spatial stream — он видит, что есть в сцене."],
          ["The audio track of the clip", "The network on the slide is purely visual; motion comes from optical flow.", "Сеть на слайде чисто визуальная; движение она берёт из оптического потока."],
          ["The class scores produced by the spatial stream", "The two streams run in parallel; their class scores are fused only at the end.", "Два потока работают параллельно; их оценки классов объединяются только в конце."],
        ], "The temporal stream takes multi-frame optical flow (motion); the spatial stream takes a single frame (appearance).", "Temporal stream получает оптический поток по нескольким кадрам (движение), spatial stream — один кадр (внешний вид)."),
        qx("Which output does image captioning (Vinyals et al., 2015) produce?", "A sentence that describes the image", [
          ["A box, label and score for every object", "That is the output of object detection, not captioning.", "Это ответ детекции объектов, а не подписи к изображению."],
          ["A class label for every pixel", "That is image segmentation; captioning writes natural language.", "Это сегментация; подпись — текст на естественном языке."],
          ["A new photo in the style of a painting", "That is neural style transfer (Gatys et al., 2016).", "Это перенос стиля (Gatys et al., 2016)."],
        ], "Captioning turns an image into a sentence, such as ‘A cat sitting on a suitcase on the floor’.", "Подпись превращает изображение в предложение, например «A cat sitting on a suitcase on the floor»."),
        qx("Gatys et al. (2016) redraw a photo in the style of Van Gogh’s ‘The Starry Night’. What is this called?", "Style transfer", [
          ["DeepDream", "DeepDream (Mordvintsev et al., 2015) exaggerates the patterns a network sees; it does not copy a painting's style.", "DeepDream (Mordvintsev et al., 2015) преувеличивает узоры, которые видит сеть, а не копирует стиль картины."],
          ["Image captioning", "Captioning turns an image into a sentence, not into a new image.", "Подпись превращает изображение в предложение, а не в новую картинку."],
          ["Image segmentation", "Segmentation labels pixels; it does not create a new picture.", "Сегментация размечает пиксели, а не создаёт новую картинку."],
        ], "Neural style transfer keeps the content of the photo and takes the style (colours, strokes) from the painting.", "Перенос стиля сохраняет содержание фото и берёт стиль (цвета, мазки) у картины."),
        qx("img = cv2.imread('street.jpg') loads a colour photo 640 pixels wide and 480 pixels tall. What is img.shape?", "(480, 640, 3)", [
          ["(640, 480, 3)", "Width and height are swapped: a NumPy shape starts with the number of rows, the height.", "Ширина и высота перепутаны: форма NumPy начинается с числа строк, то есть с высоты."],
          ["(480, 640)", "That is a grayscale shape; imread with the default flag returns 3 colour channels.", "Это форма полутонового изображения; imread с флагом по умолчанию возвращает 3 цветовых канала."],
          ["(3, 480, 640)", "Channels-first is the PyTorch tensor layout; OpenCV puts the channels last.", "Каналы первыми — это раскладка тензоров PyTorch; в OpenCV каналы идут последними."],
        ], "img.shape is (height, width, channels) = (480, 640, 3).", "img.shape — это (height, width, channels) = (480, 640, 3)."),
        qx("In what order are the colour channels stored in an array returned by cv2.imread?", "Blue, green, red", [
          ["Red, green, blue", "RGB is what matplotlib expects; OpenCV stores BGR, so convert with COLOR_BGR2RGB before showing.", "RGB ожидает matplotlib; OpenCV хранит BGR, поэтому перед показом нужен COLOR_BGR2RGB."],
          ["Hue, saturation, value", "HSV is a different colour space you get with cv2.COLOR_BGR2HSV, not the default.", "HSV — другое цветовое пространство, его получают через cv2.COLOR_BGR2HSV; по умолчанию его нет."],
          ["Red, green, blue, alpha", "Alpha is kept only with cv2.IMREAD_UNCHANGED, and even then the order starts with blue.", "Альфа-канал сохраняется только с cv2.IMREAD_UNCHANGED, и даже тогда порядок начинается с синего."],
        ], "cv2.imread returns channels in BGR order: index 0 is blue, 1 is green, 2 is red.", "cv2.imread возвращает каналы в порядке BGR: индекс 0 — синий, 1 — зелёный, 2 — красный."),
        qx("cv2.imread('leaf.jpg') is called, but the file name has a typo. What happens?", "It returns None; the next call that uses img fails", [
          ["It raises FileNotFoundError on that line", "OpenCV does not raise here; it silently returns None.", "OpenCV здесь не выбрасывает исключение, а молча возвращает None."],
          ["It returns a black 0-filled image of the default size", "There is no default image; the result is None, not an array of zeros.", "Изображения по умолчанию нет; результат — None, а не массив нулей."],
          ["It returns an empty array of shape (0, 0, 3)", "It returns None, not an array, so even img.shape fails with an AttributeError.", "Возвращается None, а не массив, поэтому даже img.shape падает с AttributeError."],
        ], "A missing file gives None without an exception; the crash comes later, e.g. in cvtColor or at img.shape.", "Отсутствующий файл даёт None без исключения; падение случается позже, например в cvtColor или на img.shape."),
        qx("How many numbers does a 640 × 480 colour image loaded with cv2.imread contain?", "921,600", [
          ["307,200", "That is 480 × 640 — one channel only, as in a grayscale image.", "Это 480 × 640 — только один канал, как у полутонового изображения."],
          ["1,228,800", "That is 480 × 640 × 4; imread gives 3 channels (BGR), not 4.", "Это 480 × 640 × 4; imread даёт 3 канала (BGR), а не 4."],
          ["3,360", "That is (640 + 480) × 3: the sides must be multiplied, not added.", "Это (640 + 480) × 3: стороны нужно перемножать, а не складывать."],
        ], "480 × 640 × 3 = 921,600 values, each an integer from 0 to 255.", "480 × 640 × 3 = 921 600 значений, каждое — целое от 0 до 255."),
        tfx("After gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), gray.shape is (h, w, 1).", false, "BGR2GRAY returns a single-channel image of shape (h, w): the channel axis disappears instead of being kept as 1.", "BGR2GRAY возвращает одноканальное изображение формы (h, w): ось каналов исчезает, а не остаётся равной 1.", "Choosing True confuses the number of channels (1) with the shape; OpenCV drops the third axis for grayscale.", "Ответ True путает число каналов (1) с формой; для полутонового изображения OpenCV убирает третью ось."),
      ],
    ),
    part(
      "cv-l1-p2",
      { en: "A short history: from Hubel & Wiesel to deep learning", ru: "Краткая история: от Hubel & Wiesel до глубокого обучения" },
      {
        en: `## Two stories that meet in 2012
The lecture's history has two threads: **computer vision** (how to make machines see) and **neural networks** (how to make machines learn). They merge in **2012 with AlexNet**.
## Hubel and Wiesel, 1959: how the brain sees
Hubel and Wiesel **measured the brain activity** of single neurons in a cat's visual cortex while showing it bars of light. A neuron responded to a bar at one angle and gave **no response** at another.
| Cell type | Responds to |
|---|---|
| Simple cells | light **orientation** — an edge at a certain angle |
| Complex cells | light orientation **and movement** |
| Hypercomplex cells | **movement with an end point** |
The lesson: vision is **hierarchical** — simple local features such as oriented edges come first, then more and more complex combinations of them. Convolutional networks are built the same way.
## Larry Roberts, 1963: edges of a block
Roberts (often called the author of the first PhD thesis in computer vision) recognized simple 3-D blocks in three steps:
- **(a) original picture** of a block;
- **(b) differentiated picture** — the brightness is differentiated, so only the **edges** (sharp changes of brightness) remain;
- **(c) feature points selected** — corners and points on the edges, used to recover the 3-D shape.
## The Summer Vision Project, 1966
An MIT memo by **Seymour Papert** (Vision Memo No. 100, July 1966) planned to use **summer workers** to build **a significant part of a visual system** in one summer, split into sub-problems. Vision turned out to be far harder: the field is still working on it more than 50 years later.
## David Marr, 1970s: stages of visual representation
| Stage | What it contains |
|---|---|
| Input image | perceived intensities (pixel brightness) |
| Primal sketch | zero crossings, blobs, edges, bars, ends, virtual lines, groups, curves, boundaries |
| 2½-D sketch | local surface orientation, discontinuities in depth and in surface orientation |
| 3-D model | 3-D models organized hierarchically from surface and volumetric primitives |
## Recognition via parts, 1970s
- **Pictorial structures** (Fischler and Elschlager, 1973): an object is a set of **parts** (head, torso, limbs) joined by flexible connections, like a stick figure.
- **Generalized cylinders** (Brooks and Binford, 1979): an object is assembled from **cylinder-like volumes** — a person made of tubes.
## Recognition via edge detection, 1980s
**John Canny (1986)** gave the classic edge detector, and **David Lowe (1987)** recognized objects by their edges. The slide shows colourful razors next to their edge map: thin white lines on black, **all colour gone**.
The same detector is one line in OpenCV today:
@diagram cv-pipeline
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
= edges = cv2.Canny(blur, 100, 200)
- **Hysteresis**: a gradient above the high threshold (200) is a **strong edge**; below the low threshold (100) it is **discarded**; in between it is kept **only if it is connected to a strong edge**.
- **Blur first**: derivatives amplify noise, so without smoothing noisy pixels turn into **false edges**.
- The output is a **single-channel 0/255 edge map**: if the task depends on colour (ripe vs unripe fruit), edges alone throw the key information away.
![Left half: several colourful plastic razors (pink, blue, green and black) lying on a light-blue table; right half: the same scene as a black image in which only thin white lines trace the edges of the razors, with no colour at all](/events/cv/l1-edges-vs-colour.webp)
## Grouping, matching and the first ML successes
- **Normalized Cuts** (Shi and Malik, 1997) — **recognition via grouping**: split the image into coherent regions (a monk, umbrellas, a tower) before recognizing them.
- **SIFT** (David Lowe, 1999) — **recognition via matching**: find distinctive keypoints and match them between two photos of the same stop sign taken from different angles and distances.
- **Viola and Jones (2001)** — fast **face detection**, **one of the first successful applications of machine learning to vision**.
- The timeline marks an **AI Winter** over the late 1980s and the 1990s — years of low interest and funding for AI.
## Benchmarks: PASCAL and ImageNet
- **PASCAL Visual Object Challenge**: find objects such as a train, a person or an airplane; on PASCAL VOC 2007 the mean Average Precision (mAP) grew from about 17% (2007) to about 41% (2011).
- **ImageNet** (Deng et al., 2009): the classification challenge has **1,000 object classes** and **1,431,167 images**. In the **top-5** metric an answer is correct if the true class is among the model's 5 best guesses (for example scale, T-shirt, steel drum, drumstick, mud turtle).
| Year | Model | Top-5 error, % |
|---|---|---|
| 2010 | Lin et al. | 28.2 |
| 2011 | Sanchez and Perronnin | 25.8 |
| 2012 | AlexNet (Krizhevsky et al.) | 16.4 |
| 2013 | Zeiler and Fergus | 11.7 |
| 2014 | VGG (Simonyan and Zisserman) | 7.3 |
| 2014 | GoogLeNet (Szegedy et al.) | 6.7 |
| 2015 | ResNet (He et al.) | 3.6 |
| 2016 | Shao et al. | 3.0 |
| 2017 | SENet (Hu et al.) | 2.3 |
| — | Human (Russakovsky et al.) | 5.1 |
= 2011 → 2012: 25.8 − 16.4 = 9.4 percentage points
= relative drop: 9.4 / 25.8 ≈ 0.36 → about 36% fewer errors
= first below the human 5.1%: ResNet (2015), 3.6%
## The neural network line
- **Perceptron** (Frank Rosenblatt, ~1957; 1958 on the timeline) — one of the earliest algorithms that could **learn from data**. It was **built in hardware**: weights stored in **potentiometers** and updated by **electric motors** during learning; a camera of **20 × 20 cadmium sulfide photocells** gave a **400-pixel image**; it learned to recognize **letters**. Today we would call it a **linear classifier**.
@diagram cv-neuron
- **Minsky and Papert (1969)** showed that perceptrons **could not learn the XOR function**; this caused a lot of disillusionment in the field.
| x | y | XOR(x, y) |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |
Try one straight line: s = x + y − 0.5, and predict 1 when s > 0.
= (0, 0): s = −0.5 → 0 ✓
= (0, 1): s = 0.5 → 1 ✓
= (1, 0): s = 0.5 → 1 ✓
= (1, 1): s = 1.5 → 1 ✗ (XOR = 0)
= accuracy = 3 / 4 = 75%
Every line fails on at least one point: the 1s lie on one diagonal of the square and the 0s on the other, so the classes are **not linearly separable**. Solving XOR needs **more than one layer**.
- **Neocognitron** (Fukushima, 1980) — a computational model of the visual system **directly inspired by Hubel and Wiesel**: interleaved **simple cells (convolution)** and **complex cells (pooling)**. It had **no practical training algorithm**, yet it looks a lot like AlexNet more than 32 years later.
- **Backpropagation** (Rumelhart, Hinton and Williams, 1986) — computes **gradients** in neural networks and **successfully trained perceptrons with multiple layers**.
- **LeNet** (LeCun et al., 1998) — **backprop applied to a Neocognitron-like architecture**; it learned to recognize **handwritten digits** and was **deployed commercially by NEC to process handwritten checks**. It is very similar to modern CNNs.
- **2000s, ‘deep learning’** — researchers trained deeper and deeper networks (Hinton and Salakhutdinov, 2006; Bengio et al., 2007; Lee et al., 2009; Glorot and Bengio, 2010), but it was **not a mainstream research topic** yet.
## 2012: AlexNet and the explosion
**AlexNet** (Krizhevsky, Sutskever and Hinton, NeurIPS 2012) takes a **224 × 224 × 3** image, applies **11 × 11 filters with stride 4**, then 5 × 5 and 3 × 3 convolutions with **max pooling**, two **dense** layers of 4096 units and **1000 outputs** — one score per ImageNet class. It is drawn as two halves because it was trained on **two GPUs**.
Why it worked in 2012 and not in 1980 — the lecture names **three ingredients**:
| Ingredient | What was ready by 2012 |
|---|---|
| Algorithms | backprop and convolutional architectures (Neocognitron → LeNet → AlexNet) |
| Data | ImageNet: about 1.4 million labelled images in 1,000 classes |
| Computation | GPUs: about 3–4 GFLOPs per dollar for the GTX 580 used by AlexNet, about 15 for the GTX 1080 Ti (2017); CPUs stayed below about 2 |
After 2012 Google searches for ‘deep learning’ and the number of papers at the top computer vision conference shot up. The **2018 Turing Award** went to **Yoshua Bengio, Geoffrey Hinton and Yann LeCun**.
> The ideas are old (1959 cells, 1958 perceptron, 1980 Neocognitron, 1986 backprop, 1998 LeNet); deep learning won in 2012 because these algorithms finally met big labelled data and cheap GPU computation.
## Check yourself
?? Why can a single perceptron not learn the XOR function? You may describe a small drawing.
?= A perceptron is a linear classifier: it separates the classes with one straight line. For XOR the points (0, 1) and (1, 0) are class 1 and (0, 0), (1, 1) are class 0; they lie on opposite diagonals, so no single line separates them — at least two layers are needed.
?? The Neocognitron (1980) looked a lot like AlexNet (2012). Why did deep learning only take off in 2012?
?= The Neocognitron had no practical training algorithm. By 2012 there was backpropagation, a big labelled dataset (ImageNet, about 1.4 million images in 1,000 classes) and cheap GPU computation, so AlexNet could be trained and cut the ImageNet top-5 error from 25.8% to 16.4%.`,
        ru: `## Две истории, которые встречаются в 2012 году
История в лекции идёт двумя линиями: **компьютерное зрение** (как научить машины видеть) и **нейронные сети** (как научить машины учиться). Они сливаются в **2012 году с AlexNet**.
## Hubel и Wiesel, 1959: как видит мозг
Hubel и Wiesel **измеряли активность** отдельных нейронов зрительной коры кошки, показывая ей полоски света. Нейрон откликался на полоску под одним углом и **не откликался (no response)** под другим.
| Тип клеток | На что откликаются |
|---|---|
| Simple cells (простые) | на **ориентацию** света — край под определённым углом |
| Complex cells (сложные) | на ориентацию **и движение** |
| Hypercomplex cells (сверхсложные) | на **движение с конечной точкой (end point)** |
Вывод: зрение **иерархично** — сначала простые локальные признаки вроде ориентированных краёв, затем всё более сложные их сочетания. Свёрточные сети устроены так же.
## Larry Roberts, 1963: края кубика
Roberts (его часто называют автором первой диссертации по компьютерному зрению) распознавал простые 3-D блоки в три шага:
- **(a) original picture** — исходное фото блока;
- **(b) differentiated picture** — яркость дифференцируют, и остаются только **края** (места резкой смены яркости);
- **(c) feature points selected** — выбранные особые точки: углы и точки на краях, по которым восстанавливают 3-D форму.
## Summer Vision Project, 1966
Записка MIT от **Seymour Papert** (Vision Memo No. 100, июль 1966) предлагала силами **летних сотрудников** за одно лето построить **значительную часть зрительной системы**, разбив её на подзадачи. Зрение оказалось гораздо сложнее: область работает над ним уже больше 50 лет.
## David Marr, 1970-е: стадии зрительного представления
| Стадия | Что содержит |
|---|---|
| Input image (входное изображение) | воспринимаемые интенсивности (яркость пикселей) |
| Primal sketch (первичный эскиз) | переходы через ноль, пятна (blobs), края, полосы, концы, виртуальные линии, группы, кривые, границы |
| 2½-D sketch (2½-мерный эскиз) | локальная ориентация поверхностей, разрывы глубины и ориентации поверхностей |
| 3-D model (3-D модель) | 3-D модели, иерархически собранные из поверхностных и объёмных примитивов |
## Распознавание по частям, 1970-е
- **Pictorial structures** (Fischler and Elschlager, 1973): объект — набор **частей** (голова, туловище, конечности), соединённых гибкими связями, как «человечек из палочек».
- **Generalized cylinders (обобщённые цилиндры)** (Brooks and Binford, 1979): объект собирается из **объёмов, похожих на цилиндры**, — человек из трубок.
## Распознавание через поиск краёв, 1980-е
**John Canny (1986)** предложил классический детектор краёв, а **David Lowe (1987)** распознавал объекты по их краям. На слайде цветные бритвы рядом с картой краёв: тонкие белые линии на чёрном, **цвета больше нет**.
Сегодня этот детектор — одна строка в OpenCV:
@diagram cv-pipeline
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
= edges = cv2.Canny(blur, 100, 200)
- **Hysteresis (гистерезис)**: градиент выше верхнего порога (200) — **сильный край**; ниже нижнего (100) — **отбрасывается**; между ними пиксель остаётся, **только если связан с сильным краем**.
- **Сначала размытие**: производные усиливают шум, и без сглаживания шумные пиксели превращаются в **ложные края**.
- Результат — **одноканальная карта краёв из 0 и 255**: если задача зависит от цвета (спелый или неспелый плод), одни края выбрасывают главную информацию.
![Слева: несколько цветных пластиковых бритв (розовые, синие, зелёные и чёрные) на светло-голубом столе; справа: та же сцена в виде чёрного изображения, где только тонкие белые линии обводят края бритв, без всякого цвета](/events/cv/l1-edges-vs-colour.webp)
## Группировка, сопоставление и первые успехи ML
- **Normalized Cuts** (Shi and Malik, 1997) — **распознавание через группировку**: разбить изображение на однородные области (монах, зонтики, башня), а потом их распознавать.
- **SIFT** (David Lowe, 1999) — **распознавание через сопоставление**: найти характерные ключевые точки (keypoints) и сопоставить их на двух фото одного и того же знака STOP, снятых с разных углов и расстояний.
- **Viola and Jones (2001)** — быстрая **детекция лиц**, **одно из первых успешных применений машинного обучения в зрении**.
- На шкале времени отмечена **AI Winter («зима ИИ»)** — конец 1980-х и 1990-е, годы слабого интереса и финансирования AI.
## Бенчмарки: PASCAL и ImageNet
- **PASCAL Visual Object Challenge**: находить объекты вроде поезда, человека или самолёта; на PASCAL VOC 2007 средняя точность (mAP) выросла примерно с 17% (2007) до 41% (2011).
- **ImageNet** (Deng et al., 2009): в соревновании по классификации **1 000 классов объектов** и **1 431 167 изображений**. По метрике **top-5** ответ засчитывается, если верный класс есть среди 5 лучших догадок модели (например scale, T-shirt, steel drum, drumstick, mud turtle).
| Год | Модель | Ошибка top-5, % |
|---|---|---|
| 2010 | Lin et al. | 28.2 |
| 2011 | Sanchez and Perronnin | 25.8 |
| 2012 | AlexNet (Krizhevsky et al.) | 16.4 |
| 2013 | Zeiler and Fergus | 11.7 |
| 2014 | VGG (Simonyan and Zisserman) | 7.3 |
| 2014 | GoogLeNet (Szegedy et al.) | 6.7 |
| 2015 | ResNet (He et al.) | 3.6 |
| 2016 | Shao et al. | 3.0 |
| 2017 | SENet (Hu et al.) | 2.3 |
| — | Человек (Russakovsky et al.) | 5.1 |
= 2011 → 2012: 25.8 − 16.4 = 9.4 percentage points
= relative drop: 9.4 / 25.8 ≈ 0.36 → about 36% fewer errors
= first below the human 5.1%: ResNet (2015), 3.6%
## Линия нейронных сетей
- **Perceptron (перцептрон)** (Frank Rosenblatt, ~1957; на шкале — 1958) — один из первых алгоритмов, которые умели **учиться на данных**. Он был **собран в железе**: веса хранились в **потенциометрах** и менялись **электромоторами** во время обучения; камера из **20 × 20 фотоэлементов на сульфиде кадмия** давала **изображение из 400 пикселей**; перцептрон учился распознавать **буквы**. Сегодня мы назвали бы его **линейным классификатором (linear classifier)**.
@diagram cv-neuron
- **Minsky and Papert (1969)** показали, что перцептроны **не могут выучить функцию XOR**; это вызвало сильное разочарование в области.
| x | y | XOR(x, y) |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |
Попробуем одну прямую: s = x + y − 0.5, и предсказываем 1, когда s > 0.
= (0, 0): s = −0.5 → 0 ✓
= (0, 1): s = 0.5 → 1 ✓
= (1, 0): s = 0.5 → 1 ✓
= (1, 1): s = 1.5 → 1 ✗ (XOR = 0)
= accuracy = 3 / 4 = 75%
Любая прямая ошибается хотя бы на одной точке: единицы лежат на одной диагонали квадрата, нули — на другой, поэтому классы **линейно неразделимы (not linearly separable)**. Для XOR нужно **больше одного слоя**.
- **Neocognitron** (Fukushima, 1980) — вычислительная модель зрительной системы, **напрямую вдохновлённая Hubel и Wiesel**: чередуются **simple cells (свёртка, convolution)** и **complex cells (пулинг, pooling)**. У неё **не было практичного алгоритма обучения**, и всё же она очень похожа на AlexNet, появившуюся больше чем через 32 года.
- **Backpropagation (обратное распространение ошибки)** (Rumelhart, Hinton and Williams, 1986) — вычисляет **градиенты** в нейронных сетях; с ним **впервые успешно обучили многослойные перцептроны**.
- **LeNet** (LeCun et al., 1998) — **backprop, применённый к архитектуре наподобие Neocognitron**; сеть научилась распознавать **рукописные цифры** и была **внедрена NEC в коммерческую систему обработки рукописных чеков**. Она очень похожа на современные CNN.
- **2000-е, «deep learning»** — исследователи обучали всё более глубокие сети (Hinton and Salakhutdinov, 2006; Bengio et al., 2007; Lee et al., 2009; Glorot and Bengio, 2010), но это ещё **не было массовой темой исследований**.
## 2012: AlexNet и взрыв
**AlexNet** (Krizhevsky, Sutskever and Hinton, NeurIPS 2012) принимает изображение **224 × 224 × 3**, применяет **фильтры 11 × 11 со stride 4**, затем свёртки 5 × 5 и 3 × 3 с **max pooling**, два **полносвязных (dense)** слоя по 4096 нейронов и **1000 выходов** — по одной оценке на каждый класс ImageNet. Её рисуют двумя половинами, потому что она обучалась на **двух GPU**.
Почему это сработало в 2012-м, а не в 1980-м, — лекция называет **три составляющие**:
| Составляющая | Что было готово к 2012 году |
|---|---|
| Algorithms (алгоритмы) | backprop и свёрточные архитектуры (Neocognitron → LeNet → AlexNet) |
| Data (данные) | ImageNet: около 1,4 млн размеченных изображений в 1 000 классах |
| Computation (вычисления) | GPU: около 3–4 GFLOPs на доллар у GTX 580, на которой обучали AlexNet, около 15 у GTX 1080 Ti (2017); CPU оставались ниже примерно 2 |
После 2012 года поисковые запросы «deep learning» в Google и число статей на главной конференции по компьютерному зрению резко выросли. **Премию Тьюринга 2018 года** получили **Yoshua Bengio, Geoffrey Hinton и Yann LeCun**.
> Идеи старые (клетки 1959, перцептрон 1958, Neocognitron 1980, backprop 1986, LeNet 1998); глубокое обучение победило в 2012 году, потому что эти алгоритмы наконец встретились с большими размеченными данными и дешёвыми вычислениями на GPU.
## Проверь себя
?? Почему один перцептрон не может выучить функцию XOR? Можно описать небольшой рисунок.
?= Перцептрон — линейный классификатор: он разделяет классы одной прямой. У XOR точки (0, 1) и (1, 0) — класс 1, а (0, 0) и (1, 1) — класс 0; они лежат на противоположных диагоналях, поэтому никакая одна прямая их не разделит — нужно хотя бы два слоя.
?? Neocognitron (1980) очень похож на AlexNet (2012). Почему глубокое обучение взлетело только в 2012 году?
?= У Neocognitron не было практичного алгоритма обучения. К 2012 году появились backpropagation, большой размеченный датасет (ImageNet, около 1,4 млн изображений в 1 000 классах) и дешёвые вычисления на GPU, поэтому AlexNet удалось обучить, и она снизила ошибку top-5 на ImageNet с 25.8% до 16.4%.`,
      },
      [
        qx("Hubel and Wiesel (1959) found simple cells in a cat’s visual cortex. What do simple cells respond to?", "The orientation of a bar of light", [
          ["Movement with an end point", "That describes hypercomplex cells, the highest level on the slide.", "Это описание hypercomplex cells — самого высокого уровня на слайде."],
          ["Orientation together with movement", "Orientation plus movement is what complex cells respond to.", "На ориентацию вместе с движением откликаются complex cells."],
          ["The colour of the light", "The experiment varied the angle and motion of the bar; colour is not among the responses on the slide.", "В опыте меняли угол и движение полоски; цвета среди откликов на слайде нет."],
        ], "Simple cells respond to light orientation; complex cells add movement; hypercomplex cells respond to movement with an end point.", "Простые клетки откликаются на ориентацию света, сложные — ещё и на движение, сверхсложные — на движение с конечной точкой."),
        qx("In Larry Roberts’ 1963 example, what does the differentiated picture of the block show?", "Only the edges, where brightness changes sharply", [
          ["Corner points marked with crosses", "Marked points are step (c), feature points selected, which comes after differentiation.", "Отмеченные точки — шаг (c), feature points selected, он идёт после дифференцирования."],
          ["The block painted in one average grey, without shading", "Averaging removes detail; differentiation keeps only the places where brightness changes.", "Усреднение стирает детали; дифференцирование оставляет только места, где меняется яркость."],
          ["A 3-D model assembled from cylinders", "Building objects from cylinders is Brooks and Binford's generalized cylinders (1979).", "Сборка объектов из цилиндров — это generalized cylinders Brooks и Binford (1979)."],
        ], "Differentiating brightness leaves only the edges: (a) original picture → (b) differentiated picture → (c) feature points.", "Дифференцирование яркости оставляет только края: (a) исходное фото → (b) differentiated picture → (c) особые точки."),
        qx("What does the 1966 MIT Summer Vision Project memo by Seymour Papert show about computer vision?", "Its difficulty was badly underestimated", [
          ["Vision was fully solved by summer workers", "The plan was to build a significant part of a visual system in one summer; the field is still working on it.", "План был построить значительную часть зрительной системы за одно лето; область работает над этим до сих пор."],
          ["It proved that perceptrons cannot learn XOR", "Papert did co-write that result, but in 1969 with Minsky, not in this memo.", "Papert действительно соавтор этого результата, но в 1969 году вместе с Minsky, а не в этой записке."],
          ["It introduced the first convolutional network", "Convolution-like networks came with the Neocognitron (1980) and LeNet (1998).", "Сети со свёрткой появились с Neocognitron (1980) и LeNet (1998)."],
        ], "The memo planned a significant part of a visual system as a summer project; more than 50 years later vision is still not solved.", "Записка планировала значительную часть зрительной системы как летний проект; больше 50 лет спустя зрение всё ещё не решено."),
        qx("Which order matches David Marr’s stages of visual representation (1970s)?", "Input image → primal sketch → 2½-D sketch → 3-D model", [
          ["Input image → 2½-D sketch → primal sketch → 3-D model", "The primal sketch (edges, blobs) comes first; depth and surface orientation (2½-D) build on it.", "Сначала primal sketch (края, пятна); глубина и ориентация поверхностей (2½-D) строятся на нём."],
          ["Primal sketch → input image → 3-D model → 2½-D sketch", "Everything starts from the input image, and the full 3-D model is the last stage.", "Всё начинается с входного изображения, а полная 3-D модель — последняя стадия."],
          ["Input image → 3-D model → primal sketch → 2½-D sketch", "The 3-D model is the goal at the end, not a step right after the image.", "3-D модель — цель в конце, а не шаг сразу после изображения."],
        ], "Marr: input image (intensities) → primal sketch (edges, blobs) → 2½-D sketch (surface orientation, depth) → 3-D model.", "Marr: входное изображение (интенсивности) → primal sketch (края, пятна) → 2½-D sketch (ориентация поверхностей, глубина) → 3-D модель."),
        qx("In cv2.Canny(blur, 100, 200) a pixel has gradient 150 and is connected to a strong edge. What happens to it?", "It is kept as an edge (value 255)", [
          ["It is discarded because 150 < 200", "Between the thresholds a pixel survives if it touches a strong edge — that is hysteresis.", "Между порогами пиксель выживает, если касается сильного края, — это и есть гистерезис."],
          ["It is kept only if no strong edge is near", "The rule is the opposite: the connection to a strong edge is what keeps it.", "Правило обратное: пиксель сохраняет именно связь с сильным краем."],
          ["It is written as 150 in the output map", "The Canny output is binary, 0 or 255, never the gradient value.", "Выход Canny бинарный — 0 или 255, а не значение градиента."],
        ], "Hysteresis: above 200 → strong edge; below 100 → discarded; between → kept only if connected to a strong edge.", "Гистерезис: выше 200 — сильный край; ниже 100 — отбрасывается; между — остаётся, только если связан с сильным краем."),
        qx("Why is cv2.GaussianBlur usually applied before cv2.Canny?", "Derivatives amplify noise and create false edges", [
          ["Canny needs a smooth three-channel input", "Canny is normally run on a single-channel image; the reason for blurring is noise.", "Canny обычно запускают на одноканальном изображении; размывают из-за шума."],
          ["Blurring makes the final edges thicker and brighter", "Blur removes fine noise; the edge map stays thin and 0/255.", "Размытие убирает мелкий шум; карта краёв остаётся тонкой и из 0/255."],
          ["Blurring converts the image to grayscale", "Only cvtColor with COLOR_BGR2GRAY changes the number of channels; blur keeps them.", "Число каналов меняет только cvtColor с COLOR_BGR2GRAY; размытие их сохраняет."],
        ], "Canny is based on brightness derivatives, which amplify noise; smoothing first prevents false edges.", "Canny опирается на производные яркости, которые усиливают шум; предварительное сглаживание убирает ложные края."),
        qx("A model must tell red ripe tomatoes from green unripe ones. A student feeds it only Canny edges. Is that a good idea?", "No: the 0/255 edge map has lost all colour", [
          ["Yes: edges keep the hue of every pixel they mark", "Canny outputs a single channel of 0 and 255; the hue is gone.", "Canny выдаёт один канал из 0 и 255; оттенок потерян."],
          ["Yes: Canny returns three colour channels", "The output has one channel, so red and green look the same.", "У выхода один канал, поэтому красный и зелёный неразличимы."],
          ["No: Canny only works on 224 × 224 images", "Canny works on any size; the problem is the missing colour, not the size.", "Canny работает с любым размером; проблема в потерянном цвете, а не в размере."],
        ], "Ripe and unripe tomatoes have the same shape; the difference is colour, which the single-channel edge map throws away.", "Спелые и неспелые помидоры одинаковы по форме; различие — в цвете, а одноканальная карта краёв его выбрасывает."),
        qx("Two photos show the same stop sign from different angles and distances. Which 1999 method matches points between them?", "SIFT keypoints (David Lowe)", [
          ["Normalized Cuts (Shi and Malik)", "Normalized Cuts groups one image into regions; it does not match points across photos.", "Normalized Cuts группирует одно изображение в области и не сопоставляет точки между фото."],
          ["Viola–Jones face detector", "Viola–Jones (2001) detects faces; it does not match keypoints between images.", "Viola–Jones (2001) находит лица и не сопоставляет ключевые точки между изображениями."],
          ["Canny edge detector", "Canny finds edges in one image; it gives no distinctive keypoints to match.", "Canny находит края на одном изображении и не даёт характерных ключевых точек для сопоставления."],
        ], "SIFT (1999) finds distinctive keypoints that can be matched across changes of viewpoint and scale — recognition via matching.", "SIFT (1999) находит характерные ключевые точки, которые сопоставляются при смене ракурса и масштаба, — распознавание через сопоставление."),
        qx("Which pairing of a classic method and its idea is correct?", "Normalized Cuts — grouping pixels into regions", [
          ["SIFT — detecting faces with machine learning", "Face detection with ML is Viola and Jones (2001); SIFT matches keypoints.", "Детекция лиц с ML — это Viola и Jones (2001); SIFT сопоставляет ключевые точки."],
          ["Generalized cylinders — matching keypoints", "Generalized cylinders build objects from cylinder-like parts; matching is SIFT.", "Обобщённые цилиндры собирают объекты из цилиндрических частей; сопоставление — это SIFT."],
          ["Viola–Jones — differentiating a block’s brightness", "Differentiating brightness to get edges is Roberts (1963); Viola–Jones detects faces.", "Дифференцирование яркости ради краёв — это Roberts (1963); Viola–Jones находит лица."],
        ], "Normalized Cuts (Shi and Malik, 1997) is recognition via grouping: it splits an image into coherent regions.", "Normalized Cuts (Shi and Malik, 1997) — распознавание через группировку: изображение делится на однородные области."),
        qx("Why does the lecture mark Viola and Jones (2001) as a milestone?", "Face detection: an early ML success in vision", [
          ["The first ConvNet trained end to end with backprop", "That describes LeNet (LeCun et al., 1998), not Viola–Jones.", "Это описание LeNet (LeCun et al., 1998), а не Viola–Jones."],
          ["The first dataset with 1,000 classes", "That is ImageNet (2009); Viola–Jones is a face detector.", "Это ImageNet (2009); Viola–Jones — детектор лиц."],
          ["The first system to read handwritten checks", "Reading checks was LeNet, deployed commercially by NEC.", "Чеки читала LeNet, внедрённая NEC в коммерческую систему."],
        ], "The slide calls Viola–Jones face detection one of the first successful applications of machine learning to vision.", "На слайде детекция лиц Viola–Jones названа одним из первых успешных применений машинного обучения в зрении."),
        qx("Which numbers describe the ImageNet classification challenge shown in the lecture?", "1,000 classes, about 1.4 million images", [
          ["10 classes, 60,000 small 32 × 32 colour images", "That is CIFAR-10, a much smaller dataset.", "Это CIFAR-10 — гораздо меньший датасет."],
          ["100 classes, about 1.4 million images", "ImageNet has ten times more classes: 1,000.", "У ImageNet классов в десять раз больше — 1 000."],
          ["1,000 classes, about 14,000 images", "There are 1,431,167 images — about 1.4 million, not thousands.", "Изображений 1 431 167 — около 1,4 млн, а не тысячи."],
        ], "The ImageNet challenge: 1,000 object classes and 1,431,167 images (Deng et al., 2009).", "Соревнование ImageNet: 1 000 классов объектов и 1 431 167 изображений (Deng et al., 2009)."),
        qx("ImageNet top-5 error fell from 25.8% (2011) to 16.4% (AlexNet, 2012). By how much?", "9.4 percentage points", [
          ["11.8 percentage points", "11.8 = 28.2 − 16.4 uses the 2010 result instead of the 2011 one.", "11.8 = 28.2 − 16.4 — взят результат 2010 года вместо 2011-го."],
          ["36 percentage points", "About 36% is the relative drop (9.4 / 25.8); in percentage points it is 9.4.", "Около 36% — это относительное падение (9.4 / 25.8); в процентных пунктах — 9.4."],
          ["42.2 percentage points", "42.2 is the sum 25.8 + 16.4; a drop is a difference.", "42.2 — это сумма 25.8 + 16.4, а падение — разность."],
        ], "25.8 − 16.4 = 9.4 percentage points, about a 36% relative drop — the jump that started the deep learning era.", "25.8 − 16.4 = 9.4 процентного пункта, около 36% относительно — скачок, с которого началась эпоха глубокого обучения."),
        qx("Which model in the lecture’s ImageNet chart was the first to beat the human top-5 error of 5.1%?", "ResNet (He et al.), 3.6% in 2015", [
          ["GoogLeNet (Szegedy et al.), 6.7% in 2014", "6.7% is still above the human 5.1%.", "6.7% всё ещё выше человеческих 5.1%."],
          ["VGG (Simonyan and Zisserman), 7.3%", "7.3% is worse than the human 5.1%.", "7.3% хуже человеческих 5.1%."],
          ["SENet (Hu et al.), 2.3% in 2017", "SENet is lower, but ResNet was already below 5.1% two years earlier.", "У SENet ошибка ниже, но ResNet опустилась ниже 5.1% на два года раньше."],
        ], "ResNet (2015) reached 3.6%, the first result in the chart below the human 5.1%.", "ResNet (2015) достигла 3.6% — первый результат на диаграмме ниже человеческих 5.1%."),
        qx("Rosenblatt’s perceptron saw 20 × 20 photocell images. As a linear classifier, how many weights does one output need, bias aside?", "400", [
          ["40", "40 = 20 + 20; the image has 20 × 20 = 400 pixels, one weight each.", "40 = 20 + 20; в изображении 20 × 20 = 400 пикселей, по весу на каждый."],
          ["401", "401 includes the bias, which the question leaves aside.", "401 учитывает смещение (bias), а вопрос его не считает."],
          ["20", "20 is only one row of photocells; every one of the 400 pixels gets a weight.", "20 — это только один ряд фотоэлементов; вес получает каждый из 400 пикселей."],
        ], "20 × 20 = 400 pixels, and a linear classifier has one weight per input pixel: 400 weights (plus one bias).", "20 × 20 = 400 пикселей, а у линейного классификатора по одному весу на входной пиксель: 400 весов (плюс одно смещение)."),
        qx("A perceptron predicts 1 when x + y − 0.5 > 0. What is its accuracy on the four XOR points?", "75% — only (1, 1) is wrong", [
          ["100% — all four points are right", "(1, 1) gives s = 1.5 > 0 → 1, but XOR(1, 1) = 0.", "(1, 1) даёт s = 1.5 > 0 → 1, а XOR(1, 1) = 0."],
          ["50% — (0, 1) and (1, 0) are wrong", "Both give s = 0.5 > 0 → 1, which matches XOR = 1.", "Обе дают s = 0.5 > 0 → 1, что совпадает с XOR = 1."],
          ["25% — only (0, 0) is right", "Three points are right: (0, 0) → 0, (0, 1) → 1, (1, 0) → 1.", "Верны три точки: (0, 0) → 0, (0, 1) → 1, (1, 0) → 1."],
        ], "s = −0.5, 0.5, 0.5, 1.5 → predictions 0, 1, 1, 1 vs XOR 0, 1, 1, 0: 3 of 4 correct = 75%.", "s = −0.5, 0.5, 0.5, 1.5 → предсказания 0, 1, 1, 1 против XOR 0, 1, 1, 0: верно 3 из 4 = 75%."),
        tfx("A single perceptron can learn XOR if it is trained for long enough.", false, "XOR is not linearly separable: the 1s and 0s lie on opposite diagonals, so no single line separates them, however long the training. More layers are needed.", "XOR линейно неразделим: единицы и нули лежат на противоположных диагоналях, и никакая одна прямая их не разделит, сколько ни обучай. Нужны дополнительные слои.", "True would mean some straight line splits the XOR points, but every line misclassifies at least one of them.", "Ответ True означал бы, что какая-то прямая делит точки XOR, но любая прямая ошибается хотя бы на одной из них."),
        qx("Fukushima’s Neocognitron (1980) looks a lot like AlexNet. What did it lack?", "A practical training algorithm", [
          ["Convolution-like simple cells", "It had them: simple cells in the Neocognitron play the role of convolution.", "Они у него были: simple cells в Neocognitron играют роль свёртки."],
          ["Pooling-like complex cells", "It had them too: complex cells act like pooling.", "Они тоже были: complex cells работают как пулинг."],
          ["Inspiration from Hubel and Wiesel", "It was directly inspired by Hubel and Wiesel's hierarchy of cells.", "Он был напрямую вдохновлён иерархией клеток Hubel и Wiesel."],
        ], "The Neocognitron had the architecture but no practical way to train it; backprop (1986) and LeNet (1998) filled that gap.", "У Neocognitron была архитектура, но не было практичного способа её обучить; этот пробел закрыли backprop (1986) и LeNet (1998)."),
        qx("What was LeNet (LeCun et al., 1998)?", "Backprop applied to a Neocognitron-like ConvNet", [
          ["A hand-designed edge detector for checks", "LeNet learned its filters with backprop; it was not a hand-written rule.", "LeNet выучила свои фильтры с помощью backprop; это не правило, написанное вручную."],
          ["A hardware perceptron with weights in potentiometers", "That is Rosenblatt's perceptron (~1957).", "Это перцептрон Rosenblatt (~1957)."],
          ["The 2012 winner of the ImageNet challenge", "The 2012 winner was AlexNet; LeNet read handwritten digits in 1998.", "В 2012 году победила AlexNet; LeNet читала рукописные цифры в 1998 году."],
        ], "LeNet applied backprop to a Neocognitron-like architecture, learned handwritten digits and processed checks for NEC.", "LeNet применила backprop к архитектуре наподобие Neocognitron, выучила рукописные цифры и обрабатывала чеки для NEC."),
        qx("AlexNet takes a 224 × 224 × 3 image and ends with 1000 outputs. What do the 1000 outputs stand for?", "One score per ImageNet class", [
          ["One value per pixel row of the input", "The input has 224 rows; the 1000 outputs match the 1,000 classes.", "У входа 224 строки; 1000 выходов соответствуют 1 000 классов."],
          ["One filter of the first conv layer each", "The first layer has 96 filters (48 per GPU); the outputs are class scores.", "В первом слое 96 фильтров (по 48 на GPU); выходы — это оценки классов."],
          ["One output per GPU core used in training", "The number of outputs is set by the task, not by the hardware.", "Число выходов задаёт задача, а не железо."],
        ], "ImageNet has 1,000 classes, so the last layer gives one score per class; the highest score is the prediction.", "В ImageNet 1 000 классов, поэтому последний слой даёт по оценке на класс; наибольшая оценка — это предсказание."),
        qx("Which three ingredients does the lecture credit for the deep learning explosion after 2012?", "Algorithms, data, computation", [
          ["Edges, regions and keypoints", "These are classical CV ideas (Canny, Normalized Cuts, SIFT), not the reasons for 2012.", "Это идеи классического CV (Canny, Normalized Cuts, SIFT), а не причины 2012 года."],
          ["Neurons, synapses and brains", "Networks are only loosely inspired by the brain; the slide lists algorithms, data and computation.", "Сети лишь отдалённо вдохновлены мозгом; на слайде — алгоритмы, данные и вычисления."],
          ["Python, OpenCV and smartphones", "Tools matter, but the slide names algorithms, big labelled data and GPU computation.", "Инструменты важны, но на слайде названы алгоритмы, большие размеченные данные и вычисления на GPU."],
        ], "Algorithms (backprop, ConvNets), data (ImageNet) and computation (GPUs: GFLOPs per dollar shot up) came together in 2012.", "Алгоритмы (backprop, ConvNets), данные (ImageNet) и вычисления (GPU: GFLOPs на доллар резко выросли) сошлись в 2012 году."),
      ],
    ),
  ],
};
