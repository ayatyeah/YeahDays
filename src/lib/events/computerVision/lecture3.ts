import { part, qx, tfx, type Lecture } from "../types";

export const lecture3: Lecture = {
  id: "cv-l3",
  title: { en: "Lecture 3 — Linear classifiers", ru: "Лекция 3 — Линейные классификаторы" },
  parts: [
    part(
      "cv-l3-p1",
      { en: "The linear classifier: f(x, W) = Wx + b and three viewpoints", ru: "Линейный классификатор: f(x, W) = Wx + b и три взгляда на него" },
      {
        en: `## From kNN to a parametric model
**kNN** keeps every training image and compares a test image with all of them, so prediction is slow — O(N) for N training images.
The **parametric approach** squeezes what was learned from the training data into **parameters W** (weights). After training the images can be thrown away, and a prediction is one fast formula.
The simplest such formula is the **linear classifier** — the basic building block that neural networks stack many times.
## The score function f(x, W) = Wx + b
= f(x, W) = Wx + b
- **x** — the image stretched into one long column of pixel values;
- **W** — the weight matrix, **one row per class**;
- **b** — the **bias** vector, one number per class;
- **f(x, W)** — the vector of **class scores**; the predicted class is the **argmax**, the class with the largest score.
For **CIFAR-10** (50 000 training and 10 000 test images, each 32×32×3, 10 classes) the shapes are:
| Symbol | Meaning | Shape |
|---|---|---|
| x | image stretched into a column | (3072,) |
| W | weights, one row per class | (10, 3072) |
| b | bias, one number per class | (10,) |
| f(x, W) | class scores | (10,) |
= 32 × 32 × 3 = 3072
= params = 10 · 3072 + 10 = 30720 + 10 = 30730
## Worked example: a 2×2 image, 3 classes
The slide's image has four pixels 56, 231, 24, 2 and three classes: cat, dog, ship. Stretch the pixels into a column, multiply each row of W by it and add the bias:
= x = [56, 231, 24, 2]
= W = [[0.2, −0.5, 0.1, 2.0], [1.5, 1.3, 2.1, 0.0], [0, 0.25, 0.2, −0.3]]
= b = [1.1, 3.2, −1.2]
= cat:  0.2·56 + (−0.5)·231 + 0.1·24 + 2.0·2 + 1.1 = 11.2 − 115.5 + 2.4 + 4.0 + 1.1 = −96.8
= dog:  1.5·56 + 1.3·231 + 2.1·24 + 0.0·2 + 3.2 = 84.0 + 300.3 + 50.4 + 0 + 3.2 = 437.9
= ship: 0·56 + 0.25·231 + 0.2·24 + (−0.3)·2 − 1.2 = 0 + 57.75 + 4.8 − 0.6 − 1.2 = 60.75
- The slide prints **61.95** for ship: that is Wx **before** the bias −1.2 is added; the full score is 60.75.
- The picture is a cat, but **dog** wins with 437.9. This W is bad — we need a way to measure how bad (a **loss**) and to improve it.
## Exam format: s = Wx + b by hand
@diagram cv-linear
The midterm asks for every step. Multiply each row of W by x, then add that row's bias:
= W = [[1, 2], [−1, 1], [2, −1]],   x = [2, −1],   b = [0, 1, −1]
= s0 = 1·2 + 2·(−1) + 0 = 2 − 2 + 0 = 0
= s1 = (−1)·2 + 1·(−1) + 1 = −2 − 1 + 1 = −2
= s2 = 2·2 + (−1)·(−1) − 1 = 4 + 1 − 1 = 4
= s = [0, −2, 4]   →   argmax = 2   →   Bird
- Check the shapes first: W (3, 2) times x (2,) gives (3,); adding b (3,) gives one score per class.
- **W** holds the learned weights: row k says how strongly each input value pushes the score of class k up (positive weight) or down (negative weight). Each row works as a **template** for its class.
- **b** is a per-class offset that does not depend on the image: it raises or lowers a class score for every input, for example toward classes that are frequent in the data.
## The bias trick
Add an extra **1** at the end of x and put b in as the **last column** of W — then one matrix product does everything:
= [W | b] · [x; 1] = Wx + b
= W (3, 4), b (3,)  →  W' (3, 5);   x (4,)  →  x' = [56, 231, 24, 2, 1] (5,)
## Predictions are linear
Ignoring the bias, scaling the image scales every score by the same factor:
= f(cx, W) = W(cx) = c · f(x, W)
= f(x, W) = [−96.8, 437.8, 62.0]   →   f(0.5x, W) = [−48.4, 218.9, 31.0]
- A darker copy of the photo gets proportionally smaller scores, but for c > 0 the **order of the scores stays the same**, so the predicted class does not change.
## Three ways to look at a linear classifier
| Viewpoint | What you look at | Key idea |
|---|---|---|
| Algebraic | f(x, W) = Wx + b | matrix times vector plus bias |
| Visual | each row of W reshaped into an image | one **template** per class; the score is how well the image matches it |
| Geometric | each row of W as a direction in pixel space | **hyperplanes** cutting up a 3072-dimensional space |
- **Visual**: the score is a dot product of a template and the image, so the classifier does **template matching**. Learned CIFAR-10 templates look like blurry average pictures: a blue background for planes and ships, a reddish blob for cars.
- One template cannot capture **multiple modes** of a class: the **horse template has two heads**, because horses in the data face both left and right.
- **Geometric**: vary one pixel, e.g. (15, 8, 0), keep the rest fixed, and each class score moves along a **straight line**. In the full space the images where the car score equals 0 form a **hyperplane**; the car score grows in the direction of the car row of W.
![A row of ten small, square, blurry colour patches like the class templates a linear classifier learns from tiny 32×32 photos: a bluish patch with a pale sky border, a reddish car-shaped blob on grey, a greenish-brown blob, a brown horse-like blob with a head on both the left and the right side, a blue patch with a darker sea-blue bottom and five more muted patches](/events/cv/l3-linear-templates.webp)
## Hard cases for a linear classifier
Every boundary of a linear classifier is a straight cut (a hyperplane), so it fails on 2-D datasets like these:
| Dataset | Why a straight cut fails |
|---|---|
| class 1 in quadrants 1 and 3, class 2 in quadrants 2 and 4 | you would need two crossing lines |
| class 1 is a ring: 1 ≤ L2 norm ≤ 2, class 2 is everything else | the boundary is two circles, not a line |
| class 1 is three separate blobs (three modes) | one half-plane cannot cover three islands |
- The first case is **XOR**: (0, 0) → 0, (0, 1) → 1, (1, 0) → 1, (1, 1) → 0. No single line puts both 1s on one side and both 0s on the other — this is why the **Perceptron could not learn XOR**.
- The fix is a **non-linear** model: hand-made features, or a neural network that stacks layers with non-linear activations.
> f(x, W) = Wx + b gives one score per class (one row of W and one b each) and the largest score wins — but straight hyperplanes cannot separate XOR, rings or multi-modal classes.
## Check yourself
?? Compute s = Wx + b for W = [[2, 0], [1, −1], [0, 3]], x = [1, 2], b = [1, 0, −2] and give the predicted class (0, 1 or 2).
?= s0 = 2·1 + 0·2 + 1 = 3, s1 = 1·1 + (−1)·2 + 0 = −1, s2 = 0·1 + 3·2 − 2 = 4, so s = [3, −1, 4] and the classifier predicts class 2, the one with the largest score.
?? Why can't a single linear classifier correctly separate every possible dataset?
?= Its decision boundaries are straight hyperplanes, so each class gets one convex region; data like XOR, a ring around the origin or a class split into several blobs needs a curved or multi-piece boundary that one Wx + b cannot draw.`,
        ru: `## От kNN к параметрической модели
**kNN** хранит все обучающие изображения и сравнивает тестовое изображение с каждым из них, поэтому предсказание медленное — O(N) для N обучающих изображений.
**Параметрический подход (parametric approach)** сжимает всё, что выучено на обучающих данных, в **параметры W (weights, веса)**. После обучения изображения можно выбросить, а предсказание — одна быстрая формула.
Простейшая такая формула — **линейный классификатор (linear classifier)**, базовый «кирпичик», который нейросети повторяют много раз.
## Функция оценок f(x, W) = Wx + b
= f(x, W) = Wx + b
- **x** — изображение, вытянутое в один длинный столбец значений пикселей;
- **W** — матрица весов, **по строке на каждый класс**;
- **b** — вектор **bias (смещение)**, по числу на класс;
- **f(x, W)** — вектор **оценок классов (class scores)**; предсказанный класс — **argmax**, то есть класс с наибольшей оценкой.
Для **CIFAR-10** (50 000 обучающих и 10 000 тестовых изображений 32×32×3, 10 классов) формы такие:
| Обозначение | Смысл | Форма |
|---|---|---|
| x | изображение, вытянутое в столбец | (3072,) |
| W | веса, по строке на класс | (10, 3072) |
| b | bias, по числу на класс | (10,) |
| f(x, W) | оценки классов | (10,) |
= 32 × 32 × 3 = 3072
= params = 10 · 3072 + 10 = 30720 + 10 = 30730
## Разбор примера: изображение 2×2, 3 класса
У изображения на слайде четыре пикселя 56, 231, 24, 2 и три класса: cat, dog, ship. Вытягиваем пиксели в столбец, умножаем на него каждую строку W и прибавляем bias:
= x = [56, 231, 24, 2]
= W = [[0.2, −0.5, 0.1, 2.0], [1.5, 1.3, 2.1, 0.0], [0, 0.25, 0.2, −0.3]]
= b = [1.1, 3.2, −1.2]
= cat:  0.2·56 + (−0.5)·231 + 0.1·24 + 2.0·2 + 1.1 = 11.2 − 115.5 + 2.4 + 4.0 + 1.1 = −96.8
= dog:  1.5·56 + 1.3·231 + 2.1·24 + 0.0·2 + 3.2 = 84.0 + 300.3 + 50.4 + 0 + 3.2 = 437.9
= ship: 0·56 + 0.25·231 + 0.2·24 + (−0.3)·2 − 1.2 = 0 + 57.75 + 4.8 − 0.6 − 1.2 = 60.75
- На слайде для ship напечатано **61.95** — это Wx **до** прибавления bias −1.2; полная оценка — 60.75.
- На картинке кошка, но побеждает **dog** с 437.9. Эта W плохая — нужен способ измерить, насколько (функция **потерь, loss**), и улучшить её.
## Формат экзамена: s = Wx + b вручную
@diagram cv-linear
На мидтерме требуют каждый шаг. Умножаем каждую строку W на x и прибавляем bias этой строки:
= W = [[1, 2], [−1, 1], [2, −1]],   x = [2, −1],   b = [0, 1, −1]
= s0 = 1·2 + 2·(−1) + 0 = 2 − 2 + 0 = 0
= s1 = (−1)·2 + 1·(−1) + 1 = −2 − 1 + 1 = −2
= s2 = 2·2 + (−1)·(−1) − 1 = 4 + 1 − 1 = 4
= s = [0, −2, 4]   →   argmax = 2   →   Bird
- Сначала проверьте формы: W (3, 2) на x (2,) даёт (3,); после прибавления b (3,) получается по одной оценке на класс.
- **W** хранит выученные веса: строка k показывает, насколько сильно каждое входное значение поднимает оценку класса k (положительный вес) или опускает её (отрицательный вес). Каждая строка работает как **шаблон (template)** своего класса.
- **b** — сдвиг для каждого класса, не зависящий от изображения: он поднимает или опускает оценку класса для любого входа, например в пользу классов, которые часто встречаются в данных.
## Bias trick (приём со смещением)
Допишите в конец x лишнюю **1** и поставьте b **последним столбцом** W — тогда всё делает одно умножение матрицы на вектор:
= [W | b] · [x; 1] = Wx + b
= W (3, 4), b (3,)  →  W' (3, 5);   x (4,)  →  x' = [56, 231, 24, 2, 1] (5,)
## Предсказания линейны
Если не учитывать bias, масштабирование изображения умножает все оценки на одно и то же число:
= f(cx, W) = W(cx) = c · f(x, W)
= f(x, W) = [−96.8, 437.8, 62.0]   →   f(0.5x, W) = [−48.4, 218.9, 31.0]
- Более тёмная копия фото получает пропорционально меньшие оценки, но при c > 0 **порядок оценок не меняется**, поэтому предсказанный класс остаётся тем же.
## Три взгляда на линейный классификатор
| Взгляд | На что смотрим | Главная идея |
|---|---|---|
| Алгебраический (algebraic) | f(x, W) = Wx + b | матрица на вектор плюс bias |
| Визуальный (visual) | каждая строка W, развёрнутая в изображение | один **шаблон** на класс; оценка — насколько изображение на него похоже |
| Геометрический (geometric) | каждая строка W как направление в пространстве пикселей | **гиперплоскости (hyperplanes)**, разрезающие 3072-мерное пространство |
- **Визуальный**: оценка — скалярное произведение шаблона и изображения, то есть классификатор делает **сопоставление с шаблоном (template matching)**. Выученные шаблоны CIFAR-10 похожи на размытые усреднённые картинки: синий фон у самолётов и кораблей, красноватое пятно у машин.
- Один шаблон не может охватить **несколько мод (multiple modes)** класса: у **шаблона лошади две головы**, потому что лошади в данных смотрят и влево, и вправо.
- **Геометрический**: меняем один пиксель, например (15, 8, 0), остальные фиксируем — и оценка каждого класса движется по **прямой**. Во всём пространстве изображения, где оценка car равна 0, образуют **гиперплоскость**; оценка car растёт в направлении строки car в W.
![Ряд из десяти маленьких квадратных размытых цветных пятен, похожих на шаблоны классов, которые линейный классификатор выучивает на крошечных фото 32×32: голубоватое пятно с бледным небесным краем, красноватое пятно в форме машины на сером, зеленовато-коричневое пятно, коричневое пятно, похожее на лошадь с головой и слева, и справа, синее пятно с тёмно-синим низом и ещё пять приглушённых пятен](/events/cv/l3-linear-templates.webp)
## Трудные случаи для линейного классификатора
Каждая граница линейного классификатора — прямой разрез (гиперплоскость), поэтому он не справляется с такими двумерными данными:
| Данные | Почему прямой разрез не подходит |
|---|---|
| класс 1 в четвертях 1 и 3, класс 2 в четвертях 2 и 4 | нужны две пересекающиеся прямые |
| класс 1 — кольцо: 1 ≤ L2-норма ≤ 2, класс 2 — всё остальное | граница — две окружности, а не прямая |
| класс 1 — три отдельных пятна (три моды) | одна полуплоскость не покроет три островка |
- Первый случай — это **XOR**: (0, 0) → 0, (0, 1) → 1, (1, 0) → 1, (1, 1) → 0. Ни одна прямая не отделит обе единицы от обоих нулей — поэтому **Perceptron не смог выучить XOR**.
- Решение — **нелинейная** модель: признаки, придуманные вручную, или нейросеть, которая складывает слои с нелинейными активациями.
> f(x, W) = Wx + b даёт по оценке на класс (по строке W и по одному b на каждый), побеждает наибольшая — но прямые гиперплоскости не разделят XOR, кольцо или класс из нескольких мод.
## Проверь себя
?? Вычислите s = Wx + b для W = [[2, 0], [1, −1], [0, 3]], x = [1, 2], b = [1, 0, −2] и назовите предсказанный класс (0, 1 или 2).
?= s0 = 2·1 + 0·2 + 1 = 3, s1 = 1·1 + (−1)·2 + 0 = −1, s2 = 0·1 + 3·2 − 2 = 4, значит s = [3, −1, 4], и классификатор предсказывает класс 2 — с наибольшей оценкой.
?? Почему один линейный классификатор не может правильно разделить любой набор данных?
?= Его границы решений — прямые гиперплоскости, поэтому каждому классу достаётся одна выпуклая область; данным вроде XOR, кольца вокруг начала координат или класса из нескольких отдельных пятен нужна кривая или составная граница, которую один Wx + b не нарисует.`,
      },
      [
        qx("For CIFAR-10 (32×32×3 images, 10 classes), what is the shape of W in f(x, W) = Wx + b?", "(10, 3072)", [
          ["(3072, 10)", "That is the transpose: Wx needs one row per class and one column per pixel value, so W is (10, 3072).", "Это транспонированная матрица: для Wx нужна одна строка на класс и один столбец на значение пикселя, то есть (10, 3072)."],
          ["(10, 1024)", "1024 = 32 × 32 ignores the three colour channels; x has 32 × 32 × 3 = 3072 numbers.", "1024 = 32 × 32 — здесь забыты три цветовых канала; в x 32 × 32 × 3 = 3072 числа."],
          ["(32, 32, 3)", "That is the shape of the image itself, not of the weight matrix that multiplies the stretched image.", "Это форма самого изображения, а не матрицы весов, которая умножается на вытянутое изображение."],
        ], "x is (3072,) and the output is 10 scores, so W must be (10, 3072): one row of 3072 weights per class.", "x имеет форму (3072,), на выходе 10 оценок, значит W — (10, 3072): по строке из 3072 весов на каждый класс."),
        qx("How many learnable parameters does f(x, W) = Wx + b have for CIFAR-10 (3072 inputs, 10 classes)?", "30 730", [
          ["30 720", "This counts only W (10 × 3072); the 10 bias values must be added.", "Здесь посчитана только W (10 × 3072); нужно добавить ещё 10 значений bias."],
          ["3 082", "3072 + 10 adds the sizes instead of multiplying them: every class has its own 3072 weights.", "3072 + 10 — размеры сложены, а не перемножены: у каждого класса свои 3072 веса."],
          ["10 250", "This uses 1024 inputs (32 × 32) and forgets the three colour channels.", "Здесь взято 1024 входа (32 × 32) и забыты три цветовых канала."],
        ], "10 × 3072 weights + 10 biases = 30 720 + 10 = 30 730 parameters.", "10 × 3072 весов + 10 bias = 30 720 + 10 = 30 730 параметров."),
        qx("A CIFAR-10 image is stretched into a column x. How many numbers does x contain?", "3072", [
          ["1024", "32 × 32 = 1024 is the number of pixel positions; each of them has 3 colour values.", "32 × 32 = 1024 — число позиций пикселей; у каждой из них 3 значения цвета."],
          ["96", "32 × 3 = 96 multiplies only one side of the image by the channels.", "32 × 3 = 96 — на каналы умножена только одна сторона изображения."],
          ["30 720", "30 720 is the number of weights in W for 10 classes, not the size of one image.", "30 720 — число весов в W для 10 классов, а не размер одного изображения."],
        ], "32 × 32 × 3 = 3072 numbers: height × width × colour channels.", "32 × 32 × 3 = 3072 числа: высота × ширина × цветовые каналы."),
        qx("A 2×2 grayscale image (pixels 56, 231, 24, 2) is classified into 3 classes. What are the shapes of x, W and b?", "x (4,), W (3, 4), b (3,)", [
          ["x (4,), W (4, 3), b (4,)", "W needs one row per class (3 rows) and one column per pixel (4); b has one value per class.", "У W по строке на класс (3 строки) и по столбцу на пиксель (4); у b по значению на класс."],
          ["x (2, 2), W (3, 2), b (3,)", "x is stretched into a column of 4 numbers before multiplying; the slide's W is (3, 4).", "Перед умножением x вытягивается в столбец из 4 чисел; W на слайде — (3, 4)."],
          ["x (4,), W (3, 4), b (4,)", "b adds one offset to each class score, so it has 3 entries, not 4.", "b добавляет по сдвигу к оценке каждого класса, поэтому в нём 3 элемента, а не 4."],
        ], "x = [56, 231, 24, 2] is (4,), W is (3, 4) and b is (3,), so Wx + b gives 3 scores.", "x = [56, 231, 24, 2] — (4,), W — (3, 4), b — (3,), и Wx + b даёт 3 оценки."),
        qx("The cat row of W is [0.2, −0.5, 0.1, 2.0], b_cat = 1.1, x = [56, 231, 24, 2]. What is the cat score?", "−96.8", [
          ["−97.9", "−97.9 is Wx alone; the bias 1.1 still has to be added.", "−97.9 — это только Wx; нужно ещё прибавить bias 1.1."],
          ["134.2", "This treats −0.5 · 231 as +115.5; the sign of a weight matters.", "Здесь −0.5 · 231 посчитано как +115.5; знак веса важен."],
          ["−99.0", "This subtracts the bias instead of adding it: −97.9 − 1.1.", "Здесь bias вычтен вместо сложения: −97.9 − 1.1."],
        ], "11.2 − 115.5 + 2.4 + 4.0 = −97.9, plus b = 1.1 gives −96.8.", "11.2 − 115.5 + 2.4 + 4.0 = −97.9, плюс b = 1.1 — получается −96.8."),
        qx("W = [[1, −1], [0, 2], [3, 1]], x = [3, 1], b = [2, 0, −8]. What is s = Wx + b?", "[4, 2, 2]", [
          ["[2, 2, 10]", "This is Wx without the bias; b = [2, 0, −8] must still be added.", "Это Wx без bias; нужно ещё прибавить b = [2, 0, −8]."],
          ["[6, 2, 2]", "Row 0 gives 1·3 + (−1)·1 = 2 before the bias, not 4: the −1 weight was treated as +1.", "Строка 0 даёт 1·3 + (−1)·1 = 2 до bias, а не 4: вес −1 принят за +1."],
          ["[4, 2, 18]", "Row 2 is 10 + (−8) = 2; adding 8 instead of −8 gives 18.", "Строка 2: 10 + (−8) = 2; если прибавить 8 вместо −8, получится 18."],
        ], "s0 = 3 − 1 + 2 = 4, s1 = 0 + 2 + 0 = 2, s2 = 9 + 1 − 8 = 2, so s = [4, 2, 2] and class 0 wins.", "s0 = 3 − 1 + 2 = 4, s1 = 0 + 2 + 0 = 2, s2 = 9 + 1 − 8 = 2, то есть s = [4, 2, 2], и побеждает класс 0."),
        qx("Scores s = [0, −2, 4] for classes 0 = Cat, 1 = Dog, 2 = Bird. What does the classifier predict?", "Bird — index 2 holds the largest score", [
          ["Cat — a score of 0 means zero error", "A score is not an error; the prediction is simply the class with the largest score.", "Оценка — не ошибка; предсказание — это просто класс с наибольшей оценкой."],
          ["Dog — the lowest score is the closest match", "Scores are not distances; with Wx + b a larger score means a better match.", "Оценки — не расстояния; в Wx + b большая оценка означает лучшее совпадение."],
          ["None — negative scores make the output invalid", "Scores can be any real number, negative ones included; argmax still works.", "Оценки могут быть любыми действительными числами, в том числе отрицательными; argmax всё равно работает."],
        ], "The prediction is argmax(s): the largest value 4 sits at index 2, so Bird.", "Предсказание — argmax(s): наибольшее значение 4 стоит под индексом 2, значит Bird."),
        qx("With the bias trick, how do W (3, 4) and x (4,) change?", "b becomes a 5th column of W; x gets a 1 at the end", [
          ["b becomes a 4th row of W; x gets a 0 at the end", "b goes in as a column (one value per class row), and the extra input must be 1 so that b is added in full.", "b добавляется столбцом (по значению на строку-класс), а лишний вход должен быть 1, чтобы b прибавился целиком."],
          ["b becomes a 5th column of W; x gets a 0 at the end", "With a 0 appended, the bias column is multiplied by 0 and disappears.", "Если дописать 0, столбец bias умножится на 0 и пропадёт."],
          ["W stays (3, 4) and b is added to every pixel", "The bias is per class, not per pixel; the trick merges it into W.", "Bias — для каждого класса, а не для каждого пикселя; приём переносит его в W."],
        ], "Append 1 to x → (5,), put b as the last column of W → (3, 5); then W'x' = Wx + b.", "Дописываем 1 к x → (5,), ставим b последним столбцом W → (3, 5); тогда W'x' = Wx + b."),
        qx("Ignoring bias, an image gets scores [−96.8, 437.8, 62.0]. What are the scores of 0.5 × image?", "[−48.4, 218.9, 31.0]", [
          ["[−96.8, 437.8, 62.0]", "Scores are linear in x: halving every pixel halves every score.", "Оценки линейны по x: если уменьшить все пиксели вдвое, все оценки тоже уменьшатся вдвое."],
          ["[−193.6, 875.6, 124.0]", "This doubles the scores; the image was multiplied by 0.5, not by 2.", "Здесь оценки удвоены; изображение умножили на 0.5, а не на 2."],
          ["[−97.3, 437.3, 61.5]", "This subtracts 0.5 from each score; scaling x scales the scores.", "Здесь из каждой оценки вычтено 0.5; масштаб x масштабирует оценки."],
        ], "f(cx, W) = W(cx) = c · f(x, W), so with c = 0.5 every score is halved.", "f(cx, W) = W(cx) = c · f(x, W), поэтому при c = 0.5 каждая оценка уменьшается вдвое."),
        tfx("With f(x, W) = Wx (no bias), making an image darker by multiplying all pixels by 0.5 can change the predicted class.", false,
          "All scores are multiplied by the same positive factor 0.5, so their order — and the argmax — stays the same.",
          "Все оценки умножаются на один и тот же положительный множитель 0.5, поэтому их порядок, а значит и argmax, не меняется.",
          "Answering True ignores linearity: f(0.5x) = 0.5 · f(x) keeps the largest score the largest.",
          "Ответ «верно» игнорирует линейность: f(0.5x) = 0.5 · f(x), и наибольшая оценка остаётся наибольшей."),
        qx("In the visual viewpoint, what does one row of W represent?", "A template image for one class", [
          ["One training image stored as is", "Storing training images is kNN; a row of W is learned and looks like a blurry average template.", "Хранение обучающих изображений — это kNN; строка W обучается и похожа на размытый усреднённый шаблон."],
          ["The bias of one class", "The bias is the separate vector b; a row of W has one weight per pixel value.", "Bias — это отдельный вектор b; в строке W по весу на каждое значение пикселя."],
          ["One pixel's weights across all classes", "That is a column of W: one input value as seen by every class.", "Это столбец W: одно входное значение, на которое смотрят все классы."],
        ], "Each row of W, reshaped to 32×32×3, is a template; the score is its dot product with the image.", "Каждая строка W, развёрнутая в 32×32×3, — это шаблон; оценка — её скалярное произведение с изображением."),
        qx("The learned CIFAR-10 horse template looks like a horse with two heads. Why?", "Horses face left and right; one template mixes both modes", [
          ["CIFAR-10 contains photos of two-headed horses", "The data is ordinary; the two heads come from averaging horses that face both ways.", "Данные обычные; две головы получаются при усреднении лошадей, смотрящих в разные стороны."],
          ["Each row of W stores two templates per class", "A linear classifier has exactly one row — one template — per class.", "У линейного классификатора ровно одна строка — один шаблон — на класс."],
          ["The bias b adds a mirrored copy of the image", "b is just one number per class; it cannot draw a second head.", "b — всего одно число на класс; второй головы он нарисовать не может."],
        ], "A single template cannot capture multiple modes of the data, so left- and right-facing horses blend into one picture.", "Один шаблон не может охватить несколько мод данных, поэтому лошади, смотрящие влево и вправо, сливаются в одну картинку."),
        qx("In the geometric viewpoint, what is the set of images where one class score equals 0?", "A hyperplane in pixel space", [
          ["A single point at the class template", "w·x + b = 0 holds for infinitely many images that form a flat surface, not a point.", "Уравнению w·x + b = 0 удовлетворяет бесконечно много изображений — это плоская поверхность, а не точка."],
          ["A sphere around the class mean", "A linear equation gives a flat boundary; a sphere would need squared terms.", "Линейное уравнение даёт плоскую границу; для сферы нужны квадраты."],
          ["The cluster of that class's training images", "The boundary is defined by W and b alone, not by where the training images lie.", "Граница задаётся только W и b, а не тем, где лежат обучающие изображения."],
        ], "w_k·x + b_k = 0 is a linear equation in 3072 variables — a hyperplane; the score grows in the direction of w_k.", "w_k·x + b_k = 0 — линейное уравнение от 3072 переменных, то есть гиперплоскость; оценка растёт в направлении w_k."),
        qx("All pixels are fixed except pixel (15, 8, 0). How does the car score change as that pixel's value grows?", "Along a straight line", [
          ["Along a parabola", "There are no squared terms in Wx + b; the score is linear in each pixel.", "В Wx + b нет квадратов; оценка линейна по каждому пикселю."],
          ["As a step from 0 to 1", "A raw score is not thresholded; it changes smoothly and without limit.", "Сырая оценка не проходит через порог; она меняется плавно и неограниченно."],
          ["Along a bell curve", "A bell shape needs an exponential of a square; a linear score has no peak.", "Для колокола нужна экспонента от квадрата; у линейной оценки нет пика."],
        ], "Each score is a weighted sum, so as one pixel varies the score moves along a line whose slope is that pixel's weight.", "Каждая оценка — взвешенная сумма, поэтому при изменении одного пикселя она движется по прямой с наклоном, равным весу этого пикселя."),
        qx("Which 2-D dataset can a single linear classifier NOT separate perfectly?", "XOR: (0, 1) and (1, 0) vs (0, 0) and (1, 1)", [
          ["Points with x > 2 vs points with x < 2", "The vertical line x = 2 separates them, so a linear boundary works.", "Их разделяет вертикальная прямая x = 2, так что линейная граница подходит."],
          ["Points above the line y = x vs points below it", "The line y = x itself is the separating boundary.", "Разделяющей границей служит сама прямая y = x."],
          ["Bright vs dark images by mean pixel value", "The mean pixel is a linear function of x, so one threshold on it is a hyperplane.", "Среднее значение пикселя — линейная функция от x, поэтому порог по нему — гиперплоскость."],
        ], "No single line puts (0, 1), (1, 0) on one side and (0, 0), (1, 1) on the other — the Perceptron's famous XOR failure.", "Ни одна прямая не отделит (0, 1), (1, 0) от (0, 0), (1, 1) — знаменитый провал Perceptron на XOR."),
        qx("Class 1 is a ring (1 ≤ L2 norm ≤ 2), class 2 is everything else. Why does a linear classifier fail?", "The boundary must be two circles, not a straight line", [
          ["The ring has too few training points", "More points would not help: no straight cut can isolate a ring.", "Больше точек не поможет: ни один прямой разрез не выделит кольцо."],
          ["Linear classifiers cannot take 2-D inputs", "Inputs of any dimension work; the problem is the shape of the boundary.", "Подходят входы любой размерности; проблема в форме границы."],
          ["The bias term is too small to reach the ring", "Changing b only shifts a straight boundary; it never bends it into a circle.", "Изменение b лишь сдвигает прямую границу, но никогда не сгибает её в окружность."],
        ], "A linear classifier draws straight hyperplanes; a ring needs an inner and an outer circular boundary.", "Линейный классификатор проводит прямые гиперплоскости; кольцу нужны внутренняя и внешняя круговые границы."),
        qx("What does the bias vector b do in s = Wx + b?", "Shifts each class score by a constant that ignores x", [
          ["Scales every pixel before W is applied", "Scaling inputs is preprocessing; b is added after Wx, one number per class.", "Масштабирование входов — это предобработка; b прибавляется после Wx, по числу на класс."],
          ["Stores the true label of the image", "Labels y_i are used by the loss, not stored in the model.", "Метки y_i использует функция потерь, в модели они не хранятся."],
          ["Turns the scores into probabilities", "That is softmax; b only moves each score up or down.", "Это делает softmax; b лишь сдвигает каждую оценку вверх или вниз."],
        ], "b_k is a data-independent offset for class k: it raises or lowers that class's score for every image.", "b_k — сдвиг для класса k, не зависящий от данных: он поднимает или опускает оценку этого класса для любого изображения."),
        qx("Compared with kNN, what does a trained linear classifier need to keep to classify a new image?", "Only W and b", [
          ["All training images and their labels", "That is kNN; the parametric approach summarizes the data in W and b.", "Это kNN; параметрический подход сжимает данные в W и b."],
          ["The k nearest training images per class", "Neighbours belong to kNN; a linear classifier computes Wx + b directly.", "Соседи — из kNN; линейный классификатор сразу считает Wx + b."],
          ["W, b and the mean training image per class", "Mean images are not stored; the learned rows of W already act as templates.", "Средние изображения не хранятся; обученные строки W сами работают как шаблоны."],
        ], "After training the images can be thrown away; a prediction is one matrix-vector product plus b.", "После обучения изображения можно выбросить; предсказание — одно умножение матрицы на вектор плюс b."),
        qx("In the 2×2 example a cat image gets cat −96.8, dog 437.9, ship 60.75. What does this show?", "This W is bad — a loss is needed to measure it", [
          ["The picture actually shows a dog", "The input is the cat image; the classifier is wrong, not the label.", "На входе — кошка; ошибается классификатор, а не метка."],
          ["The bias makes the dog score too high", "Dog's bias is only 3.2; the score comes from the weights times the pixels.", "Bias класса dog всего 3.2; оценка набирается из весов, умноженных на пиксели."],
          ["Negative scores mean a computation error", "Scores can be negative; −96.8 is a valid, if low, cat score.", "Оценки могут быть отрицательными; −96.8 — допустимая, хоть и низкая, оценка cat."],
        ], "Dog wins for a cat image, so this W is poor; a loss function quantifies how bad W is so that it can be improved.", "Для кошки побеждает dog, значит W плохая; функция потерь измеряет, насколько, чтобы W можно было улучшить."),
        qx("In the car row of W, the weight for pixel p is large and positive. What does that mean?", "A brighter pixel p raises the car score", [
          ["Pixel p is ignored by the car class", "An ignored pixel would have a weight near 0, not a large one.", "У игнорируемого пикселя вес был бы около 0, а не большим."],
          ["A brighter pixel p lowers the car score", "That would be a negative weight; a positive weight adds to the score.", "Так было бы при отрицательном весе; положительный вес увеличивает оценку."],
          ["Pixel p is red in every car image", "A weight is a learned vote, not a guarantee about every image.", "Вес — это выученный голос, а не гарантия для каждого изображения."],
        ], "The car score is Σ w_p · x_p + b: a large positive w_p means a high value at p pushes the car score up.", "Оценка car — это Σ w_p · x_p + b: большой положительный w_p означает, что большое значение в p поднимает оценку car."),
      ],
    ),
    part(
      "cv-l3-p2",
      { en: "Loss functions and the multiclass SVM loss", ru: "Функции потерь и multiclass SVM loss" },
      {
        en: `## How do we choose a good W?
For any W we can compute scores. The slide shows a linear classifier's 10 CIFAR-10 scores for three test images:
| Image | Score of the true class | Highest other score | Verdict |
|---|---|---|---|
| cat | cat 2.9 | dog 8.02 | wrong |
| car | automobile 6.04 | bird 5.31 | correct |
| frog | frog −4.34 | truck 6.14 | very wrong |
The plan has two steps:
- use a **loss function** to put a number on how good a value of W is;
- find the W that **minimizes** the loss — **optimization** (next lecture).
## Loss function
A **loss function** tells how good the current classifier is: **low loss = good classifier, high loss = bad classifier**.
- Other names: **objective function**, **cost function**.
- The **negative** of a loss is sometimes called a reward, profit, utility or fitness function — that one you maximize.
Given a dataset of N examples (x_i, y_i), where x_i is an image and y_i is its **integer label**:
= L_i = L(f(x_i, W), y_i)
= L = (1/N) · Σ_i L_i
The loss for the whole dataset is the **average** of the per-example losses.
## Multiclass SVM loss (hinge loss)
Idea: **the score of the correct class should be higher than all the other scores — by a margin of at least 1**.
= s = f(x_i, W)
= L_i = Σ_{j ≠ y_i} max(0, s_j − s_{y_i} + 1)
- Every **wrong class j** adds max(0, s_j − s_yi + 1): nothing if the correct score beats it by at least 1, otherwise the size of the shortfall.
- The correct class itself (j = y_i) is **left out** of the sum.
- On the slide's plot (loss against the correct-class score) the loss falls along a straight line and then stays **flat at 0** once the correct score beats the highest other score by the **margin**. The shape looks like a door **hinge** — hence **hinge loss**.
## Worked example: cat, car, frog
Three training images and three classes; the score of the true class is in bold:
| Class | cat image | car image | frog image |
|---|---|---|---|
| cat | **3.2** | 1.3 | 2.2 |
| car | 5.1 | **4.9** | 2.5 |
| frog | −1.7 | 2.0 | **−3.1** |
| SVM loss | 2.9 | 0 | 12.9 |
Cat image (true class cat, score 3.2):
= L_cat = max(0, 5.1 − 3.2 + 1) + max(0, −1.7 − 3.2 + 1)
= L_cat = max(0, 2.9) + max(0, −3.9) = 2.9 + 0 = 2.9
Car image (true class car, score 4.9):
= L_car = max(0, 1.3 − 4.9 + 1) + max(0, 2.0 − 4.9 + 1)
= L_car = max(0, −2.6) + max(0, −1.9) = 0 + 0 = 0
Frog image (true class frog, score −3.1):
= L_frog = max(0, 2.2 − (−3.1) + 1) + max(0, 2.5 − (−3.1) + 1)
= L_frog = max(0, 6.3) + max(0, 6.6) = 6.3 + 6.6 = 12.9
Loss over the dataset:
= L = (2.9 + 0 + 12.9) / 3 = 15.8 / 3 ≈ 5.27
- The cat image is misclassified (car 5.1 > cat 3.2) and pays 2.9; the frog image is badly wrong and pays the most; the car image beats both other classes by more than 1 and pays 0.
![Three square photos side by side on a white background: a grey tabby cat sitting and looking to the side, a red sports car seen from the front, a bright green tree frog with red eyes on a green leaf](/events/cv/l3-cat-car-frog.webp)
## Questions from the slides
| Question | Answer |
|---|---|
| The car image's scores change a little — what happens to its loss? | it stays 0: car (4.9) beats cat and frog by more than the margin |
| Minimum and maximum possible loss? | min 0, max +∞ |
| All scores small and random (almost equal)? | each wrong class adds about max(0, 0 + 1) = 1, so L ≈ C − 1 (2 for 3 classes, 9 for CIFAR-10) |
| Sum over all classes, including j = y_i? | the extra term is always max(0, 1) = 1: the loss grows by 1, the best W does not change |
| Mean instead of sum? | the loss is divided by C − 1: only rescaled, the same W is preferred |
| Squared hinge, max(0, s_j − s_yi + 1)²? | a different loss: big violations cost much more, so it can prefer a different W |
- The value **C − 1** is a handy debugging check: right after initialization the SVM loss should be close to it.
## Is a W with L = 0 unique?
No. If W gives L = 0, then **2W** gives L = 0 too: every score doubles, so every margin only gets bigger. The car image:
= W:   max(0, 1.3 − 4.9 + 1) + max(0, 2.0 − 4.9 + 1) = max(0, −2.6) + max(0, −1.9) = 0
= 2W:  max(0, 2.6 − 9.8 + 1) + max(0, 4.0 − 9.8 + 1) = max(0, −6.2) + max(0, −4.8) = 0
So how should we choose between W and 2W if both are perfect on the training data? That is the job of **regularization** — the next part.
> The multiclass SVM loss is 0 only when the correct score beats every other score by at least 1; each class that breaks the margin adds max(0, s_j − s_yi + 1).
## Check yourself
?? A dog image gets scores cat 1.5, dog 2.0, bird 2.8. Compute its multiclass SVM loss (margin 1).
?= L = max(0, 1.5 − 2.0 + 1) + max(0, 2.8 − 2.0 + 1) = 0.5 + 1.8 = 2.3; even the cat term counts, because dog beats cat by less than the margin.
?? A student finds a W with SVM loss 0 on the training set and says it is the only best W. Is the student right?
?= No: 2W (or any cW with c > 1) multiplies every score difference, so each margin grows and the loss stays 0; regularization is needed to say which of these equal solutions we prefer.`,
        ru: `## Как выбрать хорошую W?
Для любой W можно посчитать оценки. На слайде — 10 оценок линейного классификатора CIFAR-10 для трёх тестовых изображений:
| Изображение | Оценка истинного класса | Наибольшая из остальных | Вердикт |
|---|---|---|---|
| cat | cat 2.9 | dog 8.02 | неверно |
| car | automobile 6.04 | bird 5.31 | верно |
| frog | frog −4.34 | truck 6.14 | совсем неверно |
План из двух шагов:
- с помощью **функции потерь (loss function)** выразить числом, насколько хороша данная W;
- найти W, которая **минимизирует** потери, — это **оптимизация (optimization)** (следующая лекция).
## Функция потерь
**Функция потерь (loss function)** показывает, насколько хорош текущий классификатор: **низкие потери — хороший классификатор, высокие — плохой**.
- Другие названия: **objective function (целевая функция)**, **cost function (функция стоимости)**.
- **Потери со знаком минус** иногда называют reward, profit, utility или fitness function — такую функцию максимизируют.
Дан датасет из N примеров (x_i, y_i), где x_i — изображение, а y_i — его **целочисленная метка (label)**:
= L_i = L(f(x_i, W), y_i)
= L = (1/N) · Σ_i L_i
Потери на всём датасете — **среднее** потерь по отдельным примерам.
## Multiclass SVM loss (hinge loss)
Идея: **оценка правильного класса должна быть выше всех остальных оценок — с отступом (margin) хотя бы 1**.
= s = f(x_i, W)
= L_i = Σ_{j ≠ y_i} max(0, s_j − s_{y_i} + 1)
- Каждый **неверный класс j** добавляет max(0, s_j − s_yi + 1): ничего, если правильная оценка обгоняет его хотя бы на 1, иначе — величину недостачи.
- Сам правильный класс (j = y_i) в сумму **не входит**.
- На графике со слайда (потери в зависимости от оценки правильного класса) потери падают по прямой, а затем остаются **ровно 0**, как только правильная оценка обгонит наибольшую из остальных на **отступ**. Форма похожа на дверную **петлю (hinge)** — отсюда **hinge loss**.
## Разбор примера: cat, car, frog
Три обучающих изображения и три класса; оценка истинного класса выделена жирным:
| Класс | изображение cat | изображение car | изображение frog |
|---|---|---|---|
| cat | **3.2** | 1.3 | 2.2 |
| car | 5.1 | **4.9** | 2.5 |
| frog | −1.7 | 2.0 | **−3.1** |
| SVM loss | 2.9 | 0 | 12.9 |
Кошка (истинный класс cat, оценка 3.2):
= L_cat = max(0, 5.1 − 3.2 + 1) + max(0, −1.7 − 3.2 + 1)
= L_cat = max(0, 2.9) + max(0, −3.9) = 2.9 + 0 = 2.9
Машина (истинный класс car, оценка 4.9):
= L_car = max(0, 1.3 − 4.9 + 1) + max(0, 2.0 − 4.9 + 1)
= L_car = max(0, −2.6) + max(0, −1.9) = 0 + 0 = 0
Лягушка (истинный класс frog, оценка −3.1):
= L_frog = max(0, 2.2 − (−3.1) + 1) + max(0, 2.5 − (−3.1) + 1)
= L_frog = max(0, 6.3) + max(0, 6.6) = 6.3 + 6.6 = 12.9
Потери на датасете:
= L = (2.9 + 0 + 12.9) / 3 = 15.8 / 3 ≈ 5.27
- Кошка классифицирована неверно (car 5.1 > cat 3.2) и «платит» 2.9; лягушка — грубая ошибка, она платит больше всех; машина обгоняет оба других класса больше чем на 1 и платит 0.
![Три квадратных фото в ряд на белом фоне: серая полосатая кошка сидит и смотрит в сторону, красный спортивный автомобиль спереди, ярко-зелёная древесная лягушка с красными глазами на зелёном листе](/events/cv/l3-cat-car-frog.webp)
## Вопросы со слайдов
| Вопрос | Ответ |
|---|---|
| Оценки машины чуть-чуть меняются — что будет с её потерями? | останутся 0: car (4.9) обгоняет cat и frog больше чем на отступ |
| Минимальные и максимальные возможные потери? | минимум 0, максимум +∞ |
| Все оценки маленькие и случайные (почти равные)? | каждый неверный класс добавляет около max(0, 0 + 1) = 1, поэтому L ≈ C − 1 (2 для 3 классов, 9 для CIFAR-10) |
| Сумма по всем классам, включая j = y_i? | лишнее слагаемое всегда max(0, 1) = 1: потери вырастут на 1, лучшая W не изменится |
| Среднее вместо суммы? | потери делятся на C − 1: только масштаб, предпочтительна та же W |
| Квадратичный hinge, max(0, s_j − s_yi + 1)²? | другая функция потерь: большие нарушения стоят гораздо дороже, поэтому она может предпочесть другую W |
- Значение **C − 1** — удобная проверка на ошибки: сразу после инициализации SVM-потери должны быть близки к нему.
## Единственна ли W с L = 0?
Нет. Если W даёт L = 0, то и **2W** даёт L = 0: все оценки удваиваются, и каждый отступ только растёт. Для машины:
= W:   max(0, 1.3 − 4.9 + 1) + max(0, 2.0 − 4.9 + 1) = max(0, −2.6) + max(0, −1.9) = 0
= 2W:  max(0, 2.6 − 9.8 + 1) + max(0, 4.0 − 9.8 + 1) = max(0, −6.2) + max(0, −4.8) = 0
Как же выбрать между W и 2W, если обе идеальны на обучающих данных? Это задача **регуляризации (regularization)** — следующая часть.
> Multiclass SVM loss равна 0, только когда правильная оценка обгоняет каждую другую хотя бы на 1; каждый класс, нарушающий отступ, добавляет max(0, s_j − s_yi + 1).
## Проверь себя
?? Изображение собаки получило оценки cat 1.5, dog 2.0, bird 2.8. Посчитайте multiclass SVM loss (отступ 1).
?= L = max(0, 1.5 − 2.0 + 1) + max(0, 2.8 − 2.0 + 1) = 0.5 + 1.8 = 2.3; учитывается даже слагаемое cat, потому что dog обгоняет cat меньше чем на отступ.
?? Студент нашёл W с SVM-потерями 0 на обучающей выборке и говорит, что это единственная лучшая W. Прав ли он?
?= Нет: 2W (или любая cW при c > 1) умножает каждую разность оценок, отступы растут, и потери остаются 0; чтобы выбрать среди таких равных решений, нужна регуляризация.`,
      },
      [
        qx("What does a loss function tell us about the current classifier W?", "How bad W is on the data: lower is better", [
          ["How long one forward pass of W takes", "Speed is not what a loss measures; it compares predictions with labels.", "Функция потерь не измеряет скорость; она сравнивает предсказания с метками."],
          ["How many learnable parameters W has", "The parameter count is fixed by the shapes; the loss depends on how good W's values are.", "Число параметров задано формами; потери зависят от того, насколько хороши значения W."],
          ["How good W is on the data: a higher loss is better", "It is the other way round: low loss = good classifier, high loss = bad.", "Всё наоборот: низкие потери — хороший классификатор, высокие — плохой."],
        ], "A loss function quantifies how good W is: low loss = good classifier, high loss = bad classifier.", "Функция потерь показывает, насколько хороша W: низкие потери — хороший классификатор, высокие — плохой."),
        qx("Which of these is NOT another name for a loss function?", "Activation function", [
          ["Cost function", "Cost function is a common synonym for loss function.", "Cost function — распространённый синоним функции потерь."],
          ["Objective function", "The lecture lists objective function as another name for the loss.", "В лекции objective function названа другим именем функции потерь."],
          ["Negative of a reward function", "A reward (utility, fitness) function is a negative loss, so its negative is a loss.", "Функция награды (utility, fitness) — это потери со знаком минус, значит её отрицание — потери."],
        ], "An activation function is a non-linearity inside a neural network; loss = cost = objective function.", "Функция активации — нелинейность внутри нейросети; loss = cost = objective function."),
        qx("For a dataset of N examples (x_i, y_i), what is y_i?", "The integer label of image i", [
          ["The score of the correct class", "Scores come from f(x_i, W); y_i is the ground-truth class index.", "Оценки дают f(x_i, W); y_i — индекс истинного класса."],
          ["The i-th row of the weight matrix W", "Rows of W are class templates; y_i belongs to the data, not to the model.", "Строки W — шаблоны классов; y_i относится к данным, а не к модели."],
          ["The loss of example i", "The per-example loss is L_i; y_i is that example's label.", "Потери на примере — это L_i; y_i — метка этого примера."],
        ], "x_i is the image and y_i its integer label, e.g. 3 for cat in CIFAR-10.", "x_i — изображение, y_i — его целочисленная метка, например 3 для cat в CIFAR-10."),
        qx("How is the loss over the whole dataset computed from the per-example losses L_i?", "Their average: (1/N) Σ L_i", [
          ["Their maximum over all examples", "The lecture uses the average, so every example counts, not only the worst one.", "В лекции берётся среднее — учитывается каждый пример, а не только худший."],
          ["Their sum divided by the number of classes", "The sum is divided by the number of examples N, not by C.", "Сумма делится на число примеров N, а не на C."],
          ["Their product", "Multiplying losses would let one zero-loss example zero out everything.", "При перемножении один пример с нулевыми потерями обнулил бы всё."],
        ], "L = (1/N) Σ_i L_i(f(x_i, W), y_i): the mean of the per-example losses.", "L = (1/N) Σ_i L_i(f(x_i, W), y_i) — среднее потерь по примерам."),
        qx("In the multiclass SVM loss, which term is added for each wrong class j?", "max(0, s_j − s_yi + 1)", [
          ["max(0, s_yi − s_j + 1)", "The order is flipped: this would punish the correct class for winning.", "Порядок перевёрнут: так штрафовался бы правильный класс за то, что он выигрывает."],
          ["max(0, s_j − s_yi − 1)", "The margin is +1: the correct score must beat s_j by at least 1.", "Отступ равен +1: правильная оценка должна превышать s_j хотя бы на 1."],
          ["max(1, s_j − s_yi)", "The floor is 0, not 1; otherwise even a perfect classifier would pay.", "Нижняя граница — 0, а не 1; иначе платил бы даже идеальный классификатор."],
        ], "L_i = Σ_{j ≠ y_i} max(0, s_j − s_yi + 1): zero when the correct score beats s_j by the margin 1.", "L_i = Σ_{j ≠ y_i} max(0, s_j − s_yi + 1): ноль, когда правильная оценка обгоняет s_j на отступ 1."),
        qx("A cat image scores cat 3.2, car 5.1, frog −1.7. What is its multiclass SVM loss?", "2.9", [
          ["1.9", "1.9 = 5.1 − 3.2 forgets the margin +1 in the car term.", "1.9 = 5.1 − 3.2 — в слагаемом car забыт отступ +1."],
          ["6.8", "max(0, −3.9) is 0, not 3.9: negative terms are clipped, not made positive.", "max(0, −3.9) = 0, а не 3.9: отрицательные слагаемые обнуляются, а не берутся по модулю."],
          ["−1.0", "2.9 + (−3.9) forgets the max with 0; the SVM loss is never negative.", "2.9 + (−3.9) — забыт max с нулём; SVM-потери не бывают отрицательными."],
        ], "max(0, 5.1 − 3.2 + 1) + max(0, −1.7 − 3.2 + 1) = 2.9 + 0 = 2.9.", "max(0, 5.1 − 3.2 + 1) + max(0, −1.7 − 3.2 + 1) = 2.9 + 0 = 2.9."),
        qx("A frog image scores cat 2.2, car 2.5, frog −3.1. What is its multiclass SVM loss?", "12.9", [
          ["10.9", "10.9 drops the +1 margin from both terms (5.3 + 5.6).", "10.9 — из обоих слагаемых выброшен отступ +1 (5.3 + 5.6)."],
          ["6.6", "6.6 is only the car term; the cat term 6.3 must be added.", "6.6 — только слагаемое car; нужно добавить ещё 6.3 от cat."],
          ["0.5", "This treats −(−3.1) as −3.1; subtracting a negative score adds 3.1.", "Здесь −(−3.1) взято как −3.1; вычитание отрицательной оценки прибавляет 3.1."],
        ], "max(0, 2.2 + 3.1 + 1) + max(0, 2.5 + 3.1 + 1) = 6.3 + 6.6 = 12.9.", "max(0, 2.2 + 3.1 + 1) + max(0, 2.5 + 3.1 + 1) = 6.3 + 6.6 = 12.9."),
        qx("Per-image SVM losses are 2.9, 0 and 12.9. What is the loss over this dataset of 3 images?", "5.27", [
          ["7.9", "7.9 averages only the two non-zero losses; the 0 still counts as an example.", "7.9 — среднее только двух ненулевых потерь; ноль тоже считается примером."],
          ["15.8", "15.8 is the sum; the dataset loss divides it by N = 3.", "15.8 — сумма; потери по датасету делят её на N = 3."],
          ["12.9", "12.9 is the worst single image; the dataset loss is the mean.", "12.9 — худшее отдельное изображение; потери по датасету — среднее."],
        ], "L = (2.9 + 0 + 12.9) / 3 = 15.8 / 3 ≈ 5.27.", "L = (2.9 + 0 + 12.9) / 3 = 15.8 / 3 ≈ 5.27."),
        qx("A car image scores cat 1.3, car 4.9, frog 2.0, so its loss is 0. What if its scores change slightly?", "The loss stays 0: car still wins by more than 1", [
          ["The loss grows in proportion to the change", "Both terms sit deep in the flat zero part of the hinge; small changes keep them 0.", "Оба слагаемых глубоко в плоской нулевой части hinge; малые изменения оставляют их нулями."],
          ["The loss becomes slightly negative", "max(0, ·) is never below 0, so the SVM loss cannot be negative.", "max(0, ·) не бывает меньше 0, поэтому SVM-потери не могут быть отрицательными."],
          ["The loss jumps to C − 1 = 2", "C − 1 is the loss for nearly equal scores, not for a small change here.", "C − 1 — потери при почти равных оценках, а не при малом изменении здесь."],
        ], "Car beats cat by 3.6 and frog by 2.9 — both more than the margin 1 — so small changes leave the loss at 0.", "Car обгоняет cat на 3.6, а frog на 2.9 — оба больше отступа 1, — поэтому малые изменения оставляют потери нулевыми."),
        qx("What are the minimum and maximum possible values of the multiclass SVM loss for one example?", "0 and +∞", [
          ["0 and 1", "One wrong class alone can add more than 1 (e.g. 6.6 for the frog image).", "Один неверный класс сам может добавить больше 1 (например, 6.6 у лягушки)."],
          ["−∞ and +∞", "Every term is max(0, …) ≥ 0, so the loss cannot go below 0.", "Каждое слагаемое — max(0, …) ≥ 0, поэтому потери не опускаются ниже 0."],
          ["0 and C − 1", "C − 1 is the expected loss for random scores, not the maximum: scores are unbounded.", "C − 1 — ожидаемые потери при случайных оценках, а не максимум: оценки не ограничены."],
        ], "Min 0 when every margin is met; max +∞ because a wrong score can exceed the correct one by any amount.", "Минимум 0, когда выполнены все отступы; максимум +∞, потому что неверная оценка может превышать правильную на сколько угодно."),
        qx("At initialization all scores are small and nearly equal. What SVM loss do you expect on CIFAR-10 (C = 10)?", "About 9", [
          ["About 10", "The correct class is left out of the sum, so there are only C − 1 = 9 terms.", "Правильный класс в сумму не входит, поэтому слагаемых только C − 1 = 9."],
          ["About 0", "With equal scores no margin is met, so every term is about 1.", "При равных оценках ни один отступ не выполнен, поэтому каждое слагаемое около 1."],
          ["About 2.3", "2.3 = ln 10 is the expected cross-entropy loss, not the SVM loss.", "2.3 = ln 10 — ожидаемые потери cross-entropy, а не SVM."],
        ], "Each of the C − 1 wrong classes adds max(0, 0 + 1) ≈ 1, so L ≈ C − 1 = 9 — a handy debugging check.", "Каждый из C − 1 неверных классов добавляет max(0, 0 + 1) ≈ 1, поэтому L ≈ C − 1 = 9 — удобная проверка на ошибки."),
        qx("What changes if the SVM sum also includes the correct class j = y_i?", "Every loss grows by 1; the best W stays the same", [
          ["Every loss becomes 0, since that term cancels out", "The extra term is max(0, s_yi − s_yi + 1) = 1, not 0.", "Лишнее слагаемое — max(0, s_yi − s_yi + 1) = 1, а не 0."],
          ["The loss doubles and the best W changes", "A constant +1 neither doubles the loss nor changes which W is best.", "Константа +1 не удваивает потери и не меняет лучшую W."],
          ["Nothing — that extra term is always 0", "s_yi − s_yi + 1 = 1, so the term is always exactly 1.", "s_yi − s_yi + 1 = 1, поэтому слагаемое всегда ровно 1."],
        ], "The added term is always max(0, 1) = 1, so the loss shifts by a constant and the preferred W is unchanged.", "Добавленное слагаемое всегда max(0, 1) = 1, поэтому потери сдвигаются на константу, а лучшая W не меняется."),
        qx("What happens if the SVM loss uses a mean over the wrong classes instead of a sum?", "It is divided by C − 1; the same W is preferred", [
          ["A different W becomes the best one", "Dividing by a constant does not change which W gives the lowest loss.", "Деление на константу не меняет, какая W даёт наименьшие потери."],
          ["The loss can now become negative for some images", "Every term is still max(0, …) ≥ 0, so the mean is ≥ 0 too.", "Каждое слагаемое по-прежнему max(0, …) ≥ 0, значит и среднее ≥ 0."],
          ["The margin changes from 1 to 1/C", "Averaging rescales the total; the margin inside each term stays 1.", "Усреднение масштабирует сумму; отступ внутри каждого слагаемого остаётся 1."],
        ], "A mean is the sum times 1/(C − 1): the loss is rescaled, and rescaling does not move the minimum.", "Среднее — это сумма, умноженная на 1/(C − 1): потери масштабируются, а масштаб не сдвигает минимум."),
        tfx("Squaring the hinge, max(0, s_j − s_yi + 1)², only rescales the SVM loss, so it always prefers the same W.", false,
          "Squaring is not a constant rescaling: large violations grow much faster and small ones shrink, so the preferred W can change.",
          "Возведение в квадрат — не умножение на константу: большие нарушения растут гораздо быстрее, малые уменьшаются, поэтому лучшая W может измениться.",
          "Answering True confuses squaring with a mean or a constant factor; the squared hinge is a different loss.",
          "Ответ «верно» путает квадрат со средним или постоянным множителем; квадратичный hinge — это другая функция потерь."),
        qx("A W gives SVM loss 0 on the whole training set. What loss does 2W give?", "Also 0 — every margin only gets bigger", [
          ["About C − 1, as at initialization", "C − 1 is the loss for nearly equal scores; 2W makes the gaps larger, not smaller.", "C − 1 — потери при почти равных оценках; 2W делает разрывы больше, а не меньше."],
          ["Higher, because all scores grow", "Scores grow, but the gaps between the correct and wrong scores grow too.", "Оценки растут, но растут и разрывы между правильной и неверными оценками."],
          ["Undefined until the model is retrained", "The loss can be computed for any W; for 2W it is 0.", "Потери можно посчитать для любой W; для 2W они равны 0."],
        ], "Doubling W doubles every score difference, so margins already above 1 stay above 1: a W with L = 0 is not unique.", "Удвоение W удваивает каждую разность оценок, и отступы, уже больше 1, остаются больше 1: W с L = 0 не единственна."),
        qx("With 2W the car image scores become cat 2.6, car 9.8, frog 4.0. What is its SVM loss?", "0", [
          ["11.0", "11.0 = 6.2 + 4.8 takes absolute values; max(0, −6.2) is 0.", "11.0 = 6.2 + 4.8 — взяты модули; max(0, −6.2) = 0."],
          ["2", "2 would need every term to equal 1; here both terms are negative before the max.", "2 получилось бы, если бы каждое слагаемое было 1; здесь оба отрицательны до max."],
          ["−11.0", "−11.0 skips the max with 0; the SVM loss is never negative.", "−11.0 — пропущен max с нулём; SVM-потери не бывают отрицательными."],
        ], "max(0, 2.6 − 9.8 + 1) + max(0, 4.0 − 9.8 + 1) = max(0, −6.2) + max(0, −4.8) = 0.", "max(0, 2.6 − 9.8 + 1) + max(0, 4.0 − 9.8 + 1) = max(0, −6.2) + max(0, −4.8) = 0."),
        qx("A dog image scores cat 0.5, dog 3.0, bird 2.5 — dog has the top score. What is its SVM loss?", "0.5", [
          ["0", "Dog wins, but it beats bird by only 0.5, less than the margin 1.", "Dog выигрывает, но обгоняет bird лишь на 0.5 — меньше отступа 1."],
          ["−1.0", "−1.5 + 0.5 forgets the max with 0 for the cat term.", "−1.5 + 0.5 — для слагаемого cat забыт max с нулём."],
          ["1.5", "1.5 also counts the dog term max(0, 1) = 1; the correct class is skipped.", "1.5 — учтено ещё слагаемое dog max(0, 1) = 1; правильный класс пропускается."],
        ], "max(0, 0.5 − 3.0 + 1) + max(0, 2.5 − 3.0 + 1) = 0 + 0.5 = 0.5: a correct prediction can still have a loss.", "max(0, 0.5 − 3.0 + 1) + max(0, 2.5 − 3.0 + 1) = 0 + 0.5 = 0.5: даже верное предсказание может давать потери."),
        qx("On the hinge-loss plot, what happens once the correct score beats the highest other score by the margin?", "The loss stays flat at 0", [
          ["The loss keeps falling along the same line", "The line stops at 0: max(0, ·) cuts it off — that is the hinge.", "Прямая останавливается на 0: max(0, ·) её обрезает — это и есть «петля» (hinge)."],
          ["The loss starts to rise again", "A higher correct score never increases the SVM loss.", "Рост правильной оценки никогда не увеличивает SVM-потери."],
          ["The loss jumps up to exactly 1", "The margin is 1, but the loss there is 0, not 1.", "Отступ равен 1, но потери там равны 0, а не 1."],
        ], "The hinge loss decreases linearly and then becomes flat at 0 once the margin is met.", "Hinge-потери убывают линейно, а после выполнения отступа становятся ровно 0."),
        qx("Given a linear score function, which two steps does the lecture use to choose a good W?", "Define a loss, then minimize it (optimization)", [
          ["Try random W and keep the best test accuracy", "Choosing anything by test accuracy leaks the test set; W is found by minimizing a training loss.", "Выбор чего-либо по точности на тесте — утечка тестовых данных; W ищут минимизацией потерь на обучении."],
          ["Copy W from a kNN model, then add a bias", "kNN has no weight matrix to copy; it just stores the training images.", "У kNN нет матрицы весов, которую можно скопировать; он просто хранит обучающие изображения."],
          ["Normalize the pixels, then apply softmax", "Normalization and softmax do not search for W; optimization does.", "Нормализация и softmax не ищут W; это делает оптимизация."],
        ], "1. A loss function quantifies how good W is. 2. Optimization finds the W that minimizes the loss.", "1. Функция потерь показывает, насколько хороша W. 2. Оптимизация находит W с минимальными потерями."),
        qx("Top scores: cat image → dog 8.02; car image → car 6.04; frog image → truck 6.14. What is the accuracy?", "1/3 ≈ 33%: only the car image is right", [
          ["2/3 ≈ 67%: the cat and car images are right", "The cat image's top score is dog, so it is misclassified.", "У кошки наибольшая оценка — dog, значит она классифицирована неверно."],
          ["0%: every image has some wrong scores", "Only the argmax matters: the car image's top score is car, so it counts as correct.", "Важен только argmax: у машины наибольшая оценка — car, значит она засчитывается как верная."],
          ["100%: every image received a score", "Accuracy counts correct argmax predictions, not images that got scores.", "Accuracy считает верные argmax-предсказания, а не изображения, получившие оценки."],
        ], "Accuracy = correct / total: only the car image has its true class on top, so 1/3 ≈ 33%.", "Accuracy = верные / все: только у машины истинный класс наверху, значит 1/3 ≈ 33%."),
      ],
    ),
    part(
      "cv-l3-p3",
      { en: "Regularization: L2, L1 and simpler models", ru: "Регуляризация: L2, L1 и более простые модели" },
      {
        en: `## Beyond training error
On the training data W and 2W can be equally perfect. To choose between them we add a second term to the loss:
= L(W) = (1/N) · Σ_i L_i(f(x_i, W), y_i) + λ · R(W)
| Term | What it says |
|---|---|
| **data loss** (1/N) Σ L_i | model predictions should match the training data |
| **regularization** R(W) | prevent the model from doing *too* well on the training data |
| λ | **regularization strength**, a **hyperparameter** chosen on validation data |
- The data loss looks only at the training set; R(W) looks only at the weights.
- λ = 0 means no regularization; a larger λ means a stronger preference for simple weights.
## Simple and more complex regularizers
| Regularizer | R(W) | What it prefers |
|---|---|---|
| L2 | Σ_k Σ_l W_kl² | small, **spread-out** weights |
| L1 | Σ_k Σ_l abs(W_kl) | **sparse** weights: many exactly 0 |
| Elastic net (L1 + L2) | Σ_k Σ_l (β · W_kl² + abs(W_kl)) | a mix of both |
More complex regularizers, used for neural networks: **dropout**, **batch normalization**, cutout, mixup, stochastic depth.
## Why regularize
- **Express preferences** among models beyond "minimize training error".
- **Avoid overfitting**: prefer **simple models** that **generalize** better to new data.
- **Improve optimization** by adding curvature to the loss.
- L2 regularization of the weights is also called **weight decay**.
## L2 likes to spread out the weights
Two weight vectors give the same score on the same input:
= x = [1, 1, 1, 1]
= w1 = [1, 0, 0, 0]
= w2 = [0.25, 0.25, 0.25, 0.25]
= w1ᵀx = 1 + 0 + 0 + 0 = 1
= w2ᵀx = 0.25 + 0.25 + 0.25 + 0.25 = 1
The data loss cannot tell them apart, but the regularizers can:
= R_L2(w1) = 1² + 0² + 0² + 0² = 1
= R_L2(w2) = 4 · 0.25² = 4 · 0.0625 = 0.25   →   R_L2(w2) < R_L2(w1)
= R_L1(w1) = 1,   R_L1(w2) = 4 · 0.25 = 1   →   R_L1(w1) = R_L1(w2)
- **L2 prefers w2**: it uses every input a little instead of relying on one pixel, so noise in a single pixel barely changes the decision.
- **L1** generally prefers **sparse** solutions with many zero weights (like w1) — useful when only a few features matter. Here it sees a tie.
## Back to W and 2W
Both have data loss 0 on the training set. Under L2, doubling every weight multiplies the penalty by 4:
= R(2W) = Σ_k Σ_l (2 · W_kl)² = 4 · R(W)
= R(W) = 2.5,  λ = 0.1:   L(W) = 0 + 0.1 · 2.5 = 0.25,   L(2W) = 0 + 0.1 · 10 = 1.0
So the regularized loss picks **W** — the solution with smaller weights.
## Prefer simpler models
The slide shows training points (blue) and two models:
- **f1** — a wiggly curve (not a linear model; e.g. polynomial regression) that passes through **every** training point: zero training error.
- **f2** — a straight line with some training error, but **simpler**.
- New points (white) arrive later: they lie close to the line f2, while f1 swings far away from them — f1 has fitted the **noise**.
Regularization **pushes against fitting the data too well**, so we don't fit noise. It is important: you should (usually) use it.
![A simple plot on a white background with a horizontal and a vertical axis line: five blue dots that a wiggly blue curve passes through exactly, a straight green line running close to all of them, and two light-grey dots that lie near the green line but far from the wiggly curve; no labels](/events/cv/l3-simple-vs-wiggly.webp)
## Choosing λ
@diagram cv-overfitting
| λ | What happens | Typical symptom |
|---|---|---|
| 0 or too small | the model fits training noise | train ≫ test, e.g. 95% train vs 62% test (overfitting) |
| well tuned | balance between fit and simplicity | best **validation** accuracy |
| too large | weights pushed toward 0, the data is ignored | train and test both low (underfitting) |
- λ is a hyperparameter: try several values and keep the one with the best **validation** accuracy (or use cross-validation). **Never tune on the test set** — it must stay an honest final estimate.
- **95% train / 62% test** is **overfitting**. Fixes: more data or **augmentation**, **regularization** (L2 weight decay, dropout), a **simpler model**, **early stopping**.
> Full loss = data loss + λ · R(W): the data loss fits the training set, while the regularizer (L2 prefers small, spread-out weights) keeps the model simple so it generalizes.
## Check yourself
?? x = [1, 1, 1, 1], w1 = [1, 0, 0, 0], w2 = [0.25, 0.25, 0.25, 0.25]. Both give score 1. Which one does L2 regularization prefer, and why?
?= R(w1) = 1 and R(w2) = 4 · 0.25² = 0.25, so L2 prefers w2: it spreads the weight over all inputs, so no single (possibly noisy) pixel dominates the decision.
?? A model reaches 95% training accuracy but only 62% test accuracy. Name the problem and explain how regularization helps.
?= This is overfitting — the model memorized training noise and does not generalize. Adding or increasing λ · R(W) (L2 weight decay, dropout) penalizes complex solutions, trading a little training accuracy for better test accuracy; λ is tuned on a validation set.`,
        ru: `## Не только ошибка на обучении
На обучающих данных W и 2W могут быть одинаково идеальны. Чтобы выбрать между ними, к потерям добавляют второе слагаемое:
= L(W) = (1/N) · Σ_i L_i(f(x_i, W), y_i) + λ · R(W)
| Слагаемое | Что оно требует |
|---|---|
| **data loss** (1/N) Σ L_i | предсказания модели должны совпадать с обучающими данными |
| **регуляризация (regularization)** R(W) | не дать модели подстроиться под обучающие данные *слишком* хорошо |
| λ | **сила регуляризации (regularization strength)**, **гиперпараметр**, который выбирают на валидационных данных |
- Data loss смотрит только на обучающую выборку; R(W) — только на веса.
- λ = 0 — регуляризации нет; чем больше λ, тем сильнее предпочтение простых весов.
## Простые и более сложные регуляризаторы
| Регуляризатор | R(W) | Что он предпочитает |
|---|---|---|
| L2 | Σ_k Σ_l W_kl² | маленькие, **распределённые (spread-out)** веса |
| L1 | Σ_k Σ_l abs(W_kl) | **разреженные (sparse)** веса: много ровно нулевых |
| Elastic net (L1 + L2) | Σ_k Σ_l (β · W_kl² + abs(W_kl)) | смесь обоих |
Более сложные регуляризаторы для нейросетей: **dropout**, **batch normalization**, cutout, mixup, stochastic depth.
## Зачем регуляризация
- **Выразить предпочтения** среди моделей, помимо «минимизировать ошибку на обучении».
- **Избежать переобучения (overfitting)**: предпочесть **простые модели**, которые лучше **обобщаются (generalize)** на новые данные.
- **Улучшить оптимизацию**, добавив кривизну (curvature) функции потерь.
- L2-регуляризацию весов также называют **weight decay**.
## L2 любит распределять веса
Два вектора весов дают одинаковую оценку на одном и том же входе:
= x = [1, 1, 1, 1]
= w1 = [1, 0, 0, 0]
= w2 = [0.25, 0.25, 0.25, 0.25]
= w1ᵀx = 1 + 0 + 0 + 0 = 1
= w2ᵀx = 0.25 + 0.25 + 0.25 + 0.25 = 1
Data loss их не различает, а регуляризаторы различают:
= R_L2(w1) = 1² + 0² + 0² + 0² = 1
= R_L2(w2) = 4 · 0.25² = 4 · 0.0625 = 0.25   →   R_L2(w2) < R_L2(w1)
= R_L1(w1) = 1,   R_L1(w2) = 4 · 0.25 = 1   →   R_L1(w1) = R_L1(w2)
- **L2 предпочитает w2**: он понемногу использует каждый вход, а не полагается на один пиксель, поэтому шум в одном пикселе почти не меняет решение.
- **L1** в целом предпочитает **разреженные** решения с множеством нулевых весов (как w1) — полезно, когда важны лишь несколько признаков. Здесь у него ничья.
## Снова W и 2W
У обеих data loss на обучающей выборке равен 0. При L2 удвоение каждого веса умножает штраф на 4:
= R(2W) = Σ_k Σ_l (2 · W_kl)² = 4 · R(W)
= R(W) = 2.5,  λ = 0.1:   L(W) = 0 + 0.1 · 2.5 = 0.25,   L(2W) = 0 + 0.1 · 10 = 1.0
Значит, регуляризованные потери выбирают **W** — решение с меньшими весами.
## Предпочитаем более простые модели
На слайде — обучающие точки (синие) и две модели:
- **f1** — извилистая кривая (не линейная модель; например, полиномиальная регрессия), проходящая через **каждую** обучающую точку: ошибка на обучении нулевая.
- **f2** — прямая с некоторой ошибкой на обучении, зато **проще**.
- Позже появляются новые точки (белые): они лежат рядом с прямой f2, а f1 уходит от них далеко — f1 выучила **шум**.
Регуляризация **мешает подгоняться под данные слишком хорошо**, чтобы модель не учила шум. Это важно: (почти всегда) её стоит использовать.
![Простой график на белом фоне с горизонтальной и вертикальной осью: пять синих точек, через которые точно проходит извилистая синяя кривая, прямая зелёная линия, идущая близко ко всем точкам, и две светло-серые точки рядом с зелёной линией, но далеко от извилистой кривой; без подписей](/events/cv/l3-simple-vs-wiggly.webp)
## Как выбрать λ
@diagram cv-overfitting
| λ | Что происходит | Типичный симптом |
|---|---|---|
| 0 или слишком мала | модель учит шум обучающих данных | train ≫ test, например 95% на обучении и 62% на тесте (переобучение) |
| подобрана хорошо | баланс между точностью подгонки и простотой | лучшая точность на **валидации** |
| слишком велика | веса прижаты к 0, данные игнорируются | низкая точность и на обучении, и на тесте (недообучение, underfitting) |
- λ — гиперпараметр: перебирают несколько значений и оставляют то, что даёт лучшую точность на **валидации** (или кросс-валидацию). **Никогда не подбирайте по тесту** — он должен остаться честной итоговой оценкой.
- **95% на обучении / 62% на тесте** — это **переобучение**. Что помогает: больше данных или **аугментация**, **регуляризация** (L2 weight decay, dropout), **более простая модель**, **early stopping**.
> Полные потери = data loss + λ · R(W): data loss подгоняет модель под обучающую выборку, а регуляризатор (L2 предпочитает маленькие распределённые веса) сохраняет модель простой, чтобы она обобщалась.
## Проверь себя
?? x = [1, 1, 1, 1], w1 = [1, 0, 0, 0], w2 = [0.25, 0.25, 0.25, 0.25]. Оба дают оценку 1. Какой из них предпочтёт L2-регуляризация и почему?
?= R(w1) = 1, а R(w2) = 4 · 0.25² = 0.25, поэтому L2 предпочитает w2: вес распределён по всем входам, и ни один (возможно, зашумлённый) пиксель не решает всё.
?? Модель даёт 95% точности на обучении и только 62% на тесте. Назовите проблему и объясните, как помогает регуляризация.
?= Это переобучение: модель запомнила шум обучающих данных и не обобщается. Добавление или усиление λ · R(W) (L2 weight decay, dropout) штрафует сложные решения — немного точности на обучении меняется на лучшую точность на тесте; λ подбирают на валидационной выборке.`,
      },
      [
        qx("In L(W) = (1/N) Σ L_i + λR(W), what does the data loss term ask for?", "Predictions that match the training labels", [
          ["Weights that are as small as possible, ideally 0", "Keeping weights small is the job of R(W), not of the data loss.", "Держать веса маленькими — задача R(W), а не data loss."],
          ["A good value for the hyperparameter λ", "λ is chosen outside training, on validation data.", "λ выбирают вне обучения, на валидационных данных."],
          ["High accuracy on the test set", "The data loss is computed on the training data; the test set is used only at the very end.", "Data loss считается на обучающих данных; тест используется только в самом конце."],
        ], "Data loss: the model's predictions should match the training data.", "Data loss: предсказания модели должны совпадать с обучающими данными."),
        qx("What is the role of the regularization term R(W)?", "Stop the model doing too well on training data", [
          ["Make the model fit the training data even better", "It does the opposite: it pushes against fitting the training data too closely.", "Он делает обратное — мешает слишком точно подгоняться под обучающие данные."],
          ["Turn the class scores into probabilities", "That is softmax; R(W) depends only on the weights.", "Это делает softmax; R(W) зависит только от весов."],
          ["Count how many test images are correct", "That is test accuracy; R(W) never looks at any images.", "Это точность на тесте; R(W) вообще не смотрит на изображения."],
        ], "Regularization prevents the model from doing too well on the training data, so that it does not fit noise.", "Регуляризация не даёт модели слишком хорошо подстроиться под обучающие данные, чтобы она не выучила шум."),
        qx("What is λ in L(W) = data loss + λR(W)?", "The regularization strength, a hyperparameter", [
          ["A weight learned by gradient descent together with W", "λ is not learned by minimizing the loss — that would simply drive it to 0.", "λ не обучается минимизацией потерь — иначе её просто довели бы до 0."],
          ["The SVM margin", "The margin is the +1 inside the hinge; λ multiplies R(W).", "Отступ — это +1 внутри hinge; λ умножает R(W)."],
          ["The number of classes C", "C appears in the data loss (e.g. C − 1 terms), not as the weight of R(W).", "C встречается в data loss (например, C − 1 слагаемых), а не как вес R(W)."],
        ], "λ sets how strongly R(W) counts against the data loss; it is a hyperparameter.", "λ задаёт, насколько сильно R(W) учитывается по сравнению с data loss; это гиперпараметр."),
        qx("How should the regularization strength λ be chosen?", "Try several values; keep the best on validation", [
          ["Pick the value that gives the best test-set accuracy", "Tuning on the test set makes the final test score optimistic and dishonest.", "Подбор по тестовой выборке делает итоговую оценку на тесте завышенной и нечестной."],
          ["Pick the value with the lowest training loss", "That is always λ = 0, i.e. no regularization at all.", "Это всегда λ = 0, то есть никакой регуляризации."],
          ["Always use λ = 1", "No single value fits every problem; λ must be tuned.", "Нет значения, подходящего для всех задач; λ нужно подбирать."],
        ], "λ is a hyperparameter: compare values on a validation set (or by cross-validation), never on the test set.", "λ — гиперпараметр: значения сравнивают на валидационной выборке (или кросс-валидацией), но не на тесте."),
        qx("Which formula is L2 regularization?", "R(W) = Σ_k Σ_l W_kl²", [
          ["R(W) = Σ_k Σ_l |W_kl|", "Absolute values give L1 regularization.", "Модули дают L1-регуляризацию."],
          ["R(W) = max_k,l |W_kl|", "The largest absolute weight is a max-norm, not L2.", "Наибольший по модулю вес — это max-норма, а не L2."],
          ["R(W) = Σ_k Σ_l W_kl", "A plain sum lets positive and negative weights cancel; L2 squares them.", "В простой сумме положительные и отрицательные веса сокращаются; L2 возводит их в квадрат."],
        ], "L2 regularization sums the squares of all weights: R(W) = Σ_k Σ_l W_kl².", "L2-регуляризация — сумма квадратов всех весов: R(W) = Σ_k Σ_l W_kl²."),
        qx("Which regularizer tends to make many weights exactly 0 (a sparse W)?", "L1", [
          ["L2", "L2 shrinks weights and spreads them out, but rarely makes them exactly 0.", "L2 уменьшает веса и распределяет их, но редко делает ровно нулевыми."],
          ["Dropout", "Dropout randomly switches units off during training; it does not zero weights for good.", "Dropout случайно отключает нейроны во время обучения; веса он навсегда не обнуляет."],
          ["Batch normalization", "Batch normalization normalizes activations; it is not a sparsity penalty.", "Batch normalization нормализует активации; это не штраф за ненулевые веса."],
        ], "L1 (Σ abs(W)) favours sparse solutions with many zeros; L2 favours small, spread-out weights.", "L1 (Σ abs(W)) предпочитает разреженные решения с множеством нулей; L2 — маленькие распределённые веса."),
        qx("What is elastic net regularization?", "A weighted mix of L1 and L2", [
          ["L2 applied twice in a row", "Applying L2 twice is still an L2-type penalty; elastic net adds L1 to L2.", "Двойное L2 — всё ещё штраф типа L2; elastic net добавляет к L2 ещё L1."],
          ["Dropout applied only to the bias", "Elastic net is a penalty on the weights, not a dropout variant.", "Elastic net — штраф на веса, а не разновидность dropout."],
          ["A penalty on the number of layers", "It penalizes weight values, not the depth of the network.", "Он штрафует значения весов, а не глубину сети."],
        ], "Elastic net: R(W) = Σ (β · W² + abs(W)) — L1 and L2 together.", "Elastic net: R(W) = Σ (β · W² + abs(W)) — L1 и L2 вместе."),
        qx("w1 = [1, 0, 0, 0] and w2 = [0.25, 0.25, 0.25, 0.25]. What are the L2 penalties R(w1) and R(w2)?", "1 and 0.25", [
          ["1 and 1", "Those are the L1 penalties; L2 squares each weight: 4 · 0.0625 = 0.25.", "Это L1-штрафы; L2 возводит каждый вес в квадрат: 4 · 0.0625 = 0.25."],
          ["1 and 0.0625", "0.0625 is one squared entry; w2 has four of them.", "0.0625 — один квадрат; у w2 их четыре."],
          ["0.25 and 1", "The values are swapped: the single weight 1 gives R = 1.", "Значения перепутаны: единственный вес 1 даёт R = 1."],
        ], "R(w1) = 1² = 1; R(w2) = 4 · 0.25² = 0.25.", "R(w1) = 1² = 1; R(w2) = 4 · 0.25² = 0.25."),
        qx("On x = [1, 1, 1, 1], w1 = [1, 0, 0, 0] and w2 = [0.25, 0.25, 0.25, 0.25] give the same score. Which does L2 prefer?", "w2 — it spreads weight over all inputs", [
          ["w1 — it has fewer non-zero weights", "Preferring few non-zero weights is how L1 behaves, not L2.", "Предпочитать мало ненулевых весов — поведение L1, а не L2."],
          ["Neither — both give the score 1", "The data loss ties, but R(w2) = 0.25 < R(w1) = 1 breaks the tie.", "Data loss одинаков, но R(w2) = 0.25 < R(w1) = 1 разрешает ничью."],
          ["w1 — its largest weight is bigger", "L2 penalizes large weights, so a bigger largest weight is worse.", "L2 штрафует большие веса, поэтому больший максимальный вес — хуже."],
        ], "L2 likes to spread out the weights: w2 has the smaller penalty (0.25 vs 1) and uses every pixel a little.", "L2 любит распределять веса: у w2 штраф меньше (0.25 против 1), и он понемногу использует каждый пиксель."),
        tfx("On x = [1, 1, 1, 1], L1 regularization also strictly prefers w2 = [0.25, 0.25, 0.25, 0.25] over w1 = [1, 0, 0, 0].", false,
          "Both have L1 penalty 1 (1 = 4 · 0.25), so L1 sees a tie here; only L2 prefers w2.",
          "У обоих L1-штраф равен 1 (1 = 4 · 0.25), так что для L1 здесь ничья; w2 предпочитает только L2.",
          "Answering True mixes up L1 with L2: it is squaring that makes the spread-out vector cheaper.",
          "Ответ «верно» путает L1 с L2: дешевле распределённый вектор делает именно возведение в квадрат."),
        qx("W and 2W both have training SVM loss 0. With L2 regularization, which has the lower total loss?", "W — R(2W) is four times R(W)", [
          ["2W — larger margins lower the loss", "Both already have data loss 0; only the penalty differs.", "У обеих data loss уже 0; различается только штраф."],
          ["They tie — the data loss is 0 for both", "The data loss ties, but λR(2W) = 4 · λR(W) is larger.", "Data loss одинаков, но λR(2W) = 4 · λR(W) больше."],
          ["2W — R(2W) is half of R(W)", "Doubling weights multiplies squared weights by 4, not by 1/2.", "Удвоение весов умножает квадраты весов на 4, а не на 1/2."],
        ], "Σ(2W)² = 4ΣW², so with equal data loss the regularized loss picks the smaller weights W.", "Σ(2W)² = 4ΣW², поэтому при равном data loss регуляризованные потери выбирают меньшие веса W."),
        qx("Data loss is 0 for both W and 2W, R(W) = 2.5 with L2, and λ = 0.1. What is the total loss of 2W?", "1.0", [
          ["0.5", "0.5 assumes R(2W) = 2 · R(W); squared weights give 4 · 2.5 = 10.", "0.5 предполагает R(2W) = 2 · R(W); квадраты весов дают 4 · 2.5 = 10."],
          ["0.25", "0.25 = 0.1 · 2.5 is the total loss of W, not of 2W.", "0.25 = 0.1 · 2.5 — полные потери W, а не 2W."],
          ["10", "10 is R(2W) alone; it must still be multiplied by λ = 0.1.", "10 — это только R(2W); его нужно ещё умножить на λ = 0.1."],
        ], "R(2W) = 4 · 2.5 = 10, total = 0 + 0.1 · 10 = 1.0 (versus 0.25 for W).", "R(2W) = 4 · 2.5 = 10, итого 0 + 0.1 · 10 = 1.0 (против 0.25 для W)."),
        qx("Which is NOT one of the purposes of regularization listed in the lecture?", "Make training accuracy as high as possible", [
          ["Express preferences beyond training error", "This is the first listed purpose: choose among models with equal training error.", "Это первая цель из списка: выбирать среди моделей с одинаковой ошибкой на обучении."],
          ["Avoid overfitting by preferring simple models", "This is the second listed purpose.", "Это вторая цель из списка."],
          ["Improve optimization by adding curvature", "This is the third listed purpose.", "Это третья цель из списка."],
        ], "Regularization deliberately stops the model from fitting the training data too well; maximizing training accuracy is the data loss's job.", "Регуляризация как раз мешает модели слишком хорошо подогнаться под обучающие данные; максимизировать точность на обучении — дело data loss."),
        qx("f1 is a wiggly curve through every training point; f2 is a line with some training error. Which is preferred?", "f2 — simpler, so it should generalize better", [
          ["f1 — zero training error is always the goal", "Fitting every point, noise included, usually hurts on new data.", "Подгонка под каждую точку вместе с шумом обычно вредит на новых данных."],
          ["f1 — more parameters mean better accuracy", "Extra flexibility lets f1 fit noise; the new points lie closer to f2.", "Лишняя гибкость позволяет f1 выучить шум; новые точки лежат ближе к f2."],
          ["Neither — pick by test accuracy while training", "The test set must not be used during training or model selection.", "Тестовую выборку нельзя использовать ни при обучении, ни при выборе модели."],
        ], "Regularization prefers simpler models: f2 ignores the noise and fits new points better than f1.", "Регуляризация предпочитает более простые модели: f2 не учит шум и лучше подходит к новым точкам, чем f1."),
        qx("A model gets 95% training accuracy but 62% test accuracy. What is the most likely problem?", "Overfitting — it does not generalize", [
          ["Underfitting — the model is too simple", "An underfitting model would also score low on the training set.", "Недообученная модель показывала бы низкую точность и на обучении."],
          ["A bug in the accuracy formula", "A large train/test gap is the classic sign of overfitting, not of a formula error.", "Большой разрыв между обучением и тестом — классический признак переобучения, а не ошибки в формуле."],
          ["The test set is too large", "A bigger test set gives a more reliable estimate; it does not cause the gap.", "Больший тест даёт более надёжную оценку; разрыва он не вызывает."],
        ], "High train but much lower test accuracy = overfitting: the model memorized the training data, noise included.", "Высокая точность на обучении и гораздо ниже на тесте = переобучение: модель запомнила обучающие данные вместе с шумом."),
        qx("Which change is most likely to shrink a 95% train / 62% test accuracy gap?", "Increase λ, the L2 regularization strength", [
          ["Set λ = 0 so the model fits the training data better", "Less regularization makes overfitting worse, not better.", "Меньше регуляризации — сильнее переобучение, а не слабее."],
          ["Train longer until training accuracy is 100%", "Longer training on the same data usually widens the gap; early stopping does the opposite.", "Более долгое обучение на тех же данных обычно увеличивает разрыв; early stopping делает обратное."],
          ["Tune λ on the test set until it shows 95%", "Tuning on the test set leaks it; the 95% would no longer be an honest estimate.", "Подбор по тесту — утечка; 95% больше не были бы честной оценкой."],
        ], "Stronger regularization (L2 weight decay, dropout), more data or augmentation, a simpler model or early stopping fight overfitting.", "С переобучением борются более сильная регуляризация (L2 weight decay, dropout), больше данных или аугментация, более простая модель или early stopping."),
        qx("What happens when λ is set far too large?", "Weights shrink toward 0 and the model underfits", [
          ["The model memorizes the training noise even more", "Memorizing noise is what happens with too little regularization.", "Запоминание шума происходит при слишком слабой регуляризации."],
          ["Training accuracy reaches 100%", "A huge penalty keeps the weights tiny, so even training accuracy drops.", "Огромный штраф держит веса крошечными, поэтому падает даже точность на обучении."],
          ["Nothing — λ only affects the bias", "λ multiplies R(W), which is computed from the weights.", "λ умножает R(W), а R(W) считается по весам."],
        ], "With a huge λ the penalty dominates, the weights go to almost 0 and the model ignores the data: both train and test accuracy are low.", "При огромной λ штраф доминирует, веса почти обнуляются и модель игнорирует данные: низкая точность и на обучении, и на тесте."),
        qx("Which of these is a regularization method listed for neural networks?", "Dropout", [
          ["Softmax", "Softmax turns scores into probabilities; it is not a regularizer.", "Softmax превращает оценки в вероятности; это не регуляризатор."],
          ["Hinge loss", "Hinge loss is a data loss (multiclass SVM), not a regularizer.", "Hinge loss — это data loss (multiclass SVM), а не регуляризатор."],
          ["Bias trick", "The bias trick just merges b into W; it adds no preference.", "Bias trick просто переносит b в W; никаких предпочтений он не добавляет."],
        ], "Besides L1, L2 and elastic net, the lecture lists dropout, batch normalization, cutout, mixup and stochastic depth.", "Кроме L1, L2 и elastic net, в лекции перечислены dropout, batch normalization, cutout, mixup и stochastic depth."),
        qx("Why can spreading the weights out, as L2 prefers, help on new images?", "No single pixel dominates, so its noise matters less", [
          ["It makes every class score positive", "Weights can still be negative; spreading them says nothing about the sign of the scores.", "Веса всё ещё могут быть отрицательными; распределение ничего не говорит о знаке оценок."],
          ["It removes the need for the bias b", "The bias is still used; L2 is about the size of the weights.", "Bias по-прежнему нужен; L2 — про величину весов."],
          ["It zeroes most weights, so the model runs faster", "Zeroing many weights is L1's sparsity; L2 keeps them small but non-zero.", "Обнуление многих весов — разреженность L1; L2 держит их маленькими, но ненулевыми."],
        ], "The decision uses many inputs a little each, so one noisy or changed pixel barely moves the scores.", "Решение использует понемногу много входов, поэтому один зашумлённый или изменившийся пиксель почти не сдвигает оценки."),
        tfx("Adding regularization often lowers training accuracy slightly but can raise test accuracy.", true,
          "R(W) pushes against fitting the training data too well, so training accuracy may drop a bit while generalization improves.",
          "R(W) мешает слишком точно подгоняться под обучающие данные, поэтому точность на обучении может немного упасть, а обобщение — улучшиться.",
          "Answering False assumes training accuracy must rise with every improvement; regularization trades a little of it for better test results.",
          "Ответ «неверно» предполагает, что любое улучшение повышает точность на обучении; регуляризация жертвует её частью ради лучшего результата на тесте."),
      ],
    ),
    part(
      "cv-l3-p4",
      { en: "Softmax and cross-entropy loss", ru: "Softmax и cross-entropy loss" },
      {
        en: `## From scores to probabilities
The SVM loss treats scores as plain numbers. Often we want to read the raw classifier scores as **probabilities**.
- Raw scores are **unnormalized log-probabilities**, also called **logits**: any real number, positive or negative, with no bound.
- A probability must be **≥ 0**, and the probabilities of all classes must **sum to 1**.
The **softmax function** does both in two steps — exponentiate, then normalize:
= P(Y = k | X = x_i) = exp(s_k) / Σ_j exp(s_j)
@diagram cv-softmax
## Worked example: the cat image
| Class | Score (logit) | exp(score) | Probability |
|---|---|---|---|
| cat | 3.2 | 24.5 | 0.13 |
| car | 5.1 | 164.0 | 0.87 |
| frog | −1.7 | 0.18 | 0.00 |
= e^3.2 ≈ 24.5,   e^5.1 ≈ 164.0,   e^(−1.7) ≈ 0.18
= sum = 24.5 + 164.0 + 0.18 = 188.68
= P(cat) = 24.5 / 188.68 ≈ 0.13
= P(car) = 164.0 / 188.68 ≈ 0.87
= P(frog) = 0.18 / 188.68 ≈ 0.001 ≈ 0.00
- **exp** turns every score, even a negative one, into a positive number; dividing by the sum makes the values add up to 1.
- The largest score still gets the largest probability, so the **predicted class does not change** — car here, a wrong prediction for a cat.
## Cross-entropy loss
Train the model to **maximize the probability of the correct class**, that is, to minimize its negative log:
= L_i = −log P(Y = y_i | X = x_i) = −log( exp(s_{y_i}) / Σ_j exp(s_j) )
= L_cat = −log(0.13) ≈ 2.04
- The log is the **natural** log (ln): −ln 0.13 ≈ 2.04, and log 10 ≈ 2.3 below.
- Why "cross-entropy": compare the predicted distribution [0.13, 0.87, 0.00] with the **correct** one [1.00, 0.00, 0.00]. The **cross-entropy** H(P, Q) = −Σ_y P(y) log Q(y) measures how far apart they are (it is closely related to the **Kullback–Leibler divergence**); with a one-hot target it is just −log Q(y_i).
- This is **maximum likelihood estimation**: choose the weights that maximize the likelihood of the observed labels. The model is also called **multinomial logistic regression**.
## Min, max and the loss at initialization
| Situation | P(correct class) | Loss −log P |
|---|---|---|
| correct score far above the others | → 1 | → 0 |
| correct score far below the others | → 0 | → +∞ |
| all scores small random values | ≈ 1/C | ≈ log C |
- **Min 0, max +∞.** The loss reaches 0 only in the limit: with finite scores P(correct) is never exactly 1.
- With small random weights at the start of training all scores are about equal, so P ≈ 1/C and the loss is about **log C**:
= C = 10:   −log(1/10) = log 10 ≈ 2.3
= C = 3:    −log(1/3) = log 3 ≈ 1.1
- **Sanity check**: if the first iteration on CIFAR-10 does not give a loss near 2.3, look for a bug.
## Cross-entropy vs SVM loss
Three examples with correct class y_i = 0 (its score is 10 every time):
| Scores | SVM loss | Cross-entropy loss |
|---|---|---|
| [10, −2, 3] | 0 | ≈ 0.0009 |
| [10, 9, 9] | 0 | ≈ 0.55 |
| [10, −100, −100] | 0 | ≈ 3·10⁻⁴⁸ (tiny, but > 0) |
= [10, 9, 9]:   P(0) = e^10 / (e^10 + e^9 + e^9) = 1 / (1 + 2/e) ≈ 0.576,   L = −log 0.576 ≈ 0.55
- **Change the last example's scores slightly** → the cross-entropy loss changes (by a tiny amount); the SVM loss **stays 0**, because the margins are met by far.
- **Double the correct score from 10 to 20** → cross-entropy **decreases**; the SVM loss **is still 0**.
- The SVM is satisfied as soon as the margins are met and stops caring; cross-entropy **always** wants the correct probability closer to 1.
## Scores vs probabilities (exam favourite)
| | Class score (logit) | Class probability (softmax) |
|---|---|---|
| Range | any real number, can be negative | between 0 and 1 |
| Sum over classes | anything | exactly 1 |
| Comes from | s = Wx + b | exp of the scores, then normalize |
| Predicted class | argmax of the scores | the same argmax |
Exam numbers: s = [0, −2, 4] for Cat, Dog, Bird:
= exp(s) = [1, 0.135, 54.6],   sum ≈ 55.7,   P ≈ [0.018, 0.002, 0.980]   →   Bird
## The full picture
- A dataset of (x, y), a **score function** s = f(x; W) = Wx, and a **loss function** — softmax (cross-entropy) or SVM — plus regularization:
= L = (1/N) · Σ_i L_i + λ · R(W)
- The next question: **how do we find the best W?** That is optimization.
> Softmax turns logits into probabilities (exp, then normalize) without changing the argmax; cross-entropy −log P(correct) is ≈ log C at the start, 0 only in the limit, and — unlike the SVM loss — never stops pushing.
## Check yourself
?? A cat image gets scores cat 3.2, car 5.1, frog −1.7. Compute the softmax probabilities and the cross-entropy loss.
?= exp gives 24.5, 164.0 and 0.18 (sum ≈ 188.7), so P ≈ 0.13, 0.87, 0.00; the loss is −ln 0.13 ≈ 2.04 — high, because most of the probability went to car.
?? Explain the difference between a class score and a class probability.
?= A score (logit) is a raw output of Wx + b — any real number, unbounded and not summing to anything; softmax turns scores into probabilities between 0 and 1 that sum to 1, and the predicted class (argmax) stays the same.`,
        ru: `## От оценок к вероятностям
SVM loss работает с оценками как с обычными числами. Часто же хочется читать сырые оценки классификатора как **вероятности**.
- Сырые оценки — это **ненормированные лог-вероятности (unnormalized log-probabilities)**, их ещё называют **logits**: любые действительные числа, положительные или отрицательные, без ограничений.
- Вероятность должна быть **≥ 0**, а вероятности всех классов в **сумме дают 1**.
**Функция softmax** обеспечивает и то и другое в два шага — взять экспоненту, затем нормировать:
= P(Y = k | X = x_i) = exp(s_k) / Σ_j exp(s_j)
@diagram cv-softmax
## Разбор примера: изображение кошки
| Класс | Оценка (logit) | exp(оценка) | Вероятность |
|---|---|---|---|
| cat | 3.2 | 24.5 | 0.13 |
| car | 5.1 | 164.0 | 0.87 |
| frog | −1.7 | 0.18 | 0.00 |
= e^3.2 ≈ 24.5,   e^5.1 ≈ 164.0,   e^(−1.7) ≈ 0.18
= sum = 24.5 + 164.0 + 0.18 = 188.68
= P(cat) = 24.5 / 188.68 ≈ 0.13
= P(car) = 164.0 / 188.68 ≈ 0.87
= P(frog) = 0.18 / 188.68 ≈ 0.001 ≈ 0.00
- **exp** превращает любую оценку, даже отрицательную, в положительное число; деление на сумму делает так, что значения в сумме дают 1.
- Наибольшая оценка по-прежнему получает наибольшую вероятность, поэтому **предсказанный класс не меняется** — здесь это car, неверный ответ для кошки.
## Cross-entropy loss (перекрёстная энтропия)
Модель обучают **максимизировать вероятность правильного класса**, то есть минимизировать её логарифм со знаком минус:
= L_i = −log P(Y = y_i | X = x_i) = −log( exp(s_{y_i}) / Σ_j exp(s_j) )
= L_cat = −log(0.13) ≈ 2.04
- Логарифм здесь **натуральный** (ln): −ln 0.13 ≈ 2.04, и ниже log 10 ≈ 2.3.
- Почему «cross-entropy»: сравниваем предсказанное распределение [0.13, 0.87, 0.00] с **правильным** [1.00, 0.00, 0.00]. **Перекрёстная энтропия** H(P, Q) = −Σ_y P(y) log Q(y) измеряет, насколько они различаются (она тесно связана с **расхождением Кульбака — Лейблера, KL divergence**); при one-hot цели это просто −log Q(y_i).
- Это **метод максимального правдоподобия (maximum likelihood estimation)**: выбираем веса, при которых наблюдаемые метки наиболее вероятны. Модель также называют **multinomial logistic regression (мультиномиальная логистическая регрессия)**.
## Минимум, максимум и потери в начале обучения
| Ситуация | P(правильный класс) | Потери −log P |
|---|---|---|
| правильная оценка намного выше остальных | → 1 | → 0 |
| правильная оценка намного ниже остальных | → 0 | → +∞ |
| все оценки — маленькие случайные числа | ≈ 1/C | ≈ log C |
- **Минимум 0, максимум +∞.** Потери достигают 0 только в пределе: при конечных оценках P(correct) никогда не равна ровно 1.
- При маленьких случайных весах в начале обучения все оценки примерно равны, поэтому P ≈ 1/C, а потери около **log C**:
= C = 10:   −log(1/10) = log 10 ≈ 2.3
= C = 3:    −log(1/3) = log 3 ≈ 1.1
- **Проверка на здравый смысл (sanity check)**: если первая итерация на CIFAR-10 не даёт потери около 2.3, ищите ошибку.
## Cross-entropy против SVM loss
Три примера с правильным классом y_i = 0 (его оценка каждый раз 10):
| Оценки | SVM loss | Cross-entropy loss |
|---|---|---|
| [10, −2, 3] | 0 | ≈ 0.0009 |
| [10, 9, 9] | 0 | ≈ 0.55 |
| [10, −100, −100] | 0 | ≈ 3·10⁻⁴⁸ (крошечные, но > 0) |
= [10, 9, 9]:   P(0) = e^10 / (e^10 + e^9 + e^9) = 1 / (1 + 2/e) ≈ 0.576,   L = −log 0.576 ≈ 0.55
- **Слегка изменим оценки последнего примера** → cross-entropy изменится (на крошечную величину); SVM loss **останется 0**, потому что отступы выполнены с огромным запасом.
- **Удвоим правильную оценку с 10 до 20** → cross-entropy **уменьшится**; SVM loss **по-прежнему 0**.
- SVM довольна, как только выполнены отступы, и дальше ей всё равно; cross-entropy **всегда** хочет приблизить вероятность правильного класса к 1.
## Оценки против вероятностей (любимый вопрос экзамена)
| | Оценка класса (logit) | Вероятность класса (softmax) |
|---|---|---|
| Диапазон | любое действительное число, может быть отрицательным | от 0 до 1 |
| Сумма по классам | любая | ровно 1 |
| Откуда берётся | s = Wx + b | exp от оценок, затем нормировка |
| Предсказанный класс | argmax оценок | тот же argmax |
Числа с экзамена: s = [0, −2, 4] для Cat, Dog, Bird:
= exp(s) = [1, 0.135, 54.6],   sum ≈ 55.7,   P ≈ [0.018, 0.002, 0.980]   →   Bird
## Общая картина
- Датасет из пар (x, y), **функция оценок (score function)** s = f(x; W) = Wx и **функция потерь** — softmax (cross-entropy) или SVM — плюс регуляризация:
= L = (1/N) · Σ_i L_i + λ · R(W)
- Следующий вопрос: **как найти лучшую W?** Это оптимизация.
> Softmax превращает logits в вероятности (exp, затем нормировка), не меняя argmax; cross-entropy −log P(correct) в начале ≈ log C, равна 0 только в пределе и — в отличие от SVM loss — никогда не перестаёт «тянуть».
## Проверь себя
?? Изображение кошки получило оценки cat 3.2, car 5.1, frog −1.7. Посчитайте вероятности softmax и cross-entropy loss.
?= exp даёт 24.5, 164.0 и 0.18 (сумма ≈ 188.7), поэтому P ≈ 0.13, 0.87, 0.00; потери −ln 0.13 ≈ 2.04 — большие, потому что почти вся вероятность ушла к car.
?? Объясните разницу между оценкой класса (score) и вероятностью класса (probability).
?= Оценка (logit) — сырой выход Wx + b: любое действительное число, не ограниченное и ни во что не складывающееся; softmax превращает оценки в вероятности от 0 до 1 с суммой 1, а предсказанный класс (argmax) остаётся тем же.`,
      },
      [
        qx("What does the softmax function do to a vector of class scores?", "Exponentiates them, then divides by their sum", [
          ["Sets the top score to 1 and all the others to 0", "That is a hard argmax (one-hot); softmax gives every class some probability.", "Это жёсткий argmax (one-hot); softmax даёт каждому классу ненулевую вероятность."],
          ["Divides each score by the sum of the scores", "Without exp, negative scores would give negative probabilities.", "Без exp отрицательные оценки дали бы отрицательные вероятности."],
          ["Clips negative scores to 0", "Clipping at 0 is ReLU; softmax maps scores to probabilities that sum to 1.", "Обрезка по 0 — это ReLU; softmax переводит оценки в вероятности с суммой 1."],
        ], "P(k) = exp(s_k) / Σ_j exp(s_j): exp makes the values positive, normalizing makes them sum to 1.", "P(k) = exp(s_k) / Σ_j exp(s_j): exp делает значения положительными, нормировка — с суммой 1."),
        qx("Why are the scores exponentiated before normalizing in softmax?", "exp makes every value positive", [
          ["exp maps the largest score to exactly 1", "exp(5.1) ≈ 164, not 1; values below 1 appear only after dividing by the sum.", "exp(5.1) ≈ 164, а не 1; значения меньше 1 появляются только после деления на сумму."],
          ["exp keeps negative scores negative", "exp of any real number is positive: exp(−1.7) ≈ 0.18.", "exp любого действительного числа положителен: exp(−1.7) ≈ 0.18."],
          ["exp alone already makes the values sum to 1", "24.5 + 164.0 + 0.18 is not 1; the normalize step is still needed.", "24.5 + 164.0 + 0.18 — не 1; шаг нормировки всё равно нужен."],
        ], "Probabilities must be ≥ 0: exp maps any logit to a positive number; then normalization makes them sum to 1.", "Вероятности должны быть ≥ 0: exp переводит любой logit в положительное число, затем нормировка даёт сумму 1."),
        qx("exp(3.2) ≈ 24.5, exp(5.1) ≈ 164.0, exp(−1.7) ≈ 0.18 for cat, car, frog. What is P(cat)?", "0.13", [
          ["0.87", "0.87 = 164.0 / 188.68 is P(car).", "0.87 = 164.0 / 188.68 — это P(car)."],
          ["0.48", "0.48 = 3.2 / (3.2 + 5.1 − 1.7) normalizes the raw scores without exp.", "0.48 = 3.2 / (3.2 + 5.1 − 1.7) — нормированы сырые оценки без exp."],
          ["0.15", "0.15 = 24.5 / 164.0 divides by the car value, not by the sum of all three.", "0.15 = 24.5 / 164.0 — деление на значение car, а не на сумму всех трёх."],
        ], "P(cat) = 24.5 / (24.5 + 164.0 + 0.18) = 24.5 / 188.68 ≈ 0.13.", "P(cat) = 24.5 / (24.5 + 164.0 + 0.18) = 24.5 / 188.68 ≈ 0.13."),
        qx("The correct class has softmax probability 0.13. What is the cross-entropy loss (natural log)?", "2.04", [
          ["0.89", "0.89 = −log₁₀ 0.13 uses base 10; the lecture uses the natural log.", "0.89 = −log₁₀ 0.13 — по основанию 10; в лекции натуральный логарифм."],
          ["0.13", "0.13 is the probability itself; the loss is its negative log.", "0.13 — сама вероятность; потери — её логарифм со знаком минус."],
          ["0.87", "0.87 = 1 − 0.13; cross-entropy uses −log, not one minus the probability.", "0.87 = 1 − 0.13; cross-entropy использует −log, а не единицу минус вероятность."],
        ], "L = −ln(0.13) ≈ 2.04.", "L = −ln(0.13) ≈ 2.04."),
        qx("What are the minimum and maximum possible cross-entropy loss for one example?", "0 and +∞", [
          ["0 and 1", "−log P grows without bound as P(correct) → 0, so 1 is not the limit.", "−log P растёт неограниченно при P(correct) → 0, поэтому 1 — не предел."],
          ["−∞ and 0", "P ≤ 1 means −log P ≥ 0: the loss is never negative.", "P ≤ 1 означает −log P ≥ 0: потери не бывают отрицательными."],
          ["0 and log C", "log C is the loss for equal scores, not the worst case.", "log C — потери при равных оценках, а не худший случай."],
        ], "Min 0 when P(correct) → 1, max +∞ when P(correct) → 0.", "Минимум 0 при P(correct) → 1, максимум +∞ при P(correct) → 0."),
        qx("At initialization all scores are small random values. What cross-entropy loss do you expect for C = 10?", "ln 10 ≈ 2.3", [
          ["C − 1 = 9", "C − 1 is the SVM loss at initialization, not cross-entropy.", "C − 1 — это SVM-потери в начале обучения, а не cross-entropy."],
          ["1/C = 0.1", "0.1 is the probability of each class, not the loss −log 0.1.", "0.1 — вероятность каждого класса, а не потери −log 0.1."],
          ["log₁₀ 10 = 1", "The lecture uses the natural log: −ln(1/10) ≈ 2.3.", "В лекции натуральный логарифм: −ln(1/10) ≈ 2.3."],
        ], "Equal scores give P = 1/C for every class, so L = −log(1/C) = log C = ln 10 ≈ 2.3.", "Равные оценки дают P = 1/C для каждого класса, поэтому L = −log(1/C) = log C = ln 10 ≈ 2.3."),
        qx("The first training iteration on a 3-class problem gives cross-entropy ≈ 1.1. What does this tell you?", "It is expected: ln 3 ≈ 1.1 for near-equal scores", [
          ["The model is already well trained on this problem", "A trained model would have a loss far below log C.", "У обученной модели потери были бы гораздо ниже log C."],
          ["There is a bug — it should start at 0", "Loss 0 would mean perfect predictions before any training.", "Потери 0 означали бы идеальные предсказания ещё до обучения."],
          ["The SVM loss must also be 1.1", "For 3 classes the SVM loss at initialization is about C − 1 = 2.", "Для 3 классов SVM-потери в начале около C − 1 = 2."],
        ], "With small random weights P ≈ 1/3 for each class, so the loss ≈ −ln(1/3) = ln 3 ≈ 1.1 — the sanity check passes.", "При маленьких случайных весах P ≈ 1/3 для каждого класса, поэтому потери ≈ −ln(1/3) = ln 3 ≈ 1.1 — проверка пройдена."),
        qx("Which statement about raw class scores (logits) is true?", "They can be any real number, including negative", [
          ["They always lie between 0 and 1", "That describes probabilities after softmax, not raw scores like 437.9 or −96.8.", "Так устроены вероятности после softmax, а не сырые оценки вроде 437.9 или −96.8."],
          ["They always sum to exactly 1 over all the classes", "Only softmax probabilities sum to 1; the scores [3.2, 5.1, −1.7] sum to 6.6.", "В сумме 1 дают только вероятности softmax; оценки [3.2, 5.1, −1.7] дают 6.6."],
          ["They equal the probabilities times 100", "Scores are not percentages; softmax needs exp and normalization.", "Оценки — не проценты; softmax требует exp и нормировки."],
        ], "Logits are unnormalized log-probabilities: unbounded real numbers of any sign; softmax turns them into probabilities.", "Logits — ненормированные лог-вероятности: неограниченные числа любого знака; softmax превращает их в вероятности."),
        tfx("Applying softmax to the class scores can change which class is predicted.", false,
          "exp and division by the same positive sum are increasing, so the largest score always gets the largest probability.",
          "exp и деление на одну и ту же положительную сумму — возрастающие операции, поэтому наибольшая оценка всегда получает наибольшую вероятность.",
          "Answering True ignores that softmax keeps the order of the scores: the argmax stays the same.",
          "Ответ «верно» игнорирует то, что softmax сохраняет порядок оценок: argmax не меняется."),
        qx("Scores [10, −2, 3], correct class 0. Which is true about the two losses?", "SVM loss is 0; cross-entropy is tiny but above 0", [
          ["Both losses are exactly 0", "Cross-entropy is about 0.0009: P(correct) is close to 1 but not equal to it.", "Cross-entropy около 0.0009: P(correct) близка к 1, но не равна ей."],
          ["SVM loss is above 0; cross-entropy is exactly 0", "It is the reverse: the margins are met (SVM = 0) and cross-entropy stays positive.", "Наоборот: отступы выполнены (SVM = 0), а cross-entropy остаётся положительной."],
          ["Both are large because class 2 scores 3", "Class 0 beats class 2 by 7, far more than the margin.", "Класс 0 обгоняет класс 2 на 7 — намного больше отступа."],
        ], "max(0, −2 − 10 + 1) + max(0, 3 − 10 + 1) = 0; cross-entropy = −ln(0.9991) ≈ 0.0009 > 0.", "max(0, −2 − 10 + 1) + max(0, 3 − 10 + 1) = 0; cross-entropy = −ln(0.9991) ≈ 0.0009 > 0."),
        qx("Scores [10, 9, 9], correct class 0. What is the multiclass SVM loss?", "0", [
          ["2", "Each term is max(0, 9 − 10 + 1) = max(0, 0) = 0, not 1.", "Каждое слагаемое — max(0, 9 − 10 + 1) = max(0, 0) = 0, а не 1."],
          ["1", "The correct score beats both others by exactly 1, which meets the margin.", "Правильная оценка обгоняет обе другие ровно на 1 — отступ выполнен."],
          ["0.55", "0.55 is the cross-entropy loss for these scores, not the SVM loss.", "0.55 — это cross-entropy для этих оценок, а не SVM-потери."],
        ], "max(0, 9 − 10 + 1) + max(0, 9 − 10 + 1) = 0 + 0 = 0.", "max(0, 9 − 10 + 1) + max(0, 9 − 10 + 1) = 0 + 0 = 0."),
        qx("Scores [10, 9, 9], correct class 0. What is the cross-entropy loss (natural log)?", "≈ 0.55", [
          ["0", "SVM is 0 here, but softmax gives P(0) ≈ 0.58, far from 1.", "SVM здесь 0, но softmax даёт P(0) ≈ 0.58 — далеко от 1."],
          ["≈ 1.1", "ln 3 ≈ 1.1 would need all three scores to be equal.", "ln 3 ≈ 1.1 получилось бы, только если все три оценки равны."],
          ["≈ 0.42", "0.42 = 1 − 0.58; the loss is −ln 0.58, not one minus the probability.", "0.42 = 1 − 0.58; потери — это −ln 0.58, а не единица минус вероятность."],
        ], "P(0) = e^10 / (e^10 + 2e^9) = 1 / (1 + 2/e) ≈ 0.576, so L = −ln 0.576 ≈ 0.55.", "P(0) = e^10 / (e^10 + 2e^9) = 1 / (1 + 2/e) ≈ 0.576, поэтому L = −ln 0.576 ≈ 0.55."),
        qx("Scores [10, −100, −100] for correct class 0 change slightly. What happens to each loss?", "Cross-entropy changes a tiny bit; SVM stays 0", [
          ["Both stay exactly 0", "Cross-entropy is a tiny positive number that moves with the scores.", "Cross-entropy — крошечное положительное число, которое меняется вместе с оценками."],
          ["SVM loss changes; cross-entropy stays exactly 0", "The margins are met by about 110, so the SVM loss stays 0.", "Отступы выполнены с запасом около 110, поэтому SVM-потери остаются 0."],
          ["Both change by the same amount", "The two losses react differently: only cross-entropy depends on every score here.", "Две функции потерь реагируют по-разному: здесь только cross-entropy зависит от каждой оценки."],
        ], "SVM ignores examples whose margins are already met; cross-entropy is never exactly 0 and reacts to any change.", "SVM игнорирует примеры с уже выполненными отступами; cross-entropy никогда не равна ровно 0 и реагирует на любое изменение."),
        qx("In [10, 9, 9] (correct class 0) the correct score is doubled from 10 to 20. What happens?", "Cross-entropy decreases; SVM loss stays 0", [
          ["Both losses decrease", "The SVM loss was already 0 and cannot go lower.", "SVM-потери уже были 0 и ниже опуститься не могут."],
          ["SVM loss decreases; cross-entropy stays the same", "SVM is stuck at 0; cross-entropy is the one that drops.", "SVM застряла на 0; падает как раз cross-entropy."],
          ["Cross-entropy rises because the scores grew", "A bigger correct score raises P(correct), so −log P falls.", "Большая правильная оценка повышает P(correct), значит −log P падает."],
        ], "SVM is satisfied once the margin is met; cross-entropy keeps pushing P(correct) toward 1, so it decreases.", "SVM довольна, как только выполнен отступ; cross-entropy продолжает тянуть P(correct) к 1, поэтому уменьшается."),
        qx("Softmax with the cross-entropy loss is also known as…", "Multinomial logistic regression", [
          ["Multinomial linear regression", "Linear regression predicts real numbers with a squared error, not class probabilities.", "Линейная регрессия предсказывает числа с квадратичной ошибкой, а не вероятности классов."],
          ["Multiclass support vector machine", "The multiclass SVM uses the hinge loss, not softmax.", "Multiclass SVM использует hinge loss, а не softmax."],
          ["Elastic net regularization", "Elastic net is a penalty on the weights (L1 + L2), not a loss on the scores.", "Elastic net — штраф на веса (L1 + L2), а не потери по оценкам."],
        ], "The slide title reads: Cross-Entropy Loss (Multinomial Logistic Regression).", "Заголовок слайда: Cross-Entropy Loss (Multinomial Logistic Regression)."),
        qx("Scores s = [0, −2, 4] for Cat, Dog, Bird. Which statement is right?", "Bird gets the highest probability after softmax", [
          ["Dog has probability −2", "−2 is a score; every softmax probability is positive.", "−2 — оценка; любая вероятность softmax положительна."],
          ["Cat has probability 0", "exp(0) = 1, so P(Cat) = 1 / 55.7 ≈ 0.018, not 0.", "exp(0) = 1, поэтому P(Cat) = 1 / 55.7 ≈ 0.018, а не 0."],
          ["The three probabilities are equal, about 0.33 each", "Only equal scores give equal probabilities.", "Равные вероятности дают только равные оценки."],
        ], "exp gives [1, 0.135, 54.6], sum ≈ 55.7, so P ≈ [0.018, 0.002, 0.980]: Bird, as argmax(s) already said.", "exp даёт [1, 0.135, 54.6], сумма ≈ 55.7, поэтому P ≈ [0.018, 0.002, 0.980]: Bird, как и говорил argmax(s)."),
        qx("Two classes with scores [2, 0]. Using e² ≈ 7.39, what is P(class 0) after softmax?", "0.88", [
          ["1.00", "2 / (2 + 0) normalizes the raw scores without exp.", "2 / (2 + 0) — нормированы сырые оценки без exp."],
          ["0.12", "0.12 = 1 / 8.39 is P(class 1).", "0.12 = 1 / 8.39 — это P(class 1)."],
          ["7.39", "7.39 is exp(2) before normalizing; a probability cannot exceed 1.", "7.39 — это exp(2) до нормировки; вероятность не может быть больше 1."],
        ], "P(0) = e² / (e² + e⁰) = 7.39 / 8.39 ≈ 0.88.", "P(0) = e² / (e² + e⁰) = 7.39 / 8.39 ≈ 0.88."),
        qx("With a one-hot correct distribution, the cross-entropy between it and the softmax output equals…", "−log of the correct-class probability", [
          ["The correct-class probability itself", "Then a probability near 1 would give a large loss; the loss is −log P.", "Тогда вероятность около 1 давала бы большие потери; потери — это −log P."],
          ["One minus the correct-class probability", "1 − P is a different measure; cross-entropy is −Σ P log Q = −log Q(y_i).", "1 − P — другая мера; cross-entropy — это −Σ P log Q = −log Q(y_i)."],
          ["The sum of −log over all class probabilities", "With a one-hot target only the correct class has weight 1; the others are multiplied by 0.", "При one-hot цели вес 1 только у правильного класса; остальные умножаются на 0."],
        ], "H(P, Q) = −Σ_y P(y) log Q(y); with P = [1, 0, 0] only −log Q(y_i) remains.", "H(P, Q) = −Σ_y P(y) log Q(y); при P = [1, 0, 0] остаётся только −log Q(y_i)."),
        qx("Minimizing cross-entropy over the training set is the same as…", "Maximizing the likelihood of the correct labels", [
          ["Maximizing the SVM margin of every class", "The margin belongs to the hinge loss; cross-entropy comes from likelihood.", "Отступ относится к hinge loss; cross-entropy выводится из правдоподобия."],
          ["Minimizing the L2 norm of W", "That is the regularization term R(W), not the data loss.", "Это регуляризация R(W), а не data loss."],
          ["Maximizing the number of non-zero weights", "No loss in the lecture rewards non-zero weights; L1 even pushes them to 0.", "Ни одна функция потерь в лекции не поощряет ненулевые веса; L1 даже толкает их к 0."],
        ], "Maximum likelihood estimation: choose W to maximize the probability of the observed labels; −log turns it into a minimization.", "Метод максимального правдоподобия: выбрать W, максимизирующую вероятность наблюдаемых меток; −log превращает это в минимизацию."),
        qx("A 3-class model gives equal scores [1, 1, 1]. What does softmax output?", "[0.33, 0.33, 0.33]", [
          ["[1.00, 1.00, 1.00]", "Probabilities must sum to 1; each exp(1) is divided by the sum 3e.", "Вероятности должны давать в сумме 1; каждое exp(1) делится на сумму 3e."],
          ["[0.00, 0.00, 0.00]", "exp is always positive, so no class gets probability 0.", "exp всегда положителен, поэтому ни один класс не получает вероятность 0."],
          ["[1.00, 0.00, 0.00]", "With a tie there is no reason to favour class 0; softmax treats equal scores equally.", "При равенстве нет причины выделять класс 0; softmax одинаково обходится с равными оценками."],
        ], "Equal scores give equal exp values, so each probability is 1/3; the loss would be ln 3 ≈ 1.1.", "Равные оценки дают равные exp, поэтому каждая вероятность 1/3; потери были бы ln 3 ≈ 1.1."),
      ],
    ),
  ],
};
