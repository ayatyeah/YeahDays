import { part, qx, tfx, type Lecture } from "../types";

export const lecture2: Lecture = {
  id: "cv-l2",
  title: { en: "Lecture 2 — Image classification and kNN", ru: "Лекция 2 — Классификация изображений и kNN" },
  parts: [
    part(
      "cv-l2-p1",
      { en: "The task, the semantic gap, challenges and datasets", ru: "Задача, семантический разрыв, трудности и датасеты" },
      {
        en: `## The task: image classification
**Image classification** is a core computer vision task. **Input**: an image. **Output**: one label from a **fixed set of categories**, for example {cat, bird, deer, dog, truck}.
The categories are decided in advance; the classifier only chooses among them and never invents a new label.
## The semantic gap
A person sees a cat; the computer sees **just a big grid of numbers between 0 and 255**. The distance between the meaning ("a cat") and these raw numbers is called the **semantic gap**.
The slide's example is an image of **800 × 600 × 3** (three colour channels). In OpenCV a photo 800 pixels wide and 600 pixels high is an array of shape (height, width, channels):
= img = cv2.imread('cat.jpg')
= img.shape -> (600, 800, 3)   # dtype uint8, values 0..255, channel order B, G, R
= 600 * 800 * 3 = 1 440 000 numbers
@diagram cv-image-array
- The slide says RGB; OpenCV stores the same three channels in the order **BGR**.
- **Grayscale** keeps one channel: shape (600, 800), three times fewer numbers, but the colour information is gone.
- A CIFAR-10 image is 32 × 32 × 3 = **3 072** numbers — this vector is the input of the linear classifier in the next lecture.
## Why it is hard: the challenges
A small change in the scene can change **almost every pixel** while the label stays the same. A good classifier must be **robust (invariant)** to all of these:
| Challenge | What changes | Example from the slides |
|---|---|---|
| Viewpoint variation | all pixels change when the camera moves | the same cat seen from another angle |
| Intraclass variation | objects of one class look very different | kittens with different colours and fur patterns |
| Fine-grained categories | different classes look very similar | Maine Coon vs Ragdoll vs American Shorthair |
| Background clutter | the object blends into the background | a tabby cat in autumn leaves, a white cat in snow |
| Illumination changes | lighting changes the brightness of every pixel | a dark cat in shadow, a cat backlit by the sun |
| Deformation | the object takes many shapes | cats lying, stretching, sitting upright |
| Occlusion | only part of the object is visible | a cat under a blanket, only a tail sticking out from a sofa |
![Six photos of tabby cats in a 3 by 2 grid: a cat seen from high above, a cat in deep shadow lit from one side, a cat lying on its back with paws stretched out, a cat half hidden under a knitted blanket, a cat camouflaged among brown autumn leaves, a white-and-grey cat sitting in bright snow](/events/cv/l2-cat-challenges.webp)
The same challenges explain why **data collection and preprocessing** matter in practice:
- **illumination changes** → normalize brightness and contrast, collect photos under different lamps;
- **viewpoint, deformation, occlusion** → collect varied examples and use augmentation (crops, flips, small rotations);
- **background clutter** → crop to the object when possible, include varied backgrounds in training;
- **fine-grained categories** → keep enough resolution and colour: small details decide the class.
## Why classification matters
- **Directly useful**: medical imaging (Levy et al., 2016), galaxy classification (Dieleman et al., 2014), whale recognition (a Kaggle challenge).
- **A building block for other tasks** — many tasks become "classify again and again":
| Task | What is classified at each step |
|---|---|
| Object detection | each image region: background, horse, person, car, truck… |
| Image captioning | the next word: man → riding → horse → STOP |
| Playing Go | the next move: one of the 19 × 19 board positions |
## Why not hard-code a classifier?
Unlike sorting a list of numbers, there is **no obvious way to hard-code** the algorithm for recognizing a cat. You could try rules: **find edges** (e.g. with the Canny edge detector), then **find corners**, then … what?
Hand-written rules break on every challenge above and must be rewritten for each new class, so this approach does not scale.
## The data-driven approach
- **1. Collect** a dataset of images and labels.
- **2. Train** a classifier with machine learning.
- **3. Evaluate** the classifier on **new** images.
The program now has two functions instead of one:
= def train(images, labels): ... return model
= def predict(model, test_images): ... return test_labels
## Image classification datasets
| Dataset | Classes | Images | Image size | Remember |
|---|---|---|---|---|
| MNIST | 10 digits (0–9) | 50k train, 10k test | 28 × 28 grayscale | the Drosophila of CV |
| CIFAR-10 | 10 | 50k train (5k per class), 10k test (1k per class) | 32 × 32 RGB | used for homework |
| CIFAR-100 | 100 | 50k train (500 per class), 10k test (100 per class) | 32 × 32 RGB | 20 superclasses × 5 classes |
| ImageNet | 1000 | ~1.3M train, 50k val, 100k test | variable, often resized to 256 × 256 | top-5 accuracy |
| MIT Places | 365 scene types | ~8M train, 18.25k val, 328.5k test | variable, often 256 × 256 | scenes, not objects |
| Omniglot | 1623 characters from 50 alphabets | 20 images per category | handwritten characters | few-shot learning |
- **MNIST** is called the **Drosophila of computer vision**: like the fruit fly in biology it is small and cheap to experiment on, but results from MNIST **often do not hold** on more complex datasets.
- **CIFAR-10** classes: airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck.
- **CIFAR-100** groups its 100 classes into **20 superclasses of 5**: aquatic mammals = beaver, dolphin, otter, seal, whale; trees = maple, oak, palm, pine, willow.
- **ImageNet**: ~1.3K training images per class, 50 per class for validation, 100 per class for test; the **test labels are secret**. A 22k-category version exists but is less commonly used.
- **Top-5 accuracy** (ImageNet's metric): the algorithm predicts 5 labels for each image, and the answer counts as correct if **one of them** is the true label. Top-1 accuracy counts only the first guess.
- **Places**: 50 validation and 900 test images per class.
- **Omniglot** has only 20 images per category, so it tests **few-shot learning** — learning a class from a handful of examples.
Quick numbers you can be asked to compute:
= CIFAR-10 train per class: 50 000 / 10 = 5 000
= CIFAR-100 train per class: 50 000 / 100 = 500
= ImageNet validation: 1 000 classes * 50 = 50 000 images
= CIFAR-10 pixels: 50 000 images * 32 * 32 * 3 = 153 600 000 ≈ 154M
| Dataset | Training pixels |
|---|---|
| MNIST | ~47M |
| CIFAR-10 | ~154M |
| CIFAR-100 | ~154M |
| ImageNet | ~251B |
| Places365 | ~1.6T |
CIFAR-10 and CIFAR-100 have the **same** number of pixels: the same 50k images of the same size, only cut into more classes (so fewer examples per class).
> Image classification maps a grid of 0–255 numbers to one label from a fixed set; because of the semantic gap and its challenges, we learn the mapping from data (collect → train → evaluate) instead of hard-coding rules.
## Check yourself
?? A student collects 3 000 photos of 5 kinds of fruit in a shop, under different lamps and from different angles. Name two challenges from the lecture that this dataset shows and how you would handle each.
?= Illumination changes — normalize brightness and contrast (or equalize the histogram) and keep varied lighting in training; viewpoint variation — collect photos from many angles and augment with flips, crops and small rotations. Background clutter or occlusion with a matching fix also earn full points.
?? Why can't image classification be written as a hand-coded algorithm, like sorting a list?
?= Because of the semantic gap: the input is only a grid of 0–255 numbers, and viewpoint, lighting, deformation, occlusion and intraclass variation change almost every pixel without changing the label, so fixed rules (edges → corners → …) fail. Instead we use the data-driven approach: collect labelled images, train a classifier, evaluate it on new images.`,
        ru: `## Задача: классификация изображений
**Image classification (классификация изображений)** — базовая задача компьютерного зрения. **Вход**: изображение. **Выход**: одна метка из **заранее заданного набора категорий**, например {cat, bird, deer, dog, truck}.
Категории задаются заранее; классификатор только выбирает среди них и никогда не придумывает новую метку.
## Семантический разрыв (semantic gap)
Человек видит кошку, а компьютер — **просто большую сетку чисел от 0 до 255**. Расстояние между смыслом («кошка») и этими сырыми числами называют **семантическим разрывом (semantic gap)**.
В примере со слайда изображение **800 × 600 × 3** (три цветовых канала). В OpenCV фото шириной 800 и высотой 600 пикселей — это массив формы (height, width, channels):
= img = cv2.imread('cat.jpg')
= img.shape -> (600, 800, 3)   # dtype uint8, values 0..255, channel order B, G, R
= 600 * 800 * 3 = 1 440 000 numbers
@diagram cv-image-array
- На слайде написано RGB; OpenCV хранит те же три канала в порядке **BGR**.
- **Grayscale (оттенки серого)** оставляет один канал: форма (600, 800), чисел втрое меньше, но информация о цвете теряется.
- Изображение CIFAR-10 — это 32 × 32 × 3 = **3 072** числа; именно такой вектор подаётся на вход линейному классификатору в следующей лекции.
## Почему это трудно: challenges
Небольшое изменение сцены может поменять **почти каждый пиксель**, а метка останется той же. Хороший классификатор должен быть **устойчив (invariant)** ко всему этому:
| Трудность | Что меняется | Пример со слайдов |
|---|---|---|
| Viewpoint variation (смена ракурса) | при движении камеры меняются все пиксели | та же кошка с другого угла |
| Intraclass variation (разнообразие внутри класса) | объекты одного класса выглядят очень по-разному | котята разного окраса и узора шерсти |
| Fine-grained categories (близкие подклассы) | разные классы выглядят очень похоже | мейн-кун, рэгдолл и американская короткошёрстная |
| Background clutter (загромождённый фон) | объект сливается с фоном | полосатая кошка в осенних листьях, белая кошка в снегу |
| Illumination changes (смена освещения) | свет меняет яркость каждого пикселя | тёмная кошка в тени, кошка в контровом свете солнца |
| Deformation (деформация) | объект принимает разные формы | кошки лёжа, потягиваясь, сидя столбиком |
| Occlusion (перекрытие) | виден только кусок объекта | кошка под пледом, из-под дивана торчит только хвост |
![Шесть фото полосатых кошек сеткой 3 на 2: кошка, снятая высоко сверху; кошка в глубокой тени с боковым светом; кошка на спине с вытянутыми лапами; кошка, наполовину спрятанная под вязаным пледом; кошка, сливающаяся с бурыми осенними листьями; бело-серая кошка в ярком снегу](/events/cv/l2-cat-challenges.webp)
Те же трудности объясняют, почему на практике важны **сбор данных и предобработка (preprocessing)**:
- **смена освещения** → нормализовать яркость и контраст, снимать при разных лампах;
- **ракурс, деформация, перекрытие** → собирать разнообразные примеры и применять аугментацию (кропы, отражения, небольшие повороты);
- **загромождённый фон** → по возможности обрезать кадр до объекта, включать в обучение разные фоны;
- **близкие подклассы** → сохранять достаточное разрешение и цвет: класс решают мелкие детали.
## Зачем нужна классификация
- **Полезна сама по себе**: медицинские снимки (Levy et al., 2016), классификация галактик (Dieleman et al., 2014), распознавание китов (соревнование Kaggle).
- **Кирпичик для других задач** — многие задачи сводятся к «классифицировать снова и снова»:
| Задача | Что классифицируется на каждом шаге |
|---|---|
| Object detection (обнаружение объектов) | каждая область изображения: background, horse, person, car, truck… |
| Image captioning (подпись к изображению) | следующее слово: man → riding → horse → STOP |
| Игра в го | следующий ход: одна из 19 × 19 позиций доски |
## Почему не запрограммировать классификатор вручную?
В отличие от сортировки списка чисел, **нет очевидного способа вручную закодировать** алгоритм распознавания кошки. Можно попробовать правила: **найти края (edges)** (например, детектором Canny), потом **найти углы (corners)**, потом … что?
Ручные правила ломаются на каждой трудности выше, и их приходится переписывать для каждого нового класса, поэтому такой подход не масштабируется.
## Подход на основе данных (data-driven approach)
- **1. Собрать** датасет изображений с метками.
- **2. Обучить** классификатор методами машинного обучения.
- **3. Оценить** классификатор на **новых** изображениях.
Теперь в программе две функции вместо одной:
= def train(images, labels): ... return model
= def predict(model, test_images): ... return test_labels
## Датасеты для классификации изображений
| Датасет | Классы | Изображения | Размер | Запомнить |
|---|---|---|---|---|
| MNIST | 10 цифр (0–9) | 50k train, 10k test | 28 × 28, оттенки серого | «дрозофила» CV |
| CIFAR-10 | 10 | 50k train (5k на класс), 10k test (1k на класс) | 32 × 32 RGB | для домашних заданий |
| CIFAR-100 | 100 | 50k train (500 на класс), 10k test (100 на класс) | 32 × 32 RGB | 20 суперклассов × 5 классов |
| ImageNet | 1000 | ~1.3M train, 50k val, 100k test | разный, часто приводят к 256 × 256 | top-5 accuracy |
| MIT Places | 365 типов сцен | ~8M train, 18.25k val, 328.5k test | разный, часто 256 × 256 | сцены, а не объекты |
| Omniglot | 1623 символа из 50 алфавитов | 20 изображений на категорию | рукописные символы | few-shot learning |
- **MNIST** называют **дрозофилой компьютерного зрения (Drosophila of computer vision)**: как плодовая мушка в биологии, он маленький и дешёвый для опытов, но результаты на MNIST **часто не переносятся** на более сложные датасеты.
- Классы **CIFAR-10**: airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck.
- **CIFAR-100** объединяет 100 классов в **20 суперклассов по 5**: aquatic mammals (водные млекопитающие) = beaver, dolphin, otter, seal, whale; trees (деревья) = maple, oak, palm, pine, willow.
- **ImageNet**: ~1.3K обучающих изображений на класс, по 50 на класс в validation и по 100 в test; **метки test-набора секретны**. Есть версия на 22k категорий, но ею пользуются реже.
- **Top-5 accuracy** (метрика ImageNet): алгоритм выдаёт 5 меток для каждого изображения, и ответ засчитывается, если **одна из них** верная. Top-1 accuracy засчитывает только первую догадку.
- **Places**: по 50 изображений на класс в validation и по 900 в test.
- В **Omniglot** всего 20 изображений на категорию, поэтому он проверяет **few-shot learning** — обучение классу по горстке примеров.
Быстрые расчёты, которые могут попросить:
= CIFAR-10 train per class: 50 000 / 10 = 5 000
= CIFAR-100 train per class: 50 000 / 100 = 500
= ImageNet validation: 1 000 classes * 50 = 50 000 images
= CIFAR-10 pixels: 50 000 images * 32 * 32 * 3 = 153 600 000 ≈ 154M
| Датасет | Пикселей в обучении |
|---|---|
| MNIST | ~47M |
| CIFAR-10 | ~154M |
| CIFAR-100 | ~154M |
| ImageNet | ~251B |
| Places365 | ~1.6T |
У CIFAR-10 и CIFAR-100 **одинаковое** число пикселей: те же 50k изображений того же размера, просто разбитые на большее число классов (значит, примеров на класс меньше).
> Классификация изображений переводит сетку чисел 0–255 в одну метку из заданного набора; из-за семантического разрыва и трудностей мы учим это отображение на данных (собрать → обучить → оценить), а не пишем правила вручную.
## Проверь себя
?? Студент собрал 3 000 фото пяти видов фруктов в магазине — при разных лампах и с разных ракурсов. Назовите две трудности из лекции, которые есть в этом датасете, и как вы справитесь с каждой.
?= Смена освещения — нормализовать яркость и контраст (или выровнять гистограмму) и оставить в обучении разное освещение; смена ракурса — снимать с разных углов и аугментировать отражениями, кропами и небольшими поворотами. Загромождённый фон или перекрытие с подходящим решением тоже дают полный балл.
?? Почему классификацию изображений нельзя записать как алгоритм вручную, как сортировку списка?
?= Из-за семантического разрыва: на входе только сетка чисел 0–255, а ракурс, освещение, деформация, перекрытие и разнообразие внутри класса меняют почти каждый пиксель, не меняя метку, поэтому фиксированные правила (края → углы → …) не работают. Вместо этого применяют подход на основе данных: собрать размеченные изображения, обучить классификатор, оценить его на новых изображениях.`,
      },
      [
        qx("In image classification, what is the output for one input image?", "One label from a fixed set of classes", [
          ["A box around every object in the image", "Boxes around objects are the output of object detection, a task built on top of classification.", "Рамки вокруг объектов — это выход object detection, задачи, построенной поверх классификации."],
          ["A sentence that describes the scene", "A sentence is the output of image captioning; classification returns a single label.", "Предложение — выход image captioning; классификация возвращает одну метку."],
          ["A new category name chosen by the model", "The set of categories is fixed in advance; the classifier only picks one of them and never invents a label.", "Набор категорий задан заранее; классификатор только выбирает одну из них и не придумывает новых меток."],
        ], "Image classification: the input is an image, the output is one label from a fixed set of categories such as cat, bird, deer, dog, truck.", "Классификация изображений: на входе изображение, на выходе одна метка из заданного набора категорий — cat, bird, deer, dog, truck."),
        qx("What does the semantic gap refer to?", "Pixels are just numbers, while a label is a meaning", [
          ["Images are stored with fewer bits than they need", "Bit depth is not the issue: 8 bits per channel are plenty; the gap is between numbers and meaning.", "Дело не в разрядности: 8 бит на канал вполне хватает; разрыв — между числами и смыслом."],
          ["Training and test photos come from different cameras", "Different cameras cause domain shift, a separate problem; the semantic gap exists even for one camera.", "Разные камеры дают domain shift — это отдельная проблема; семантический разрыв есть и при одной камере."],
          ["Neighbouring pixels can have very different values", "Sharp jumps between neighbours are edges or noise; the semantic gap is about what the numbers mean.", "Резкие скачки между соседними пикселями — это края или шум; семантический разрыв — про смысл чисел."],
        ], "The computer sees only a grid of numbers between 0 and 255; the gap between those numbers and the concept ‘cat’ is the semantic gap.", "Компьютер видит только сетку чисел от 0 до 255; разрыв между этими числами и понятием «кошка» и есть семантический разрыв."),
        qx("A photo is 800 pixels wide and 600 pixels high. What is img.shape after img = cv2.imread('cat.jpg')?", "(600, 800, 3)", [
          ["(800, 600, 3)", "Width and height are swapped: a NumPy shape lists the rows (height) first.", "Ширина и высота перепутаны: в форме NumPy сначала идут строки, то есть высота."],
          ["(3, 600, 800)", "Channels-first is the PyTorch tensor layout; cv2.imread puts the channels last.", "Каналы первыми — это раскладка тензоров PyTorch; cv2.imread ставит каналы последними."],
          ["(600, 800)", "Two dimensions mean a grayscale image; the default flag IMREAD_COLOR loads 3 channels.", "Два измерения — это изображение в оттенках серого; флаг по умолчанию IMREAD_COLOR загружает 3 канала."],
        ], "imread returns (height, width, channels) = (600, 800, 3), dtype uint8, channels in BGR order.", "imread возвращает (height, width, channels) = (600, 800, 3), dtype uint8, каналы в порядке BGR."),
        qx("How many numbers describe one CIFAR-10 image?", "3 072", [
          ["1 024", "32 × 32 = 1 024 counts only one channel; CIFAR-10 images are RGB.", "32 × 32 = 1 024 — это только один канал, а изображения CIFAR-10 цветные (RGB)."],
          ["4 096", "32 × 32 × 4 would need a fourth (alpha) channel; CIFAR-10 has three.", "32 × 32 × 4 потребовало бы четвёртого канала (alpha); в CIFAR-10 их три."],
          ["2 352", "28 × 28 × 3 = 2 352 uses MNIST's size; CIFAR-10 images are 32 × 32.", "28 × 28 × 3 = 2 352 — это размер MNIST; изображения CIFAR-10 — 32 × 32."],
        ], "A CIFAR-10 image is 32 × 32 pixels with 3 colour channels: 32 × 32 × 3 = 3 072 numbers.", "Изображение CIFAR-10 — 32 × 32 пикселя с 3 цветовыми каналами: 32 × 32 × 3 = 3 072 числа."),
        qx("Photos of one parked car taken from the front, the side and above share almost no pixel values. Which challenge is this?", "Viewpoint variation", [
          ["Intraclass variation", "Intraclass variation is about different objects of one class; here it is the very same car.", "Intraclass variation — про разные объекты одного класса, а здесь одна и та же машина."],
          ["Deformation", "The car does not change its shape; only the camera position changed.", "Машина не меняет форму; изменилось только положение камеры."],
          ["Illumination changes", "Nothing is said about lighting; the pixels change because the camera moved.", "Про освещение ничего не сказано; пиксели меняются из-за того, что двигалась камера."],
        ], "Viewpoint variation: all pixels change when the camera moves, while the object and its label stay the same.", "Viewpoint variation: при движении камеры меняются все пиксели, хотя объект и его метка те же."),
        qx("A model must tell a Maine Coon from a Ragdoll and an American Shorthair. Which challenge does the lecture call this?", "Fine-grained categories", [
          ["Intraclass variation", "Intraclass variation is one class looking different; here different classes look alike.", "Intraclass variation — когда один класс выглядит по-разному; здесь же разные классы похожи."],
          ["Background clutter", "Nothing hides the cats in the background; the classes themselves are similar.", "Фон кошек не скрывает; трудность в том, что сами классы похожи."],
          ["Illumination and viewpoint changes", "No change of lighting or angle is described; the difficulty is that the breeds look alike.", "Смены света или ракурса в условии нет; трудность в том, что породы похожи друг на друга."],
        ], "Fine-grained categories: very similar classes, like cat breeds, must be separated by small details.", "Fine-grained categories: очень похожие классы, например породы кошек, приходится различать по мелким деталям."),
        qx("A tabby cat lies in brown autumn leaves of almost the same colour and pattern. Which challenge is this?", "Background clutter", [
          ["Occlusion", "The cat is fully visible; it is not covered, it blends into the background.", "Кошка видна целиком; её ничто не закрывает, она сливается с фоном."],
          ["Deformation", "The cat's pose is not the problem; the problem is the similar-looking background.", "Проблема не в позе кошки, а в похожем на неё фоне."],
          ["Fine-grained categories", "Fine-grained means similar classes; here one object hides in a similar background.", "Fine-grained — это похожие классы; здесь один объект теряется на похожем фоне."],
        ], "Background clutter: the object blends into a background of similar colour and texture (the slide shows a cat in leaves and a cat in snow).", "Background clutter: объект сливается с фоном похожего цвета и текстуры (на слайде — кошка в листьях и кошка в снегу)."),
        qx("Only a striped tail sticks out from under a sofa cushion, yet the correct label is still cat. Which challenge is this?", "Occlusion — most of the cat is hidden from view", [
          ["Deformation — the body takes an unusual shape", "The body's shape is not visible at all; the cat is covered, not bent.", "Формы тела вообще не видно; кошка закрыта, а не изогнута."],
          ["Background clutter — the cat blends into the sofa", "The cat does not blend in; it is hidden behind an object.", "Кошка не сливается с диваном — она спрятана за предметом."],
          ["Viewpoint variation — the camera angle changed", "Changing the angle would still show the cat; here an object covers it.", "При другом ракурсе кошку всё равно было бы видно; здесь её закрывает предмет."],
        ], "Occlusion: only part of the object is visible; the classifier must still recognize it from that part.", "Occlusion: виден только кусок объекта, и классификатор всё равно должен узнать его по этому куску."),
        qx("A leaf dataset was shot under warm and cold lamps, so one leaf looks very different in colour and brightness. Which step targets this?", "Normalize brightness and colour (white balance)", [
          ["Resize every image to the same size", "Resizing fixes different resolutions, not lighting or colour casts.", "Изменение размера решает проблему разных разрешений, а не освещения и цветового оттенка."],
          ["Apply a median blur to every image", "A median blur removes salt-and-pepper noise; it does not change the overall colour cast.", "Медианное размытие убирает шум «соль и перец»; общий цветовой оттенок оно не меняет."],
          ["Convert the labels to one-hot vectors before training", "Label encoding does not touch the pixels, so the lighting problem stays.", "Кодирование меток не трогает пиксели, поэтому проблема освещения остаётся."],
        ], "Illumination changes are handled by normalizing brightness/contrast and colour (white balance, histogram equalization) and by training on varied lighting.", "Смену освещения компенсируют нормализацией яркости, контраста и цвета (баланс белого, выравнивание гистограммы) и обучением на разном освещении."),
        tfx("Results obtained on MNIST usually carry over to harder datasets such as ImageNet.", false, "MNIST is the Drosophila of computer vision: easy to experiment on, but results from MNIST often do not hold on more complex datasets.", "MNIST — дрозофила компьютерного зрения: на нём удобно экспериментировать, но результаты с MNIST часто не переносятся на более сложные датасеты.", "Choosing True ignores the slide's warning: 28 × 28 grayscale digits are far simpler than 1000 classes of real photos.", "Ответ True игнорирует предупреждение со слайда: цифры 28 × 28 в оттенках серого гораздо проще, чем 1000 классов реальных фото."),
        qx("Cat breeds that differ mainly in fur colour must be told apart. What is the main risk of converting all images to grayscale?", "Colour cues that separate the classes are lost", [
          ["The images get three times more numbers", "It is the opposite: grayscale keeps one channel instead of three.", "Наоборот: в оттенках серого остаётся один канал вместо трёх."],
          ["Grayscale images cannot be resized anymore", "cv2.resize works on single-channel images just as well.", "cv2.resize так же хорошо работает с одноканальными изображениями."],
          ["OpenCV cannot blur or threshold single-channel images", "Blur and threshold work on grayscale; thresholding actually expects one channel.", "Размытие и пороговая обработка работают с серым; threshold даже ожидает один канал."],
        ], "Grayscale reduces the data threefold and removes colour noise, but when colour separates the classes (fine-grained breeds, plant disease spots) that information is lost.", "Оттенки серого втрое сокращают данные и убирают цветовой шум, но если классы различаются цветом (породы, пятна болезни на листьях), эта информация теряется."),
        qx("How does image captioning use classification as a building block?", "It classifies which word to say next, step by step", [
          ["It draws a box around every object it names", "Drawing boxes is object detection; captioning picks words.", "Рамки рисует object detection; captioning выбирает слова."],
          ["It counts the objects and prints the number", "Counting is a different task; the slide shows choosing words: man, riding, horse, STOP.", "Подсчёт — другая задача; на слайде выбираются слова: man, riding, horse, STOP."],
          ["It reads text printed in the photo with OCR", "Captioning describes the scene; it does not read printed text.", "Captioning описывает сцену, а не читает напечатанный текст."],
        ], "Captioning repeats a classification over the vocabulary: what word to say next? man → riding → horse → STOP.", "Captioning раз за разом классифицирует по словарю: какое слово сказать следующим? man → riding → horse → STOP."),
        qx("In the slides' object detection example, what is each image region classified as?", "Background or one of the object classes", [
          ["Edge or not edge, decided separately for every pixel", "Per-pixel edge maps come from edge detectors like Canny, not from detection by classification.", "Карты краёв по пикселям дают детекторы вроде Canny, а не детекция через классификацию."],
          ["The next word of a caption", "Choosing words is image captioning, not detection.", "Выбор слов — это image captioning, а не детекция."],
          ["A move on a 19 × 19 Go board", "Board positions are the classes in the Go example, not in detection.", "Позиции доски — классы в примере с го, а не в детекции."],
        ], "Detection classifies regions: background, horse, person, car, truck — a box gets the class of what is inside it.", "Детекция классифицирует области: background, horse, person, car, truck — рамка получает класс того, что внутри неё."),
        tfx("A student says a cat detector can be hand-coded reliably: find edges, then corners, then match a cat shape.", false, "The lecture's point: there is no obvious way to hard-code recognition; viewpoint, lighting, deformation and occlusion break fixed rules, so we use a data-driven approach.", "Мысль лекции: нет очевидного способа вручную закодировать распознавание; ракурс, освещение, деформация и перекрытие ломают фиксированные правила, поэтому используют подход на основе данных.", "Choosing True ignores the semantic gap: edge and corner rules fail as soon as the pose, the light or the background changes.", "Ответ True игнорирует семантический разрыв: правила по краям и углам ломаются, как только меняются поза, свет или фон."),
        qx("Which order matches the data-driven approach from the lecture?", "Collect labelled images, train, evaluate on new images", [
          ["Write rules for edges and corners, then test them", "Writing rules by hand is exactly what the data-driven approach replaces.", "Ручное написание правил — именно то, что заменяет подход на основе данных."],
          ["Train on new images, then collect labels for them", "Training needs labels first; the order is collect → train → evaluate.", "Для обучения сначала нужны метки; порядок — собрать → обучить → оценить."],
          ["Evaluate on the training images, then collect test labels", "Evaluating on training images says nothing about new data.", "Оценка на обучающих изображениях ничего не говорит о новых данных."],
        ], "1. Collect a dataset of images and labels; 2. use machine learning to train a classifier; 3. evaluate it on new images.", "1. Собрать датасет изображений с метками; 2. обучить классификатор методами машинного обучения; 3. оценить его на новых изображениях."),
        qx("Which description fits the MNIST dataset?", "10 digit classes, 28 × 28 grayscale images", [
          ["10 object classes, 32 × 32 RGB images", "That is CIFAR-10: airplane, automobile, bird and so on.", "Это CIFAR-10: airplane, automobile, bird и так далее."],
          ["1000 classes, images often resized to 256 × 256", "That is ImageNet, with ~1.3M training images.", "Это ImageNet с ~1.3M обучающих изображений."],
          ["1623 characters, 20 images per category", "That is Omniglot, built for few-shot learning.", "Это Omniglot, созданный для few-shot learning."],
        ], "MNIST: 10 classes (digits 0 to 9), 28 × 28 grayscale images, 50k training and 10k test images.", "MNIST: 10 классов (цифры от 0 до 9), изображения 28 × 28 в оттенках серого, 50k обучающих и 10k тестовых."),
        qx("How are the classes of CIFAR-100 organized?", "20 superclasses × 5 classes = 100", [
          ["10 superclasses × 10 classes each", "The count is 100, but CIFAR-100 has 20 superclasses of 5 classes.", "Итог 100 сходится, но в CIFAR-100 20 суперклассов по 5 классов."],
          ["100 classes with no grouping at all", "CIFAR-100 does group classes, e.g. aquatic mammals and trees.", "CIFAR-100 группирует классы, например aquatic mammals и trees."],
          ["20 classes with 5 000 images each", "CIFAR-100 has 100 classes with 500 training images each.", "В CIFAR-100 100 классов по 500 обучающих изображений."],
        ], "CIFAR-100: 100 classes in 20 superclasses with 5 classes each — e.g. aquatic mammals: beaver, dolphin, otter, seal, whale.", "CIFAR-100: 100 классов в 20 суперклассах по 5 — например, aquatic mammals: beaver, dolphin, otter, seal, whale."),
        qx("A model's 5 guesses for a lynx photo, best first, are tabby, tiger cat, lynx, cougar, fox. How is this prediction scored?", "Wrong for top-1, correct for top-5", [
          ["Correct for both top-1 and top-5", "Top-1 counts only the first guess, tabby, which is wrong.", "Top-1 засчитывает только первую догадку, tabby, а она неверна."],
          ["Wrong for both top-1 and top-5", "Top-5 is correct when the true label is among the 5 guesses — lynx is third.", "Top-5 засчитывается, если верная метка среди 5 догадок, — lynx третья."],
          ["Correct for top-1, wrong for top-5", "This is impossible: if the first guess is right, it is also inside the top 5.", "Так не бывает: если первая догадка верна, она входит и в top-5."],
        ], "Top-5 accuracy (ImageNet's metric): the image counts as correct if one of the 5 predicted labels is right; top-1 needs the first guess to be right.", "Top-5 accuracy (метрика ImageNet): изображение засчитывается, если одна из 5 предсказанных меток верна; для top-1 должна быть верна первая."),
        qx("Omniglot has 1623 categories but only 20 images per category. What is it meant to test?", "Learning a class from very few examples", [
          ["Scene recognition across 365 place types", "365 scene types is MIT Places, not Omniglot.", "365 типов сцен — это MIT Places, а не Omniglot."],
          ["Training on millions of labelled images", "20 images per category is the opposite of millions; that describes ImageNet or Places.", "20 изображений на категорию — противоположность миллионов; это про ImageNet или Places."],
          ["Digit recognition on 28 × 28 images", "Handwritten digits 0–9 are MNIST; Omniglot has characters from 50 alphabets.", "Рукописные цифры 0–9 — это MNIST; в Omniglot символы из 50 алфавитов."],
        ], "Omniglot (1623 characters from 50 alphabets, 20 images each) is meant to test few-shot learning.", "Omniglot (1623 символа из 50 алфавитов, по 20 изображений) создан для проверки few-shot learning."),
        qx("MIT Places has 365 scene classes and 900 test images per class. How many test images is that?", "328 500", [
          ["18 250", "18 250 = 365 × 50 is the validation set, with 50 images per class.", "18 250 = 365 × 50 — это validation, по 50 изображений на класс."],
          ["365 000", "That would be 1 000 per class; the slide says 900 per class.", "Это было бы 1 000 на класс, а на слайде 900 на класс."],
          ["32 850", "That is 365 × 90 — one zero is missing.", "Это 365 × 90 — потерян один ноль."],
        ], "365 × 900 = 328 500 test images, the slide's 328.5K.", "365 × 900 = 328 500 тестовых изображений — те самые 328.5K со слайда."),
      ],
    ),
    part(
      "cv-l2-p2",
      { en: "Nearest neighbor and kNN: distances, boundaries, speed", ru: "Nearest neighbor и kNN: расстояния, границы, скорость" },
      {
        en: `## The first classifier: nearest neighbor
The **nearest neighbor (NN)** classifier is the simplest data-driven method:
- **train**: memorize all training images and their labels — nothing else happens;
- **predict**: for each test image, find the **most similar** training image and return **its label**.
"Most similar" needs a **distance metric**: a number that is small when two images are alike and large when they differ.
## L1 distance, worked example from the slide
The **L1 (Manhattan) distance** compares two images **pixel by pixel** and adds up the absolute differences:
= d1(I1, I2) = sum over all pixels p of |I1[p] - I2[p]|
The slide compares a 4 × 4 test image with a 4 × 4 training image (each table row is one row of pixels):
| Test image row | Training image row | Absolute differences |
|---|---|---|
| 56, 32, 10, 18 | 10, 20, 24, 17 | 46, 12, 14, 1 |
| 90, 23, 128, 133 | 8, 10, 89, 100 | 82, 13, 39, 33 |
| 24, 26, 178, 200 | 12, 16, 178, 170 | 12, 10, 0, 30 |
| 2, 0, 255, 220 | 4, 32, 233, 112 | 2, 32, 22, 108 |
= row 1: 46 + 12 + 14 + 1 = 73
= row 2: 82 + 13 + 39 + 33 = 167
= row 3: 12 + 10 + 0 + 30 = 52
= row 4: 2 + 32 + 22 + 108 = 164
= d1 = 73 + 167 + 52 + 164 = 456
Note the **absolute value**: 10 − 24 = −14 counts as **+14**. Without it, positive and negative differences would cancel out.
## L2 distance
The **L2 (Euclidean) distance** squares the differences, adds them up and takes the square root:
= d2(I1, I2) = sqrt( sum over all pixels p of (I1[p] - I2[p])^2 )
A tiny example with two 3-pixel images a = [10, 20, 30] and b = [13, 16, 30]:
= differences: |10 - 13| = 3, |20 - 16| = 4, |30 - 30| = 0
= L1 = 3 + 4 + 0 = 7
= L2 = sqrt(3^2 + 4^2 + 0^2) = sqrt(9 + 16 + 0) = sqrt(25) = 5
| Property | L1 (Manhattan) | L2 (Euclidean) |
|---|---|---|
| Formula | sum of absolute differences | square root of the sum of squared differences |
| Points at distance 1 from the centre | a diamond (a square turned 45°) | a circle |
| One big difference | counts as it is | counts more, because it is squared |
| Rotating the coordinate axes | changes the distance | does not change it |
| NN boundaries in 2-D | pieces that are horizontal, vertical or at 45° | straight pieces at any angle |
## The code from the slide (NumPy)
The training set is a matrix **Xtr** of shape N × D: one flattened image per row (N images, D pixels each); **ytr** holds the N labels.
= self.Xtr = X    # train: just memorize the data
= self.ytr = y
= distances = np.sum(np.abs(self.Xtr - X[i, :]), axis=1)
= min_index = np.argmin(distances)
= Ypred[i] = self.ytr[min_index]
- **self.Xtr − X[i, :]** subtracts the i-th test image from **every** training row at once (broadcasting) → an N × D matrix;
- **np.abs** and **np.sum(…, axis=1)** add the absolute differences along each row → **N distances**, shape (N,);
- **np.argmin** gives the index of the **smallest** distance, and the label at that index is the prediction (np.argmax would pick the most different image);
- for L2 the distance line becomes np.sqrt(np.sum(np.square(self.Xtr − X[i, :]), axis=1)).
## How fast is it?
| Step | Time with N training examples | Why |
|---|---|---|
| Training | O(1) | it only stores the data |
| Prediction (one test image) | O(N) | it compares the test image with all N training images |
This is **bad**: we can afford **slow training** (done once, offline), but we need **fast testing** (every user request, often on a phone). Useful models are usually the other way round: slow to train, fast to predict.
= CIFAR-10: one prediction = 50 000 distances x 3 072 values = 153 600 000 subtractions
= 10 000 test images x 50 000 training images = 500 000 000 distance computations
There are many methods for **fast / approximate nearest neighbors**, e.g. the **FAISS** library (github.com/facebookresearch/faiss).
## What do the nearest neighbors look like?
On CIFAR-10 the slide shows each test image with its 10 nearest training images by pixel distance. Many neighbours belong to the **wrong class** (red frames on the slide): they share the overall **colour, brightness and background**, not the object.
## Decision boundaries
@diagram cv-knn
The slides draw NN in two dimensions (features x0 and x1):
- **points** are training examples; their **colours** are the training labels;
- **background colours** give the category a test point at that position would be assigned;
- the **decision boundary** is the boundary between two classification regions.
With one neighbour the boundaries are **noisy** and **affected by outliers**: a single yellow point inside the green cloud creates a yellow island around itself. How to smooth them? **Use more neighbours.**
## K-nearest neighbors (kNN)
Instead of copying the label from the single nearest neighbour, take a **majority vote** among the **K closest points**.
- More neighbours **smooth out rough decision boundaries**.
- More neighbours **reduce the effect of outliers**: one mislabelled point is outvoted.
- With K > 1 there can be **ties** between classes (white regions on the slide) — they must be broken somehow: e.g. the closest neighbour decides, or an odd K is used for two classes.
Worked vote — the five training points nearest to a query point, sorted by distance:
| Rank | Distance | Label |
|---|---|---|
| 1 | 1.0 | cat |
| 2 | 1.5 | dog |
| 3 | 2.0 | dog |
| 4 | 2.5 | cat |
| 5 | 3.0 | cat |
= K = 1: neighbour 1 -> cat
= K = 3: cat 1, dog 2 -> dog
= K = 5: cat 3, dog 2 -> cat
The same query gets **different answers for different K**, so K must be chosen carefully (part 3).
## The distance metric decides what similar means
The slides compare L1 and L2 with K = 1 on the same points: the regions differ, because "nearest" depends on the metric.
With the right choice of distance metric, kNN can be applied to **any type of data** — for example research papers compared with **tf-idf similarity** (the "show similar" button of arxiv-sanity). The web demo (vision.stanford.edu/teaching/cs231n-demos/knn) lets you move points, switch between L1 and L2 and change K and the number of points.
> Nearest neighbor memorizes the training data (training O(1)) and compares every test image with all N training images (prediction O(N)); kNN takes a majority vote of the K closest points, which smooths boundaries and resists outliers.
## Check yourself
?? Compute the L1 and the L2 distance between a = [2, 8, 5] and b = [8, 0, 5]. Show the steps.
?= |2 − 8| = 6, |8 − 0| = 8, |5 − 5| = 0, so L1 = 6 + 8 + 0 = 14 and L2 = √(6² + 8² + 0²) = √(36 + 64) = √100 = 10.
?? A nearest neighbor classifier stores 1 000 000 training images. How fast are its training and its prediction, and why is this a problem for a phone app?
?= Training is O(1) — it only memorizes the data — but each prediction is O(N): the test image is compared with all 1 000 000 training images, which is slow and needs the whole dataset in memory. We want the opposite (slow training is fine, testing must be fast), so one uses approximate nearest neighbors (e.g. FAISS) or a parametric model.`,
        ru: `## Первый классификатор: nearest neighbor
Классификатор **nearest neighbor (NN, ближайший сосед)** — самый простой метод на основе данных:
- **train**: запомнить все обучающие изображения и их метки — больше ничего не происходит;
- **predict**: для каждого тестового изображения найти **самое похожее** обучающее и вернуть **его метку**.
Для «самого похожего» нужна **метрика расстояния (distance metric)**: число, маленькое для похожих изображений и большое для разных.
## Расстояние L1: разбор примера со слайда
**Расстояние L1 (манхэттенское, Manhattan)** сравнивает два изображения **попиксельно** и складывает модули разностей:
= d1(I1, I2) = sum over all pixels p of |I1[p] - I2[p]|
На слайде сравнивают тестовое изображение 4 × 4 с обучающим 4 × 4 (каждая строка таблицы — одна строка пикселей):
| Строка теста | Строка обучающего | Модули разностей |
|---|---|---|
| 56, 32, 10, 18 | 10, 20, 24, 17 | 46, 12, 14, 1 |
| 90, 23, 128, 133 | 8, 10, 89, 100 | 82, 13, 39, 33 |
| 24, 26, 178, 200 | 12, 16, 178, 170 | 12, 10, 0, 30 |
| 2, 0, 255, 220 | 4, 32, 233, 112 | 2, 32, 22, 108 |
= row 1: 46 + 12 + 14 + 1 = 73
= row 2: 82 + 13 + 39 + 33 = 167
= row 3: 12 + 10 + 0 + 30 = 52
= row 4: 2 + 32 + 22 + 108 = 164
= d1 = 73 + 167 + 52 + 164 = 456
Обратите внимание на **модуль**: 10 − 24 = −14 считается как **+14**. Без модуля положительные и отрицательные разности взаимно гасились бы.
## Расстояние L2
**Расстояние L2 (евклидово, Euclidean)** возводит разности в квадрат, складывает и извлекает квадратный корень:
= d2(I1, I2) = sqrt( sum over all pixels p of (I1[p] - I2[p])^2 )
Маленький пример с двумя изображениями из 3 пикселей: a = [10, 20, 30] и b = [13, 16, 30]:
= differences: |10 - 13| = 3, |20 - 16| = 4, |30 - 30| = 0
= L1 = 3 + 4 + 0 = 7
= L2 = sqrt(3^2 + 4^2 + 0^2) = sqrt(9 + 16 + 0) = sqrt(25) = 5
| Свойство | L1 (Manhattan) | L2 (Euclidean) |
|---|---|---|
| Формула | сумма модулей разностей | корень из суммы квадратов разностей |
| Точки на расстоянии 1 от центра | ромб (квадрат, повёрнутый на 45°) | окружность |
| Одна большая разность | учитывается как есть | весит больше, потому что возводится в квадрат |
| Поворот осей координат | меняет расстояние | не меняет |
| Границы NN на плоскости | отрезки горизонтальные, вертикальные или под 45° | прямые отрезки под любым углом |
## Код со слайда (NumPy)
Обучающая выборка — матрица **Xtr** формы N × D: по одному «вытянутому» изображению в строке (N изображений по D пикселей); **ytr** хранит N меток.
= self.Xtr = X    # train: just memorize the data
= self.ytr = y
= distances = np.sum(np.abs(self.Xtr - X[i, :]), axis=1)
= min_index = np.argmin(distances)
= Ypred[i] = self.ytr[min_index]
- **self.Xtr − X[i, :]** вычитает i-е тестовое изображение сразу из **каждой** обучающей строки (broadcasting) → матрица N × D;
- **np.abs** и **np.sum(…, axis=1)** складывают модули разностей вдоль каждой строки → **N расстояний**, форма (N,);
- **np.argmin** даёт индекс **наименьшего** расстояния, и метка по этому индексу — предсказание (np.argmax выбрал бы самое непохожее изображение);
- для L2 строка расстояний становится np.sqrt(np.sum(np.square(self.Xtr − X[i, :]), axis=1)).
## Насколько это быстро?
| Шаг | Время при N обучающих примерах | Почему |
|---|---|---|
| Обучение | O(1) | только сохраняет данные |
| Предсказание (одно изображение) | O(N) | сравнивает тестовое изображение со всеми N обучающими |
Это **плохо**: медленное **обучение** мы можем себе позволить (оно делается один раз, офлайн), а **тестирование** нужно быстрое (каждый запрос пользователя, часто на телефоне). Полезные модели обычно наоборот: учатся медленно, предсказывают быстро.
= CIFAR-10: one prediction = 50 000 distances x 3 072 values = 153 600 000 subtractions
= 10 000 test images x 50 000 training images = 500 000 000 distance computations
Есть много методов **быстрого / приближённого поиска ближайших соседей**, например библиотека **FAISS** (github.com/facebookresearch/faiss).
## Как выглядят ближайшие соседи?
На слайде для CIFAR-10 показаны тестовые изображения и по 10 ближайших обучающих по пиксельному расстоянию. Многие соседи из **чужого класса** (красные рамки на слайде): у них похожи общие **цвет, яркость и фон**, а не объект.
## Границы решений (decision boundaries)
@diagram cv-knn
На слайдах NN нарисован в двух измерениях (признаки x0 и x1):
- **точки** — обучающие примеры; их **цвета** — обучающие метки;
- **цвет фона** показывает класс, который получила бы тестовая точка в этом месте;
- **граница решений (decision boundary)** — граница между двумя областями классов.
С одним соседом границы **шумные** и **зависят от выбросов (outliers)**: одна жёлтая точка внутри зелёного облака создаёт вокруг себя жёлтый островок. Как их сгладить? **Брать больше соседей.**
## K ближайших соседей (kNN)
Вместо того чтобы копировать метку единственного ближайшего соседа, проводят **голосование большинством (majority vote)** среди **K ближайших точек**.
- Больше соседей — **глаже неровные границы решений**.
- Больше соседей — **меньше влияние выбросов**: одну неверно размеченную точку перевешивают остальные.
- При K > 1 возможна **ничья (tie)** между классами (белые области на слайде) — её нужно как-то разрешать: например, решает ближайший сосед или для двух классов берут нечётное K.
Разбор голосования — пять обучающих точек, ближайших к запросу, по возрастанию расстояния:
| Место | Расстояние | Метка |
|---|---|---|
| 1 | 1.0 | cat |
| 2 | 1.5 | dog |
| 3 | 2.0 | dog |
| 4 | 2.5 | cat |
| 5 | 3.0 | cat |
= K = 1: neighbour 1 -> cat
= K = 3: cat 1, dog 2 -> dog
= K = 5: cat 3, dog 2 -> cat
Один и тот же запрос получает **разные ответы при разных K**, поэтому K нужно выбирать осознанно (часть 3).
## Метрика решает, что значит «похоже»
На слайдах L1 и L2 сравнивают при K = 1 на одних и тех же точках: области получаются разными, потому что «ближайший» зависит от метрики.
При правильном выборе метрики kNN можно применять к **любому типу данных** — например, сравнивать научные статьи по **tf-idf similarity** (кнопка «show similar» на arxiv-sanity). Веб-демо (vision.stanford.edu/teaching/cs231n-demos/knn) позволяет двигать точки, переключать L1 и L2, менять K и число точек.
> Nearest neighbor запоминает обучающие данные (обучение O(1)) и сравнивает каждое тестовое изображение со всеми N обучающими (предсказание O(N)); kNN голосует среди K ближайших точек — это сглаживает границы и ослабляет влияние выбросов.
## Проверь себя
?? Вычислите расстояния L1 и L2 между a = [2, 8, 5] и b = [8, 0, 5]. Покажите шаги.
?= |2 − 8| = 6, |8 − 0| = 8, |5 − 5| = 0, поэтому L1 = 6 + 8 + 0 = 14, а L2 = √(6² + 8² + 0²) = √(36 + 64) = √100 = 10.
?? Классификатор nearest neighbor хранит 1 000 000 обучающих изображений. Насколько быстро он обучается и предсказывает и почему это проблема для приложения на телефоне?
?= Обучение O(1) — он только запоминает данные, — но каждое предсказание O(N): тестовое изображение сравнивается со всеми 1 000 000 обучающих, это медленно и требует держать весь датасет в памяти. Нужно наоборот (медленное обучение допустимо, тест должен быть быстрым), поэтому используют приближённый поиск соседей (например, FAISS) или параметрическую модель.`,
      },
      [
        qx("What does the nearest neighbor classifier do during training?", "It memorizes all training images and labels", [
          ["It learns one weight per pixel and class", "Learning weights is what a linear classifier does; NN learns nothing and only stores the data.", "Веса учит линейный классификатор; NN ничего не учит и только хранит данные."],
          ["It computes the mean image of each class", "Averaging per class is a nearest-centroid method, not the slide's nearest neighbor.", "Усреднение по классам — это метод ближайшего центроида, а не nearest neighbor со слайда."],
          ["It fits a line between every pair of classes", "Fitting lines between classes is a linear model; NN's train() just keeps X and y.", "Проведение прямых между классами — линейная модель; train() у NN просто сохраняет X и y."],
        ], "train(X, y) only does self.Xtr = X and self.ytr = y: memorize all data and labels.", "train(X, y) делает только self.Xtr = X и self.ytr = y: запоминает все данные и метки."),
        qx("How does nearest neighbor predict the label of a test image?", "It copies the label of the closest training image", [
          ["It takes the label of the farthest training image", "The farthest image is the least similar one; NN uses the smallest distance.", "Самое далёкое изображение — наименее похожее; NN берёт наименьшее расстояние."],
          ["It averages the labels of all training images", "Labels are categories and are not averaged; NN uses only the closest image.", "Метки — категории, их не усредняют; NN смотрит только на ближайшее изображение."],
          ["It picks the most frequent label in the dataset", "That ignores the test image completely; NN looks for the most similar training image.", "Так тестовое изображение вообще не учитывается; NN ищет самое похожее обучающее."],
        ], "For each test image: find the nearest training image (smallest distance) and return its label.", "Для каждого тестового изображения: найти ближайшее обучающее (наименьшее расстояние) и вернуть его метку."),
        qx("Test row [56, 32, 10, 18], training row [10, 20, 24, 17]. What is the L1 distance between these two rows?", "73", [
          ["45", "This forgets the absolute value: 46 + 12 − 14 + 1 = 45; the −14 must count as +14.", "Здесь забыт модуль: 46 + 12 − 14 + 1 = 45; −14 нужно считать как +14."],
          ["49.6", "≈ √2457 is the L2 distance of these rows, not L1.", "≈ √2457 — это расстояние L2 для этих строк, а не L1."],
          ["2 457", "46² + 12² + 14² + 1² = 2 457 is the sum of squares, used inside L2.", "46² + 12² + 14² + 1² = 2 457 — сумма квадратов, она нужна внутри L2."],
        ], "|56 − 10| + |32 − 20| + |10 − 24| + |18 − 17| = 46 + 12 + 14 + 1 = 73, the slide's first row.", "|56 − 10| + |32 − 20| + |10 − 24| + |18 − 17| = 46 + 12 + 14 + 1 = 73 — первая строка со слайда."),
        qx("What is the L2 distance between a = [1, 4] and b = [4, 0]?", "5", [
          ["7", "3 + 4 = 7 is the L1 distance; L2 squares, adds and takes the root.", "3 + 4 = 7 — это L1; L2 возводит в квадрат, складывает и извлекает корень."],
          ["25", "9 + 16 = 25 is the sum of squares; the square root is still missing.", "9 + 16 = 25 — сумма квадратов; не хватает квадратного корня."],
          ["1", "Adding signed differences −3 + 4 = 1 lets them cancel; distances use squares or absolute values.", "Сумма разностей со знаком −3 + 4 = 1 даёт взаимное гашение; расстояния используют квадраты или модули."],
        ], "Differences 3 and 4: L2 = √(3² + 4²) = √25 = 5.", "Разности 3 и 4: L2 = √(3² + 4²) = √25 = 5."),
        qx("In the slide's 4 × 4 example the row sums of absolute differences are 73, 167, 52 and 164. What is the L1 distance?", "456", [
          ["114", "456 / 4 = 114 is the average per row; L1 is the full sum.", "456 / 4 = 114 — среднее по строке; L1 — полная сумма."],
          ["28.5", "456 / 16 = 28.5 is the average per pixel, not the distance.", "456 / 16 = 28.5 — среднее на пиксель, а не расстояние."],
          ["167", "167 is only the largest row; all four rows must be added.", "167 — только самая большая строка; сложить нужно все четыре."],
        ], "L1 adds the absolute differences of all 16 pixels: 73 + 167 + 52 + 164 = 456.", "L1 складывает модули разностей всех 16 пикселей: 73 + 167 + 52 + 164 = 456."),
        qx("Xtr has shape (50000, 3072). What is the shape of np.sum(np.abs(Xtr - x), axis=1) for one test row x?", "(50000,)", [
          ["(3072,)", "Summing over axis=0 would give one value per pixel; axis=1 sums each row.", "Сумма по axis=0 дала бы по значению на пиксель; axis=1 суммирует каждую строку."],
          ["(50000, 3072)", "That is the shape of the difference matrix before the sum.", "Это форма матрицы разностей до суммирования."],
          ["a single number", "Without an axis np.sum would return one scalar; with axis=1 it keeps one value per row.", "Без axis np.sum вернул бы одно число; с axis=1 остаётся по значению на строку."],
        ], "Broadcasting subtracts x from all 50 000 rows; summing along axis=1 leaves one distance per training image: shape (50000,).", "Broadcasting вычитает x из всех 50 000 строк; сумма по axis=1 оставляет по расстоянию на обучающее изображение: форма (50000,)."),
        qx("A student writes min_index = np.argmax(distances) in the NN code. What will the classifier return?", "The label of the least similar training image", [
          ["The label of the most similar training image", "That needs np.argmin: the smallest distance means the most similar image.", "Для этого нужен np.argmin: наименьшее расстояние — самое похожее изображение."],
          ["An error, because argmax needs a 2-D array", "np.argmax works on a 1-D array, so the code runs and silently gives wrong labels.", "np.argmax работает с одномерным массивом, поэтому код выполнится и молча даст неверные метки."],
          ["The most frequent label in the training set", "argmax picks one index by distance, not by label frequency.", "argmax выбирает один индекс по расстоянию, а не по частоте меток."],
        ], "argmax returns the index of the largest distance — the most different image — so predictions are wrong without any error.", "argmax возвращает индекс наибольшего расстояния — самого непохожего изображения, — и предсказания неверны без всякой ошибки."),
        qx("With N training examples, how fast are nearest neighbor training and prediction?", "Training O(1), prediction O(N)", [
          ["Training O(N), prediction O(1)", "This is reversed — and it is what we would like to have, but NN is the opposite.", "Это наоборот — именно так хотелось бы, но у NN всё обратно."],
          ["Training O(N²), prediction O(N)", "Training compares nothing; it only stores the data in constant time.", "Обучение ничего не сравнивает; оно лишь сохраняет данные за константное время."],
          ["Training O(1), prediction O(1)", "Prediction must compare the test image with all N training images.", "Предсказание должно сравнить тестовое изображение со всеми N обучающими."],
        ], "Training only memorizes: O(1). Predicting one image computes N distances: O(N).", "Обучение только запоминает: O(1). Предсказание одного изображения считает N расстояний: O(N)."),
        qx("Why does the lecture call nearest neighbor's speed profile bad?", "We need fast testing; slow training is acceptable", [
          ["Training must be repeated before each prediction", "Training happens once and only stores data; repeating it is not the issue.", "Обучение происходит один раз и только сохраняет данные; дело не в его повторах."],
          ["Training is too slow for large datasets", "NN training is O(1); it is prediction that is slow.", "Обучение NN — O(1); медленное как раз предсказание."],
          ["Prediction time does not grow with the dataset size", "It does grow: every prediction is O(N).", "Растёт: каждое предсказание — O(N)."],
        ], "We can afford slow training (done once), but we need fast testing; NN is fast to train and slow to test — the wrong way round.", "Медленное обучение можно себе позволить (оно один раз), а тестирование должно быть быстрым; NN быстро учится и медленно тестирует — всё наоборот."),
        qx("A NN classifier has 50 000 training images. How many distances does it compute to classify 200 test images?", "10 000 000", [
          ["50 000", "That is the number for one test image; there are 200 of them.", "Это число для одного тестового изображения, а их 200."],
          ["100 000 000", "One zero too many: 50 000 × 200 = 10 000 000.", "Лишний ноль: 50 000 × 200 = 10 000 000."],
          ["50 200", "The counts must be multiplied, not added: each test image meets every training image.", "Числа нужно перемножить, а не сложить: каждое тестовое сравнивается с каждым обучающим."],
        ], "Each of the 200 test images is compared with all 50 000 training images: 200 × 50 000 = 10 000 000 distances.", "Каждое из 200 тестовых изображений сравнивается со всеми 50 000 обучающими: 200 × 50 000 = 10 000 000 расстояний."),
        qx("What does the FAISS library mentioned on the slide provide?", "Fast or approximate nearest neighbor search", [
          ["A dataset of 1.3 million labelled images", "That describes ImageNet, not a library.", "Это описание ImageNet, а не библиотеки."],
          ["A web demo of kNN decision boundaries", "The web demo is a separate Stanford page (cs231n-demos/knn).", "Веб-демо — отдельная страница Стэнфорда (cs231n-demos/knn)."],
          ["A new distance metric that replaces L1 and L2 entirely", "FAISS speeds up the neighbour search; it does not replace the metric.", "FAISS ускоряет поиск соседей, а не заменяет метрику."],
        ], "The slide points to FAISS as one of many methods for fast / approximate nearest neighbors, which fixes NN's slow prediction.", "Слайд упоминает FAISS как один из методов быстрого / приближённого поиска ближайших соседей — это лечит медленное предсказание NN."),
        qx("In the slides' 2-D plots, what is a decision boundary?", "The border between two classification regions", [
          ["The line joining two training points", "A segment between two points is not a boundary; the boundary separates regions of different classes.", "Отрезок между двумя точками — не граница; граница разделяет области разных классов."],
          ["The set of points at distance K from a training point", "K is the number of neighbours, not a radius.", "K — число соседей, а не радиус."],
          ["The edge of the plotted data area", "The plot's frame is not a boundary between classes.", "Рамка графика — не граница между классами."],
        ], "Background colours show the class a test point would get; the decision boundary is where one colour region meets another.", "Цвет фона показывает класс, который получит тестовая точка; граница решений — там, где одна цветная область встречается с другой."),
        qx("With K = 1, one yellow training point sits inside a green cluster. What happens around it?", "A small yellow island appears", [
          ["The yellow point is ignored", "With K = 1 every point counts; nothing outvotes it.", "При K = 1 учитывается каждая точка; её никто не перевешивает."],
          ["The green region becomes smoother", "An outlier makes the boundary noisier, not smoother.", "Выброс делает границу шумнее, а не глаже."],
          ["The whole region turns yellow", "Only test points nearest to that one point turn yellow; the rest stay green.", "Жёлтыми становятся только тестовые точки, ближайшие к этой точке; остальное остаётся зелёным."],
        ], "With K = 1 decision boundaries are noisy and affected by outliers: the yellow outlier gets its own yellow island.", "При K = 1 границы шумные и зависят от выбросов: жёлтый выброс получает собственный жёлтый островок."),
        qx("The 5 nearest neighbours, closest first, are dog, cat, cat, dog, dog. What do K = 1, K = 3 and K = 5 predict?", "dog, cat, dog", [
          ["dog, dog, dog", "K = 3 sees dog, cat, cat: cat wins 2 to 1.", "При K = 3 видны dog, cat, cat: cat побеждает 2 : 1."],
          ["cat, cat, dog", "K = 1 uses only the closest neighbour, which is a dog.", "K = 1 берёт только ближайшего соседа, а это dog."],
          ["dog, cat, cat", "K = 5 counts 3 dogs and 2 cats, so dog wins.", "При K = 5 — 3 dog и 2 cat, побеждает dog."],
        ], "K = 1 → dog; K = 3 → dog, cat, cat → cat; K = 5 → 3 dogs vs 2 cats → dog.", "K = 1 → dog; K = 3 → dog, cat, cat → cat; K = 5 → 3 dog против 2 cat → dog."),
        qx("What does increasing K from 1 to 3 usually do to the decision boundaries?", "Smooths them and removes outlier islands", [
          ["Makes them noisier around outliers", "More voters make single outliers matter less, so boundaries get smoother.", "Чем больше голосующих, тем меньше влияние одиночного выброса, и границы глаже."],
          ["Leaves them exactly unchanged", "The slides show clearly different regions for K = 1 and K = 3.", "На слайдах области при K = 1 и K = 3 заметно различаются."],
          ["Turns them into perfectly straight lines", "kNN boundaries stay piecewise; they become smoother, not straight lines.", "Границы kNN остаются ломаными; они становятся глаже, но не прямыми."],
        ], "Using more neighbours helps smooth out rough decision boundaries and reduces the effect of outliers.", "Больше соседей — глаже неровные границы и меньше влияние выбросов."),
        qx("With K = 4, two neighbours say cat and two say dog. What does the lecture say about such cases?", "It is a tie that must be broken somehow", [
          ["It cannot happen when K is larger than 1", "It is the reverse: ties appear only when K > 1.", "Наоборот: ничьи бывают только при K > 1."],
          ["The test point is labelled as background", "There is no background class in kNN voting; one of the tied classes must win.", "В голосовании kNN нет класса background; должен победить один из классов ничьей."],
          ["K is automatically reduced to 0", "K = 0 would mean no neighbours and no vote at all.", "K = 0 означало бы отсутствие соседей и голосования вообще."],
        ], "When K > 1 there can be ties between classes (white regions on the slide); they need a rule, e.g. the closest neighbour decides or an odd K.", "При K > 1 возможны ничьи между классами (белые области на слайде); нужно правило, например решает ближайший сосед или берётся нечётное K."),
        qx("Which shape contains all points at L1 distance 1 from the origin in 2-D?", "A diamond (a square rotated 45°)", [
          ["A circle", "A circle is the set at L2 distance 1.", "Окружность — это точки на расстоянии 1 по L2."],
          ["An axis-aligned square with corners at (±1, ±1)", "That square belongs to the max (L∞) distance; L1 gives |x| + |y| = 1, a diamond.", "Такой квадрат — для максимум-расстояния (L∞); L1 даёт |x| + |y| = 1, ромб."],
          ["A straight line through the origin", "A distance level set around a point is a closed curve, not a line.", "Множество точек на одном расстоянии от центра — замкнутая фигура, а не прямая."],
        ], "|x| + |y| = 1 is a diamond with corners (1, 0), (0, 1), (−1, 0), (0, −1) — the slide's L1 picture; L2 gives a circle.", "|x| + |y| = 1 — ромб с вершинами (1, 0), (0, 1), (−1, 0), (0, −1), как на слайде для L1; L2 даёт окружность."),
        tfx("Rotating the coordinate axes can change the L1 distance between two points, but not their L2 distance.", true, "L1 adds the per-axis differences, which depend on the axes; L2 is the length of the difference vector and does not change under rotation.", "L1 складывает разности по осям, а они зависят от осей; L2 — длина вектора разности, и при повороте она не меняется.", "Choosing False would mean the diamond of L1 is as symmetric as the circle of L2 — rotating the diamond clearly changes it.", "Ответ False означал бы, что ромб L1 так же симметричен, как окружность L2, — но при повороте ромб явно меняется."),
        tfx("With the right distance metric, kNN can be applied to non-image data, such as research papers compared by tf-idf.", true, "The slide's example: arxiv-sanity finds similar papers with tf-idf similarity; kNN only needs a sensible distance.", "Пример со слайда: arxiv-sanity находит похожие статьи по tf-idf similarity; kNN нужна лишь осмысленная метрика.", "Choosing False ties kNN to pixels, but the method works on any data for which a distance is defined.", "Ответ False привязывает kNN к пикселям, хотя метод работает с любыми данными, для которых задано расстояние."),
        qx("On CIFAR-10, why are many pixel-space nearest neighbours of a test image from the wrong class?", "They match colours and background, not the object", [
          ["The test images were labelled incorrectly", "The labels are fine; the pixel distance itself measures the wrong kind of similarity.", "Метки в порядке; само пиксельное расстояние измеряет не то сходство."],
          ["L1 distance only looks at the image border", "L1 sums over all pixels, not just the border.", "L1 суммирует по всем пикселям, а не только по краю."],
          ["Nearest neighbor always returns a random training image", "NN is deterministic: it returns the image with the smallest distance.", "NN детерминирован: он возвращает изображение с наименьшим расстоянием."],
        ], "Pixel distance rewards similar overall colour, brightness and background, so neighbours often show other classes (the red frames on the slide).", "Пиксельное расстояние поощряет похожие общий цвет, яркость и фон, поэтому соседи часто из других классов (красные рамки на слайде)."),
      ],
    ),
    part(
      "cv-l2-p3",
      { en: "Hyperparameters, data splits, cross-validation and the limits of kNN", ru: "Гиперпараметры, разбиение данных, кросс-валидация и пределы kNN" },
      {
        en: `## Hyperparameters
What is the best value of **K**? What is the best **distance metric**? These are **hyperparameters**: choices about the learning algorithm that we **don't learn from the training data**; instead we **set them at the start** of the learning process.
| | Hyperparameter | Parameter |
|---|---|---|
| Who sets it | you, before training | the learning algorithm, during training |
| Examples | K, L1 vs L2 (later: learning rate, regularization strength λ) | the weights W and bias b of a linear classifier (next lecture) |
| How to choose it | try values, compare them on validation data | fit it to the training data |
Hyperparameters are **very problem-dependent**: in general you need to **try them all** and see what works best for your data and task.
## Setting hyperparameters: four ideas
| Idea | What you do | Verdict |
|---|---|---|
| #1 | choose what works best on **your whole dataset** (used for training) | **BAD**: K = 1 always works perfectly on training data |
| #2 | split into **train** and **test**; choose what works best on **test** | **BAD**: no idea how the algorithm will perform on new data |
| #3 | split into **train, validation and test**; choose on **validation**, evaluate on **test** | **Better!** |
| #4 | **cross-validation**: split into folds, try each fold as validation, average | most reliable; useful for small datasets |
- Why idea #1 fails: with K = 1 every training image is its **own nearest neighbour** (distance 0), so training accuracy is always 100% — it says nothing about new images.
- Why idea #2 fails: once the test set was used to **choose** K, the test score is **optimistic**; it no longer measures performance on truly **new** data.
- Idea #3: train on **train**, pick hyperparameters on **validation**, and run on the **test set only once, at the very end**.
@diagram cv-data-split
## Splits with numbers (exam style)
= 2 000 images, 80 / 20: 2 000 * 0.8 = 1 600 train, 2 000 * 0.2 = 400 test
= 2 000 images, 70 / 15 / 15: 1 400 train, 300 validation, 300 test
= 4 classes x 500 images, stratified 70 / 15 / 15: per class 350 / 75 / 75
- **Stratified split**: split **each class separately**, so every class keeps the same share in train, validation and test.
- Organize the files **one folder per class**, e.g. data/train/plastic/, data/val/plastic/, data/test/plastic/.
- Test images must never be seen during training or tuning — no duplicates or near-duplicates across the splits.
## Cross-validation
In **5-fold cross-validation** the data (with the test set kept aside) is split into **5 folds**. For each hyperparameter value we train **5 times**: each time 4 folds are used for training and the remaining fold for validation; then the 5 results are **averaged**.
= 1 000 images, 5 folds: each run trains on 800 and validates on 200
= fold accuracies 0.80, 0.84, 0.78, 0.82, 0.86 -> mean = 4.10 / 5 = 0.82
- Useful for **small datasets**, but (unfortunately) **not used too frequently in deep learning**: training a big network 5 times per setting is too expensive.
- The slide's plot is 5-fold cross-validation for the value of **k**: each point is a single outcome, the line goes through the **mean**, the bars show the **standard deviation**; here **k ≈ 7** works best.
| Method | Training runs per setting | Best for |
|---|---|---|
| Train / validation / test | 1 | large datasets, deep learning |
| k-fold cross-validation | k (e.g. 5) | small datasets, cheap models like kNN |
## Universal approximation
As the number of training samples goes to **infinity**, nearest neighbor can represent **any function** — subject to many technical conditions: only **continuous functions on a compact domain**, with assumptions about the spacing of the training points, etc.
- The slides fit a curve with the NN function (a **step function**) using **5, 10, 20 and 100** training points: the more points, the closer the steps follow the true curve.
- So in theory NN can learn anything; in practice it needs **enough points to cover the space** — and that is the problem.
## The curse of dimensionality
**Curse of dimensionality**: for **uniform coverage** of space, the number of training points needed **grows exponentially with the dimension**.
| Dimensions | Points for 4 per axis |
|---|---|
| 1 | 4 |
| 2 | 4² = 16 |
| 3 | 4³ = 64 |
| D | 4 to the power D |
= possible 32x32 binary images: 2^(32*32) = 2^1024 ≈ 10^308
= elementary particles in the visible universe ≈ 10^97
Even tiny black-and-white 32 × 32 images have vastly more possible values than there are particles in the universe, so no dataset can cover image space densely; real images have thousands of dimensions (3 072 for CIFAR-10).
## kNN on raw pixels is seldom used
- **Very slow at test time** (O(N) per prediction).
- **Distance metrics on pixels are not informative**: a **boxed** copy (black rectangles over parts), a **shifted** copy and a **tinted** copy of one photo all have the **same L2 distance** to the original, although a person sees them very differently.
![Four versions of the same photo of a red apple on a plain grey table, side by side: the original; the same photo with three black rectangles covering parts of the apple; the photo shifted a few pixels to the right; the photo with a blue-green colour tint](/events/cv/l2-apple-boxed-shifted-tinted.webp)
- Exam link: photos of the same object taken with **another phone** (other colours, brightness, resolution) can be **far away in pixel space** — raw-pixel distances suffer badly from this **domain shift**.
## Nearest neighbor with ConvNet features works well
Instead of raw pixels, compare **feature vectors computed by a convolutional network (ConvNet)**. Then nearest neighbours are semantically similar: food → food, trains → trains, babies → babies, elephants → elephants.
- Example: **image captioning with nearest neighbor** (Devlin et al., 2015) — find the closest training image in feature space and reuse its caption, e.g. "A cat sitting in a bathroom sink".
| | kNN on raw pixels | kNN on ConvNet features |
|---|---|---|
| What is compared | pixel values 0–255 | learned feature vectors |
| Shift, tint, small occlusion | large change in distance | small change |
| Typical neighbours | similar colours and background | the same kind of object or scene |
| Used in practice | seldom | yes: retrieval, captioning |
## Overfitting and generalization
A K = 1 model with 100% training accuracy is the extreme case of **overfitting**: perfect on what it has seen, worse on new data. The same pattern appears later with any model:
= train accuracy 95%, test accuracy 62% -> gap 33 points -> overfitting (poor generalization)
- Fixes: more data or augmentation, regularization (L2 weight decay, dropout), a simpler model (for kNN: a larger K), early stopping.
- Tune all of this on the **validation** set, never on the test set.
## Summary of the lecture
- In image classification we start with a training set of images and labels and must predict labels on the test set.
- It is challenging because of the **semantic gap**: we need invariance to occlusion, deformation, lighting, intraclass variation, etc.
- Image classification is a **building block** for other vision tasks.
- The **K-nearest neighbors** classifier predicts labels from the nearest training examples.
- **Distance metric and K are hyperparameters**.
- Choose hyperparameters using the **validation set**; only run on the **test set once at the very end**.
> Hyperparameters such as K and the distance metric are chosen on a validation set (or by cross-validation), never on the test set; kNN on raw pixels is slow and its pixel distances are not meaningful, but kNN on ConvNet features works well.
## Check yourself
?? A student tries K = 1, 3, 5, 7, 9, picks the K with the best test accuracy and reports that accuracy as the final result. What is wrong, and what should be done instead?
?= The test set was used to choose a hyperparameter, so the reported score is optimistic and says nothing about truly new data. Split into train / validation / test (or use cross-validation on the training data), choose K on validation, and evaluate on the test set only once at the end.
?? You have 2 000 images of 4 waste classes (500 each). Propose a train / validation / test split, give the counts, and say how you would choose K for kNN.
?= For example 70 / 15 / 15, stratified per class: 1 400 train, 300 validation, 300 test (350 / 75 / 75 per class). Try several K (and L1 vs L2), keep the one with the best validation accuracy (or use 5-fold cross-validation on the training part), then report test accuracy once.`,
        ru: `## Гиперпараметры (hyperparameters)
Какое значение **K** лучше? Какая **метрика расстояния** лучше? Это **гиперпараметры**: решения об алгоритме обучения, которые мы **не выучиваем из обучающих данных**, а **задаём в начале** процесса обучения.
| | Гиперпараметр | Параметр |
|---|---|---|
| Кто задаёт | вы, до обучения | алгоритм обучения, во время обучения |
| Примеры | K, L1 или L2 (позже: learning rate, сила регуляризации λ) | веса W и смещение b линейного классификатора (следующая лекция) |
| Как выбрать | перебрать значения и сравнить на validation | подогнать по обучающим данным |
Гиперпараметры **сильно зависят от задачи**: в общем случае нужно **перепробовать варианты** и посмотреть, что лучше работает на ваших данных.
## Как выбирать гиперпараметры: четыре идеи
| Идея | Что делаем | Вердикт |
|---|---|---|
| #1 | выбираем то, что лучше всего на **всём датасете** (на нём же и учимся) | **ПЛОХО**: K = 1 всегда идеально работает на обучающих данных |
| #2 | делим на **train** и **test**; выбираем лучшее на **test** | **ПЛОХО**: непонятно, как алгоритм поведёт себя на новых данных |
| #3 | делим на **train, validation и test**; выбираем по **validation**, оцениваем на **test** | **Лучше!** |
| #4 | **кросс-валидация (cross-validation)**: делим на фолды, каждый по очереди — validation, усредняем | надёжнее всего; полезно для маленьких датасетов |
- Почему идея #1 не работает: при K = 1 каждое обучающее изображение — **само себе ближайший сосед** (расстояние 0), поэтому точность на обучении всегда 100% — о новых изображениях это ничего не говорит.
- Почему идея #2 не работает: если test использовали, чтобы **выбрать** K, оценка на test становится **оптимистичной** и больше не измеряет качество на действительно **новых** данных.
- Идея #3: учимся на **train**, подбираем гиперпараметры на **validation** и запускаем на **test только один раз, в самом конце**.
@diagram cv-data-split
## Разбиение с числами (как на экзамене)
= 2 000 images, 80 / 20: 2 000 * 0.8 = 1 600 train, 2 000 * 0.2 = 400 test
= 2 000 images, 70 / 15 / 15: 1 400 train, 300 validation, 300 test
= 4 classes x 500 images, stratified 70 / 15 / 15: per class 350 / 75 / 75
- **Стратифицированное разбиение (stratified split)**: делим **каждый класс отдельно**, чтобы у каждого класса была одна и та же доля в train, validation и test.
- Файлы раскладываем **по папке на класс**, например data/train/plastic/, data/val/plastic/, data/test/plastic/.
- Тестовые изображения нельзя видеть ни при обучении, ни при подборе — никаких дублей и почти-дублей между частями.
## Кросс-валидация (cross-validation)
При **5-fold cross-validation** данные (test отложен в сторону) делят на **5 фолдов**. Для каждого значения гиперпараметра учим **5 раз**: каждый раз 4 фолда идут на обучение, а оставшийся — на validation; затем 5 результатов **усредняют**.
= 1 000 images, 5 folds: each run trains on 800 and validates on 200
= fold accuracies 0.80, 0.84, 0.78, 0.82, 0.86 -> mean = 4.10 / 5 = 0.82
- Полезно для **маленьких датасетов**, но (к сожалению) **в deep learning используется нечасто**: учить большую сеть 5 раз на каждую настройку слишком дорого.
- График на слайде — 5-fold cross-validation по значению **k**: каждая точка — отдельный результат, линия проходит через **среднее**, планки показывают **стандартное отклонение**; здесь лучше всего **k ≈ 7**.
| Метод | Запусков обучения на настройку | Лучше всего для |
|---|---|---|
| Train / validation / test | 1 | больших датасетов, deep learning |
| k-fold cross-validation | k (например, 5) | маленьких датасетов, дешёвых моделей вроде kNN |
## Универсальная аппроксимация (universal approximation)
Когда число обучающих примеров стремится к **бесконечности**, nearest neighbor может представить **любую функцию** — при множестве технических условий: только **непрерывные функции на компактной области**, с допущениями о расположении обучающих точек и т. д.
- На слайдах кривую приближают функцией NN (**ступенчатой функцией**) по **5, 10, 20 и 100** обучающим точкам: чем больше точек, тем точнее ступеньки повторяют настоящую кривую.
- То есть в теории NN может выучить что угодно, но на практике ему нужно **достаточно точек, чтобы покрыть пространство**, — и в этом проблема.
## Проклятие размерности (curse of dimensionality)
**Curse of dimensionality**: для **равномерного покрытия** пространства число нужных обучающих точек **растёт экспоненциально с размерностью**.
| Размерность | Точек при 4 на ось |
|---|---|
| 1 | 4 |
| 2 | 4² = 16 |
| 3 | 4³ = 64 |
| D | 4 в степени D |
= possible 32x32 binary images: 2^(32*32) = 2^1024 ≈ 10^308
= elementary particles in the visible universe ≈ 10^97
Даже у крошечных чёрно-белых изображений 32 × 32 возможных вариантов несравнимо больше, чем частиц во Вселенной, поэтому никакой датасет не покроет пространство изображений плотно; у реальных изображений тысячи измерений (3 072 у CIFAR-10).
## kNN на сырых пикселях почти не используют
- **Очень медленно на тесте** (O(N) на предсказание).
- **Метрики расстояния по пикселям неинформативны**: копия с **закрашенными прямоугольниками (boxed)**, **сдвинутая (shifted)** и **тонированная (tinted)** копии одного фото имеют **одинаковое расстояние L2** до оригинала, хотя человек видит их совсем по-разному.
![Четыре версии одного фото красного яблока на однотонном сером столе, рядом: оригинал; то же фото с тремя чёрными прямоугольниками поверх частей яблока; фото, сдвинутое на несколько пикселей вправо; фото с сине-зелёным цветовым оттенком](/events/cv/l2-apple-boxed-shifted-tinted.webp)
- Связь с экзаменом: фото того же объекта, снятые **другим телефоном** (другие цвета, яркость, разрешение), могут оказаться **далеко в пространстве пикселей** — расстояния по сырым пикселям сильно страдают от такого **domain shift**.
## Nearest neighbor на признаках ConvNet работает хорошо
Вместо сырых пикселей сравнивают **векторы признаков, посчитанные свёрточной сетью (ConvNet)**. Тогда ближайшие соседи похожи по смыслу: еда → еда, поезда → поезда, малыши → малыши, слоны → слоны.
- Пример: **подписи к изображениям через nearest neighbor** (Devlin et al., 2015) — находим ближайшее обучающее изображение в пространстве признаков и берём его подпись, например «A cat sitting in a bathroom sink».
| | kNN на сырых пикселях | kNN на признаках ConvNet |
|---|---|---|
| Что сравнивается | значения пикселей 0–255 | выученные векторы признаков |
| Сдвиг, оттенок, небольшое перекрытие | сильно меняют расстояние | меняют мало |
| Типичные соседи | похожие цвета и фон | тот же вид объекта или сцены |
| Применяется на практике | редко | да: поиск похожих, подписи |
## Переобучение и обобщение
Модель с K = 1 и 100% точностью на обучении — крайний случай **переобучения (overfitting)**: идеально на увиденном, хуже на новом. Та же картина потом встречается у любой модели:
= train accuracy 95%, test accuracy 62% -> gap 33 points -> overfitting (poor generalization)
- Что помогает: больше данных или аугментация, регуляризация (L2 weight decay, dropout), более простая модель (для kNN — большее K), early stopping.
- Всё это подбирают на **validation**, а не на test.
## Итоги лекции
- В классификации изображений мы начинаем с обучающего набора изображений с метками и должны предсказать метки на тестовом наборе.
- Задача трудна из-за **семантического разрыва**: нужна устойчивость к перекрытию, деформации, освещению, разнообразию внутри класса и т. д.
- Классификация изображений — **кирпичик** для других задач зрения.
- Классификатор **K-nearest neighbors** предсказывает метки по ближайшим обучающим примерам.
- **Метрика расстояния и K — гиперпараметры**.
- Гиперпараметры выбирают по **validation**; на **test запускают один раз, в самом конце**.
> Гиперпараметры вроде K и метрики расстояния выбирают по validation (или кросс-валидацией), но никогда по test; kNN на сырых пикселях медленный, и его пиксельные расстояния не отражают смысла, а kNN на признаках ConvNet работает хорошо.
## Проверь себя
?? Студент пробует K = 1, 3, 5, 7, 9, выбирает K с лучшей точностью на test и сообщает эту точность как итоговую. Что не так и как нужно было сделать?
?= Test использован для выбора гиперпараметра, поэтому итоговая оценка оптимистична и ничего не говорит о действительно новых данных. Нужно разбить данные на train / validation / test (или делать кросс-валидацию на обучающей части), выбрать K по validation и оценить на test только один раз в конце.
?? У вас 2 000 изображений 4 классов мусора (по 500). Предложите разбиение на train / validation / test, посчитайте количества и объясните, как выбрать K для kNN.
?= Например, 70 / 15 / 15 со стратификацией по классам: 1 400 train, 300 validation, 300 test (по 350 / 75 / 75 на класс). Перебрать несколько K (и L1 или L2), оставить вариант с лучшей точностью на validation (или 5-fold cross-validation на обучающей части), затем один раз сообщить точность на test.`,
      },
      [
        qx("What makes K in kNN a hyperparameter?", "It is set before learning, not learned from data", [
          ["It is computed from the training labels", "Nothing computes K from the data; we choose it and compare choices on validation.", "K ничем не вычисляется из данных; его выбирают и сравнивают варианты на validation."],
          ["It is the label predicted for the test image", "K is the number of voting neighbours, not a predicted label.", "K — число голосующих соседей, а не предсказанная метка."],
          ["It changes after every training example", "K stays fixed during learning; parameters are what training would update.", "K не меняется во время обучения; обновляются при обучении параметры."],
        ], "Hyperparameters are choices about the learning algorithm that we don't learn from the training data but set at the start, like K and the distance metric.", "Гиперпараметры — решения об алгоритме обучения, которые не выучиваются из данных, а задаются в начале, как K и метрика расстояния."),
        qx("A student picks K by the highest accuracy on the training data. Which K wins, and why is this bad?", "K = 1: each point is its own nearest neighbour", [
          ["K = N: the vote then uses every training point", "With K = N every point gets the majority class, so training accuracy is low, not best.", "При K = N каждая точка получает класс большинства, так что точность на обучении низкая, а не лучшая."],
          ["K = 7: it was best on the slide's plot", "k ≈ 7 was best in cross-validation, not on training data, where K = 1 is always perfect.", "k ≈ 7 оказался лучшим на кросс-валидации, а не на обучающих данных, где K = 1 всегда идеален."],
          ["K = 3: it breaks ties between classes", "K = 3 does not reach 100% on training data; K = 1 does, which makes this method useless.", "K = 3 не даёт 100% на обучающих данных; это делает K = 1, и поэтому способ бесполезен."],
        ], "Idea #1 is bad: K = 1 always works perfectly on training data (distance 0 to itself), but that tells nothing about new images.", "Идея #1 плохая: K = 1 всегда идеален на обучающих данных (расстояние 0 до самого себя), но о новых изображениях это ничего не говорит."),
        qx("Why is choosing K by the best accuracy on the test set a mistake?", "The test score no longer reflects truly new data", [
          ["Test sets are only for deep networks, not for kNN", "Every classifier, kNN included, is evaluated on a held-out test set.", "Любой классификатор, включая kNN, оценивают на отложенном test."],
          ["The test set is always too small to give an accuracy", "Accuracy can be computed on any labelled set; the problem is using it for choices.", "Точность можно посчитать на любом размеченном наборе; беда в том, что по нему делают выбор."],
          ["Test accuracy is always lower than training accuracy", "That is often true but is not the reason; tuning on test makes it optimistic.", "Часто так и есть, но причина не в этом: подбор по test делает оценку оптимистичной."],
        ], "Idea #2 is bad: after tuning on test we have no idea how the algorithm will perform on new data.", "Идея #2 плохая: после подбора по test мы не знаем, как алгоритм поведёт себя на новых данных."),
        qx("Which protocol does the lecture recommend for setting hyperparameters?", "Choose on validation, run on test once at the end", [
          ["Choose on test, then confirm on validation", "Using test for the choice spoils it, whatever is done afterwards.", "Выбор по test портит его, что бы ни делали потом."],
          ["Choose on training data, then retest on it", "Training data favours K = 1 and says nothing about generalization.", "Обучающие данные выбирают K = 1 и ничего не говорят об обобщении."],
          ["Choose on test and report that same score", "That reports an optimistic number; the test set must be used only once, for the final check.", "Так сообщают завышенное число; test используется один раз — для финальной проверки."],
        ], "Idea #3: split into train, validation and test; choose hyperparameters on validation and evaluate on test only once at the very end.", "Идея #3: разбить на train, validation и test; выбрать гиперпараметры по validation и оценить на test один раз в самом конце."),
        qx("2 000 images are split 70 / 15 / 15 into train / validation / test. How many images are in each part?", "1 400 / 300 / 300", [
          ["1 600 / 200 / 200", "That is an 80 / 10 / 10 split.", "Это разбиение 80 / 10 / 10."],
          ["1 400 / 150 / 150", "15% of 2 000 is 300, not 150.", "15% от 2 000 — это 300, а не 150."],
          ["700 / 150 / 150", "The percentages were used as counts; they must be applied to 2 000.", "Проценты взяты как количества; их нужно применить к 2 000."],
        ], "2 000 × 0.70 = 1 400, 2 000 × 0.15 = 300, 2 000 × 0.15 = 300; total 2 000.", "2 000 × 0.70 = 1 400, 2 000 × 0.15 = 300, 2 000 × 0.15 = 300; всего 2 000."),
        qx("4 classes have 500 images each. With a stratified 80 / 20 split, how many test images does each class get?", "100", [
          ["400", "400 is the total test size (2 000 × 0.2), not the count per class.", "400 — это весь test (2 000 × 0.2), а не количество на класс."],
          ["125", "125 = 500 / 4 splits one class into 4 parts; stratified means 20% of each class.", "125 = 500 / 4 делит класс на 4 части; стратификация — это 20% от каждого класса."],
          ["80", "80 is the training percentage, not a count.", "80 — процент обучающей части, а не количество."],
        ], "Stratified: 20% of each class goes to test, 500 × 0.2 = 100 per class; 4 × 100 = 400 test images in total.", "Стратификация: 20% каждого класса идут в test, 500 × 0.2 = 100 на класс; всего 4 × 100 = 400 тестовых."),
        qx("In 5-fold cross-validation on 1 000 training images, what does each of the 5 runs use?", "800 for training, 200 for validation", [
          ["200 for training, 800 for validation", "Swapped: one fold (1/5) validates, the other four train.", "Перепутано: один фолд (1/5) — validation, четыре — обучение."],
          ["500 for training, 500 for validation", "That would be 2 folds, not 5.", "Это было бы 2 фолда, а не 5."],
          ["1 000 for training, 200 for validation", "The validation fold must not also be used for training.", "Фолд validation нельзя одновременно использовать для обучения."],
        ], "5 folds of 200 images: each run trains on 4 folds (800) and validates on the remaining one (200).", "5 фолдов по 200 изображений: каждый запуск учится на 4 фолдах (800) и проверяется на оставшемся (200)."),
        qx("Five folds give validation accuracies 0.70, 0.74, 0.72, 0.76, 0.78. What is the cross-validation estimate?", "0.74", [
          ["0.78", "0.78 is only the best fold; cross-validation averages all folds.", "0.78 — лишь лучший фолд; кросс-валидация усредняет все фолды."],
          ["0.70", "0.70 is only the worst fold.", "0.70 — лишь худший фолд."],
          ["3.70", "3.70 is the sum; it must be divided by 5.", "3.70 — сумма; её нужно разделить на 5."],
        ], "Mean = (0.70 + 0.74 + 0.72 + 0.76 + 0.78) / 5 = 3.70 / 5 = 0.74.", "Среднее = (0.70 + 0.74 + 0.72 + 0.76 + 0.78) / 5 = 3.70 / 5 = 0.74."),
        qx("Why is cross-validation not used too frequently in deep learning?", "Training k times costs too much compute", [
          ["It only works with the L1 distance", "Cross-validation works with any model and metric.", "Кросс-валидация работает с любой моделью и метрикой."],
          ["It needs the test labels during training", "Cross-validation splits the training data; the test set stays aside.", "Кросс-валидация делит обучающие данные; test остаётся в стороне."],
          ["Deep networks have no hyperparameters", "Deep networks have many: learning rate, layers, regularization strength.", "У глубоких сетей их много: learning rate, число слоёв, сила регуляризации."],
        ], "Cross-validation is useful for small datasets, but training a big network once per fold is usually too expensive.", "Кросс-валидация полезна для маленьких датасетов, но учить большую сеть на каждом фолде обычно слишком дорого."),
        qx("On the slide's 5-fold plot for k, what do the vertical bars at each k show?", "The standard deviation of the 5 results", [
          ["The training accuracy for that k", "The plot shows cross-validation accuracy; training accuracy is not drawn.", "На графике точность кросс-валидации; точность на обучении не нарисована."],
          ["The test accuracy measured once", "The test set is not used here; the points are validation folds.", "Test здесь не используется; точки — фолды validation."],
          ["The time each run took to finish, in seconds", "The y-axis is accuracy, not time.", "По оси y — точность, а не время."],
        ], "Each point is one fold's outcome, the line goes through the mean, and the bars show the standard deviation; k ≈ 7 looks best.", "Каждая точка — результат одного фолда, линия идёт через среднее, планки показывают стандартное отклонение; лучше всего выглядит k ≈ 7."),
        tfx("As training samples go to infinity, nearest neighbor can represent any continuous function on a compact domain.", true, "This is the universal approximation property of NN, under technical conditions (continuous function, compact domain, assumptions on the spacing of points).", "Это свойство универсальной аппроксимации NN при технических условиях (непрерывная функция, компактная область, допущения о расположении точек).", "Choosing False misses the slides with 5, 10, 20 and 100 points; the catch is practical — far too many points are needed in high dimensions.", "Ответ False упускает слайды с 5, 10, 20 и 100 точками; подвох практический — в больших размерностях точек нужно слишком много."),
        qx("Covering space with 4 points per axis needs 4 points in 1-D and 16 in 2-D. How many in 5-D?", "1 024", [
          ["20", "4 × 5 = 20 grows linearly; coverage grows exponentially: 4⁵.", "4 × 5 = 20 — линейный рост, а покрытие растёт экспоненциально: 4⁵."],
          ["625", "5⁴ = 625 swaps base and exponent; it is 4 to the power 5.", "5⁴ = 625 — перепутаны основание и степень; нужно 4 в степени 5."],
          ["256", "4⁴ = 256 is the count for 4 dimensions.", "4⁴ = 256 — это для 4 измерений."],
        ], "The number of points is 4 to the power D: 4⁵ = 1 024 — the curse of dimensionality.", "Число точек — 4 в степени D: 4⁵ = 1 024 — проклятие размерности."),
        qx("Why does the lecture compare 2^(32×32) ≈ 10^308 with the ≈ 10^97 particles in the universe?", "No dataset can densely cover image space", [
          ["Binary images need 308 bits to be stored", "A 32 × 32 binary image needs 1 024 bits; 308 is the decimal exponent.", "Двоичному изображению 32 × 32 нужно 1 024 бита; 308 — десятичная степень."],
          ["32 × 32 images are too small to classify", "CIFAR-10 classifies 32 × 32 images; the point is the size of the space.", "CIFAR-10 как раз классифицирует изображения 32 × 32; суть — в размере пространства."],
          ["The universe limits how many classes can exist", "The comparison is about the number of possible images, not of classes.", "Сравнение — про число возможных изображений, а не классов."],
        ], "Even tiny binary images have about 10^308 possible values — far more than particles in the universe — so kNN can never cover the space uniformly.", "Даже крошечные двоичные изображения имеют около 10^308 вариантов — гораздо больше, чем частиц во Вселенной, — поэтому kNN никогда не покроет пространство равномерно."),
        qx("Boxed, shifted and tinted copies of a photo have the same L2 distance to it. What does this show?", "Pixel distance misses what the image shows", [
          ["L2 distance only works on grayscale images, not colour", "L2 works on any array; the problem is what pixel differences mean.", "L2 работает с любым массивом; проблема в смысле пиксельных разностей."],
          ["The three edits leave every pixel value unchanged", "Each edit changes many pixels; they just change them by the same total amount.", "Каждая правка меняет много пикселей; просто суммарное изменение одинаковое."],
          ["L1 would always rank them correctly", "L1 is also a pixel distance and has the same weakness.", "L1 — тоже пиксельное расстояние с той же слабостью."],
        ], "Distance metrics on pixels are not informative: very different changes, including a harmless shift, give the same L2 distance.", "Метрики по пикселям неинформативны: совсем разные изменения, включая безобидный сдвиг, дают одно и то же расстояние L2."),
        qx("Which pair gives the lecture's two reasons why kNN on raw pixels is seldom used?", "Slow at test time; pixel distances not informative", [
          ["Training takes O(N²); labels are needed for test images", "Training is O(1), and test labels are never needed to predict.", "Обучение — O(1), а метки теста для предсказания не нужны."],
          ["Too few hyperparameters; only works on MNIST", "kNN has K and the metric, and it runs on any dataset.", "У kNN есть K и метрика, и он работает на любом датасете."],
          ["Cannot handle colour; needs a GPU to run", "kNN handles colour vectors and runs on a CPU.", "kNN работает с цветными векторами и запускается на CPU."],
        ], "kNN on raw pixels: very slow at test time (O(N)), and distance metrics on pixels are not informative.", "kNN на сырых пикселях: очень медленный на тесте (O(N)), и метрики по пикселям неинформативны."),
        qx("Nearest neighbor works well when distances are computed on what?", "Features from a convolutional network", [
          ["Raw pixel values of larger images", "Bigger raw images keep the same problem: pixel distances are not informative.", "Большие сырые изображения сохраняют ту же проблему: пиксельные расстояния неинформативны."],
          ["Pixels after converting both images from BGR to RGB", "Reordering channels does not change what pixel distances measure.", "Перестановка каналов не меняет того, что измеряют пиксельные расстояния."],
          ["Canny edge maps of both images", "Edge maps are still pixel arrays and lose colour; the slides use ConvNet features.", "Карты краёв — всё ещё массивы пикселей без цвета; на слайдах — признаки ConvNet."],
        ], "Nearest neighbor with ConvNet features works well: neighbours become semantically similar, as in captioning by nearest neighbor (Devlin et al., 2015).", "Nearest neighbor на признаках ConvNet работает хорошо: соседи похожи по смыслу, как в подписях через nearest neighbor (Devlin et al., 2015)."),
        qx("A model gets 95% training accuracy but 62% test accuracy. What is the most likely problem?", "Overfitting — poor generalization to new data", [
          ["Underfitting — the model is too simple for the data", "An underfitting model would also score low on training data, not 95%.", "Недообученная модель показала бы низкую точность и на обучении, а не 95%."],
          ["The test set is larger than the training set", "Set sizes do not explain a 33-point gap.", "Размеры наборов не объясняют разрыв в 33 пункта."],
          ["Data leakage from the test set into training", "Leakage would make test accuracy too high, not too low.", "Утечка сделала бы точность на test завышенной, а не заниженной."],
        ], "A large train–test gap means overfitting: the model memorized the training data. Fixes: more data or augmentation, regularization, a simpler model, early stopping, tuned on validation.", "Большой разрыв между train и test означает переобучение: модель запомнила обучающие данные. Помогают: больше данных или аугментация, регуляризация, более простая модель, early stopping, подобранные по validation."),
        qx("A kNN model with K = 1 overfits noisy labels. Which change is most likely to help?", "Choose a larger K using the validation set", [
          ["Tune K on the test set until it is the best", "Tuning on test gives an optimistic score and leaks test data into the choice.", "Подбор по test даёт завышенную оценку и протаскивает test в выбор."],
          ["Evaluate on the training set instead", "On the training set K = 1 always looks perfect, hiding the problem.", "На обучающих данных K = 1 всегда выглядит идеально и скрывает проблему."],
          ["Remove the validation set to train on more data", "Without validation there is no fair way to pick K.", "Без validation нет честного способа выбрать K."],
        ], "A larger K outvotes mislabelled points and smooths boundaries (a simpler model); the value is picked on validation data.", "Большее K перевешивает неверно размеченные точки и сглаживает границы (модель проще); значение подбирают по validation."),
        qx("kNN on raw pixels works on lab photos but fails on photos from another phone with warmer colours. Why?", "Colour shifts move images far apart in pixel space", [
          ["kNN forgets its training data after deployment", "kNN keeps all training data; that is how it predicts.", "kNN хранит все обучающие данные — именно так он и предсказывает."],
          ["Warm colours break the L1 distance formula", "The formula still works; it just measures a large, meaningless difference.", "Формула работает, просто измеряет большую и бессмысленную разницу."],
          ["The phone's photos contain more classes than training", "Nothing says new classes appeared; the same objects look different in pixels.", "Ничто не говорит о новых классах; те же объекты просто выглядят иначе в пикселях."],
        ], "This is domain shift: a colour cast changes every pixel, so pixel distances to the right class become large. Collect diverse data, augment colour and normalize.", "Это domain shift: цветовой оттенок меняет каждый пиксель, и пиксельные расстояния до нужного класса становятся большими. Нужно собрать разнообразные данные, аугментировать цвет и нормализовать."),
        qx("Which of these is learned from the training data rather than chosen as a hyperparameter?", "The weights W of a linear classifier", [
          ["The value of K in kNN", "K is set before learning, so it is a hyperparameter.", "K задают до обучения, значит это гиперпараметр."],
          ["L1 or L2 as the distance metric", "The metric is a choice about the algorithm — a hyperparameter.", "Метрика — решение об алгоритме, то есть гиперпараметр."],
          ["The number of folds in cross-validation", "The number of folds is a choice about the evaluation procedure, not something learned.", "Число фолдов — выбор процедуры оценки, а не то, что выучивается."],
        ], "Parameters such as W and b are fitted to the training data; hyperparameters such as K and the metric are chosen by us and compared on validation.", "Параметры вроде W и b подгоняются по обучающим данным; гиперпараметры вроде K и метрики выбираем мы и сравниваем на validation."),
      ],
    ),
  ],
};
