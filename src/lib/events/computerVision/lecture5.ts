import { part, qx, tfx, type Lecture } from "../types";

export const lecture5: Lecture = {
  id: "cv-l5",
  title: { en: "Lecture 5 — Convolutional neural networks", ru: "Лекция 5 — Свёрточные нейронные сети" },
  parts: [
    part(
      "cv-l5-p1",
      { en: "Convolution: filters, output size, stride, padding and parameters", ru: "Свёртка: фильтры, размер выхода, stride, padding и параметры" },
      {
        en: `## Recap: a linear classifier on raw pixels
A CIFAR-10 image is **32×32×3**. The linear classifier **flattens** it into a vector **x** of **3 072** numbers and computes **f(x, W) = Wx + b**, giving **10 scores**, one per class.
= x: 32 · 32 · 3 = 3072
= W: 10 × 3072   b: 10   s = Wx + b: 10 scores
- It learns **one template per class**, and its decision boundaries are **linear**.
- In the course notebook it reaches only **≈ 25 %** on CIFAR-10: better than **10 %** random guessing, but far from useful.
## Why flattening is a problem
- **Spatial neighbourhood is thrown away**: pixels (i, j) and (i, j + 1) become two unrelated inputs.
- **A shifted object looks like a completely different vector**: move a cat by a few pixels and almost every input number changes.
- **Fully connected layers do not scale** with image size: every hidden unit has one weight per input number.
| Input | Hidden units | Weights in the first layer |
|---|---|---|
| 32×32×3 (CIFAR) | 1 000 | 3 072 000 |
| 224×224×3 (ImageNet) | 1 000 | 150 528 000 |
| 1000×1000×3 (photo) | 1 000 | 3 000 000 000 |
We need a layer that **respects the 2D structure** and uses **few parameters**.
## Three ideas behind CNNs
- **Local connectivity**: each unit looks at a **small patch** (e.g. 3×3), not at the whole image.
- **Weight sharing**: the **same filter** slides over all positions, because a feature useful in one place (an edge) is useful everywhere.
- **Hierarchy**: stacked layers turn **edges → textures → parts → objects**.
Result: **far fewer parameters**, **translation equivariance** (a shifted object gives a shifted feature map) and **features learned from data** instead of designed by hand.
## Convolution: sliding a filter over the image
Put a **3×3 filter (kernel)** on the top-left corner of the input, multiply the 9 overlapping pairs and **sum** them (plus a bias): that is one output number. Then move the filter one pixel to the right and repeat, row by row.
= out[i, j] = Σ_u Σ_v K[u, v] · in[i + u, j + v] + b
- A **5×5 input** and a **3×3 filter** (stride 1, no padding) give a **3×3 output**: the filter fits in 3 positions per row and 3 per column.
- Deep-learning libraries actually compute **cross-correlation** (the filter is not flipped), but everyone calls it convolution.
@diagram cv-convolution
## Worked example: one output value
Patch rows [3, 1, 0], [2, 1, 0], [4, 2, 1]; filter rows [1, 0, −1] three times: a **vertical-edge filter**. Multiply element by element and add:
= row 1: 3·1 + 1·0 + 0·(−1) = 3
= row 2: 2·1 + 1·0 + 0·(−1) = 2
= row 3: 4·1 + 2·0 + 1·(−1) = 3
= out = 3 + 2 + 3 = 8
A **large positive** value means **bright on the left, dark on the right**: there is a vertical edge here. A value near **0** means a flat patch; a **large negative** value means dark on the left, bright on the right. Each filter answers one question: **is my pattern here?**
## Hand-designed vs learned filters
| Filter | Weights | Responds to |
|---|---|---|
| Blur (box) | all nine weights 1/9 | averages the neighbourhood, smooths noise |
| Sobel-x | [−1 0 1; −2 0 2; −1 0 1] | vertical edges (brightness changes along x) |
| Sobel-y | Sobel-x turned by 90° | horizontal edges (brightness changes along y) |
Before deep learning such filters were **designed by hand**. The CNN idea: **do not design the numbers, learn them by gradient descent**, so the network finds the filters that are best for the task.
## Convolution on a colour image
A filter always **extends through the full depth** of its input. On a **32×32×3** image a ‘5×5 filter’ is really a **5×5×3** block of weights.
= one filter: 5 · 5 · 3 = 75 weights + 1 bias = 76 parameters
= 32×32×3 input, one 5×5×3 filter, S = 1, P = 0  →  28×28×1 activation map
- At every position: **one dot product over 75 numbers + bias** gives one number.
- Sliding **one filter** over the whole image gives **one 2D activation map (feature map)**.
## Many filters give an output volume
- **6 filters** of 5×5×3 give 6 maps, stacked into an output volume **28×28×6**.
- **Output depth = number of filters**: a hyperparameter you choose (typically 32, 64, 128, growing with depth).
- The next conv layer takes the 28×28×6 volume as its input, so each of its filters has depth **6** (e.g. 3×3×6).
## Output size: stride and padding
= O = ⌊(W − K + 2P) / S⌋ + 1
**W** = input size, **K** = filter size (often written F), **P** = padding, **S** = stride. Height and width are computed separately.
| W | K | S | P | Output O |
|---|---|---|---|---|
| 7 | 3 | 1 | 0 | (7 − 3)/1 + 1 = 5 |
| 7 | 3 | 2 | 0 | (7 − 3)/2 + 1 = 3 |
| 7 | 3 | 3 | 0 | (7 − 3)/3 + 1 = 2.33: does not fit |
| 32 | 5 | 1 | 0 | (32 − 5)/1 + 1 = 28 |
| 32 | 5 | 1 | 2 | (32 − 5 + 4)/1 + 1 = 32 |
- **Stride S > 1** skips positions and **downsamples** the map (S = 2 roughly halves it).
- Always check that **(W − K + 2P) is divisible by S**; if not, change K, P or S.
- **Zero padding** adds a border of P zeros around the input: a 5×5 input with P = 1 becomes 7×7.
- Without padding the map **shrinks at every layer**, and border pixels are used less often than central ones.
- **Same padding**: P = (K − 1)/2 keeps O = W when S = 1, so **3×3 uses P = 1** and **5×5 uses P = 2**.
## Counting parameters
= conv: C_out · (C_in · K · K + 1)
= FC: inputs · outputs + outputs
The **+1** is the **bias** of each filter. A conv layer's parameter count **does not depend on the image size**, only on K, C_in and C_out.
| Layer | Computation | Parameters |
|---|---|---|
| Conv 5×5, 3 → 10 | 10 · (3·25 + 1) | 760 |
| Conv 3×3, 64 → 128 | 128 · (64·9 + 1) | 73 856 |
| FC 3072 → 10 | 3072·10 + 10 | 30 730 |
| FC 3072 → 1000 | 3072·1000 + 1000 | 3 073 000 |
Worked example from the slides: a **32×32×3** input, **ten 5×5 filters**, **S = 1**, **P = 2**.
= spatial size: (32 − 5 + 2·2) / 1 + 1 = 32
= output: 32 × 32 × 10
= parameters: 10 · (5·5·3 + 1) = 10 · 76 = 760
The 3×3 conv with 64 → 128 channels has about **40× fewer** parameters than one FC layer from a CIFAR image to 1 000 units, and it works at **any resolution**.
> A conv layer slides small shared filters through the full input depth: output size ⌊(W − K + 2P)/S⌋ + 1, output depth = number of filters, parameters = C_out · (C_in · K² + 1).
## Check yourself
?? An input is 64×64×3. A conv layer has 16 filters of size 3×3 with stride 1 and padding 1. Give the output shape and the number of parameters.
?= (64 − 3 + 2·1)/1 + 1 = 64, so the output is 64×64×16; parameters = 16 · (3·3·3 + 1) = 16 · 28 = 448.
?? A student says: ‘A fully connected layer works just as well on images, it only needs more memory.’ Give two reasons why a conv layer is better.
?= Flattening throws away the 2D neighbourhood, so a shifted object becomes a different vector, while a conv layer keeps the spatial structure and just shifts its feature map (translation equivariance). FC weights grow with the image size (3 072 000 for 32×32×3 → 1 000 units), whereas conv parameters depend only on K, C_in and C_out thanks to local connectivity and weight sharing.`,
        ru: `## Напоминание: линейный классификатор на «сырых» пикселях
Изображение CIFAR-10 имеет размер **32×32×3**. Линейный классификатор **вытягивает (flatten)** его в вектор **x** из **3 072** чисел и считает **f(x, W) = Wx + b** — получается **10 scores (оценок)**, по одной на класс.
= x: 32 · 32 · 3 = 3072
= W: 10 × 3072   b: 10   s = Wx + b: 10 scores
- Он учит **один шаблон (template) на класс**, а его границы решений (decision boundaries) **линейные**.
- В ноутбуке курса он даёт всего **≈ 25 %** на CIFAR-10: лучше случайного угадывания (**10 %**), но до пользы далеко.
## Почему вытягивание в вектор — проблема
- **Теряется пространственное соседство**: пиксели (i, j) и (i, j + 1) становятся двумя несвязанными входами.
- **Сдвинутый объект выглядит как совсем другой вектор**: сдвиньте кошку на пару пикселей — и поменяются почти все входные числа.
- **Полносвязные (fully connected, FC) слои не масштабируются** с размером изображения: у каждого скрытого нейрона по одному весу на каждое входное число.
| Вход | Скрытых нейронов | Весов в первом слое |
|---|---|---|
| 32×32×3 (CIFAR) | 1 000 | 3 072 000 |
| 224×224×3 (ImageNet) | 1 000 | 150 528 000 |
| 1000×1000×3 (фото) | 1 000 | 3 000 000 000 |
Нужен слой, который **учитывает двумерную структуру** и обходится **малым числом параметров**.
## Три идеи, на которых стоят CNN
- **Local connectivity (локальная связность)**: каждый нейрон смотрит на **маленький участок** (например, 3×3), а не на всё изображение.
- **Weight sharing (общие веса)**: **один и тот же фильтр** скользит по всем позициям, потому что признак, полезный в одном месте (край), полезен везде.
- **Hierarchy (иерархия)**: слои друг над другом превращают **края → текстуры → части → объекты**.
Итог: **гораздо меньше параметров**, **translation equivariance (эквивариантность к сдвигу)** — сдвинутый объект даёт сдвинутую карту признаков — и **признаки, выученные из данных**, а не придуманные вручную.
## Свёртка: фильтр скользит по изображению
Кладём **фильтр (kernel) 3×3** на левый верхний угол входа, перемножаем 9 пар чисел, лежащих друг над другом, и **складываем** (плюс bias): получаем одно выходное число. Потом сдвигаем фильтр на пиксель вправо и повторяем, строка за строкой.
= out[i, j] = Σ_u Σ_v K[u, v] · in[i + u, j + v] + b
- **Вход 5×5** и **фильтр 3×3** (stride 1, без padding) дают **выход 3×3**: фильтр помещается в 3 позиции по строке и в 3 по столбцу.
- Библиотеки глубокого обучения на самом деле считают **cross-correlation (взаимную корреляцию)** — фильтр не переворачивается, — но все называют это свёрткой.
@diagram cv-convolution
## Разбор: одно выходное значение
Строки участка [3, 1, 0], [2, 1, 0], [4, 2, 1]; строки фильтра — трижды [1, 0, −1]: это **фильтр вертикального края**. Перемножаем поэлементно и складываем:
= row 1: 3·1 + 1·0 + 0·(−1) = 3
= row 2: 2·1 + 1·0 + 0·(−1) = 2
= row 3: 4·1 + 2·0 + 1·(−1) = 3
= out = 3 + 2 + 3 = 8
**Большое положительное** значение — **слева светло, справа темно**: здесь вертикальный край. Значение около **0** — ровный участок; **большое отрицательное** — слева темно, справа светло. Каждый фильтр отвечает на один вопрос: **есть ли здесь мой узор?**
## Фильтры: придуманные вручную и выученные
| Фильтр | Веса | На что реагирует |
|---|---|---|
| Blur (box, размытие) | все девять весов по 1/9 | усредняет окрестность, сглаживает шум |
| Sobel-x | [−1 0 1; −2 0 2; −1 0 1] | вертикальные края (яркость меняется вдоль x) |
| Sobel-y | Sobel-x, повёрнутый на 90° | горизонтальные края (яркость меняется вдоль y) |
До глубокого обучения такие фильтры **придумывали вручную**. Идея CNN: **не придумывать числа, а выучить их градиентным спуском (gradient descent)**, чтобы сеть сама нашла фильтры, лучшие для задачи.
## Свёртка цветного изображения
Фильтр всегда **проходит через всю глубину** входа. На изображении **32×32×3** «фильтр 5×5» на самом деле — блок весов **5×5×3**.
= one filter: 5 · 5 · 3 = 75 weights + 1 bias = 76 parameters
= 32×32×3 input, one 5×5×3 filter, S = 1, P = 0  →  28×28×1 activation map
- В каждой позиции: **одно скалярное произведение (dot product) по 75 числам + bias** даёт одно число.
- **Один фильтр**, проведённый по всему изображению, даёт **одну двумерную карту активаций (activation map, feature map)**.
## Много фильтров — выходной объём
- **6 фильтров** 5×5×3 дают 6 карт, сложенных в выходной объём (volume) **28×28×6**.
- **Глубина выхода = число фильтров**: это гиперпараметр, его выбираете вы (обычно 32, 64, 128, и оно растёт с глубиной сети).
- Следующий свёрточный слой получает объём 28×28×6 на вход, поэтому глубина каждого его фильтра — **6** (например, 3×3×6).
## Размер выхода: stride и padding
= O = ⌊(W − K + 2P) / S⌋ + 1
**W** — размер входа, **K** — размер фильтра (часто пишут F), **P** — padding (дополнение), **S** — stride (шаг). Высоту и ширину считают отдельно.
| W | K | S | P | Выход O |
|---|---|---|---|---|
| 7 | 3 | 1 | 0 | (7 − 3)/1 + 1 = 5 |
| 7 | 3 | 2 | 0 | (7 − 3)/2 + 1 = 3 |
| 7 | 3 | 3 | 0 | (7 − 3)/3 + 1 = 2.33: не помещается |
| 32 | 5 | 1 | 0 | (32 − 5)/1 + 1 = 28 |
| 32 | 5 | 1 | 2 | (32 − 5 + 4)/1 + 1 = 32 |
- **Stride S > 1** перескакивает позиции и **уменьшает (downsample)** карту (S = 2 — примерно вдвое).
- Всегда проверяйте, что **(W − K + 2P) делится на S**; если нет — меняйте K, P или S.
- **Zero padding** добавляет вокруг входа рамку из P нулей: вход 5×5 при P = 1 становится 7×7.
- Без padding карта **уменьшается на каждом слое**, а пиксели на краях участвуют реже центральных.
- **Same padding**: P = (K − 1)/2 сохраняет O = W при S = 1, поэтому **для 3×3 берут P = 1**, а **для 5×5 — P = 2**.
## Считаем параметры
= conv: C_out · (C_in · K · K + 1)
= FC: inputs · outputs + outputs
**+1** — это **bias** каждого фильтра. Число параметров свёрточного слоя **не зависит от размера изображения** — только от K, C_in и C_out.
| Слой | Вычисление | Параметров |
|---|---|---|
| Conv 5×5, 3 → 10 | 10 · (3·25 + 1) | 760 |
| Conv 3×3, 64 → 128 | 128 · (64·9 + 1) | 73 856 |
| FC 3072 → 10 | 3072·10 + 10 | 30 730 |
| FC 3072 → 1000 | 3072·1000 + 1000 | 3 073 000 |
Разбор со слайдов: вход **32×32×3**, **десять фильтров 5×5**, **S = 1**, **P = 2**.
= spatial size: (32 − 5 + 2·2) / 1 + 1 = 32
= output: 32 × 32 × 10
= parameters: 10 · (5·5·3 + 1) = 10 · 76 = 760
У свёртки 3×3 с 64 → 128 каналами примерно **в 40 раз меньше** параметров, чем у одного FC-слоя от картинки CIFAR к 1 000 нейронов, и она работает при **любом разрешении**.
> Свёрточный слой двигает маленькие общие фильтры через всю глубину входа: размер выхода ⌊(W − K + 2P)/S⌋ + 1, глубина выхода = число фильтров, параметры = C_out · (C_in · K² + 1).
## Проверь себя
?? Вход 64×64×3. Свёрточный слой: 16 фильтров 3×3, stride 1, padding 1. Найдите форму выхода и число параметров.
?= (64 − 3 + 2·1)/1 + 1 = 64, значит выход 64×64×16; параметров 16 · (3·3·3 + 1) = 16 · 28 = 448.
?? Студент говорит: «Полносвязный слой работает на изображениях не хуже, ему просто нужно больше памяти». Назовите две причины, почему свёрточный слой лучше.
?= Вытягивание в вектор теряет двумерное соседство, и сдвинутый объект становится другим вектором, а свёрточный слой сохраняет пространственную структуру и просто сдвигает карту признаков (translation equivariance). Веса FC растут с размером изображения (3 072 000 для 32×32×3 → 1 000 нейронов), а параметры свёртки зависят только от K, C_in и C_out благодаря локальной связности и общим весам.`,
      },
      [
        qx("A CIFAR-10 image of size 32×32×3 is flattened for a linear classifier. How many numbers does the vector x have?", "3 072", [
          ["1 024", "1 024 = 32 · 32 counts one channel only; the three colour channels make it 32 · 32 · 3 = 3 072.", "1 024 = 32 · 32 — это только один канал; с тремя цветовыми каналами выходит 32 · 32 · 3 = 3 072."],
          ["96", "96 = 32 · 3 multiplies only one side by the channels; every pixel of the 32 × 32 grid has 3 values.", "96 = 32 · 3 — на каналы умножена только одна сторона; у каждого пикселя сетки 32 × 32 по 3 значения."],
          ["9 216", "9 216 = 96 · 96 does not describe this image; the length is height · width · channels = 3 072.", "9 216 = 96 · 96 не описывает это изображение; длина вектора — высота · ширина · каналы = 3 072."],
        ], "Flattening keeps every number: 32 · 32 · 3 = 3 072, which is why W has shape 10 × 3 072 for CIFAR-10.", "При вытягивании сохраняется каждое число: 32 · 32 · 3 = 3 072, поэтому для CIFAR-10 у W форма 10 × 3 072."),
        qx("Which problem of flattening an image into a vector does the lecture point out?", "A shifted object becomes a completely different vector", [
          ["The image loses its three colour channels", "Flattening keeps all 3 072 numbers, including all three channels; colour is not lost.", "Вытягивание сохраняет все 3 072 числа, включая все три канала; цвет не теряется."],
          ["Pixel values get rescaled to [0, 1] and lose precision", "Flattening only reorders the numbers; scaling to [0, 1] is a separate preprocessing step.", "Вытягивание лишь переставляет числа; масштабирование в [0, 1] — отдельный шаг предобработки."],
          ["The number of classes must equal the number of pixels", "The number of classes (10) is set by the rows of W, not by the number of pixels.", "Число классов (10) задаётся строками W, а не числом пикселей."],
        ], "Flattening throws away the neighbourhood: pixels (i, j) and (i, j + 1) become unrelated inputs, so a small shift changes almost every input.", "Вытягивание выбрасывает соседство: пиксели (i, j) и (i, j + 1) становятся несвязанными входами, поэтому небольшой сдвиг меняет почти все входы."),
        qx("An FC layer maps a 224×224×3 image to 1 000 hidden units. How many weights does it have (biases not counted)?", "150 528 000", [
          ["150 528", "150 528 is the number of inputs; each of the 1 000 units needs its own weight for every input.", "150 528 — это число входов; каждому из 1 000 нейронов нужен свой вес на каждый вход."],
          ["3 072 000", "3 072 000 is the CIFAR case (32 · 32 · 3 · 1 000), not a 224 × 224 image.", "3 072 000 — это случай CIFAR (32 · 32 · 3 · 1 000), а не изображение 224 × 224."],
          ["50 176 000", "50 176 000 = 224 · 224 · 1 000 forgets the three colour channels.", "50 176 000 = 224 · 224 · 1 000 — забыты три цветовых канала."],
        ], "224 · 224 · 3 = 150 528 inputs, times 1 000 units = 150 528 000 weights: FC layers do not scale with image size.", "224 · 224 · 3 = 150 528 входов, умножить на 1 000 нейронов = 150 528 000 весов: FC-слои не масштабируются с размером изображения."),
        qx("Which three ideas does the lecture name as the basis of convolutional networks?", "Local connectivity, weight sharing, hierarchy", [
          ["Full connectivity, dropout, softmax output", "Full connectivity is exactly what CNNs avoid; dropout and softmax are not the founding ideas.", "Полная связность — именно то, чего CNN избегают; dropout и softmax — не основополагающие идеи."],
          ["Flattening, one template per class, linear boundaries", "These describe the linear classifier that CNNs are meant to improve on.", "Это описание линейного классификатора, который CNN как раз должны превзойти."],
          ["Pooling, batch norm, residual connections", "These are later building blocks; the three ideas are about how a conv layer connects and shares weights.", "Это более поздние строительные блоки; три идеи — о том, как свёрточный слой связан и как делит веса."],
        ], "CNNs rest on local connectivity (small patches), weight sharing (the same filter everywhere) and hierarchy (edges → textures → parts → objects).", "CNN стоят на локальной связности (маленькие участки), общих весах (один фильтр везде) и иерархии (края → текстуры → части → объекты)."),
        qx("Patch rows [2, 0, 1], [3, 1, 0], [4, 1, 2]; filter rows [1, 0, −1] three times; no bias. What is the output value?", "6", [
          ["−6", "−6 comes from subtracting the left column from the right; the filter multiplies the left column by +1.", "−6 получается, если вычесть левый столбец из правого; фильтр умножает левый столбец на +1."],
          ["9", "9 = 2 + 3 + 4 is only the left column; the right column (1, 0, 2) must be subtracted.", "9 = 2 + 3 + 4 — это только левый столбец; правый столбец (1, 0, 2) нужно вычесть."],
          ["3", "3 is only the middle row (3 − 0); the output sums all three rows: 1 + 3 + 2.", "3 — это только средняя строка (3 − 0); выход — сумма всех трёх строк: 1 + 3 + 2."],
        ], "Row by row: (2 − 1) + (3 − 0) + (4 − 2) = 1 + 3 + 2 = 6; the middle column is multiplied by 0.", "Построчно: (2 − 1) + (3 − 0) + (4 − 2) = 1 + 3 + 2 = 6; средний столбец умножается на 0."),
        qx("A vertical-edge filter with columns 1, 0, −1 gives a large positive output at one position. What does the image look like there?", "Bright on the left, dark on the right", [
          ["Dark on the left, bright on the right", "That pattern gives a large negative value, because the bright right column is multiplied by −1.", "Такой узор даёт большое отрицательное значение: яркий правый столбец умножается на −1."],
          ["A flat patch of equal brightness", "Equal brightness makes the +1 and −1 columns cancel, so the output is near 0.", "При одинаковой яркости столбцы +1 и −1 гасят друг друга, и выход около 0."],
          ["A horizontal edge, bright on top", "Columns 1, 0, −1 compare left with right; a horizontal edge needs a Sobel-y-like filter.", "Столбцы 1, 0, −1 сравнивают левое с правым; для горизонтального края нужен фильтр вроде Sobel-y."],
        ], "A positive output means the left column is brighter than the right one: a vertical edge from bright to dark. Each filter answers ‘is my pattern here?’.", "Положительный выход значит, что левый столбец ярче правого: вертикальный край от светлого к тёмному. Каждый фильтр отвечает на вопрос «есть ли здесь мой узор?»."),
        qx("Which hand-designed filter mainly responds to vertical edges?", "Sobel-x: [−1 0 1; −2 0 2; −1 0 1]", [
          ["Box blur: all nine weights equal to 1/9", "A box blur averages the neighbourhood and smooths edges instead of detecting them.", "Box blur усредняет окрестность и сглаживает края, а не находит их."],
          ["Sobel-y: Sobel-x turned by 90°", "Sobel-y compares the rows above and below, so it responds to horizontal edges.", "Sobel-y сравнивает строки сверху и снизу, поэтому реагирует на горизонтальные края."],
          ["Identity: 1 in the centre, 0 elsewhere", "The identity filter just copies each pixel; it does not compare neighbours at all.", "Единичный фильтр просто копирует пиксель; он вообще не сравнивает соседей."],
        ], "Sobel-x subtracts the left column from the right one (with weight 2 in the middle row), so it fires where brightness changes along x: on vertical edges.", "Sobel-x вычитает левый столбец из правого (с весом 2 в средней строке), поэтому срабатывает там, где яркость меняется вдоль x: на вертикальных краях."),
        qx("What is the central idea of CNNs about the numbers inside the filters?", "Learn them from data by gradient descent", [
          ["Copy them from the Sobel and blur kernels", "Hand-designed kernels were the pre-deep-learning approach; CNNs treat filter values as trainable parameters.", "Придуманные вручную ядра — подход до глубокого обучения; в CNN значения фильтров — обучаемые параметры."],
          ["Draw them at random and keep them fixed", "Random filters are only the starting point; training then updates them with gradients.", "Случайные фильтры — лишь начальная точка; затем обучение меняет их по градиентам."],
          ["Set them by hand for each new dataset", "Designing numbers per dataset is exactly what CNNs avoid; the network finds the best filters itself.", "Подбирать числа вручную под каждый датасет — именно то, чего CNN избегают; сеть сама находит лучшие фильтры."],
        ], "Do not design the numbers: treat them as parameters and learn them by gradient descent, so the network finds the filters best for the task.", "Не придумывать числа, а считать их параметрами и учить градиентным спуском, чтобы сеть сама нашла лучшие для задачи фильтры."),
        qx("A conv layer gets a 32×32×3 image and uses 5×5 filters. What is the real shape of one filter?", "5×5×3", [
          ["5×5×1", "A filter always extends through the full input depth; a 1-channel filter would ignore two colour channels.", "Фильтр всегда проходит через всю глубину входа; одноканальный фильтр игнорировал бы два цветовых канала."],
          ["5×5×32", "32 is the image width, not its depth; the filter depth matches the 3 input channels.", "32 — это ширина изображения, а не глубина; глубина фильтра равна 3 входным каналам."],
          ["3×3×5", "The filter is 5×5 in space and 3 deep, so the shape is 5×5×3.", "Фильтр 5×5 по пространству и глубиной 3, поэтому форма 5×5×3."],
        ], "The filter extends through the full depth of the input: 5 · 5 · 3 = 75 weights plus 1 bias, one dot product per position.", "Фильтр проходит через всю глубину входа: 5 · 5 · 3 = 75 весов плюс 1 bias, одно скалярное произведение на позицию."),
        qx("Input 32×32×3, six 5×5×3 filters, stride 1, no padding. What is the output volume?", "28×28×6", [
          ["32×32×6", "32×32 would need padding P = 2; without padding (32 − 5)/1 + 1 = 28.", "32×32 потребовало бы padding P = 2; без padding (32 − 5)/1 + 1 = 28."],
          ["28×28×3", "The output depth equals the number of filters (6), not the number of input channels.", "Глубина выхода равна числу фильтров (6), а не числу входных каналов."],
          ["27×27×6", "27 forgets the +1 in the formula: (32 − 5)/1 + 1 = 28.", "27 — забыто +1 в формуле: (32 − 5)/1 + 1 = 28."],
        ], "Each filter gives one 28×28 map ((32 − 5)/1 + 1 = 28), and six filters stack into 28×28×6.", "Каждый фильтр даёт одну карту 28×28 ((32 − 5)/1 + 1 = 28), а шесть фильтров складываются в 28×28×6."),
        qx("A conv layer outputs 28×28×6. The next conv layer uses 3×3 filters. What depth must each of its filters have?", "6", [
          ["3", "3 is the depth of the original RGB image; this layer's input has 6 channels.", "3 — глубина исходного цветного изображения; у входа этого слоя 6 каналов."],
          ["1", "A depth-1 filter would read only one of the six maps; filters span the full input depth.", "Фильтр глубины 1 читал бы только одну из шести карт; фильтры проходят через всю глубину входа."],
          ["28", "28 is the spatial size of the maps, not their number.", "28 — пространственный размер карт, а не их число."],
        ], "The 28×28×6 volume is the new input, like an image with 6 channels, so each filter is 3×3×6.", "Объём 28×28×6 — новый вход, как изображение с 6 каналами, поэтому каждый фильтр — 3×3×6."),
        qx("Input 7×7, filter 3×3, stride 2, no padding. What is the output size?", "3×3", [
          ["5×5", "5×5 is the result for stride 1; stride 2 gives (7 − 3)/2 + 1 = 3.", "5×5 — результат для stride 1; stride 2 даёт (7 − 3)/2 + 1 = 3."],
          ["2×2", "2 forgets the +1: (7 − 3)/2 = 2, then add 1.", "2 — забыто +1: (7 − 3)/2 = 2, затем нужно прибавить 1."],
          ["4×4", "4 is (7 − 3) without dividing by the stride and without the +1.", "4 — это (7 − 3) без деления на stride и без +1."],
        ], "O = (W − K + 2P)/S + 1 = (7 − 3 + 0)/2 + 1 = 3, so the output is 3×3.", "O = (W − K + 2P)/S + 1 = (7 − 3 + 0)/2 + 1 = 3, значит выход 3×3."),
        qx("Input 7×7, filter 3×3, stride 3, padding 0. What happens?", "It does not fit evenly: change K, P or S", [
          ["Output is 3×3, the same as with stride 2", "With stride 3, (7 − 3)/3 = 1.33 is not an integer, so the stride-2 answer does not carry over.", "При stride 3 (7 − 3)/3 = 1.33 — не целое, поэтому ответ для stride 2 не подходит."],
          ["Output is 5×5, because stride does not change the size", "Stride does change the size: it skips positions and downsamples the map.", "Stride меняет размер: он перескакивает позиции и уменьшает карту."],
          ["Output is 1×1, the filter covers the whole image", "A 3×3 filter cannot cover a 7×7 image in one position.", "Фильтр 3×3 не может накрыть изображение 7×7 в одной позиции."],
        ], "(7 − 3)/3 + 1 = 2.33 is not an integer, so the filter does not fit; always check that (W − K + 2P) is divisible by S.", "(7 − 3)/3 + 1 = 2.33 — не целое, фильтр не помещается; всегда проверяйте, что (W − K + 2P) делится на S."),
        qx("A 3×3 conv with stride 1 must keep a 32×32 map at 32×32. Which padding is needed?", "P = 1", [
          ["P = 0", "Without padding the map shrinks: (32 − 3)/1 + 1 = 30.", "Без padding карта уменьшается: (32 − 3)/1 + 1 = 30."],
          ["P = 2", "P = 2 is same padding for 5×5 filters; with 3×3 it gives 34×34.", "P = 2 — same padding для фильтров 5×5; с 3×3 получится 34×34."],
          ["P = 3", "P = 3 would grow the map to (32 − 3 + 6)/1 + 1 = 36.", "P = 3 увеличило бы карту до (32 − 3 + 6)/1 + 1 = 36."],
        ], "Same padding P = (K − 1)/2 = (3 − 1)/2 = 1: (32 − 3 + 2)/1 + 1 = 32.", "Same padding: P = (K − 1)/2 = (3 − 1)/2 = 1, тогда (32 − 3 + 2)/1 + 1 = 32 — размер сохраняется."),
        qx("How many learnable parameters does a conv layer with ten 5×5 filters on a 3-channel input have?", "760", [
          ["750", "750 = 10 · 75 forgets the bias of each filter (+1 per filter).", "750 = 10 · 75 — забыт bias каждого фильтра (+1 на фильтр)."],
          ["260", "260 = 10 · (25 + 1) forgets that each filter spans all 3 input channels.", "260 = 10 · (25 + 1) — забыто, что каждый фильтр проходит через все 3 входных канала."],
          ["76", "76 is one filter (75 weights + 1 bias); there are ten filters.", "76 — это один фильтр (75 весов + 1 bias); а фильтров десять."],
        ], "C_out · (C_in · K² + 1) = 10 · (3 · 25 + 1) = 10 · 76 = 760, whatever the image size.", "C_out · (C_in · K² + 1) = 10 · (3 · 25 + 1) = 10 · 76 = 760 при любом размере изображения."),
        qx("A 3×3 conv layer maps 64 input channels to 128 output channels. How many parameters does it have, biases included?", "73 856", [
          ["73 728", "73 728 = 128 · 64 · 9 forgets the 128 biases.", "73 728 = 128 · 64 · 9 — забыты 128 bias."],
          ["1 280", "1 280 = 128 · (9 + 1) forgets that each filter spans all 64 input channels.", "1 280 = 128 · (9 + 1) — забыто, что каждый фильтр проходит через все 64 входных канала."],
          ["8 320", "8 320 = 128 · (64 + 1) is a 1×1 conv; a 3×3 filter has 9 weights per channel.", "8 320 = 128 · (64 + 1) — это свёртка 1×1; у фильтра 3×3 по 9 весов на канал."],
        ], "128 · (64 · 9 + 1) = 128 · 577 = 73 856, about 40× fewer than an FC layer from a CIFAR image to 1 000 units (3 073 000).", "128 · (64 · 9 + 1) = 128 · 577 = 73 856 — примерно в 40 раз меньше, чем у FC-слоя от картинки CIFAR к 1 000 нейронов (3 073 000)."),
        tfx("The number of parameters of a conv layer grows when the input image gets larger.", false, "Conv parameters are C_out · (C_in · K² + 1): they depend on the filter size and the channel counts, not on the image height and width.", "Параметры свёртки — C_out · (C_in · K² + 1): они зависят от размера фильтра и числа каналов, а не от высоты и ширины изображения.", "Choosing True mixes conv layers up with FC layers, whose weights really do grow with the number of input pixels.", "Ответ True путает свёрточные слои с FC-слоями, у которых веса действительно растут с числом входных пикселей."),
        qx("Why can the same 3×3 conv layer run on 32×32 and on 224×224 images, while an FC layer built for 3 072 inputs cannot?", "Its weights depend only on K, C_in and C_out", [
          ["It resizes every input to 32×32 first", "A conv layer does not resize anything; it simply slides over however many positions there are.", "Свёрточный слой ничего не масштабирует; он просто проходит по всем имеющимся позициям."],
          ["It has more parameters than the FC layer", "It has far fewer parameters, and that is not why it accepts any size.", "У него параметров гораздо меньше, и не поэтому он принимает любой размер."],
          ["Padding adds zeros until both input sizes match", "Padding adds a thin border of P zeros; it does not stretch a 32×32 input to 224×224.", "Padding добавляет тонкую рамку из P нулей; он не растягивает вход 32×32 до 224×224."],
        ], "The shared filter is slid over every position, so a bigger image just gives a bigger feature map; the FC weight matrix is fixed to exactly 3 072 inputs.", "Общий фильтр проходит по всем позициям, поэтому большее изображение просто даёт большую карту признаков; матрица весов FC жёстко рассчитана на 3 072 входа."),
        qx("A student says: ‘Without padding we can stack as many conv layers as we like.’ What is wrong with this?", "The map shrinks each layer; borders are underused", [
          ["Without padding the output depth shrinks", "Depth is set by the number of filters; padding affects only height and width.", "Глубину задаёт число фильтров; padding влияет только на высоту и ширину."],
          ["Without padding the stride must be at least 2 to fit the filter", "Stride and padding are independent hyperparameters; stride 1 without padding is valid.", "Stride и padding — независимые гиперпараметры; stride 1 без padding вполне допустим."],
          ["Unpadded layers have more parameters", "Padding does not change the parameter count C_out · (C_in · K² + 1).", "Padding не меняет число параметров C_out · (C_in · K² + 1)."],
        ], "Each unpadded 3×3 layer cuts 2 pixels (32 → 30 → 28 …), and border pixels are used less often than central ones; same padding P = (K − 1)/2 fixes both.", "Каждый слой 3×3 без padding отрезает 2 пикселя (32 → 30 → 28 …), а краевые пиксели используются реже центральных; same padding P = (K − 1)/2 решает обе проблемы."),
        tfx("Deep-learning libraries flip the filter before sliding it, exactly as in the mathematical definition of convolution.", false, "Libraries compute cross-correlation: the filter is slid without flipping, but everyone still calls the operation convolution.", "Библиотеки считают взаимную корреляцию (cross-correlation): фильтр двигают без переворота, но операцию всё равно называют свёрткой.", "Choosing True ignores the remark on the slide; and since the filters are learned, a flip would change nothing important anyway.", "Ответ True противоречит замечанию на слайде; к тому же фильтры обучаются, так что переворот ничего важного не изменил бы."),
      ],
    ),
    part(
      "cv-l5-p2",
      { en: "Building a CNN: feature maps, pooling, ReLU, batch norm and training", ru: "Как устроена CNN: карты признаков, pooling, ReLU, batch norm и обучение" },
      {
        en: `## Fully connected vs convolutional
| Property | Fully connected | Convolutional |
|---|---|---|
| Connectivity | every input to every unit | a local K×K window |
| Weights | one per connection | shared across positions |
| Params grow with image size | yes | no |
| Spatial structure | lost | preserved |
| Shifted object | a different input | a shifted feature map |
The last row is **translation equivariance**: shift the input, and the feature map shifts the same way.
## What filters are learned?
- The course notebook shows the **sixteen 3×3×3 filters** of the **first layer** of a CNN trained on CIFAR-10. Drawn as tiny colour images they look like **oriented edges and colour contrasts**: nobody programmed them, they emerged from the data because they help classification.
- **Deeper layers** combine these simple patterns into **textures** and then into **object parts**.
- A **feature map** is one channel of a layer's output: **bright = strong filter response**. For a ship image some layer-1 maps (after ReLU) light up on the hull outline, some on the sky–water boundary, some on textures.
![A small photo of a white cargo ship on blue sea under a pale sky on the left; to its right a grid of eight grayscale panels of the same ship, each lighting up a different pattern in white on black: the hull outline, the horizon line between sky and water, the wave texture, the vertical edges of the masts](/events/cv/l5-ship-feature-maps.webp)
## Receptive field
The **receptive field (RF)** of a unit is the region of the **input image** that influences it.
= RF = 1 + L · (K − 1)      (stride 1, L layers of K×K)
= 1 layer of 3×3:  1 + 1 · 2 = 3  →  3×3
= 2 layers of 3×3: 1 + 2 · 2 = 5  →  5×5
= 3 layers of 3×3: 1 + 3 · 2 = 7  →  7×7
- In 1D: a top unit sees 3 units below it, and together they see 5 inputs.
- **Stride and pooling** make the RF grow faster.
- That is why a deep network recognizes **large objects** although every filter is small.
## Max pooling
Split each feature map into **non-overlapping 2×2 blocks** (stride 2) and keep the **maximum** of each block.
= input 4×4, rows: [1 1 2 4]  [5 6 7 8]  [3 2 1 0]  [1 2 3 4]
= top-left:    max(1, 1, 5, 6) = 6     top-right:    max(2, 4, 7, 8) = 8
= bottom-left: max(3, 2, 1, 2) = 3     bottom-right: max(1, 0, 3, 4) = 4
= output 2×2: [6 8]  [3 4]
@diagram cv-pooling
- **No learnable parameters**: pooling is a fixed rule.
- Applied to **each channel independently**, so the depth does not change: 32×32×64 → 16×16×64.
- Gives a **small shift invariance**: moving a feature by one pixel inside the window does not change the maximum.
| Operation | Output | Where used |
|---|---|---|
| Max pool 2×2, S = 2 | H/2 × W/2 | LeNet, AlexNet, VGG |
| Average pool | smoothed H/2 × W/2 | LeNet (subsampling), Inception |
| Global average pool | 1×1×C | GoogLeNet, ResNet (before the classifier) |
| Stride-2 convolution | H/2 × W/2 | ResNet, modern all-conv nets |
**Global average pooling** averages each whole channel into one number: **7×7×512 → 512 numbers**, which removes the huge FC layers. Modern nets often use a **stride-2 convolution** instead of pooling, so that the downsampling is also **learned**.
## Non-linearity: ReLU
= f(x) = max(0, x)
= gradient: 1 if x > 0, else 0
- Without a non-linearity, a stack of convolutions **collapses into one linear operation**.
- ReLU **does not saturate** for x > 0, is very cheap, and trains much faster than sigmoid or tanh (in AlexNet **≈ 6× faster**).
- Drawback: a unit whose input is always negative gets zero gradient and stops learning, a **dead ReLU**. Alternatives: **Leaky ReLU**, **GELU**.
## A typical CNN for classification
Repeat **Conv → ReLU → Pool**: the spatial size goes down, the number of channels goes up. Then flatten and classify.
| Layer | Output shape |
|---|---|
| Input | 32×32×3 |
| Conv (32 filters, same padding) + ReLU | 32×32×32 |
| Max pool 2×2 | 16×16×32 |
| Conv (64 filters, same padding) + ReLU | 16×16×64 |
| Max pool 2×2 | 8×8×64 |
| Flatten | 8 · 8 · 64 = 4096 |
| FC + ReLU | 128 |
| FC + softmax | 10 class probabilities |
The **conv / pool part** is the **feature extractor**; the **FC part** is the **classifier**.
## Batch normalization
= x̂ = (x − μ_B) / √(σ²_B + ε)
= y = γ · x̂ + β
- **μ_B, σ²_B**: mean and variance of **each channel** over the mini-batch (and over all spatial positions).
- **γ, β**: **learnable** scale and shift, so the layer can undo the normalization if that helps.
- Usual placement: **Conv → BN → ReLU**.
- **Training**: statistics of the current batch. **Test**: **running averages** collected during training.
- Effect: stable activations, **larger learning rates**, faster convergence, mild regularization.
Worked example for one channel: μ_B = 4, σ²_B = 4 (ε ≈ 0), γ = 3, β = 1, input x = 8.
= x̂ = (8 − 4) / √4 = 4 / 2 = 2
= y = 3 · 2 + 1 = 7
## Regularization in CNNs
A small dataset and many parameters lead to **overfitting**: high training accuracy, much lower test accuracy.
| Method | What it does | Where |
|---|---|---|
| Weight decay | adds the L2 penalty λ‖W‖² to the loss, keeps weights small | all layers |
| Dropout | zeroes units with probability p, during training only | mostly FC layers |
| Data augmentation | random flips, crops, colour jitter: new valid images for free | training images |
In the course notebook: **random horizontal flips + weight decay**; dropout was not needed for the small networks.
## Training a CNN
The same loop as for the linear classifier:
= mini-batch → CNN → scores → softmax cross-entropy loss L
= backprop: ∂L/∂W for every filter and weight
= update: W ← W − η · ∇W L
- Notebook: **SGD with momentum 0.9** and a **OneCycle** learning-rate schedule (warm-up, then decay).
- The gradients of a convolution are again convolutions (with flipped filters).
- **Monitor training vs test (validation) accuracy** to spot overfitting: a growing gap is the warning sign.
@diagram cv-overfitting
> A CNN repeats Conv → BN → ReLU → Pool to shrink space and grow channels, then classifies with FC + softmax; pooling has no weights, the receptive field grows with depth, and overfitting is fought with augmentation, weight decay and dropout.
## Check yourself
?? A 32×32×64 feature map goes through 2×2 max pooling with stride 2. What is the output shape, how many parameters does the layer have, and why is it used?
?= 16×16×64: height and width halve and the depth stays, because each channel is pooled independently; 0 parameters. It reduces computation, makes the receptive field grow faster and adds a small shift invariance.
?? A CNN reaches 95% training accuracy but 62% test accuracy on a small dataset. Name the problem and two remedies from this lecture.
?= Overfitting: the network memorizes the training images instead of generalizing. Use data augmentation (random flips, crops, colour jitter) and weight decay or dropout in the FC layers, and watch the validation accuracy to stop in time.`,
        ru: `## Полносвязный слой против свёрточного
| Свойство | Fully connected | Convolutional |
|---|---|---|
| Связи | каждый вход с каждым нейроном | локальное окно K×K |
| Веса | свой на каждую связь | общие для всех позиций |
| Параметры растут с размером изображения | да | нет |
| Пространственная структура | теряется | сохраняется |
| Сдвинутый объект | другой вход | сдвинутая карта признаков |
Последняя строка — это **translation equivariance (эквивариантность к сдвигу)**: сдвиньте вход, и карта признаков сдвинется так же.
## Какие фильтры выучиваются?
- В ноутбуке курса показаны **шестнадцать фильтров 3×3×3** **первого слоя** CNN, обученной на CIFAR-10. Нарисованные как крошечные цветные картинки, они похожи на **ориентированные края и цветовые контрасты**: их никто не программировал, они возникли из данных, потому что помогают классификации.
- **Более глубокие слои** собирают из этих простых узоров **текстуры**, а затем **части объектов**.
- **Карта признаков (feature map)** — один канал выхода слоя: **светлое = сильный отклик фильтра**. Для изображения корабля одни карты первого слоя (после ReLU) светятся на контуре корпуса, другие — на границе неба и воды, третьи — на текстурах.
![Слева небольшое фото белого грузового корабля на синем море под бледным небом; справа от него сетка из восьми серых панелей с тем же кораблём, на каждой белым по чёрному светится свой узор: контур корпуса, линия горизонта между небом и водой, текстура волн, вертикальные края мачт](/events/cv/l5-ship-feature-maps.webp)
## Рецептивное поле
**Рецептивное поле (receptive field, RF)** нейрона — это область **входного изображения**, которая на него влияет.
= RF = 1 + L · (K − 1)      (stride 1, L layers of K×K)
= 1 layer of 3×3:  1 + 1 · 2 = 3  →  3×3
= 2 layers of 3×3: 1 + 2 · 2 = 5  →  5×5
= 3 layers of 3×3: 1 + 3 · 2 = 7  →  7×7
- В 1D: верхний нейрон видит 3 нейрона под собой, а они вместе видят 5 входов.
- **Stride и pooling** заставляют RF расти быстрее.
- Поэтому глубокая сеть распознаёт **большие объекты**, хотя каждый фильтр маленький.
## Max pooling
Делим каждую карту признаков на **непересекающиеся блоки 2×2** (stride 2) и оставляем **максимум** каждого блока.
= input 4×4, rows: [1 1 2 4]  [5 6 7 8]  [3 2 1 0]  [1 2 3 4]
= top-left:    max(1, 1, 5, 6) = 6     top-right:    max(2, 4, 7, 8) = 8
= bottom-left: max(3, 2, 1, 2) = 3     bottom-right: max(1, 0, 3, 4) = 4
= output 2×2: [6 8]  [3 4]
@diagram cv-pooling
- **Нет обучаемых параметров**: pooling — фиксированное правило.
- Применяется **к каждому каналу отдельно**, поэтому глубина не меняется: 32×32×64 → 16×16×64.
- Даёт **небольшую инвариантность к сдвигу**: если признак сдвинулся на пиксель внутри окна, максимум не меняется.
| Операция | Выход | Где используется |
|---|---|---|
| Max pool 2×2, S = 2 | H/2 × W/2 | LeNet, AlexNet, VGG |
| Average pool | сглаженный H/2 × W/2 | LeNet (subsampling), Inception |
| Global average pool | 1×1×C | GoogLeNet, ResNet (перед классификатором) |
| Свёртка со stride 2 | H/2 × W/2 | ResNet, современные полностью свёрточные сети |
**Global average pooling** усредняет каждый канал целиком в одно число: **7×7×512 → 512 чисел** — и огромные FC-слои больше не нужны. Современные сети часто ставят **свёртку со stride 2** вместо pooling, чтобы уменьшение размера тоже **обучалось**.
## Нелинейность: ReLU
= f(x) = max(0, x)
= gradient: 1 if x > 0, else 0
- Без нелинейности стопка свёрток **схлопывается в одну линейную операцию**.
- ReLU **не насыщается** при x > 0, очень дешёвая и обучается намного быстрее sigmoid или tanh (в AlexNet **≈ в 6 раз**).
- Недостаток: нейрон, у которого вход всегда отрицательный, получает нулевой градиент и перестаёт учиться — это **dead ReLU («мёртвый» ReLU)**. Альтернативы: **Leaky ReLU**, **GELU**.
## Типичная CNN для классификации
Повторяем **Conv → ReLU → Pool**: пространственный размер уменьшается, число каналов растёт. Затем вытягиваем в вектор и классифицируем.
| Слой | Форма выхода |
|---|---|
| Вход | 32×32×3 |
| Conv (32 фильтра, same padding) + ReLU | 32×32×32 |
| Max pool 2×2 | 16×16×32 |
| Conv (64 фильтра, same padding) + ReLU | 16×16×64 |
| Max pool 2×2 | 8×8×64 |
| Flatten | 8 · 8 · 64 = 4096 |
| FC + ReLU | 128 |
| FC + softmax | вероятности 10 классов |
**Часть conv / pool** — это **извлекатель признаков (feature extractor)**; **FC-часть** — **классификатор**.
## Batch normalization
= x̂ = (x − μ_B) / √(σ²_B + ε)
= y = γ · x̂ + β
- **μ_B, σ²_B**: среднее и дисперсия **каждого канала** по мини-батчу (и по всем пространственным позициям).
- **γ, β**: **обучаемые** масштаб и сдвиг, чтобы слой мог отменить нормализацию, если это полезно.
- Обычное место: **Conv → BN → ReLU**.
- **Обучение**: статистика текущего батча. **Тест**: **скользящие средние (running averages)**, накопленные за обучение.
- Эффект: стабильные активации, **большие learning rate**, более быстрая сходимость, лёгкая регуляризация.
Разбор для одного канала: μ_B = 4, σ²_B = 4 (ε ≈ 0), γ = 3, β = 1, вход x = 8.
= x̂ = (8 − 4) / √4 = 4 / 2 = 2
= y = 3 · 2 + 1 = 7
## Регуляризация в CNN
Маленький датасет и много параметров ведут к **переобучению (overfitting)**: высокая точность на обучении и гораздо ниже на тесте.
| Метод | Что делает | Где |
|---|---|---|
| Weight decay | добавляет к loss L2-штраф λ‖W‖², держит веса маленькими | все слои |
| Dropout | обнуляет нейроны с вероятностью p, только при обучении | в основном FC-слои |
| Data augmentation | случайные отражения, обрезки, изменение цвета: новые правильные изображения бесплатно | обучающие изображения |
В ноутбуке курса: **случайные горизонтальные отражения + weight decay**; для маленьких сетей dropout не понадобился.
## Обучение CNN
Тот же цикл, что и для линейного классификатора:
= mini-batch → CNN → scores → softmax cross-entropy loss L
= backprop: ∂L/∂W for every filter and weight
= update: W ← W − η · ∇W L
- Ноутбук: **SGD с momentum 0.9** и расписание learning rate **OneCycle** (сначала разгон, затем спад).
- Градиенты свёртки — снова свёртки (с перевёрнутыми фильтрами).
- **Следите за точностью на обучении и на тесте (валидации)**, чтобы заметить переобучение: растущий разрыв — тревожный знак.
@diagram cv-overfitting
> CNN повторяет Conv → BN → ReLU → Pool, уменьшая пространство и наращивая каналы, а затем классифицирует через FC + softmax; у pooling нет весов, рецептивное поле растёт с глубиной, а с переобучением борются аугментацией, weight decay и dropout.
## Проверь себя
?? Карта признаков 32×32×64 проходит max pooling 2×2 со stride 2. Какая форма выхода, сколько параметров у слоя и зачем он нужен?
?= 16×16×64: высота и ширина уменьшаются вдвое, а глубина сохраняется, потому что каждый канал обрабатывается отдельно; параметров 0. Он сокращает вычисления, ускоряет рост рецептивного поля и даёт небольшую инвариантность к сдвигу.
?? CNN даёт 95% точности на обучении, но 62% на тесте на маленьком датасете. Назовите проблему и два способа борьбы из этой лекции.
?= Переобучение: сеть запоминает обучающие изображения вместо обобщения. Используйте аугментацию данных (случайные отражения, обрезки, изменение цвета) и weight decay или dropout в FC-слоях, а также следите за точностью на валидации, чтобы вовремя остановиться.`,
      },
      [
        qx("In a conv layer, what happens to the feature map when the object in the input moves 4 pixels to the right?", "It shifts 4 pixels to the right as well", [
          ["It stays exactly the same", "Staying the same would be invariance; a conv layer is equivariant: the response moves with the object.", "Если бы карта не менялась, это была бы инвариантность; свёртка эквивариантна: отклик сдвигается вместе с объектом."],
          ["It becomes a completely different vector", "That is what happens to a flattened input in an FC layer, not to a conv feature map.", "Так происходит с вытянутым входом в FC-слое, а не с картой признаков свёртки."],
          ["The layer must be retrained for the new position", "Weight sharing applies the same filter at every position, so no retraining is needed.", "Общие веса применяют один и тот же фильтр во всех позициях, переобучать ничего не нужно."],
        ], "Because the same filter is applied everywhere, a shifted object gives a shifted feature map: translation equivariance.", "Так как один и тот же фильтр применяется везде, сдвинутый объект даёт сдвинутую карту признаков: translation equivariance."),
        qx("The first-layer 3×3×3 filters of a CNN trained on CIFAR-10 are drawn as tiny images. What do they mostly show?", "Oriented edges and colour contrasts", [
          ["Whole objects such as ships and horses", "Whole objects appear only in much deeper layers, after edges are combined into parts.", "Целые объекты появляются только в гораздо более глубоких слоях, когда края собраны в части."],
          ["Pure random noise with no structure", "Even after short training the filters show clear structure; random noise is only the initialization.", "Даже после короткого обучения у фильтров видна структура; случайный шум — лишь инициализация."],
          ["Exact copies of Sobel kernels typed in by hand", "Nobody programmed them; the edge-like patterns emerged from the data.", "Их никто не программировал; узоры, похожие на края, возникли из данных."],
        ], "First-layer filters learn oriented edges and colour contrasts by themselves; deeper layers combine them into textures and object parts.", "Фильтры первого слоя сами выучивают ориентированные края и цветовые контрасты; более глубокие слои собирают из них текстуры и части объектов."),
        qx("Four 3×3 conv layers with stride 1 are stacked. What is the receptive field of one unit in the last layer?", "9×9", [
          ["7×7", "7×7 is the receptive field of three layers; each extra 3×3 layer adds 2.", "7×7 — рецептивное поле трёх слоёв; каждый следующий слой 3×3 добавляет 2."],
          ["12×12", "12 = 4 · 3 adds the full filter size per layer; neighbouring windows overlap, so each layer adds only K − 1 = 2.", "12 = 4 · 3 — добавлен полный размер фильтра на слой; соседние окна перекрываются, поэтому каждый слой добавляет только K − 1 = 2."],
          ["3×3", "3×3 is the receptive field of a single layer; stacking makes it grow.", "3×3 — рецептивное поле одного слоя; при наложении слоёв оно растёт."],
        ], "RF = 1 + L · (K − 1) = 1 + 4 · 2 = 9, so the unit sees a 9×9 region of the input.", "RF = 1 + L · (K − 1) = 1 + 4 · 2 = 9, то есть нейрон видит участок входа 9×9."),
        qx("Why can a deep CNN recognize a large object although every one of its filters is only 3×3?", "Receptive field grows with depth and pooling", [
          ["Its 3×3 filters are resized to fit big objects", "Filters keep their size; it is the stacking of layers that widens what each unit sees.", "Фильтры сохраняют размер; область, которую видит нейрон, расширяет именно наложение слоёв."],
          ["Padding enlarges each filter to the image size", "Padding only adds a border of zeros around the input; the filters stay 3×3.", "Padding лишь добавляет рамку из нулей вокруг входа; фильтры остаются 3×3."],
          ["The softmax layer looks at the whole image", "Softmax only turns the final scores into probabilities; it never sees pixels.", "Softmax лишь превращает итоговые scores в вероятности; пикселей он не видит."],
        ], "Each layer adds K − 1 to the receptive field, and stride and pooling make it grow faster, so deep units see large regions.", "Каждый слой добавляет K − 1 к рецептивному полю, а stride и pooling ускоряют рост, поэтому глубокие нейроны видят большие участки."),
        qx("2×2 max pooling, stride 2, on the 4×4 map with rows [2 0 1 5], [3 1 4 2], [0 6 2 2], [1 1 3 0]. What is the output?", "[3 5; 6 3]", [
          ["[1.5 3; 2 1.75]", "These are the block averages: that is average pooling, not max pooling.", "Это средние по блокам: так работает average pooling, а не max pooling."],
          ["[3 6; 5 3]", "The top-right and bottom-left blocks are swapped: the top-right block {1, 5, 4, 2} gives 5.", "Перепутаны правый верхний и левый нижний блоки: правый верхний блок {1, 5, 4, 2} даёт 5."],
          ["[2 1; 0 2]", "These are the top-left corners of the blocks; max pooling keeps the largest value of each block.", "Это левые верхние углы блоков; max pooling берёт наибольшее значение каждого блока."],
        ], "Blocks: {2, 0, 3, 1} → 3, {1, 5, 4, 2} → 5, {0, 6, 1, 1} → 6, {2, 2, 3, 0} → 3, so the output is [3 5; 6 3].", "Блоки: {2, 0, 3, 1} → 3, {1, 5, 4, 2} → 5, {0, 6, 1, 1} → 6, {2, 2, 3, 0} → 3, значит выход [3 5; 6 3]."),
        qx("How many learnable parameters does a 2×2 max-pooling layer applied to 64 channels have?", "0", [
          ["4", "4 would be one weight per window cell, but max pooling only takes a maximum; it has no weights.", "4 — это по весу на клетку окна, но max pooling лишь берёт максимум; весов у него нет."],
          ["256", "256 = 4 · 64 assumes trainable weights per channel; pooling is a fixed rule.", "256 = 4 · 64 предполагает обучаемые веса на канал; pooling — фиксированное правило."],
          ["64", "64 would be one bias per channel; pooling has no bias either.", "64 — это по bias на канал; но и bias у pooling нет."],
        ], "Pooling has no learnable parameters: it is a fixed max (or average) applied to each channel independently.", "У pooling нет обучаемых параметров: это фиксированный максимум (или среднее), применяемый к каждому каналу отдельно."),
        qx("A 16×16×32 volume goes through 2×2 max pooling with stride 2. What is the output shape?", "8×8×32", [
          ["8×8×16", "Pooling works on each channel independently, so the depth of 32 stays.", "Pooling работает с каждым каналом отдельно, поэтому глубина 32 сохраняется."],
          ["16×16×16", "Pooling halves height and width, not the number of channels.", "Pooling уменьшает вдвое высоту и ширину, а не число каналов."],
          ["15×15×32", "15 = (16 − 2)/1 + 1 uses stride 1; with stride 2 it is (16 − 2)/2 + 1 = 8.", "15 = (16 − 2)/1 + 1 — это stride 1; со stride 2 будет (16 − 2)/2 + 1 = 8."],
        ], "2×2 pooling with stride 2 halves height and width and keeps the depth: 16×16×32 → 8×8×32.", "Pooling 2×2 со stride 2 уменьшает вдвое высоту и ширину и сохраняет глубину: 16×16×32 → 8×8×32."),
        qx("Global average pooling is applied to a 7×7×512 volume. What comes out?", "512 numbers, one per channel", [
          ["25 088 numbers, the flattened volume", "25 088 = 7 · 7 · 512 is what Flatten gives; global average pooling averages each channel.", "25 088 = 7 · 7 · 512 — это результат Flatten; global average pooling усредняет каждый канал."],
          ["49 numbers, one per position", "Averaging over the channels would give 49 values; GAP averages over the positions, per channel.", "Усреднение по каналам дало бы 49 значений; GAP усредняет по позициям, отдельно для каждого канала."],
          ["A 3×3×512 volume", "3×3 is what a 2×2 pooling with stride 2 gives ((7 − 2)/2 + 1, rounded down); global pooling collapses the whole 7×7 map.", "3×3 даёт pooling 2×2 со stride 2 ((7 − 2)/2 + 1 с округлением вниз); глобальный pooling сворачивает всю карту 7×7."],
        ], "Each 7×7 channel is averaged into one number: 7×7×512 → 1×1×512, which removes the huge FC layers (used in GoogLeNet and ResNet).", "Каждый канал 7×7 усредняется в одно число: 7×7×512 → 1×1×512 — это убирает огромные FC-слои (так делают GoogLeNet и ResNet)."),
        qx("Why do many modern networks use a stride-2 convolution instead of a pooling layer?", "The downsampling itself becomes learned", [
          ["It has no parameters, so it is cheaper", "A stride-2 conv does have weights; that is the whole point compared with pooling.", "У свёртки со stride 2 есть веса — в этом и смысл по сравнению с pooling."],
          ["It keeps the spatial size unchanged", "Stride 2 roughly halves height and width, just like 2×2 pooling.", "Stride 2 примерно вдвое уменьшает высоту и ширину, как и pooling 2×2."],
          ["It removes the need for any ReLU", "Non-linearities are still needed after convolutions, whatever the stride.", "Нелинейности после свёрток нужны при любом stride."],
        ], "A stride-2 conv halves H and W like pooling, but its weights are trained, so the network learns how to downsample (ResNet, all-conv nets).", "Свёртка со stride 2 уменьшает H и W вдвое, как pooling, но её веса обучаются, и сеть сама учится, как уменьшать (ResNet, all-conv сети)."),
        qx("Why must a non-linearity such as ReLU follow each convolution?", "Stacked convs would collapse into one linear map", [
          ["It halves the height and width of every feature map", "Halving the size is the job of pooling or stride; ReLU keeps the shape.", "Уменьшать размер вдвое — задача pooling или stride; ReLU сохраняет форму."],
          ["It turns the scores into class probabilities", "That is softmax at the end of the network, not ReLU after each conv.", "Это делает softmax в конце сети, а не ReLU после каждой свёртки."],
          ["It normalizes each channel to zero mean", "Normalizing channels is batch normalization, a different layer.", "Нормализация каналов — это batch normalization, отдельный слой."],
        ], "A composition of linear operations is still linear; the non-linearity between convolutions is what lets depth add expressive power.", "Композиция линейных операций остаётся линейной; именно нелинейность между свёртками даёт глубине выразительную силу."),
        qx("ReLU is applied element-wise to [−3, 0.5, 0, 2]. What is the result?", "[0, 0.5, 0, 2]", [
          ["[3, 0.5, 0, 2]", "That is the absolute value; ReLU sets negative inputs to 0.", "Это модуль числа; ReLU обнуляет отрицательные входы."],
          ["[0, 1, 0, 1]", "These are (roughly) the gradients of ReLU, not its outputs: positive inputs pass unchanged.", "Это примерно градиенты ReLU, а не её выходы: положительные входы проходят без изменений."],
          ["[−3, 0.5, 0, 2]", "The negative value −3 must become max(0, −3) = 0.", "Отрицательное −3 должно стать max(0, −3) = 0."],
        ], "f(x) = max(0, x): −3 → 0, 0.5 → 0.5, 0 → 0, 2 → 2.", "f(x) = max(0, x): отрицательное −3 становится 0, а 0.5, 0 и 2 проходят без изменений."),
        tfx("ReLU saturates for large positive inputs, just like sigmoid and tanh.", false, "ReLU's gradient is 1 for every x > 0, so it does not saturate there; that is why it trains much faster (≈ 6× in AlexNet).", "Градиент ReLU равен 1 для всех x > 0, поэтому там она не насыщается; поэтому и обучение намного быстрее (в AlexNet ≈ в 6 раз).", "Choosing True confuses ReLU with sigmoid and tanh, whose gradients vanish for large inputs; ReLU's weak spot is the zero gradient for x < 0 (dead ReLU).", "Ответ True путает ReLU с sigmoid и tanh, у которых градиент исчезает при больших входах; слабое место ReLU — нулевой градиент при x < 0 (dead ReLU)."),
        qx("After two 2×2 poolings, a CNN's last conv volume is 8×8×64. How many numbers does Flatten produce?", "4 096", [
          ["512", "512 = 8 · 64 multiplies only one side by the channels; use 8 · 8 · 64.", "512 = 8 · 64 — на каналы умножена только одна сторона; нужно 8 · 8 · 64."],
          ["3 072", "3 072 is the flattened 32×32×3 input image, not the 8×8×64 volume.", "3 072 — это вытянутое входное изображение 32×32×3, а не объём 8×8×64."],
          ["16 384", "16 384 = 16 · 16 · 64 is the size before the second pooling.", "16 384 = 16 · 16 · 64 — это размер до второго pooling."],
        ], "Flatten keeps every number: 8 · 8 · 64 = 4 096, which then feeds the FC classifier.", "Flatten сохраняет все числа: 8 · 8 · 64 = 4 096, и они идут в FC-классификатор."),
        qx("In a typical CNN for classification, which part acts as the feature extractor?", "The Conv → ReLU → Pool blocks", [
          ["The fully connected layers after Flatten", "The FC layers are the classifier: they map the extracted features to class scores.", "FC-слои — это классификатор: они переводят извлечённые признаки в scores классов."],
          ["The softmax at the very end", "Softmax only turns scores into probabilities; it extracts no features.", "Softmax лишь превращает scores в вероятности; признаков он не извлекает."],
          ["The input normalization step", "Normalization prepares the pixels; it does not learn edges, textures or parts.", "Нормализация готовит пиксели; она не выучивает края, текстуры или части."],
        ], "Conv / ReLU / pool blocks turn pixels into features (space shrinks, channels grow); FC + softmax is the classifier.", "Блоки conv / ReLU / pool превращают пиксели в признаки (пространство уменьшается, каналов становится больше); FC + softmax — классификатор."),
        qx("Batch norm for one channel: μ = 4, σ² = 4, ε ≈ 0, γ = 3, β = 1. What is the output y for the input x = 8?", "7", [
          ["4", "4 divides by the variance (4) instead of the standard deviation √4 = 2: x̂ = 1, y = 3 · 1 + 1.", "4 — деление на дисперсию (4) вместо стандартного отклонения √4 = 2: x̂ = 1, y = 3 · 1 + 1."],
          ["2", "2 is only the normalized value x̂; the learnable γ and β still scale and shift it.", "2 — это только нормализованное x̂; обучаемые γ и β ещё масштабируют и сдвигают его."],
          ["13", "13 = 3 · (8 − 4) + 1 skips the division by √(σ² + ε).", "13 = 3 · (8 − 4) + 1 — пропущено деление на √(σ² + ε)."],
        ], "x̂ = (8 − 4)/√4 = 2, then y = γ · x̂ + β = 3 · 2 + 1 = 7.", "x̂ = (8 − 4)/√4 = 2, затем y = γ · x̂ + β = 3 · 2 + 1 = 7."),
        qx("Why does batch normalization include the learnable parameters γ and β?", "To let the layer undo the normalization", [
          ["To compute the mean and variance of the batch", "The mean and variance are computed from the data; γ and β are applied after normalizing.", "Среднее и дисперсию вычисляют по данным; γ и β применяются уже после нормализации."],
          ["To store the running averages for test time", "Running averages are separate stored statistics, not the learnable γ and β.", "Скользящие средние — отдельная сохранённая статистика, а не обучаемые γ и β."],
          ["To randomly drop units during training", "Randomly dropping units is dropout, a different regularizer.", "Случайно отключать нейроны — это dropout, другой регуляризатор."],
        ], "After x̂ = (x − μ)/√(σ² + ε) the layer outputs y = γx̂ + β; the learned scale and shift let it restore any useful mean and spread.", "После x̂ = (x − μ)/√(σ² + ε) слой выдаёт y = γx̂ + β; выученные масштаб и сдвиг позволяют вернуть любое полезное среднее и разброс."),
        qx("Which statistics does batch normalization use at test time?", "Running averages from training", [
          ["The mean and variance of the test batch", "Test predictions must not depend on which other images share the batch; BN uses stored running averages.", "Предсказание на тесте не должно зависеть от того, какие ещё изображения в батче; BN использует сохранённые скользящие средние."],
          ["Zero mean and unit variance set by hand", "Nothing is set by hand: the averages are collected from the training batches.", "Ничего не задаётся вручную: средние накапливаются по обучающим батчам."],
          ["The statistics of the first training batch", "One batch is too noisy; BN keeps running averages over the whole training.", "Один батч слишком шумный; BN ведёт скользящие средние за всё обучение."],
        ], "Training uses the current batch's mean and variance; test time uses the running averages collected during training.", "При обучении берутся среднее и дисперсия текущего батча, на тесте — скользящие средние, накопленные за обучение."),
        qx("A CNN trained on 2 000 images gets 95% training and 62% test accuracy. Which change most directly helps?", "Add data augmentation and weight decay", [
          ["Train longer with a higher learning rate", "Longer training lets the network memorize the training set even more and widens the gap.", "Более долгое обучение позволит сети ещё сильнее запомнить обучающие данные и увеличит разрыв."],
          ["Tune the model on the test set until it improves", "Tuning on the test set leaks it into training; the 62% would no longer be an honest estimate.", "Подбор по тестовой выборке делает её частью обучения; 62% перестанут быть честной оценкой."],
          ["Add more filters to every layer", "A bigger model has even more parameters to overfit with.", "У большей модели ещё больше параметров для переобучения."],
        ], "95% vs 62% is overfitting; augmentation (flips, crops, colour jitter) and weight decay (L2) reduce it, and dropout helps in the FC layers.", "95% против 62% — переобучение; его уменьшают аугментация (отражения, обрезки, изменение цвета) и weight decay (L2), а в FC-слоях помогает dropout."),
        tfx("Dropout randomly zeroes units both during training and at test time.", false, "Dropout is active only during training; at test time all units are used, so the predictions are deterministic.", "Dropout работает только во время обучения; на тесте используются все нейроны, и предсказания детерминированы.", "Choosing True would make test predictions random; the random switching-off is a training-time regularizer.", "Ответ True сделал бы предсказания на тесте случайными; случайное отключение — это регуляризация только на обучении."),
        qx("In the course notebook, how is the CNN trained?", "SGD, momentum 0.9, OneCycle learning-rate schedule", [
          ["kNN with k = 3 on the raw pixels", "kNN does not train any weights; a CNN is trained by gradient descent with backprop.", "kNN вообще не обучает веса; CNN обучают градиентным спуском с backprop."],
          ["SGD with a learning rate that only grows every epoch", "OneCycle first warms the learning rate up and then decays it; it does not only grow.", "OneCycle сначала разгоняет learning rate, а потом уменьшает; он не только растёт."],
          ["Closed-form solution without gradients", "There is no closed-form solution for a deep CNN; the gradient ∂L/∂W comes from backprop.", "Для глубокой CNN нет решения в замкнутом виде; градиент ∂L/∂W даёт backprop."],
        ], "Same loop as for the linear classifier: mini-batch → scores → softmax cross-entropy → backprop → W ← W − η∇W L, with SGD + momentum 0.9 and a OneCycle schedule.", "Тот же цикл, что у линейного классификатора: мини-батч → scores → softmax cross-entropy → backprop → W ← W − η∇W L, с SGD + momentum 0.9 и расписанием OneCycle."),
      ],
    ),
    part(
      "cv-l5-p3",
      { en: "CNN architectures: from LeNet to ResNet and beyond", ru: "Архитектуры CNN: от LeNet до ResNet и дальше" },
      {
        en: `## A short history of CNN architectures
| Year | Network | Depth | Key idea | ImageNet top-5 error |
|---|---|---|---|---|
| 1998 | LeNet-5 | 5 | conv + pooling, trained by backprop | (MNIST digits) |
| 2012 | AlexNet | 8 | ReLU, dropout, GPUs | ≈ 16 % |
| 2014 | VGG-16 | 16 | stacked 3×3 convolutions | ≈ 7 % |
| 2014 | GoogLeNet | 22 | Inception, 1×1 bottlenecks | ≈ 6.7 % |
| 2015 | ResNet-152 | 152 | residual connections | ≈ 3.6 % (ensemble) |
The trend: **deeper networks**, fewer parameters per unit of accuracy and **better training tricks**. (The error numbers are approximate, from the original papers.)
## LeNet-5 (LeCun et al., 1998)
Designed for **handwritten digits**; the input is a **32×32×1 grayscale** image.
= 32×32×1 → C1 conv 5×5: 6@28×28 → S2 pool: 6@14×14
= → C3 conv 5×5: 16@10×10 → S4 pool: 16@5×5 → F5 120 → F6 84 → 10
- Check with the formula: C1 (32 − 5)/1 + 1 = 28; C3 (14 − 5)/1 + 1 = 10.
- About **60 000 parameters**. The pattern **conv → pool → conv → pool → FC** is still the template of many networks.
## AlexNet (Krizhevsky et al., 2012)
= 227×227×3 → Conv1 11×11 + pool: 96@27×27 → Conv2 5×5 + pool: 256@13×13
= → Conv3 3×3: 384@13×13 → Conv4 3×3: 384@13×13 → Conv5 3×3 + pool: 256@6×6 → FC 4096 → FC 4096 → FC 1000
- Won ImageNet 2012 and **started the deep-learning revolution** in computer vision.
- About **60 million parameters**, **most of them in the FC layers**.
- Key ingredients: **ReLU, dropout, data augmentation, training on 2 GPUs**, plus local response normalization.
## VGG (Simonyan & Zisserman, 2014)
Only **3×3 convolutions** and **2×2 max pooling**. After every pooling the spatial size **halves** and the number of channels **doubles**.
= 224 → 112 → 56 → 28 → 14 → 7      channels 64 → 128 → 256 → 512 → 512
- **VGG-16**: 16 weight layers, **≈ 138 million parameters**, mostly in the FC layers (7 · 7 · 512 = 25 088 inputs into FC 4096).
## Why stacks of 3×3 convolutions?
| Property | One 7×7 conv | Three 3×3 convs |
|---|---|---|
| Receptive field | 7×7 | 7×7 |
| Parameters (C channels in and out) | 49 C² | 27 C² |
| Non-linearities | 1 | 3 |
= 3 · (3 · 3 · C · C) = 27 C²    vs    7 · 7 · C · C = 49 C²
= (49 − 27) / 49 ≈ 0.45  →  about 45 % fewer parameters
Design rule: **use small filters and go deeper**: the same receptive field, fewer weights and more non-linearity.
## GoogLeNet and the Inception module
- Instead of choosing one filter size, the module runs **in parallel**: a 1×1 conv; 1×1 → 3×3; 1×1 → 5×5; 3×3 max pool → 1×1. The outputs are **concatenated along the channel dimension**.
- **Global average pooling** replaces the big FC layers; **auxiliary classifiers** help during training.
- Only **≈ 7 million parameters** with 22 layers: far fewer than AlexNet (≈ 60 M) or VGG-16 (≈ 138 M).
## The 1×1 convolution as a bottleneck
A **1×1 conv** looks at no neighbours: at every pixel it is a **linear map across the channels**, C_in → C_out. It changes the **depth**, not the height and width.
= direct:      28×28×192 → 5×5 conv, 32 filters → 28×28×32
= cost:        28·28·32 · 5·5·192 ≈ 120 M multiplies
= bottleneck:  28×28×192 → 1×1 conv, 16 → 5×5 conv, 32 → 28×28×32
= cost:        28·28·16·192 + 28·28·32 · 5·5·16 ≈ 2.4 M + 10.0 M = 12.4 M
The same output shape for about **10× less computation**.
## The degradation problem
- Plain deeper networks are **harder to optimize**: a **56-layer** plain network had **higher training error** than a **20-layer** one.
- This is **not overfitting**, because the **training** error itself is higher. It is an **optimization problem**.
- In theory the deeper net could copy the shallow one and make the extra layers the **identity**, but stacked non-linear layers find the identity hard to learn, and gradients vanish.
## ResNet: the residual block (He et al., 2015)
= y = F(x) + x
= F(x) = H(x) − x
@diagram cv-resnet
- x goes through **conv 3×3 → ReLU → conv 3×3** to give F(x); the **skip (identity) connection** adds x back, then a ReLU follows.
- The layers learn only the **residual**: if doing nothing is best, the weights go to **zero** and the block becomes the identity.
- The **gradient flows directly** through the skip path, so 50, 101, 152 and even 1000+ layers can be trained.
- When the shape changes, the skip path uses a **1×1 projection**.
| Model | Block | Layers | Parameters |
|---|---|---|---|
| ResNet-18 | basic (3×3, 3×3) | 18 | ≈ 11.7 M |
| ResNet-34 | basic | 34 | ≈ 21.8 M |
| ResNet-50 | bottleneck (1×1, 3×3, 1×1) | 50 | ≈ 25.6 M |
| ResNet-101 | bottleneck | 101 | ≈ 44.5 M |
| ResNet-152 | bottleneck | 152 | ≈ 60.2 M |
The bottleneck block reduces the channels with a 1×1 conv, applies a 3×3 and expands them again with a 1×1: the Inception trick again. ResNet ends with **global average pooling + one FC layer** instead of the huge FC head of AlexNet / VGG.
## Efficient networks and beyond CNNs
- **DenseNet (2017)**: each layer receives the **concatenation of all earlier feature maps** (feature reuse).
- **MobileNet (2017)**: **depthwise separable convolution**, a 3×3 filter per channel + a 1×1 conv that mixes the channels; **≈ 8–9× cheaper** than a standard 3×3.
- **EfficientNet (2019)**: **compound scaling** of depth, width and resolution with one coefficient.
- **Vision Transformer (ViT)**: splits the image into **16×16 patches**, linear embedding + position encoding, a transformer encoder with **self-attention**; strong with **large pretraining**.
- **ConvNeXt (2022)**: a ResNet modernized step by step (7×7 depthwise kernels, LayerNorm, GELU); it matches transformers at similar cost and is **still a pure CNN**.
The convolutional prior (**locality, weight sharing**) is still valuable, especially when data is **limited**.
## The CIFAR-10 experiment from the course notebook
A subset of CIFAR-10 (6 000 training and 1 500 test images), the same optimizer and number of epochs for every model, a few epochs on a CPU: the absolute numbers are lower than in papers.
| Model | Parameters | Test accuracy |
|---|---|---|
| Linear | 30 730 | ≈ 25 % |
| LeNet-style | 62 006 | 51.0 % |
| SimpleCNN | 25 578 | 59.3 % |
| VGGMini | 307 946 | 70.1 % |
| ResNetMini | 308 650 | 63.7 % |
- Convolution beats the linear classifier by a wide margin **with fewer parameters**: SimpleCNN has 25 578 vs 30 730.
- SimpleCNN has the fewest parameters yet beats LeNet: **design matters, not only size**.
- VGGMini beats ResNetMini (same depth and width) by about 6 points. No contradiction: skip connections solve the **degradation problem of very deep nets**, and at 8 layers there is nothing to solve.
## Practical recipe
- Start from a network **pretrained on ImageNet** and **fine-tune** it.
- **Small dataset**: **freeze the backbone** and train only the new classifier. **Larger dataset**: fine-tune all layers with a **small learning rate**.
- Use **data augmentation** and **batch normalization** by default.
| Constraint | Reasonable choice |
|---|---|
| Accuracy first | ResNet-50/101, ConvNeXt, EfficientNet |
| Mobile / embedded | MobileNet, EfficientNet-B0 |
| Simple baseline | ResNet-18 |
![A hand holding a smartphone above a green plant leaf with small brown spots in a sunny garden; the phone screen shows the live camera view of the same leaf framed by a thin green square, with no text on the screen](/events/cv/l5-phone-leaf-classifier.webp)
> Architectures moved to deeper nets with smarter building blocks: VGG (small 3×3 filters), GoogLeNet (1×1 bottlenecks), ResNet (skip connections y = F(x) + x against the degradation problem); in practice, fine-tune a pretrained network.
## Check yourself
?? Compare one 7×7 convolution with three stacked 3×3 convolutions (C channels in and out): receptive field, parameters, non-linearities. Which would you choose and why?
?= Both see a 7×7 region, but three 3×3 layers use 3 · 9C² = 27C² weights instead of 49C² (about 45 % fewer) and have three ReLUs instead of one, so the stack is cheaper and more expressive: the VGG rule ‘small filters, go deeper’.
?? A 56-layer plain CNN has higher training error than a 20-layer one. A student says it is overfitting. Is the student right, and what does ResNet change?
?= No: overfitting means low training error and high test error, but here the training error itself is higher, so it is an optimization (degradation) problem. ResNet adds skip connections y = F(x) + x, so the layers learn only the residual, the identity is easy (F = 0), and gradients flow directly through the skip path.`,
        ru: `## Краткая история архитектур CNN
| Год | Сеть | Глубина | Ключевая идея | Ошибка top-5 на ImageNet |
|---|---|---|---|---|
| 1998 | LeNet-5 | 5 | conv + pooling, обучение через backprop | (цифры MNIST) |
| 2012 | AlexNet | 8 | ReLU, dropout, GPU | ≈ 16 % |
| 2014 | VGG-16 | 16 | стеки свёрток 3×3 | ≈ 7 % |
| 2014 | GoogLeNet | 22 | Inception, bottleneck 1×1 | ≈ 6.7 % |
| 2015 | ResNet-152 | 152 | residual-соединения | ≈ 3.6 % (ансамбль) |
Тенденция: **более глубокие сети**, меньше параметров на единицу точности и **лучшие приёмы обучения**. (Ошибки приблизительные, из оригинальных статей.)
## LeNet-5 (LeCun et al., 1998)
Создана для **рукописных цифр**; вход — **изображение 32×32×1 в оттенках серого**.
= 32×32×1 → C1 conv 5×5: 6@28×28 → S2 pool: 6@14×14
= → C3 conv 5×5: 16@10×10 → S4 pool: 16@5×5 → F5 120 → F6 84 → 10
- Проверка по формуле: C1 (32 − 5)/1 + 1 = 28; C3 (14 − 5)/1 + 1 = 10.
- Около **60 000 параметров**. Схема **conv → pool → conv → pool → FC** до сих пор — шаблон многих сетей.
## AlexNet (Krizhevsky et al., 2012)
= 227×227×3 → Conv1 11×11 + pool: 96@27×27 → Conv2 5×5 + pool: 256@13×13
= → Conv3 3×3: 384@13×13 → Conv4 3×3: 384@13×13 → Conv5 3×3 + pool: 256@6×6 → FC 4096 → FC 4096 → FC 1000
- Победила в ImageNet 2012 и **начала революцию глубокого обучения** в компьютерном зрении.
- Около **60 миллионов параметров**, **большая часть — в FC-слоях**.
- Ключевые составляющие: **ReLU, dropout, аугментация данных, обучение на 2 GPU**, плюс local response normalization.
## VGG (Simonyan & Zisserman, 2014)
Только **свёртки 3×3** и **max pooling 2×2**. После каждого pooling пространственный размер **уменьшается вдвое**, а число каналов **удваивается**.
= 224 → 112 → 56 → 28 → 14 → 7      channels 64 → 128 → 256 → 512 → 512
- **VGG-16**: 16 слоёв с весами, **≈ 138 миллионов параметров**, в основном в FC-слоях (7 · 7 · 512 = 25 088 входов в FC 4096).
## Почему стеки свёрток 3×3?
| Свойство | Одна свёртка 7×7 | Три свёртки 3×3 |
|---|---|---|
| Рецептивное поле | 7×7 | 7×7 |
| Параметры (C каналов на входе и выходе) | 49 C² | 27 C² |
| Нелинейностей | 1 | 3 |
= 3 · (3 · 3 · C · C) = 27 C²    vs    7 · 7 · C · C = 49 C²
= (49 − 27) / 49 ≈ 0.45  →  about 45 % fewer parameters
Правило проектирования: **маленькие фильтры и большая глубина**: то же рецептивное поле, меньше весов и больше нелинейности.
## GoogLeNet и модуль Inception
- Вместо выбора одного размера фильтра модуль запускает **параллельно**: свёртку 1×1; 1×1 → 3×3; 1×1 → 5×5; max pool 3×3 → 1×1. Выходы **конкатенируются по каналам (channel dimension)**.
- **Global average pooling** заменяет большие FC-слои; **вспомогательные классификаторы (auxiliary classifiers)** помогают при обучении.
- Всего **≈ 7 миллионов параметров** при 22 слоях: намного меньше, чем у AlexNet (≈ 60 M) или VGG-16 (≈ 138 M).
## Свёртка 1×1 как bottleneck («бутылочное горлышко»)
**Свёртка 1×1** не смотрит на соседей: в каждом пикселе это **линейное преобразование каналов**, C_in → C_out. Она меняет **глубину**, а не высоту и ширину.
= direct:      28×28×192 → 5×5 conv, 32 filters → 28×28×32
= cost:        28·28·32 · 5·5·192 ≈ 120 M multiplies
= bottleneck:  28×28×192 → 1×1 conv, 16 → 5×5 conv, 32 → 28×28×32
= cost:        28·28·16·192 + 28·28·32 · 5·5·16 ≈ 2.4 M + 10.0 M = 12.4 M
Тот же размер выхода при **примерно в 10 раз меньших вычислениях**.
## Проблема деградации (degradation problem)
- Обычные (plain) глубокие сети **труднее оптимизировать**: **56-слойная** обычная сеть имела **более высокую ошибку на обучении**, чем **20-слойная**.
- Это **не переобучение**: выше именно ошибка **на обучении**. Это **проблема оптимизации**.
- Теоретически глубокая сеть могла бы скопировать мелкую и сделать лишние слои **тождественными (identity)**, но стопке нелинейных слоёв трудно выучить тождество, а градиенты затухают.
## ResNet: residual-блок (He et al., 2015)
= y = F(x) + x
= F(x) = H(x) − x
@diagram cv-resnet
- x проходит через **conv 3×3 → ReLU → conv 3×3** и даёт F(x); **skip-соединение (identity)** прибавляет x обратно, затем идёт ReLU.
- Слои учат только **остаток (residual)**: если лучше ничего не делать, веса уходят в **ноль**, и блок становится тождественным.
- **Градиент идёт напрямую** по skip-пути, поэтому можно обучать 50, 101, 152 и даже 1000+ слоёв.
- Когда форма меняется, skip-путь использует **проекцию 1×1**.
| Модель | Блок | Слоёв | Параметров |
|---|---|---|---|
| ResNet-18 | basic (3×3, 3×3) | 18 | ≈ 11.7 M |
| ResNet-34 | basic | 34 | ≈ 21.8 M |
| ResNet-50 | bottleneck (1×1, 3×3, 1×1) | 50 | ≈ 25.6 M |
| ResNet-101 | bottleneck | 101 | ≈ 44.5 M |
| ResNet-152 | bottleneck | 152 | ≈ 60.2 M |
Bottleneck-блок уменьшает число каналов свёрткой 1×1, применяет 3×3 и снова расширяет каналы свёрткой 1×1 — тот же трюк, что в Inception. В конце ResNet стоит **global average pooling + один FC-слой** вместо огромной FC-«головы» AlexNet / VGG.
## Экономные сети и не только CNN
- **DenseNet (2017)**: каждый слой получает **конкатенацию всех предыдущих карт признаков** (переиспользование признаков).
- **MobileNet (2017)**: **depthwise separable convolution** — фильтр 3×3 на каждый канал + свёртка 1×1, смешивающая каналы; **≈ в 8–9 раз дешевле** обычной 3×3.
- **EfficientNet (2019)**: **compound scaling** — глубина, ширина и разрешение масштабируются вместе одним коэффициентом.
- **Vision Transformer (ViT)**: режет изображение на **патчи 16×16**, линейное вложение (embedding) + кодирование позиции, transformer-энкодер с **self-attention**; силён при **большом предобучении**.
- **ConvNeXt (2022)**: ResNet, модернизированная шаг за шагом (depthwise-ядра 7×7, LayerNorm, GELU); не уступает трансформерам при сходной стоимости и **остаётся чистой CNN**.
Свёрточное априорное знание (**локальность, общие веса**) по-прежнему ценно, особенно когда данных **мало**.
## Эксперимент на CIFAR-10 из ноутбука курса
Подмножество CIFAR-10 (6 000 обучающих и 1 500 тестовых изображений), одинаковые оптимизатор и число эпох для всех моделей, несколько эпох на CPU: абсолютные числа ниже, чем в статьях.
| Модель | Параметров | Точность на тесте |
|---|---|---|
| Linear | 30 730 | ≈ 25 % |
| LeNet-style | 62 006 | 51.0 % |
| SimpleCNN | 25 578 | 59.3 % |
| VGGMini | 307 946 | 70.1 % |
| ResNetMini | 308 650 | 63.7 % |
- Свёртка обходит линейный классификатор с большим отрывом **при меньшем числе параметров**: у SimpleCNN 25 578 против 30 730.
- У SimpleCNN меньше всего параметров, но она лучше LeNet: **важна архитектура, а не только размер**.
- VGGMini обходит ResNetMini (та же глубина и ширина) примерно на 6 пунктов. Противоречия нет: skip-соединения решают **проблему деградации очень глубоких сетей**, а на 8 слоях решать нечего.
## Практический рецепт
- Начните с сети, **предобученной на ImageNet**, и **дообучите (fine-tune)** её.
- **Маленький датасет**: **заморозьте backbone** и обучайте только новый классификатор. **Датасет побольше**: дообучайте все слои с **маленьким learning rate**.
- По умолчанию используйте **аугментацию данных** и **batch normalization**.
| Ограничение | Разумный выбор |
|---|---|
| Важнее всего точность | ResNet-50/101, ConvNeXt, EfficientNet |
| Телефон / встраиваемое устройство | MobileNet, EfficientNet-B0 |
| Простой baseline | ResNet-18 |
![Рука держит смартфон над зелёным листом растения с мелкими коричневыми пятнами в солнечном саду; на экране телефона — изображение с камеры того же листа в тонкой зелёной квадратной рамке, без какого-либо текста на экране](/events/cv/l5-phone-leaf-classifier.webp)
> Архитектуры шли к более глубоким сетям с более умными блоками: VGG (маленькие фильтры 3×3), GoogLeNet (bottleneck 1×1), ResNet (skip-соединения y = F(x) + x против проблемы деградации); на практике дообучайте предобученную сеть.
## Проверь себя
?? Сравните одну свёртку 7×7 и три свёртки 3×3 подряд (C каналов на входе и выходе): рецептивное поле, параметры, нелинейности. Что вы выберете и почему?
?= Обе видят участок 7×7, но три слоя 3×3 используют 3 · 9C² = 27C² весов вместо 49C² (примерно на 45 % меньше) и дают три ReLU вместо одной, поэтому стек дешевле и выразительнее: правило VGG «маленькие фильтры, больше глубина».
?? У 56-слойной обычной CNN ошибка на обучении выше, чем у 20-слойной. Студент говорит, что это переобучение. Прав ли он и что меняет ResNet?
?= Нет: переобучение — это низкая ошибка на обучении и высокая на тесте, а здесь выше сама ошибка на обучении, значит это проблема оптимизации (деградации). ResNet добавляет skip-соединения y = F(x) + x: слои учат только остаток, тождество получается легко (F = 0), а градиенты идут напрямую по skip-пути.`,
      },
      [
        qx("Which network won ImageNet 2012 and started the deep-learning revolution in computer vision?", "AlexNet", [
          ["LeNet-5", "LeNet-5 (1998) read handwritten digits; it did not compete on ImageNet.", "LeNet-5 (1998) распознавала рукописные цифры; в ImageNet она не участвовала."],
          ["VGG-16", "VGG-16 came in 2014, two years after the breakthrough.", "VGG-16 появилась в 2014 году, через два года после прорыва."],
          ["ResNet-152", "ResNet came in 2015 and pushed the error down to ≈ 3.6 %, but the revolution began earlier.", "ResNet появилась в 2015 году и снизила ошибку до ≈ 3.6 %, но революция началась раньше."],
        ], "AlexNet (2012, 8 layers, ReLU, dropout, GPUs) reached ≈ 16 % top-5 error and started the deep-learning era in vision.", "AlexNet (2012, 8 слоёв, ReLU, dropout, GPU) получила ≈ 16 % ошибки top-5 и открыла эпоху глубокого обучения в зрении."),
        qx("Which set of ingredients made AlexNet successful?", "ReLU, dropout, data augmentation, two GPUs", [
          ["Residual connections and batch normalization", "Skip connections came with ResNet in 2015; AlexNet had no residual blocks.", "Skip-соединения появились в ResNet в 2015 году; residual-блоков в AlexNet не было."],
          ["Inception modules and 1×1 bottlenecks", "Those are GoogLeNet's ideas from 2014.", "Это идеи GoogLeNet 2014 года."],
          ["Only 3×3 convolutions and global pooling", "Uniform 3×3 stacks are VGG; AlexNet starts with 11×11 filters and ends with big FC layers.", "Единообразные стеки 3×3 — это VGG; AlexNet начинается с фильтров 11×11 и заканчивается большими FC-слоями."],
        ], "AlexNet's key ingredients: ReLU, dropout, data augmentation and training on 2 GPUs (plus local response normalization).", "Ключевые составляющие AlexNet: ReLU, dropout, аугментация данных и обучение на 2 GPU (плюс local response normalization)."),
        qx("LeNet-5 applies six 5×5 filters (stride 1, no padding) to a 32×32×1 image. What is the output?", "6 maps of 28×28", [
          ["6 maps of 32×32", "32×32 would need padding 2; LeNet's C1 has none, so (32 − 5)/1 + 1 = 28.", "32×32 потребовало бы padding 2; в C1 у LeNet его нет, поэтому (32 − 5)/1 + 1 = 28."],
          ["6 maps of 27×27", "27 forgets the +1 of the output-size formula.", "27 — забыто +1 в формуле размера выхода."],
          ["28 maps of 6×6", "The number of maps and the map size are swapped: six filters give six maps.", "Перепутаны число карт и их размер: шесть фильтров дают шесть карт."],
        ], "(32 − 5)/1 + 1 = 28, and six filters give six maps: C1 = 6@28×28; then S2 pooling gives 6@14×14.", "(32 − 5)/1 + 1 = 28, а шесть фильтров дают шесть карт: C1 = 6@28×28; затем pooling S2 даёт 6@14×14."),
        qx("Where are most of AlexNet's ≈ 60 million parameters?", "In the fully connected layers", [
          ["In the first 11×11 convolution", "96 filters of 11×11×3 hold only about 35 000 weights.", "96 фильтров 11×11×3 содержат лишь около 35 000 весов."],
          ["In the max-pooling layers", "Pooling layers have no parameters at all.", "У слоёв pooling вообще нет параметров."],
          ["In the local response normalization", "LRN is a fixed normalization formula with no large weight matrices.", "LRN — фиксированная формула нормализации без больших матриц весов."],
        ], "FC6, FC7 and FC8 (256·6·6 → 4096 → 4096 → 1000) hold most of the ≈ 60 M parameters; later networks replaced them with global average pooling.", "FC6, FC7 и FC8 (256·6·6 → 4096 → 4096 → 1000) содержат большую часть ≈ 60 M параметров; позже их заменили на global average pooling."),
        qx("VGG halves the size and doubles the channels at each stage. After the 224×224×64 stage come a pool and a conv128 block. Output?", "112×112×128", [
          ["224×224×128", "The pooling comes first and halves height and width to 112.", "Сначала идёт pooling, и он уменьшает высоту и ширину до 112."],
          ["112×112×64", "Pooling halves the size, but the next conv block doubles the channels to 128.", "Pooling уменьшает размер вдвое, но следующий блок свёрток удваивает каналы до 128."],
          ["56×56×128", "56×56 comes only after the second pooling.", "56×56 бывает только после второго pooling."],
        ], "224 → pool → 112, and the conv block doubles 64 → 128 channels: 112×112×128 (then 56×56×256, 28×28×512, 14×14×512, 7×7×512).", "224 → pool → 112, а блок свёрток удваивает каналы 64 → 128: 112×112×128 (дальше 56×56×256, 28×28×512, 14×14×512, 7×7×512)."),
        qx("With C = 64 channels in and out and no biases, how many weights do three stacked 3×3 conv layers have?", "110 592", [
          ["200 704", "200 704 = 49 · 64² is one 7×7 layer, the thing the stack replaces.", "200 704 = 49 · 64² — это один слой 7×7, который стек как раз заменяет."],
          ["36 864", "36 864 = 9 · 64² is only one 3×3 layer; there are three.", "36 864 = 9 · 64² — только один слой 3×3; а их три."],
          ["1 728", "1 728 = 27 · 64 forgets that each layer maps C channels to C channels (C²).", "1 728 = 27 · 64 — забыто, что каждый слой переводит C каналов в C каналов (C²)."],
        ], "3 · (3 · 3 · 64 · 64) = 27 · 4 096 = 110 592, about 45 % fewer than 49 · 4 096 = 200 704 for one 7×7.", "3 · (3 · 3 · 64 · 64) = 27 · 4 096 = 110 592 — примерно на 45 % меньше, чем 49 · 4 096 = 200 704 у одного 7×7."),
        qx("Three stacked 3×3 convs replace one 7×7 conv. What do they gain?", "Fewer weights and two extra non-linearities", [
          ["A larger receptive field than 7×7", "The receptive field is the same: 1 + 3 · 2 = 7.", "Рецептивное поле то же самое: 1 + 3 · 2 = 7."],
          ["The same number of weights, but faster training", "The weights are not the same: 27C² instead of 49C².", "Весов не столько же: 27C² вместо 49C²."],
          ["No need for padding or for ReLU", "Each 3×3 layer still uses padding 1 and a ReLU; the extra ReLUs are part of the gain.", "Каждый слой 3×3 всё так же использует padding 1 и ReLU; лишние ReLU — как раз часть выигрыша."],
        ], "Same 7×7 receptive field, 27C² instead of 49C² weights (≈ 45 % fewer) and 3 ReLUs instead of 1: use small filters and go deeper.", "То же рецептивное поле 7×7, 27C² весов вместо 49C² (≈ на 45 % меньше) и 3 ReLU вместо 1: маленькие фильтры и большая глубина."),
        qx("What does an Inception module do with the outputs of its parallel branches?", "Concatenates them along the channel axis", [
          ["Adds them element-wise like a skip connection", "Element-wise addition is the ResNet idea; Inception stacks the branch outputs as channels.", "Поэлементное сложение — идея ResNet; Inception складывает выходы веток как каналы."],
          ["Keeps only the branch with the best score", "All branches are used every time; none is chosen or dropped.", "Используются все ветки каждый раз; ни одна не выбирается и не отбрасывается."],
          ["Averages them into a single channel", "Averaging would throw information away; the branches are concatenated.", "Усреднение выбросило бы информацию; ветки конкатенируются."],
        ], "1×1, 1×1 → 3×3, 1×1 → 5×5 and pool → 1×1 run in parallel on the same input, and their outputs are concatenated along the channel dimension.", "1×1, 1×1 → 3×3, 1×1 → 5×5 и pool → 1×1 работают параллельно на одном входе, а их выходы конкатенируются по каналам."),
        qx("A 1×1 conv with 16 filters is applied to a 28×28×192 volume. What is the output shape?", "28×28×16", [
          ["28×28×192", "The depth is set by the number of filters (16), not by the input depth.", "Глубину задаёт число фильтров (16), а не глубина входа."],
          ["1×1×16", "A 1×1 conv slides over all 28×28 positions; it does not collapse the map like global pooling.", "Свёртка 1×1 проходит по всем 28×28 позициям; она не сворачивает карту, как глобальный pooling."],
          ["26×26×16", "26 would come from a 3×3 filter without padding; a 1×1 filter keeps 28: (28 − 1)/1 + 1.", "26 получилось бы у фильтра 3×3 без padding; фильтр 1×1 сохраняет 28: (28 − 1)/1 + 1."],
        ], "A 1×1 conv is a per-pixel linear map across channels: height and width stay 28×28, the depth becomes 16.", "Свёртка 1×1 — линейное преобразование каналов в каждом пикселе: высота и ширина остаются 28×28, глубина становится 16."),
        qx("A direct 5×5 conv 192 → 32 channels on a 28×28 map costs ≈ 120 M multiplies. With a 1×1 → 16 bottleneck first, the total is about…", "≈ 12.4 M, about 10× cheaper", [
          ["≈ 120 M, the same cost", "The bottleneck shrinks the 5×5 conv's input depth from 192 to 16, so the cost drops sharply.", "Bottleneck уменьшает глубину входа свёртки 5×5 со 192 до 16, поэтому стоимость резко падает."],
          ["≈ 2.4 M, only the 1×1 part", "2.4 M is just the 1×1 conv; the 5×5 conv on 16 channels adds ≈ 10.0 M.", "2.4 M — это только свёртка 1×1; свёртка 5×5 по 16 каналам добавляет ≈ 10.0 M."],
          ["≈ 60 M, exactly half", "The saving is not a factor of 2: 28·28·16·192 + 28·28·32·25·16 ≈ 12.4 M.", "Экономия не в 2 раза: 28·28·16·192 + 28·28·32·25·16 ≈ 12.4 M."],
        ], "1×1: 28·28·16·192 ≈ 2.4 M; 5×5 on 16 channels: 28·28·32·25·16 ≈ 10.0 M; total ≈ 12.4 M, the same 28×28×32 output for about 10× less work.", "1×1: 28·28·16·192 ≈ 2.4 M; 5×5 по 16 каналам: 28·28·32·25·16 ≈ 10.0 M; всего ≈ 12.4 M — тот же выход 28×28×32 примерно в 10 раз дешевле."),
        qx("A 56-layer plain CNN has HIGHER training error than a 20-layer one. What is this called?", "The degradation (optimization) problem", [
          ["Overfitting to the training set", "Overfitting means low training error and high test error; here the training error itself is higher.", "Переобучение — это низкая ошибка на обучении и высокая на тесте; здесь выше сама ошибка на обучении."],
          ["Underfitting caused by too few parameters", "The 56-layer net has more parameters than the 20-layer one, not fewer.", "У 56-слойной сети параметров больше, чем у 20-слойной, а не меньше."],
          ["The curse of dimensionality", "The curse of dimensionality is about kNN in high-dimensional spaces, not about network depth.", "Проклятие размерности — про kNN в пространствах высокой размерности, а не про глубину сети."],
        ], "Deeper plain nets are harder to optimize: they fail to learn even identity mappings, so training error rises with depth. This is the degradation problem.", "Глубокие обычные сети труднее оптимизировать: им сложно выучить даже тождественное отображение, и ошибка на обучении растёт с глубиной. Это проблема деградации."),
        qx("A residual block outputs y = F(x) + x. What do its conv layers learn?", "The residual F(x) = H(x) − x", [
          ["The full mapping H(x) directly", "Learning H(x) directly is the plain-network approach that suffers from degradation.", "Учить H(x) напрямую — подход обычной сети, который и страдает от деградации."],
          ["An exact copy of the input x", "The skip path already carries x; the layers learn only what must be added to it.", "Skip-путь уже переносит x; слои учат только то, что нужно к нему добавить."],
          ["The gradient of the loss", "Gradients are computed by backprop; layers learn a function of the input, not the gradient.", "Градиенты считает backprop; слои учат функцию от входа, а не градиент."],
        ], "The layers learn the difference between the desired output and the input; if doing nothing is best, F → 0 and the block is the identity.", "Слои учат разницу между нужным выходом и входом; если лучше ничего не делать, F → 0 и блок становится тождественным."),
        qx("In a residual block x = [2, −1, 3] and F(x) = [0.5, 1, −3]. What is y = F(x) + x before the final ReLU?", "[2.5, 0, 0]", [
          ["[0.5, 1, −3]", "That is F(x) alone; the skip connection adds x back.", "Это только F(x); skip-соединение добавляет x обратно."],
          ["[1, −1, −9]", "These are element-wise products; a residual block adds, it does not multiply.", "Это поэлементные произведения; residual-блок складывает, а не умножает."],
          ["[1.5, −2, 6]", "This is x − F(x); the block computes F(x) + x.", "Это x − F(x); блок вычисляет F(x) + x."],
        ], "Element by element: 0.5 + 2 = 2.5, 1 + (−1) = 0, −3 + 3 = 0, so y = [2.5, 0, 0].", "Поэлементно: 0.5 + 2 = 2.5, 1 + (−1) = 0, −3 + 3 = 0, значит y = [2.5, 0, 0]."),
        qx("Which block does ResNet-50 use?", "Bottleneck: 1×1, 3×3, 1×1", [
          ["Basic: two 3×3 convs", "The basic block is used in ResNet-18 and ResNet-34.", "Базовый блок используется в ResNet-18 и ResNet-34."],
          ["Inception: four parallel branches", "Parallel branches belong to GoogLeNet, not to ResNet.", "Параллельные ветки — это GoogLeNet, а не ResNet."],
          ["Dense: concatenates all earlier maps", "Concatenating all earlier maps is DenseNet's idea.", "Конкатенация всех предыдущих карт — идея DenseNet."],
        ], "ResNet-50/101/152 use the bottleneck block: a 1×1 reduces the channels, a 3×3 works, a 1×1 expands them back, the Inception trick inside a residual block.", "ResNet-50/101/152 используют bottleneck-блок: 1×1 уменьшает каналы, 3×3 обрабатывает, 1×1 снова расширяет — трюк Inception внутри residual-блока."),
        qx("Which idea makes MobileNet about 8–9× cheaper than standard 3×3 convolutions?", "Depthwise separable convolution", [
          ["Compound scaling", "Compound scaling of depth, width and resolution is EfficientNet's idea.", "Compound scaling глубины, ширины и разрешения — идея EfficientNet."],
          ["Concatenating all earlier feature maps", "Concatenating earlier maps is DenseNet's feature reuse.", "Конкатенация предыдущих карт — переиспользование признаков в DenseNet."],
          ["Splitting the image into 16×16 patches", "Patches with self-attention are the Vision Transformer, not MobileNet.", "Патчи с self-attention — это Vision Transformer, а не MobileNet."],
        ], "A 3×3 filter per channel (depthwise) followed by a 1×1 conv that mixes the channels (pointwise) costs ≈ 8–9× less than a standard 3×3 conv.", "Фильтр 3×3 на каждый канал (depthwise), а затем свёртка 1×1, смешивающая каналы (pointwise), стоят в ≈ 8–9 раз меньше стандартной свёртки 3×3."),
        tfx("ConvNeXt is a vision transformer that replaces convolutions with self-attention.", false, "ConvNeXt (2022) is a ResNet modernized step by step (7×7 depthwise kernels, LayerNorm, GELU) and is still a pure convolutional network.", "ConvNeXt (2022) — это ResNet, модернизированная шаг за шагом (depthwise-ядра 7×7, LayerNorm, GELU), и она остаётся чисто свёрточной сетью.", "Choosing True confuses ConvNeXt with ViT, which splits the image into 16×16 patches and uses self-attention.", "Ответ True путает ConvNeXt с ViT, которая режет изображение на патчи 16×16 и использует self-attention."),
        qx("In the course notebook VGGMini (70.1 %) beat ResNetMini (63.7 %) at 8 layers. Why does this not contradict the ResNet paper?", "Skip connections pay off only in very deep nets", [
          ["ResNetMini had ten times more parameters", "Both have about 308 000 parameters and the same depth and width.", "У обеих около 308 000 параметров и одинаковые глубина и ширина."],
          ["Residual blocks cannot be used on small CIFAR-10 images", "Residual blocks work on any images; the notebook's ResNetMini was trained on CIFAR-10.", "Residual-блоки работают на любых изображениях; ResNetMini в ноутбуке обучалась именно на CIFAR-10."],
          ["VGG uses larger filters than ResNet", "Both use 3×3 convolutions; filter size is not the difference.", "Обе используют свёртки 3×3; разница не в размере фильтров."],
        ], "Skip connections solve the degradation problem of very deep networks; at 8 layers there is no such problem, so they bring no advantage.", "Skip-соединения решают проблему деградации очень глубоких сетей; на 8 слоях такой проблемы нет, поэтому и выигрыша нет."),
        qx("You have only 500 labelled leaf photos for a new CNN classifier. What is the recommended start?", "Fine-tune a pretrained net, frozen backbone", [
          ["Train ResNet-152 from scratch", "60 M parameters trained from scratch on 500 images would overfit badly.", "60 M параметров с нуля на 500 изображениях — сильное переобучение."],
          ["A linear classifier on raw pixels", "A linear classifier on pixels is a weak baseline (≈ 25 % on CIFAR-10).", "Линейный классификатор на пикселях — слабый baseline (≈ 25 % на CIFAR-10)."],
          ["Fine-tune all layers with a large learning rate", "A large learning rate would destroy the pretrained features; with more data, fine-tune all layers with a small one.", "Большой learning rate разрушит предобученные признаки; при большем объёме данных все слои дообучают с маленьким."],
        ], "Start from an ImageNet-pretrained network; with a small dataset freeze the backbone and train only the new classifier, with augmentation.", "Начните с сети, предобученной на ImageNet; при маленьком датасете заморозьте backbone и обучайте только новый классификатор, с аугментацией."),
        qx("A leaf-disease model must run in real time on a cheap phone. Which family is a reasonable choice?", "MobileNet or EfficientNet-B0", [
          ["VGG-16 with its 138 M parameters", "VGG-16 is huge and slow; it is the opposite of a mobile-friendly model.", "VGG-16 огромная и медленная — противоположность модели для телефона."],
          ["ResNet-152 for maximum accuracy", "ResNet-152 targets accuracy, not phones; it has ≈ 60 M parameters.", "ResNet-152 нацелена на точность, а не на телефоны; у неё ≈ 60 M параметров."],
          ["AlexNet with its large FC head", "AlexNet's ≈ 60 M parameters sit mostly in FC layers; it is neither accurate nor efficient by today's standards.", "≈ 60 M параметров AlexNet в основном в FC-слоях; по сегодняшним меркам она ни точная, ни экономная."],
        ], "For mobile or embedded devices the recipe picks MobileNet or EfficientNet-B0: similar accuracy with far fewer operations.", "Для телефонов и встраиваемых устройств рецепт советует MobileNet или EfficientNet-B0: похожая точность при гораздо меньшем числе операций."),
        qx("GoogLeNet has 22 layers but only ≈ 7 M parameters. What keeps the count so low?", "1×1 bottlenecks and global average pooling", [
          ["Huge 11×11 filters in the first convolution layer", "Large filters add parameters; GoogLeNet saves them with 1×1 reductions.", "Большие фильтры добавляют параметры; GoogLeNet экономит их сокращениями 1×1."],
          ["Three big FC layers of 4 096 units", "Big FC layers are where AlexNet and VGG keep most of their parameters; GoogLeNet dropped them.", "Большие FC-слои — как раз то место, где AlexNet и VGG хранят основную часть параметров; GoogLeNet от них отказалась."],
          ["Residual connections in every block", "Skip connections belong to ResNet (2015) and do not reduce the parameter count.", "Skip-соединения — это ResNet (2015), и они не уменьшают число параметров."],
        ], "1×1 convs shrink the depth before the costly 3×3 / 5×5 filters, and global average pooling replaces the huge FC layers: ≈ 7 M vs ≈ 60 M (AlexNet) and ≈ 138 M (VGG-16).", "Свёртки 1×1 уменьшают глубину перед дорогими фильтрами 3×3 / 5×5, а global average pooling заменяет огромные FC-слои: ≈ 7 M против ≈ 60 M (AlexNet) и ≈ 138 M (VGG-16)."),
      ],
    ),
  ],
};
