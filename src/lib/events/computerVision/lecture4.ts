import { part, qx, tfx, type Lecture } from "../types";

export const lecture4: Lecture = {
  id: "cv-l4",
  title: { en: "Lecture 4 — Neural networks and backpropagation", ru: "Лекция 4 — Нейронные сети и обратное распространение ошибки" },
  parts: [
    part(
      "cv-l4-p1",
      { en: "Neural networks: neurons, layers, activations and the forward pass", ru: "Нейронные сети: нейроны, слои, активации и прямой проход" },
      {
        en: `## Where linear classifiers stop
The classifier from Lecture 3 is **f(x) = Wx + b**: one row of W per class, so **one template per class**.
- **One template per class** — a horse facing left and a horse facing right must share one template, so the model learns a blurry **two-headed average**.
- **Only straight boundaries** — each class is cut off by a **hyperplane**; data like **XOR** or **concentric rings** cannot be split by any line.
The question of this lecture: how do we get **several templates per class** and **curved decision boundaries**? Answer: stack linear layers with a **non-linear activation** between them.
## Biological neuron vs artificial neuron
| Biological neuron | Artificial neuron |
|---|---|
| dendrites receive signals | inputs x₁ … xₙ |
| synapse strength | weight wᵢ |
| cell body integrates the signals | weighted sum Σ wᵢxᵢ + b |
| fires if a threshold is reached | activation g adds non-linearity |
| axon sends the spike on | output a feeds the next layer |
| synapses change with experience | weights change during training |
![A stylized biological neuron in soft blue light: branching dendrites on the left, a round cell body in the centre, a long axon stretching to the right and ending in small synapse terminals that touch the dendrites of a second neuron, dark background](/events/cv/l4-biological-neuron.webp)
| Parameter | Artificial (ANN) | Biological (BNN) |
|---|---|---|
| Structure | layers: input, hidden, output | dendrites, cell body, axon |
| Learning | an algorithm adjusts the weights | experience changes the synapses |
| Data | needs many labelled examples | copes with noisy, unlabelled input |
| Processing | digital, fast, on GPUs | electrochemical, slower, massively parallel |
| Adaptivity | mostly fixed after training | learns continuously |
| Efficiency | training uses huge amounts of energy | about 20 W, fault-tolerant |
Neural networks are **inspired by the brain, not a model of it**. A human brain has about **86 billion neurons** and runs on about **20 W**; real neurons use spikes, timing and chemistry, while an artificial neuron is **one formula: g(w·x + b)**.
## Five components of every network
- **Neurons** — units that sum their inputs and apply an activation function.
- **Connections** — links that carry each neuron's output to the next layer.
- **Weights and biases** — the learnable numbers: how strong each connection is.
- **Propagation** — how values flow forward, layer by layer, to the output.
- **Learning rule** — how the weights change to reduce the error: **gradient descent**.
Only **weights and biases are learned** (parameters). The architecture, the activation and the learning rate are **design choices** (hyperparameters) that we pick.
## One neuron: a weighted sum, then a function
@diagram cv-neuron
= z = w1·x1 + w2·x2 + w3·x3 + b,  a = g(z)
- **Linear step** — multiply, sum, add the bias: exactly one row of the linear classifier. The **bias shifts the threshold**.
- **Activation g** — ReLU, sigmoid or tanh bends the result. **Without g a neuron is just a linear classifier.**
Worked example with new numbers: x = [2, −1, 3], w = [0.5, 1, −1], b = 1.
= z = 0.5·2 + 1·(−1) + (−1)·3 + 1 = 1 − 1 − 3 + 1 = −2
= ReLU: a = max(0, −2) = 0
= sigmoid: a = 1 / (1 + e^2) ≈ 0.119
## Neurons organised in layers
- **Input layer** — one unit per feature, e.g. the **3072 pixel values** of a 32×32×3 image.
- **Hidden layers** — transform the inputs into useful features.
- **Output layer** — class scores or a regression value.
When every node connects to every node of the next layer, it is a **fully connected (dense) layer**. We count only layers **with weights**, so input → hidden → output is a **2-layer network**.
## A two-layer network on CIFAR-10
= f(x) = W2 · max(0, W1·x + b1) + b2
= shapes: x 3072, W1 100×3072, b1 100, W2 10×100, b2 10
= parameters = 3072·100 + 100 + 100·10 + 10 = 307 200 + 100 + 1 000 + 10 = 308 310
The first layer learns **100 templates**; the second layer **mixes** them, e.g. horse = 0.7 · left-facing + 0.6 · right-facing. So one class can have **several modes** — the key upgrade over Lecture 3.
= 784 → 128 → 10 (MNIST-sized): 784·128 + 128 + 128·10 + 10 = 100 352 + 128 + 1 280 + 10 = 101 770
## Why the non-linearity is essential
Remove max(0, ·) and the two layers collapse into one:
= W2(W1·x) = (W2·W1)x = W′x
- A product of matrices is one matrix: a 3×4 matrix times a 4×5 matrix is one 3×5 matrix.
- So **any stack of linear layers is still one linear classifier**: a 100-layer network without activations still draws straight boundaries and still cannot solve XOR. Biases do not help — the result stays W′x + b′.
- Depth adds power **only when an activation function sits between the layers**. That is why the activation is not optional.
## Activation functions
| Function | Formula | Range | Pros and cons |
|---|---|---|---|
| Sigmoid | 1 / (1 + e^−z) | (0, 1) | saturates, not zero-centred |
| tanh | tanh(z) | (−1, 1) | zero-centred, still saturates |
| ReLU | max(0, z) | [0, ∞) | default choice, cheap; units can die |
| Leaky ReLU | max(0.01z, z) | all real numbers | a small slope below zero fixes dead units |
| GELU | z · Φ(z) | about (−0.17, ∞) | standard in Transformers |
- **Saturation** — at the flat ends of sigmoid and tanh the slope is almost zero, so almost no gradient flows back and learning stalls (part 2 shows why).
- **ReLU** has slope exactly **1** for positive inputs, which is why deep networks train well with it; a unit that only ever gets negative inputs outputs 0 forever — a **dead unit**.
- Rule of thumb for this course: **ReLU in hidden layers**, **sigmoid only at the output of a binary task**.
## Forward pass: is this email spam?
Email “Get free gift cards now!”: free = 1, win = 0, offer = 1, so x = [1, 0, 1]. All biases are 0 to keep the arithmetic simple.
| Unit | Weighted sum | Activation | Output |
|---|---|---|---|
| H1 | 1·0.5 + 0·(−0.2) + 1·0.3 = 0.8 | ReLU | 0.8 |
| H2 | 1·0.4 + 0·0.1 + 1·(−0.5) = −0.1 | ReLU | 0 |
| Out | 0.8·0.7 + 0·0.2 = 0.56 | sigmoid | 0.636 |
= p = σ(0.56) = 1 / (1 + e^−0.56) ≈ 0.636 > 0.5 → spam
H2 outputs **0** because ReLU clips negative values. Keep these numbers: part 3 trains this network with backpropagation.
## Learning paradigms
| Paradigm | Where the signal comes from | In this course |
|---|---|---|
| Supervised | labelled pairs (x, y): the error against the true label | most of CV: classification, detection |
| Unsupervised | no labels: find clusters or compressed representations | later: autoencoders, self-supervised learning |
| Reinforcement | an agent acts and gets rewards or penalties | robotics, games; outside this course |
## Types of neural networks
| Architecture | Suited to | Main idea |
|---|---|---|
| Feedforward / MLP | fixed-size vectors | data flows one way, no cycles (this lecture) |
| CNN | images, video, grids | filters slide over the image (next lecture) |
| RNN, LSTM, GRU | sequences | a hidden state carries memory across time |
| Transformer | tokens, image patches | attention links every patch to every other: ViT, DETR, SAM |
| Autoencoder | compression | compress to a small code (bottleneck), then rebuild |
| GAN | generation | generator vs discriminator, trained together |
| Siamese | comparing two inputs | face verification, self-supervised learning |
Rarely used today but met in surveys and exams: **RBFN** (radial basis units), **SOM** (an unsupervised map that keeps neighbourhoods), **DBN** (stacked layers of the 2006–2012 pre-training era), **CapsNet** (capsules for part–whole relations), **SNN** (spiking neurons, closest to biology). Modern vision is built from **CNNs and Transformers**.
## Strengths and limitations
| Strengths | Limitations |
|---|---|
| learn non-linear patterns | expensive to train |
| extract features automatically | hard to interpret: a black box |
| parallel computation on GPUs | can overfit the training data |
| generalise to unseen data | need large, well-labelled datasets |
@diagram cv-overfitting
**Overfitting** = high training accuracy but low test accuracy, e.g. 95% vs 62%. Usual fixes: more data or augmentation, regularization (L2 weight decay, dropout), a simpler model, early stopping. The lecture's practical tip (CS231n): a **large network with stronger regularization** usually beats a small one, which is harder to optimise.
> A neuron is g(w·x + b); without a non-linear g any stack of layers collapses into one linear classifier, so the activation is what makes depth useful.
## Check yourself
?? Why can a single linear classifier not separate every dataset, and how does a two-layer network fix this?
?= Wx + b gives each class one straight boundary (a hyperplane), so data like XOR or concentric rings cannot be split; a hidden layer with a non-linear activation such as ReLU learns several templates and curved boundaries.
?? A student removes all ReLUs from a 5-layer network to make it faster. What happens to what it can learn?
?= Without activations W5·…·W1·x collapses into one matrix W′x (plus one bias), so the network becomes a single linear classifier and can no longer learn non-linear boundaries.`,
        ru: `## Где останавливаются линейные классификаторы
Классификатор из лекции 3 — это **f(x) = Wx + b**: одна строка W на класс, то есть **один шаблон на класс**.
- **Один шаблон на класс** — лошадь, смотрящая влево, и лошадь, смотрящая вправо, должны делить один шаблон, поэтому модель учит размытое **двухголовое среднее**.
- **Только прямые границы** — каждый класс отсекается **гиперплоскостью**; данные вроде **XOR** или **концентрических колец** не разделит никакая прямая.
Вопрос этой лекции: как получить **несколько шаблонов на класс** и **изогнутые границы решений**? Ответ: сложить линейные слои стопкой и поставить между ними **нелинейную активацию**.
## Биологический нейрон и искусственный нейрон
| Биологический нейрон | Искусственный нейрон |
|---|---|
| дендриты принимают сигналы | входы x₁ … xₙ |
| сила синапса | вес wᵢ |
| тело клетки суммирует сигналы | взвешенная сумма Σ wᵢxᵢ + b |
| срабатывает, если достигнут порог | активация g добавляет нелинейность |
| аксон передаёт импульс дальше | выход a идёт в следующий слой |
| синапсы меняются с опытом | веса меняются при обучении |
![Стилизованный биологический нейрон в мягком синем свете: ветвистые дендриты слева, круглое тело клетки в центре, длинный аксон тянется вправо и заканчивается маленькими синаптическими окончаниями, которые касаются дендритов второго нейрона, тёмный фон](/events/cv/l4-biological-neuron.webp)
| Параметр | Искусственная сеть (ANN) | Биологическая сеть (BNN) |
|---|---|---|
| Структура | слои: входной, скрытые, выходной | дендриты, тело клетки, аксон |
| Обучение | алгоритм подстраивает веса | опыт меняет синапсы |
| Данные | нужно много размеченных примеров | справляется с шумным неразмеченным входом |
| Обработка | цифровая, быстрая, на GPU | электрохимическая, медленнее, массово параллельная |
| Адаптивность | после обучения в основном фиксирована | учится непрерывно |
| Эффективность | обучение тратит огромное количество энергии | около 20 Вт, устойчива к сбоям |
Нейронные сети **вдохновлены мозгом, но не моделируют его**. В мозге человека около **86 млрд нейронов**, и работает он примерно на **20 Вт**; настоящие нейроны используют импульсы, тайминг и химию, а искусственный нейрон — это **одна формула: g(w·x + b)**.
## Пять компонентов любой сети
- **Нейроны (neurons)** — элементы, которые суммируют свои входы и применяют функцию активации.
- **Связи (connections)** — передают выход каждого нейрона в следующий слой.
- **Веса и смещения (weights, biases)** — обучаемые числа: насколько сильна каждая связь.
- **Распространение (propagation)** — как значения идут вперёд, слой за слоем, к выходу.
- **Правило обучения (learning rule)** — как меняются веса, чтобы уменьшить ошибку: **градиентный спуск (gradient descent)**.
**Обучаются только веса и смещения** (параметры). Архитектура, активация и скорость обучения — **решения проектировщика** (гиперпараметры), их выбираем мы.
## Один нейрон: взвешенная сумма, затем функция
@diagram cv-neuron
= z = w1·x1 + w2·x2 + w3·x3 + b,  a = g(z)
- **Линейный шаг** — умножить, сложить, добавить смещение: ровно одна строка линейного классификатора. **Смещение (bias) сдвигает порог**.
- **Активация g** — ReLU, sigmoid или tanh изгибает результат. **Без g нейрон — просто линейный классификатор.**
Пример с новыми числами: x = [2, −1, 3], w = [0.5, 1, −1], b = 1.
= z = 0.5·2 + 1·(−1) + (−1)·3 + 1 = 1 − 1 − 3 + 1 = −2
= ReLU: a = max(0, −2) = 0
= sigmoid: a = 1 / (1 + e^2) ≈ 0.119
## Нейроны, организованные в слои
- **Входной слой (input layer)** — по одному элементу на признак, например **3072 значения пикселей** изображения 32×32×3.
- **Скрытые слои (hidden layers)** — превращают входы в полезные признаки.
- **Выходной слой (output layer)** — оценки классов или значение регрессии.
Если каждый узел связан с каждым узлом следующего слоя, это **полносвязный (fully connected, dense) слой**. Считают только слои **с весами**, поэтому вход → скрытый → выход — это **2-слойная сеть**.
## Двухслойная сеть на CIFAR-10
= f(x) = W2 · max(0, W1·x + b1) + b2
= shapes: x 3072, W1 100×3072, b1 100, W2 10×100, b2 10
= parameters = 3072·100 + 100 + 100·10 + 10 = 307 200 + 100 + 1 000 + 10 = 308 310
Первый слой учит **100 шаблонов**; второй слой их **смешивает**, например лошадь = 0.7 · смотрящая влево + 0.6 · смотрящая вправо. Так у одного класса может быть **несколько мод** — главное улучшение по сравнению с лекцией 3.
= 784 → 128 → 10 (MNIST-sized): 784·128 + 128 + 128·10 + 10 = 100 352 + 128 + 1 280 + 10 = 101 770
## Почему нелинейность обязательна
Уберите max(0, ·) — и два слоя схлопнутся в один:
= W2(W1·x) = (W2·W1)x = W′x
- Произведение матриц — одна матрица: матрица 3×4, умноженная на матрицу 4×5, — это одна матрица 3×5.
- Поэтому **любой стек линейных слоёв — всё равно один линейный классификатор**: 100-слойная сеть без активаций по-прежнему проводит прямые границы и не решает XOR. Смещения не спасают — результат остаётся W′x + b′.
- Глубина добавляет силу, **только если между слоями стоит функция активации**. Поэтому активация не опциональна.
## Функции активации
| Функция | Формула | Диапазон | Плюсы и минусы |
|---|---|---|---|
| Sigmoid | 1 / (1 + e^−z) | (0, 1) | насыщается, не центрирована в нуле |
| tanh | tanh(z) | (−1, 1) | центрирована в нуле, но тоже насыщается |
| ReLU | max(0, z) | [0, ∞) | выбор по умолчанию, дешёвая; нейроны могут «умереть» |
| Leaky ReLU | max(0.01z, z) | все действительные числа | небольшой наклон ниже нуля лечит мёртвые нейроны |
| GELU | z · Φ(z) | примерно (−0.17, ∞) | стандарт в Transformer |
- **Насыщение (saturation)** — на плоских концах sigmoid и tanh наклон почти нулевой, поэтому назад почти не идёт градиент и обучение застревает (почему — во второй части).
- У **ReLU** наклон ровно **1** для положительных входов, поэтому глубокие сети с ней хорошо обучаются; нейрон, который получает только отрицательные входы, навсегда выдаёт 0 — это **мёртвый нейрон (dead unit)**.
- Правило для курса: **ReLU в скрытых слоях**, **sigmoid только на выходе бинарной задачи**.
## Прямой проход: это письмо — спам?
Письмо «Get free gift cards now!»: free = 1, win = 0, offer = 1, поэтому x = [1, 0, 1]. Все смещения равны 0, чтобы упростить арифметику.
| Нейрон | Взвешенная сумма | Активация | Выход |
|---|---|---|---|
| H1 | 1·0.5 + 0·(−0.2) + 1·0.3 = 0.8 | ReLU | 0.8 |
| H2 | 1·0.4 + 0·0.1 + 1·(−0.5) = −0.1 | ReLU | 0 |
| Out | 0.8·0.7 + 0·0.2 = 0.56 | sigmoid | 0.636 |
= p = σ(0.56) = 1 / (1 + e^−0.56) ≈ 0.636 > 0.5 → spam
H2 выдаёт **0**, потому что ReLU обрезает отрицательные значения. Запомните эти числа: в части 3 мы обучим эту сеть с помощью backpropagation.
## Парадигмы обучения
| Парадигма | Откуда берётся сигнал | В этом курсе |
|---|---|---|
| Supervised (с учителем) | размеченные пары (x, y): ошибка относительно истинной метки | большая часть CV: классификация, детекция |
| Unsupervised (без учителя) | меток нет: ищем кластеры или сжатые представления | позже: автоэнкодеры, self-supervised learning |
| Reinforcement (с подкреплением) | агент действует и получает награды или штрафы | робототехника, игры; вне этого курса |
## Типы нейронных сетей
| Архитектура | Для чего | Главная идея |
|---|---|---|
| Feedforward / MLP | векторы фиксированной длины | данные идут в одну сторону, без циклов (эта лекция) |
| CNN | изображения, видео, сетки | фильтры скользят по изображению (следующая лекция) |
| RNN, LSTM, GRU | последовательности | скрытое состояние переносит память во времени |
| Transformer | токены, патчи изображения | внимание (attention) связывает каждый патч с каждым: ViT, DETR, SAM |
| Autoencoder | сжатие | сжать в маленький код (bottleneck), затем восстановить |
| GAN | генерация | генератор против дискриминатора, обучаются вместе |
| Siamese | сравнение двух входов | верификация лиц, self-supervised learning |
Сегодня почти не используются, но встречаются в обзорах и на экзаменах: **RBFN** (радиально-базисные нейроны), **SOM** (карта без учителя, сохраняющая соседство), **DBN** (стек слоёв эпохи предобучения 2006–2012), **CapsNet** (капсулы для отношений «часть — целое»), **SNN** (импульсные нейроны, ближе всего к биологии). Современное зрение строят на **CNN и Transformer**.
## Сильные стороны и ограничения
| Сильные стороны | Ограничения |
|---|---|
| учат нелинейные закономерности | дорого обучать |
| сами извлекают признаки | трудно интерпретировать: «чёрный ящик» |
| параллельные вычисления на GPU | могут переобучиться на обучающих данных |
| обобщают на новые данные | нужны большие, хорошо размеченные датасеты |
@diagram cv-overfitting
**Переобучение (overfitting)** = высокая точность на обучении, но низкая на тесте, например 95% против 62%. Обычные средства: больше данных или аугментация, регуляризация (L2 weight decay, dropout), более простая модель, ранняя остановка. Практический совет лекции (CS231n): **большая сеть с более сильной регуляризацией** обычно лучше маленькой, которую труднее оптимизировать.
> Нейрон — это g(w·x + b); без нелинейной g любой стек слоёв схлопывается в один линейный классификатор, поэтому именно активация делает глубину полезной.
## Проверь себя
?? Почему один линейный классификатор не может разделить любой датасет и как это исправляет двухслойная сеть?
?= Wx + b даёт каждому классу одну прямую границу (гиперплоскость), поэтому XOR или концентрические кольца не разделить; скрытый слой с нелинейной активацией, например ReLU, учит несколько шаблонов и изогнутые границы.
?? Студент убирает все ReLU из 5-слойной сети, чтобы она работала быстрее. Что станет с тем, что она может выучить?
?= Без активаций W5·…·W1·x схлопывается в одну матрицу W′x (плюс одно смещение), сеть становится одним линейным классификатором и больше не может учить нелинейные границы.`,
      },
      [
        qx("Why does a linear classifier on CIFAR-10 learn a blurry two-headed horse template?", "It has only one template per class", [
          ["Its bias vector b is set to zero", "The bias only shifts the scores; the blur comes from a single row of W having to cover every horse pose.", "Смещение лишь сдвигает оценки; размытость возникает потому, что одна строка W должна покрыть все позы лошади."],
          ["Its images are converted to grayscale", "CIFAR-10 templates are in colour; the problem is that one template must serve left- and right-facing horses.", "Шаблоны CIFAR-10 цветные; проблема в том, что один шаблон должен обслужить лошадей, смотрящих и влево, и вправо."],
          ["It uses ReLU between its layers", "A linear classifier has no hidden layers and no ReLU; adding them is exactly what fixes the problem.", "У линейного классификатора нет скрытых слоёв и ReLU; именно их добавление и решает проблему."],
        ], "f(x) = Wx + b has one row of W per class, so left- and right-facing horses are averaged into one two-headed template.", "В f(x) = Wx + b на каждый класс одна строка W, поэтому лошади, смотрящие влево и вправо, усредняются в один двухголовый шаблон."),
        qx("Which labelling of 2D points can no single linear classifier get fully right?", "Label = XOR of the signs of x1 and x2", [
          ["Label = 1 if x1 + x2 > 0", "x1 + x2 = 0 is a straight line, so a linear classifier separates this perfectly.", "x1 + x2 = 0 — прямая, поэтому линейный классификатор разделит это идеально."],
          ["Label = 1 if x1 > 3", "The boundary x1 = 3 is a vertical line, which a linear classifier handles.", "Граница x1 = 3 — вертикальная прямая, с ней линейный классификатор справится."],
          ["Two clusters on opposite sides of a line", "If a line separates the clusters, a linear classifier can learn that line.", "Если кластеры разделяет прямая, линейный классификатор её и выучит."],
        ], "XOR puts the same class in opposite quadrants; no single straight line separates them, so a hidden layer with a non-linearity is needed.", "XOR кладёт один класс в противоположные квадранты; ни одна прямая их не разделит, поэтому нужен скрытый слой с нелинейностью."),
        qx("In the neuron analogy, which part of an artificial neuron plays the role of synapse strength?", "The weight wᵢ of a connection", [
          ["The activation function g", "The activation corresponds to the neuron firing once a threshold is reached, not to synapse strength.", "Активация соответствует срабатыванию нейрона при достижении порога, а не силе синапса."],
          ["The output a sent to the next layer", "The output plays the role of the axon that sends the spike on.", "Выход играет роль аксона, который передаёт импульс дальше."],
          ["The weighted sum Σ wᵢxᵢ + b", "The weighted sum is the cell body integrating the signals.", "Взвешенная сумма — это тело клетки, которое суммирует сигналы."],
        ], "Dendrites = inputs, synapse strength = weight, cell body = weighted sum, firing = activation, axon = output.", "Дендриты = входы, сила синапса = вес, тело клетки = взвешенная сумма, срабатывание = активация, аксон = выход."),
        tfx("An artificial neuron is a faithful model of a biological neuron, including its spikes and timing.", false, "Networks are inspired by the brain, not a model of it: real neurons use spikes, timing and chemistry, an artificial one is just g(w·x + b).", "Сети вдохновлены мозгом, но не моделируют его: настоящие нейроны используют импульсы, тайминг и химию, а искусственный — просто g(w·x + b).", "Choosing True ignores the lecture's warning: the analogy motivates the idea, but the maths is only a weighted sum plus a function.", "Ответ True игнорирует предупреждение лекции: аналогия лишь мотивирует идею, а математика — это взвешенная сумма плюс функция."),
        qx("Which of these is learned during training rather than chosen by the designer?", "The hidden-layer biases", [
          ["The learning rate η", "The learning rate is a hyperparameter set before training.", "Скорость обучения — гиперпараметр, его задают до обучения."],
          ["The number of hidden units", "The width of a layer is part of the architecture, a design choice.", "Ширина слоя — часть архитектуры, это решение проектировщика."],
          ["Using ReLU as the activation", "The activation function is chosen by us; it has no learnable values here.", "Функцию активации выбираем мы; обучаемых чисел у неё здесь нет."],
        ], "Only weights and biases are learned; architecture, activation and learning rate are hyperparameters.", "Обучаются только веса и смещения; архитектура, активация и скорость обучения — гиперпараметры."),
        qx("A neuron has x = [2, −1, 3], w = [0.5, 1, −1], b = 1 and ReLU activation. What does it output?", "0", [
          ["−2", "−2 is z before the activation; ReLU turns any negative z into 0.", "−2 — это z до активации; ReLU превращает любое отрицательное z в 0."],
          ["−3", "−3 is the weighted sum without the bias; z = −3 + 1 = −2, and ReLU then gives 0.", "−3 — взвешенная сумма без смещения; z = −3 + 1 = −2, а ReLU затем даёт 0."],
          ["2", "ReLU does not flip the sign; it outputs max(0, z) = max(0, −2) = 0.", "ReLU не меняет знак; она выдаёт max(0, z) = max(0, −2) = 0."],
        ], "z = 0.5·2 + 1·(−1) + (−1)·3 + 1 = −2, and ReLU(−2) = max(0, −2) = 0.", "z = 0.5·2 + 1·(−1) + (−1)·3 + 1 = −2, и ReLU(−2) = max(0, −2) = 0."),
        qx("A network has an input layer, one hidden layer and an output layer. By the usual convention, how many layers is it?", "2 — layers with weights", [
          ["3 — input, hidden and output", "The input layer has no weights, so it is not counted.", "У входного слоя нет весов, поэтому его не считают."],
          ["1 — hidden only", "The output layer has weights too, so it is counted along with the hidden one.", "У выходного слоя тоже есть веса, поэтому он считается вместе со скрытым."],
          ["4 — the ReLU counts as a layer", "Activations have no weights; the convention counts weight layers only.", "У активаций нет весов; по соглашению считают только слои с весами."],
        ], "Layers are counted by their weights: W1 (input → hidden) and W2 (hidden → output) make a 2-layer network.", "Слои считают по весам: W1 (вход → скрытый) и W2 (скрытый → выход) — это 2-слойная сеть."),
        qx("How many parameters does a fully connected 3072 → 100 → 10 network with biases have?", "308 310", [
          ["308 200", "308 200 forgets the 110 biases: 100 in the hidden layer and 10 in the output layer.", "308 200 — забыты 110 смещений: 100 в скрытом слое и 10 в выходном."],
          ["307 310", "307 310 misses W2: the 100·10 = 1 000 weights of the second layer.", "В 307 310 пропущена W2: 100·10 = 1 000 весов второго слоя."],
          ["3 072 000", "That multiplies the layer sizes 3072·100·10 instead of adding the two layers' parameters.", "Здесь перемножены размеры слоёв 3072·100·10 вместо сложения параметров двух слоёв."],
        ], "3072·100 + 100 + 100·10 + 10 = 307 200 + 100 + 1 000 + 10 = 308 310.", "3072·100 + 100 + 100·10 + 10 = 307 200 + 100 + 1 000 + 10 = 308 310."),
        qx("An MLP maps 784 inputs to 128 hidden units to 10 classes, with biases. How many parameters does it have?", "101 770", [
          ["101 632", "101 632 counts only the weights; add the 128 + 10 = 138 biases.", "101 632 — только веса; добавьте 128 + 10 = 138 смещений."],
          ["100 480", "100 480 is just the first layer (784·128 + 128); the second layer adds 1 290 more.", "100 480 — только первый слой (784·128 + 128); второй добавляет ещё 1 290."],
          ["101 760", "101 760 forgets the 10 output biases b2.", "В 101 760 забыты 10 смещений выходного слоя b2."],
        ], "784·128 + 128 + 128·10 + 10 = 100 352 + 128 + 1 280 + 10 = 101 770.", "784·128 + 128 + 128·10 + 10 = 100 352 + 128 + 1 280 + 10 = 101 770."),
        qx("In f = W2 · max(0, W1x + b1) + b2 on CIFAR-10, what does the second layer do?", "Mixes the hidden templates into class scores", [
          ["Turns the class scores into probabilities", "That is the job of softmax or sigmoid; W2 produces scores, not probabilities.", "Это делает softmax или sigmoid; W2 выдаёт оценки, а не вероятности."],
          ["Flattens the 32×32×3 image into 3072 values", "Flattening happens before the first layer; W2 works on the 100 hidden values.", "Выпрямление происходит до первого слоя; W2 работает со 100 скрытыми значениями."],
          ["Clips negative hidden values to zero", "Clipping is done by max(0, ·), the ReLU between the layers, not by W2.", "Обрезку делает max(0, ·) — ReLU между слоями, а не W2."],
        ], "The first layer learns 100 templates; W2 combines them, e.g. horse = 0.7 · left-facing + 0.6 · right-facing.", "Первый слой учит 100 шаблонов; W2 их смешивает, например лошадь = 0.7 · смотрящая влево + 0.6 · смотрящая вправо."),
        qx("A student says: 10 linear layers stacked without activations give a stronger classifier than one. Is it right?", "No: the product W10…W1 is one matrix", [
          ["Yes: every layer adds a new boundary", "Without activations the layers multiply into one matrix, so there is still only one linear boundary per class.", "Без активаций слои перемножаются в одну матрицу, поэтому у класса по-прежнему одна линейная граница."],
          ["Yes, as long as every layer has a bias", "Biases keep the stack affine: it collapses into W′x + b′, still a linear classifier.", "Смещения оставляют стек аффинным: он схлопывается в W′x + b′ — всё тот же линейный классификатор."],
          ["No: deep linear stacks cannot be trained", "They can be trained; the problem is that they are no more expressive than one linear layer.", "Обучать их можно; проблема в том, что они не выразительнее одного линейного слоя."],
        ], "W2(W1x) = (W2W1)x = W′x: any stack of linear layers collapses into one linear layer, so depth needs activations.", "W2(W1x) = (W2W1)x = W′x: любой стек линейных слоёв схлопывается в один линейный слой, поэтому глубине нужны активации."),
        qx("Two linear layers with no activation have W1 of shape 4×5 and W2 of shape 3×4. What single matrix replaces them?", "W2·W1, of shape 3×5", [
          ["W1·W2, of shape 4×4", "x is multiplied by W1 first, so the product is W2·W1; and 4×5 times 3×4 is not even defined.", "x сначала умножается на W1, поэтому произведение — W2·W1; а 4×5 на 3×4 вообще не умножается."],
          ["W2·W1, of shape 4×4", "The product of 3×4 and 4×5 takes the outer sizes: 3×5, not 4×4.", "Произведение 3×4 на 4×5 берёт внешние размеры: 3×5, а не 4×4."],
          ["W2·W1, of shape 3×4", "3×4 is W2's own shape; the product has W2's rows and W1's columns: 3×5.", "3×4 — форма самой W2; у произведения строки W2 и столбцы W1: 3×5."],
        ], "W2(W1x) = (W2·W1)x, and (3×4)·(4×5) = 3×5, so the two layers act as one 3×5 linear map.", "W2(W1x) = (W2·W1)x, а (3×4)·(4×5) = 3×5, поэтому два слоя работают как одно линейное отображение 3×5."),
        qx("Which activation outputs values in (−1, 1) and is zero-centred?", "tanh", [
          ["Sigmoid", "Sigmoid outputs (0, 1), so it is not zero-centred.", "Sigmoid выдаёт (0, 1), поэтому не центрирована в нуле."],
          ["ReLU", "ReLU outputs [0, ∞): zero for negatives, identity for positives.", "ReLU выдаёт [0, ∞): ноль для отрицательных и само значение для положительных."],
          ["GELU", "GELU ranges from about −0.17 to ∞; it is the Transformer default.", "GELU принимает значения примерно от −0.17 до ∞; это стандарт для Transformer."],
        ], "tanh(z) has range (−1, 1) and is zero-centred, but its flat ends still saturate.", "tanh(z) имеет диапазон (−1, 1) и центрирована в нуле, но её плоские концы всё равно насыщаются."),
        qx("What does it mean that a sigmoid unit saturates?", "At its flat ends the slope is almost zero", [
          ["Its output can grow beyond 1", "Sigmoid is bounded in (0, 1); it never exceeds 1.", "Sigmoid ограничена интервалом (0, 1) и никогда не превышает 1."],
          ["It outputs exactly 0 for any negative input", "That describes ReLU; a sigmoid of a negative input lies between 0 and 0.5.", "Это описание ReLU; sigmoid отрицательного входа лежит между 0 и 0.5."],
          ["Its weights grow without bound", "Saturation is about the activation's slope, not the size of the weights.", "Насыщение — про наклон активации, а не про величину весов."],
        ], "Saturation: for large |z| the curve is flat, its gradient is near zero, so almost no gradient flows back and learning stalls.", "Насыщение: при большом |z| кривая плоская, градиент почти нулевой, назад почти ничего не проходит, и обучение застревает."),
        qx("Which activation keeps a small slope below zero so that units cannot die?", "Leaky ReLU, max(0.01z, z)", [
          ["ReLU, max(0, z)", "ReLU has slope 0 for negative inputs, so a unit that always gets negatives stops learning: it dies.", "У ReLU наклон 0 для отрицательных входов, поэтому нейрон, получающий только отрицательные значения, перестаёт учиться — «умирает»."],
          ["Sigmoid, 1 / (1 + e^−z)", "Sigmoid does not die, but it saturates at both ends; it is not the fix for dead ReLUs.", "Sigmoid не «умирает», но насыщается с обеих сторон; это не лекарство от мёртвых ReLU."],
          ["tanh, zero-centred in (−1, 1)", "tanh is zero-centred but still saturates; the dead-unit fix is Leaky ReLU.", "tanh центрирована в нуле, но тоже насыщается; лекарство от мёртвых нейронов — Leaky ReLU."],
        ], "Leaky ReLU = max(0.01z, z) keeps a small slope for z < 0, so the gradient still flows and units do not die.", "Leaky ReLU = max(0.01z, z) сохраняет небольшой наклон при z < 0, поэтому градиент течёт и нейроны не «умирают»."),
        qx("Spam network: hidden outputs [0.8, 0], output weights [0.7, 0.2], sigmoid output. What is p and the decision?", "p ≈ 0.636, so spam", [
          ["p = 0.56, so spam", "0.56 is z, the input of the sigmoid; p = σ(0.56) ≈ 0.636.", "0.56 — это z, вход sigmoid; p = σ(0.56) ≈ 0.636."],
          ["p ≈ 0.364, so not spam", "0.364 = 1 − p; the sigmoid gives σ(0.56) ≈ 0.636 > 0.5.", "0.364 = 1 − p; sigmoid даёт σ(0.56) ≈ 0.636 > 0.5."],
          ["p ≈ 0.668, so spam", "0.668 = σ(0.7) uses the weight 0.7 alone and forgets to multiply it by h1 = 0.8.", "0.668 = σ(0.7) — взят только вес 0.7, без умножения на h1 = 0.8."],
        ], "z = 0.8·0.7 + 0·0.2 = 0.56, p = 1 / (1 + e^−0.56) ≈ 0.636 > 0.5, so the email is classified as spam.", "z = 0.8·0.7 + 0·0.2 = 0.56, p = 1 / (1 + e^−0.56) ≈ 0.636 > 0.5, поэтому письмо считается спамом."),
        qx("Spam net (H1 w = [0.5, −0.2, 0.3], H2 w = [0.4, 0.1, −0.5], out w = [0.7, 0.2], no biases, ReLU). For x = [1, 0, 0], what is z?", "0.43", [
          ["0.35", "0.35 counts only H1's part 0.5·0.7; H2 = 0.4 is positive here and adds 0.4·0.2 = 0.08.", "0.35 — только вклад H1 0.5·0.7; H2 = 0.4 здесь положителен и добавляет 0.4·0.2 = 0.08."],
          ["0.9", "0.9 just adds the hidden outputs 0.5 + 0.4 without the output weights.", "0.9 — просто сумма скрытых выходов 0.5 + 0.4 без выходных весов."],
          ["0.56", "0.56 is z for the original email x = [1, 0, 1], not for x = [1, 0, 0].", "0.56 — это z для исходного письма x = [1, 0, 1], а не для x = [1, 0, 0]."],
        ], "H1 = 0.5 and H2 = 0.4 (both positive, ReLU keeps them), z = 0.5·0.7 + 0.4·0.2 = 0.35 + 0.08 = 0.43.", "H1 = 0.5 и H2 = 0.4 (оба положительны, ReLU их оставляет), z = 0.5·0.7 + 0.4·0.2 = 0.35 + 0.08 = 0.43."),
        qx("A model groups unlabelled leaf photos into clusters by similarity. Which learning paradigm is this?", "Unsupervised learning", [
          ["Supervised learning", "Supervised learning needs labelled pairs (x, y); these photos have no labels.", "Обучению с учителем нужны размеченные пары (x, y); у этих фото меток нет."],
          ["Reinforcement learning", "Reinforcement learning needs an agent that acts and receives rewards, not photo clustering.", "Обучению с подкреплением нужен агент, который действует и получает награды, а не кластеризация фото."],
          ["Image classification", "Classification is a supervised task: it predicts labels known in advance.", "Классификация — задача с учителем: она предсказывает заранее известные метки."],
        ], "No labels, and the goal is to find structure such as clusters: that is unsupervised learning.", "Меток нет, а цель — найти структуру вроде кластеров: это обучение без учителя."),
        qx("Which architecture is matched correctly with its main idea?", "Autoencoder: compress to a code, then rebuild", [
          ["GAN: a hidden state carries memory over time", "A hidden state carried over time is the RNN idea; a GAN trains a generator against a discriminator.", "Скрытое состояние во времени — идея RNN; GAN обучает генератор против дискриминатора."],
          ["CNN: attention links every patch to all others", "Attention between patches is the Transformer idea; a CNN slides filters over the image.", "Внимание между патчами — идея Transformer; CNN скользит фильтрами по изображению."],
          ["RNN: generator and discriminator compete", "Generator vs discriminator is a GAN; an RNN processes sequences with a hidden state.", "Генератор против дискриминатора — это GAN; RNN обрабатывает последовательности со скрытым состоянием."],
        ], "An autoencoder compresses the input into a small bottleneck code and then reconstructs it.", "Автоэнкодер сжимает вход в маленький код (bottleneck) и затем восстанавливает его."),
        qx("Train accuracy is 95%, test accuracy 62%. Which response matches the lecture's practical tip?", "Keep a large network, add stronger regularization", [
          ["Remove the ReLUs to make the model linear", "A linear model underfits non-linear data; the tip is regularization such as weight decay or dropout.", "Линейная модель недообучится на нелинейных данных; совет — регуляризация вроде weight decay или dropout."],
          ["Tune hyperparameters on the test set", "Tuning on the test set leaks it into training; use a validation set instead.", "Подбор на тестовом наборе делает его частью обучения; для этого есть валидационный набор."],
          ["Train longer on the same training data", "Training longer usually widens the gap; early stopping would do the opposite.", "Более долгое обучение обычно увеличивает разрыв; ранняя остановка делает наоборот."],
        ], "95% vs 62% is overfitting. The lecture's tip (CS231n): a larger network with stronger regularization (weight decay, dropout) usually wins.", "95% против 62% — переобучение. Совет лекции (CS231n): большая сеть с более сильной регуляризацией (weight decay, dropout) обычно выигрывает."),
      ],
    ),
    part(
      "cv-l4-p2",
      { en: "Computational graphs, the chain rule and gate patterns", ru: "Вычислительные графы, цепное правило и шаблоны узлов" },
      {
        en: `## How a network learns: the training loop
| Step | What happens |
|---|---|
| 1. Forward | inputs flow through the layers to a prediction |
| 2. Loss | measure the error: MSE or cross-entropy |
| 3. Backward | the chain rule gives ∂L/∂w for every weight |
| 4. Update | step against the gradient |
| 5. Repeat | many epochs until the loss is low |
= w ← w − η · ∂L/∂w
- **η (eta)** is the **learning rate**, a hyperparameter we choose.
- The minus sign means we step **against** the gradient: if ∂L/∂w > 0, a bigger w raises the loss, so w goes down; if ∂L/∂w < 0, w goes up.
= w = 0.5, ∂L/∂w = 2, η = 0.1 → w = 0.5 − 0.1·2 = 0.3
Step 3, the backward pass, is **backpropagation** — the topic of this part.
## The problem: 308 310 weights, one loss
To update every weight we need ∂L/∂w for each one of them. Three ways to get it:
| Way | Cost | Verdict |
|---|---|---|
| By hand | pages of algebra, redone for every new architecture | infeasible |
| Numerically | two forward passes per weight: 2 × 308 310 ≈ 616 000 per step | far too slow |
| Backpropagation | one forward and one backward pass for all weights | about 2–3× a forward pass |
Backprop is cheap because it **reuses the intermediate results** of the forward pass instead of rerunning the network for every weight.
## Computational graph
A **computational graph** breaks the computation into **simple nodes** (+, ×, max, exp …). In the **forward pass** values flow **left → right**; in the **backward pass** gradients flow **right → left**, from the loss back to the inputs.
## The chain rule at one node
For a node z = f(x) somewhere inside the graph:
= ∂L/∂x = ∂z/∂x · ∂L/∂z
= downstream = local × upstream
- **Upstream gradient ∂L/∂z** — arrives from the loss side.
- **Local gradient ∂z/∂x** — the node's own derivative; it depends only on the node's inputs.
- **Downstream gradient ∂L/∂x** — what the node sends further back.
A node **never needs to know the rest of the network**: it multiplies what arrives from above by its own local derivative. This single rule is the whole algorithm. The backward pass starts with **∂L/∂L = 1** at the output.
## Worked example: f = (x + y) · z
Inputs x = −2, y = 5, z = −4. Name the middle value q = x + y.
= forward: q = x + y = −2 + 5 = 3
= forward: f = q · z = 3 · (−4) = −12
= backward: ∂f/∂f = 1
= backward: ∂f/∂z = q = 3
= backward: ∂f/∂q = z = −4
= backward: ∂f/∂x = ∂q/∂x · ∂f/∂q = 1 · (−4) = −4
= backward: ∂f/∂y = ∂q/∂y · ∂f/∂q = 1 · (−4) = −4
| Variable | Forward | Local gradient | Upstream | Gradient of f |
|---|---|---|---|---|
| f | −12 | — | — | 1 |
| z | −4 | ∂f/∂z = q = 3 | 1 | 3 |
| q | 3 | ∂f/∂q = z = −4 | 1 | −4 |
| x | −2 | ∂q/∂x = 1 | −4 | −4 |
| y | 5 | ∂q/∂y = 1 | −4 | −4 |
Numerical check: increase x by 0.01 → q = 3.01 → f = 3.01 · (−4) = −12.04. The change −0.04 = −4 × 0.01 ✔, so the gradient is real.
## Gate patterns: how gradients move
@diagram cv-backprop-gates
| Gate | Nickname | Backward rule |
|---|---|---|
| add | distributor | passes the upstream gradient unchanged to every input |
| multiply | swapper | gradient to one input = upstream × the other input |
| max | router | all of the gradient goes to the larger input, zero to the rest |
| copy (one value feeds several branches) | adder | the gradients of all branches are summed |
In the worked example the **+ node distributed** −4 to both x and y, and the **× node swapped**: z got q = 3, q got z = −4.
Practice with new numbers (upstream gradient 2 for the first three gates):
= add: f = x + y → ∂f/∂x = 2, ∂f/∂y = 2
= multiply: f = x · y, x = 3, y = −5 → ∂f/∂x = 2 · (−5) = −10, ∂f/∂y = 2 · 3 = 6
= max: f = max(x, y), x = 4, y = 1 → ∂f/∂x = 2, ∂f/∂y = 0
= copy: x feeds two branches with gradients 3 and −1 → ∂L/∂x = 3 + (−1) = 2
**ReLU = max(0, z)** is a router: it passes the gradient where z > 0 and blocks it (gives 0) where z < 0.
## A sigmoid node and saturation
A sigmoid can be one node because its local gradient has a neat form:
= σ′(z) = σ(z) · (1 − σ(z))
= z = 0: σ = 0.5 → σ′ = 0.5 · 0.5 = 0.25 (the largest value)
= σ = 0.99 → σ′ = 0.99 · 0.01 ≈ 0.01
At σ = 0.99 the downstream gradient is about **100 times smaller** than the upstream one: that is **saturation**. Stack many saturated sigmoids and almost nothing reaches the first layers — the reason **ReLU**, with slope 1 for positive inputs, is the default hidden activation.
> Backprop is one rule applied node by node, downstream = local × upstream: add distributes, multiply swaps, max routes, copy adds.
## Check yourself
?? For f = (x + y) · z with x = 1, y = 3, z = −2, compute f and ∂f/∂x, ∂f/∂y, ∂f/∂z. Show the steps.
?= Forward: q = x + y = 4, f = q · z = −8. Backward: ∂f/∂z = q = 4, ∂f/∂q = z = −2, and the add gate passes −2 unchanged, so ∂f/∂x = ∂f/∂y = −2.
?? Why is backpropagation used instead of numerical gradients to train a network with 308 310 weights?
?= Numerical gradients need two forward passes per weight, about 616 000 per update, while backprop gets every ∂L/∂w from one forward and one backward pass (about 2–3× a forward pass) by applying the chain rule and reusing intermediate values.`,
        ru: `## Как сеть учится: цикл обучения
| Шаг | Что происходит |
|---|---|
| 1. Forward (прямой проход) | входы проходят через слои до предсказания |
| 2. Loss (потери) | измеряем ошибку: MSE или cross-entropy |
| 3. Backward (обратный проход) | цепное правило даёт ∂L/∂w для каждого веса |
| 4. Update (обновление) | шаг против градиента |
| 5. Repeat (повтор) | много эпох, пока потери не станут малыми |
= w ← w − η · ∂L/∂w
- **η (эта)** — **скорость обучения (learning rate)**, гиперпараметр, который выбираем мы.
- Минус означает шаг **против** градиента: если ∂L/∂w > 0, рост w увеличивает потери, поэтому w уменьшается; если ∂L/∂w < 0, w растёт.
= w = 0.5, ∂L/∂w = 2, η = 0.1 → w = 0.5 − 0.1·2 = 0.3
Шаг 3, обратный проход, — это **backpropagation (обратное распространение ошибки)**, тема этой части.
## Проблема: 308 310 весов и одна функция потерь
Чтобы обновить каждый вес, нужен ∂L/∂w для каждого из них. Три способа его получить:
| Способ | Цена | Вердикт |
|---|---|---|
| Вручную | страницы алгебры, заново для каждой новой архитектуры | невыполнимо |
| Численно | два прямых прохода на вес: 2 × 308 310 ≈ 616 000 за шаг | слишком медленно |
| Backpropagation | один прямой и один обратный проход для всех весов | примерно 2–3 прямых прохода |
Backprop дёшев, потому что **переиспользует промежуточные результаты** прямого прохода, а не прогоняет сеть заново для каждого веса.
## Вычислительный граф
**Вычислительный граф (computational graph)** разбивает вычисление на **простые узлы** (+, ×, max, exp …). При **прямом проходе** значения идут **слева направо**; при **обратном проходе** градиенты идут **справа налево** — от потерь назад к входам.
## Цепное правило в одном узле
Для узла z = f(x) где-то внутри графа:
= ∂L/∂x = ∂z/∂x · ∂L/∂z
= downstream = local × upstream
- **Входящий градиент (upstream) ∂L/∂z** — приходит со стороны потерь.
- **Локальный градиент (local) ∂z/∂x** — собственная производная узла; зависит только от входов узла.
- **Исходящий градиент (downstream) ∂L/∂x** — то, что узел передаёт дальше назад.
Узлу **не нужно знать остальную сеть**: он умножает то, что пришло сверху, на свою локальную производную. Это единственное правило и есть весь алгоритм. Обратный проход начинается с **∂L/∂L = 1** на выходе.
## Разбор примера: f = (x + y) · z
Входы x = −2, y = 5, z = −4. Обозначим промежуточное значение q = x + y.
= forward: q = x + y = −2 + 5 = 3
= forward: f = q · z = 3 · (−4) = −12
= backward: ∂f/∂f = 1
= backward: ∂f/∂z = q = 3
= backward: ∂f/∂q = z = −4
= backward: ∂f/∂x = ∂q/∂x · ∂f/∂q = 1 · (−4) = −4
= backward: ∂f/∂y = ∂q/∂y · ∂f/∂q = 1 · (−4) = −4
| Переменная | Прямой проход | Локальный градиент | Входящий | Градиент f |
|---|---|---|---|---|
| f | −12 | — | — | 1 |
| z | −4 | ∂f/∂z = q = 3 | 1 | 3 |
| q | 3 | ∂f/∂q = z = −4 | 1 | −4 |
| x | −2 | ∂q/∂x = 1 | −4 | −4 |
| y | 5 | ∂q/∂y = 1 | −4 | −4 |
Численная проверка: увеличим x на 0.01 → q = 3.01 → f = 3.01 · (−4) = −12.04. Изменение −0.04 = −4 × 0.01 ✔, значит градиент настоящий.
## Шаблоны узлов: как движутся градиенты
@diagram cv-backprop-gates
| Узел | Прозвище | Правило обратного прохода |
|---|---|---|
| add (сложение) | distributor (распределитель) | передаёт входящий градиент без изменений каждому входу |
| multiply (умножение) | swapper (переставляльщик) | градиент одному входу = входящий × другой вход |
| max | router (маршрутизатор) | весь градиент идёт большему входу, остальным — ноль |
| copy (одно значение идёт в несколько веток) | adder (сумматор) | градиенты всех веток складываются |
В разобранном примере **узел + раздал** −4 и x, и y, а **узел × переставил**: z получил q = 3, q получил z = −4.
Тренировка на новых числах (входящий градиент 2 для первых трёх узлов):
= add: f = x + y → ∂f/∂x = 2, ∂f/∂y = 2
= multiply: f = x · y, x = 3, y = −5 → ∂f/∂x = 2 · (−5) = −10, ∂f/∂y = 2 · 3 = 6
= max: f = max(x, y), x = 4, y = 1 → ∂f/∂x = 2, ∂f/∂y = 0
= copy: x feeds two branches with gradients 3 and −1 → ∂L/∂x = 3 + (−1) = 2
**ReLU = max(0, z)** — маршрутизатор: пропускает градиент там, где z > 0, и блокирует его (даёт 0) там, где z < 0.
## Узел sigmoid и насыщение
Sigmoid можно сделать одним узлом, потому что у её локального градиента удобная форма:
= σ′(z) = σ(z) · (1 − σ(z))
= z = 0: σ = 0.5 → σ′ = 0.5 · 0.5 = 0.25 (the largest value)
= σ = 0.99 → σ′ = 0.99 · 0.01 ≈ 0.01
При σ = 0.99 исходящий градиент примерно **в 100 раз меньше** входящего: это и есть **насыщение (saturation)**. Сложите много насыщенных sigmoid — и до первых слоёв почти ничего не дойдёт; поэтому **ReLU** с наклоном 1 для положительных входов — активация скрытых слоёв по умолчанию.
> Backprop — одно правило, применённое узел за узлом, downstream = local × upstream: сложение раздаёт, умножение переставляет, max маршрутизирует, копирование складывает.
## Проверь себя
?? Для f = (x + y) · z при x = 1, y = 3, z = −2 найдите f и ∂f/∂x, ∂f/∂y, ∂f/∂z. Покажите шаги.
?= Прямой проход: q = x + y = 4, f = q · z = −8. Обратный: ∂f/∂z = q = 4, ∂f/∂q = z = −2, и узел сложения передаёт −2 без изменений, поэтому ∂f/∂x = ∂f/∂y = −2.
?? Почему для обучения сети с 308 310 весами используют backpropagation, а не численные градиенты?
?= Численным градиентам нужны два прямых прохода на каждый вес — около 616 000 на одно обновление, а backprop получает все ∂L/∂w за один прямой и один обратный проход (примерно 2–3 прямых прохода), применяя цепное правило и переиспользуя промежуточные значения.`,
      },
      [
        qx("Which order describes one training step of a neural network?", "Forward, loss, backward, update", [
          ["Backward, forward, loss, update", "Backward needs the loss, and the loss needs the forward pass first.", "Обратному проходу нужна функция потерь, а ей — сначала прямой проход."],
          ["Forward, update, loss, backward", "The update uses ∂L/∂w, so it must come after the backward pass.", "Обновление использует ∂L/∂w, поэтому идёт после обратного прохода."],
          ["Loss, forward, backward, update", "The loss compares a prediction with the label, so the forward pass comes first.", "Потери сравнивают предсказание с меткой, поэтому сначала идёт прямой проход."],
        ], "1 forward → 2 loss → 3 backward (the chain rule gives ∂L/∂w) → 4 update → 5 repeat for many epochs.", "1 прямой проход → 2 потери → 3 обратный проход (цепное правило даёт ∂L/∂w) → 4 обновление → 5 повтор много эпох."),
        qx("w = 0.5, ∂L/∂w = 2 and the learning rate η = 0.1. What is w after one gradient descent step?", "0.3", [
          ["0.7", "0.7 adds the step; gradient descent subtracts it: w − η · ∂L/∂w.", "0.7 — шаг прибавлен; градиентный спуск его вычитает: w − η · ∂L/∂w."],
          ["−1.5", "−1.5 subtracts the raw gradient 2 and forgets the learning rate η = 0.1.", "−1.5 — вычтен «сырой» градиент 2, забыта скорость обучения η = 0.1."],
          ["0.48", "0.48 takes a step of 0.02; the step is η · ∂L/∂w = 0.1 · 2 = 0.2.", "0.48 — шаг 0.02; на самом деле шаг η · ∂L/∂w = 0.1 · 2 = 0.2."],
        ], "w ← w − η · ∂L/∂w = 0.5 − 0.1 · 2 = 0.3.", "w ← w − η · ∂L/∂w = 0.5 − 0.1 · 2 = 0.3."),
        qx("For some weight ∂L/∂w is negative. What does one gradient descent step do to w?", "Increases w", [
          ["Decreases w", "w − η · (negative) = w + something, so w goes up, not down.", "w − η · (отрицательное) = w + что-то, поэтому w растёт, а не падает."],
          ["Leaves w unchanged", "Only a zero gradient leaves w unchanged; here it is negative.", "Неизменным w оставляет только нулевой градиент; здесь он отрицательный."],
          ["Sets w to zero", "Gradient descent moves w by η · ∂L/∂w; it never resets it to zero.", "Градиентный спуск сдвигает w на η · ∂L/∂w, а не обнуляет его."],
        ], "A negative gradient means a bigger w lowers the loss; w ← w − η · (negative) makes w larger.", "Отрицательный градиент значит, что рост w уменьшает потери; w ← w − η · (отрицательное) увеличивает w."),
        qx("How many forward passes does a two-sided numerical gradient need for one update of a 308 310-weight network?", "About 616 000", [
          ["About 308 000", "That is one pass per weight; the two-sided difference needs f(w + h) and f(w − h), two passes.", "Это один проход на вес; двусторонней разности нужны f(w + h) и f(w − h) — два прохода."],
          ["About 2 or 3", "2–3 forward passes is the cost of backpropagation, not of numerical gradients.", "2–3 прямых прохода — цена backpropagation, а не численных градиентов."],
          ["Exactly 1", "One pass only gives the loss value, not the gradient of each weight.", "Один проход даёт только значение потерь, а не градиент каждого веса."],
        ], "Two forward passes per weight: 2 × 308 310 ≈ 616 000 passes for a single update — far too slow.", "Два прямых прохода на каждый вес: 2 × 308 310 ≈ 616 000 проходов на одно обновление — слишком медленно."),
        qx("At a node z = f(x), how is the downstream gradient ∂L/∂x computed?", "Local gradient × upstream gradient", [
          ["Local gradient + upstream gradient", "The chain rule multiplies derivatives; it never adds the local and upstream ones.", "Цепное правило перемножает производные, а не складывает локальную и входящую."],
          ["Upstream gradient ÷ local gradient", "There is no division in the chain rule: ∂L/∂x = ∂z/∂x · ∂L/∂z.", "Деления в цепном правиле нет: ∂L/∂x = ∂z/∂x · ∂L/∂z."],
          ["The local gradient alone", "Ignoring the upstream part forgets how z affects the loss.", "Без входящего градиента теряется то, как z влияет на потери."],
        ], "Chain rule: ∂L/∂x = ∂z/∂x · ∂L/∂z, i.e. downstream = local × upstream.", "Цепное правило: ∂L/∂x = ∂z/∂x · ∂L/∂z, то есть downstream = local × upstream."),
        qx("With which value does the backward pass start at the output of the graph?", "∂L/∂L = 1", [
          ["∂L/∂L = 0", "The derivative of a quantity with respect to itself is 1, not 0.", "Производная величины по самой себе равна 1, а не 0."],
          ["The loss value L", "The loss value is computed in the forward pass; the gradient seed is 1.", "Значение потерь считается при прямом проходе; начальный градиент равен 1."],
          ["The learning rate η", "η is used only in the update step, after all gradients are known.", "η используется только при обновлении, когда все градиенты уже известны."],
        ], "The backward pass starts with ∂L/∂L = 1 (∂f/∂f = 1 in the example) and moves right to left.", "Обратный проход начинается с ∂L/∂L = 1 (∂f/∂f = 1 в примере) и идёт справа налево."),
        tfx("To compute its downstream gradient, a node must know the structure of the whole network.", false, "A node only multiplies the upstream gradient by its own local derivative; it never needs the rest of the network.", "Узел лишь умножает входящий градиент на свою локальную производную; остальная сеть ему не нужна.", "Choosing True misses the point of backprop: locality is exactly what makes it simple and modular.", "Ответ True упускает суть backprop: именно локальность делает его простым и модульным."),
        qx("f = (x + y) · z with x = −2, y = 5, z = −4. What is f?", "−12", [
          ["12", "q = 3 and z = −4 have opposite signs, so f is negative.", "q = 3 и z = −4 разных знаков, поэтому f отрицательно."],
          ["−22", "−22 computes x + y · z; the brackets mean (x + y) first.", "−22 — это x + y · z; скобки требуют сначала (x + y)."],
          ["−1", "−1 is x + y + z; the graph multiplies q by z.", "−1 — это x + y + z; граф умножает q на z."],
        ], "q = x + y = 3, f = q · z = 3 · (−4) = −12.", "q = x + y = 3, f = q · z = 3 · (−4) = −12."),
        qx("Same graph (x = −2, y = 5, z = −4, q = x + y). What is ∂f/∂z?", "3", [
          ["−4", "−4 is ∂f/∂q = z; for z the multiply gate swaps in the other input, q.", "−4 — это ∂f/∂q = z; для z умножение подставляет другой вход, q."],
          ["1", "1 is the local gradient of the add node, not of the multiply node.", "1 — локальный градиент узла сложения, а не умножения."],
          ["−12", "−12 is the value of f, not its derivative.", "−12 — значение f, а не производная."],
        ], "f = q · z, so ∂f/∂z = q = 3 (upstream 1 × local q).", "f = q · z, поэтому ∂f/∂z = q = 3 (входящий 1 × локальный q)."),
        qx("In the same example, why is ∂f/∂x equal to ∂f/∂y?", "Add gate copies −4 to both inputs", [
          ["x and y have equal forward values", "x = −2 and y = 5 differ; the gradients match because of the add gate.", "x = −2 и y = 5 различны; градиенты совпадают из-за узла сложения."],
          ["The multiply gate swaps x and y", "x and y meet at the + node, not at the × node.", "x и y встречаются в узле +, а не в узле ×."],
          ["Both equal the seed gradient 1 at f", "Both equal −4, not 1: the upstream −4 passes through the add gate.", "Оба равны −4, а не 1: через сложение проходит входящий −4."],
        ], "∂q/∂x = ∂q/∂y = 1, so the add gate distributes the upstream ∂f/∂q = −4 to both x and y.", "∂q/∂x = ∂q/∂y = 1, поэтому сложение раздаёт входящий ∂f/∂q = −4 и x, и y."),
        qx("f = (x + y) · z with x = 2, y = −5, z = 3. What is ∂f/∂x?", "3", [
          ["−3", "−3 is q = x + y, which is ∂f/∂z, not ∂f/∂x.", "−3 — это q = x + y, то есть ∂f/∂z, а не ∂f/∂x."],
          ["1", "1 is only the local gradient of the add node; multiply it by the upstream z = 3.", "1 — лишь локальный градиент сложения; его надо умножить на входящий z = 3."],
          ["−9", "−9 is the value f = q · z, not a gradient.", "−9 — значение f = q · z, а не градиент."],
        ], "∂f/∂q = z = 3 and the add gate passes it on: ∂f/∂x = 1 · 3 = 3.", "∂f/∂q = z = 3, и сложение передаёт его дальше: ∂f/∂x = 1 · 3 = 3."),
        qx("In f = (x + y) · z at x = −2, y = 5, z = −4, x rises to −1.99 while y and z stay fixed. What is the new f?", "−12.04", [
          ["−11.96", "That assumes ∂f/∂x = +4; the gradient is −4, so f goes down.", "Здесь принят ∂f/∂x = +4; градиент равен −4, поэтому f уменьшается."],
          ["−12.01", "That assumes ∂f/∂x = 1; the change is −4 × 0.01 = −0.04.", "Здесь принят ∂f/∂x = 1; изменение равно −4 × 0.01 = −0.04."],
          ["−12.4", "That uses a step of 0.1; x changed by only 0.01.", "Здесь шаг 0.1; x изменился только на 0.01."],
        ], "q = 3.01, f = 3.01 · (−4) = −12.04; the change −0.04 = −4 × 0.01 confirms ∂f/∂x = −4.", "q = 3.01, f = 3.01 · (−4) = −12.04; изменение −0.04 = −4 × 0.01 подтверждает ∂f/∂x = −4."),
        qx("f = x · y with x = 3, y = −5 and upstream gradient 2. Which gradients reach x and y?", "∂L/∂x = −10, ∂L/∂y = 6", [
          ["∂L/∂x = 6, ∂L/∂y = −10", "Not swapped: x gets upstream × y = 2 · (−5), y gets upstream × x = 2 · 3.", "Не переставлено: x получает входящий × y = 2 · (−5), y — входящий × x = 2 · 3."],
          ["∂L/∂x = 2, ∂L/∂y = 2", "Passing the gradient unchanged is the add rule, not the multiply rule.", "Передать градиент без изменений — правило сложения, а не умножения."],
          ["∂L/∂x = −5, ∂L/∂y = 3", "These are only the local gradients; multiply them by the upstream 2.", "Это только локальные градиенты; их надо умножить на входящий 2."],
        ], "Multiply is a swapper: ∂L/∂x = 2 · y = −10, ∂L/∂y = 2 · x = 6.", "Умножение — «переставляльщик»: ∂L/∂x = 2 · y = −10, ∂L/∂y = 2 · x = 6."),
        qx("f = max(x, y) with x = 4, y = 1 and upstream gradient 2. Which gradients reach x and y?", "2 to x, 0 to y", [
          ["2 to x, 2 to y", "Giving both the full gradient is the add rule; max routes it only to the winner.", "Отдать обоим полный градиент — правило сложения; max направляет его только победителю."],
          ["1 to x, 1 to y", "Max does not split the gradient in half; the larger input takes all of it.", "Max не делит градиент пополам; больший вход забирает его целиком."],
          ["0 to x, 2 to y", "The gradient goes to the larger input, x = 4, not to y = 1.", "Градиент идёт к большему входу, x = 4, а не к y = 1."],
        ], "Max is a router: all of the upstream gradient goes to the larger input (x = 4), zero to the other.", "Max — маршрутизатор: весь входящий градиент идёт к большему входу (x = 4), другому — ноль."),
        qx("A value x feeds two branches whose gradients come back as 3 and −1. What is ∂L/∂x?", "2", [
          ["3", "Keeping only the larger branch is the max rule; at a copy the gradients are summed.", "Оставить только большую ветку — правило max; при копировании градиенты суммируются."],
          ["−1", "Keeping the last branch is the overwrite bug (= instead of +=).", "Оставить последнюю ветку — баг перезаписи (= вместо +=)."],
          ["−3", "The branch gradients are added, not multiplied.", "Градиенты веток складываются, а не перемножаются."],
        ], "Copy is an adder: ∂L/∂x = 3 + (−1) = 2.", "Копирование — сумматор: ∂L/∂x = 3 + (−1) = 2."),
        qx("Which gate is paired with its correct nickname?", "multiply — swapper", [
          ["add — router", "Add is the distributor: it passes the gradient unchanged to every input. The router is max.", "Сложение — распределитель: передаёт градиент всем входам без изменений. Маршрутизатор — это max."],
          ["max — distributor", "Max is the router: all gradient goes to the larger input. The distributor is add.", "Max — маршрутизатор: весь градиент идёт к большему входу. Распределитель — это сложение."],
          ["copy (fan-out) — swapper", "Copy is the adder: branch gradients are summed. The swapper is multiply.", "Копирование — сумматор: градиенты веток суммируются. Переставляльщик — это умножение."],
        ], "add → distributor, multiply → swapper, max → router, copy → adder.", "add → distributor (распределитель), multiply → swapper (переставляльщик), max → router (маршрутизатор), copy → adder (сумматор)."),
        qx("In the forward pass a ReLU got z = −0.1. The upstream gradient is −0.07. What gradient flows back to z?", "0", [
          ["−0.07", "The gradient passes only where the input was positive; here z < 0.", "Градиент проходит только там, где вход был положителен; здесь z < 0."],
          ["0.007", "0.007 multiplies the upstream by z; ReLU's local gradient is 0 or 1, not z.", "0.007 — входящий, умноженный на z; локальный градиент ReLU — 0 или 1, а не z."],
          ["−0.1", "−0.1 is the forward input, not a gradient.", "−0.1 — значение входа при прямом проходе, а не градиент."],
        ], "ReLU = max(0, z) is a router: for z < 0 its local gradient is 0, so the gradient is blocked.", "ReLU = max(0, z) — маршрутизатор: при z < 0 локальный градиент равен 0, и градиент блокируется."),
        qx("A sigmoid node outputs σ = 0.99. What is its local gradient σ′ = σ(1 − σ)?", "About 0.0099", [
          ["About 0.99", "0.99 is σ itself; it must be multiplied by 1 − σ = 0.01.", "0.99 — это сама σ; её надо умножить на 1 − σ = 0.01."],
          ["About 0.25", "0.25 is the maximum, reached at σ = 0.5 (z = 0), not at σ = 0.99.", "0.25 — максимум, он достигается при σ = 0.5 (z = 0), а не при σ = 0.99."],
          ["About 0.9801", "0.9801 = σ²; the derivative is σ(1 − σ), not σ · σ.", "0.9801 = σ²; производная — σ(1 − σ), а не σ · σ."],
        ], "σ′ = 0.99 · 0.01 ≈ 0.01: the unit is saturated and passes back only about 1% of the upstream gradient.", "σ′ = 0.99 · 0.01 ≈ 0.01: нейрон насыщен и передаёт назад лишь около 1% входящего градиента."),
        qx("A student says sigmoid is a good hidden activation for a 20-layer net because its output is bounded. Is that right?", "No: saturated sigmoids kill the gradient", [
          ["Yes: bounded outputs keep gradients large", "Bounded outputs come with flat ends, where the gradient is near zero.", "Ограниченный выход идёт вместе с плоскими концами, где градиент почти нулевой."],
          ["Yes: σ′ is at least 0.25 everywhere", "0.25 is the maximum of σ′, reached only at z = 0; elsewhere it is smaller.", "0.25 — максимум σ′, только при z = 0; в остальных точках он меньше."],
          ["No: sigmoid has no derivative at z = 0", "Sigmoid is smooth everywhere; at z = 0 its derivative is 0.25.", "Sigmoid гладкая везде; при z = 0 её производная равна 0.25."],
        ], "Each sigmoid multiplies the gradient by at most 0.25 (≈ 0.01 at σ = 0.99), so little reaches the early layers; ReLU is the default.", "Каждая sigmoid умножает градиент не больше чем на 0.25 (≈ 0.01 при σ = 0.99), до первых слоёв доходит мало; по умолчанию — ReLU."),
        tfx("The local gradient of a sigmoid is largest at z = 0, where it equals 0.25.", true, "At z = 0, σ = 0.5, so σ′ = 0.5 · 0.5 = 0.25; everywhere else σ(1 − σ) is smaller.", "При z = 0 σ = 0.5, поэтому σ′ = 0.5 · 0.5 = 0.25; во всех других точках σ(1 − σ) меньше.", "Choosing False would mean σ′ can exceed 0.25, but σ(1 − σ) peaks at σ = 0.5.", "Ответ False означал бы, что σ′ бывает больше 0.25, но σ(1 − σ) максимальна при σ = 0.5."),
      ],
    ),
    part(
      "cv-l4-p3",
      { en: "Backprop in practice: the spam network, shapes and debugging", ru: "Backprop на практике: сеть для спама, размерности и отладка" },
      {
        en: `## Backward pass on the spam network (y = 1)
Recall the forward pass: x = [1, 0, 1], hidden pre-activations [0.8, −0.1], ReLU outputs h = [0.8, 0], output weights [0.7, 0.2], z = 0.56, p = σ(z) = 0.636. The email really is spam, so the label is **y = 1**; the loss is **binary cross-entropy (BCE)**.
= L = −[y·ln(p) + (1 − y)·ln(1 − p)] = −ln(0.636) ≈ 0.452
= ∂L/∂z = p − y = 0.636 − 1 = −0.364
**Sigmoid + BCE** give the neat output gradient **p − y** (prediction minus label). From there every step is a gate pattern from part 2:
| Step | Computation | Result |
|---|---|---|
| Loss (BCE) | L = −ln(0.636) | 0.452 |
| Output grad | ∂L/∂z = p − y | −0.364 |
| Output weights | −0.364 × [0.8, 0] | [−0.291, 0] |
| Hidden outputs | −0.364 × [0.7, 0.2] | [−0.255, −0.073] |
| Through ReLU | H2 input was −0.1 → gradient blocked | [−0.255, 0] |
| W1, row H1 | −0.255 × [1, 0, 1] | [−0.255, 0, −0.255] |
| Update, η = 0.1 | 0.7 − 0.1 × (−0.291) | 0.729 |
Three patterns at once:
- **multiply swaps** — an output weight's gradient is −0.364 × its hidden output; a hidden output's gradient is −0.364 × its weight;
- **ReLU routes** — H2's input was −0.1 < 0, so its gradient is blocked and **row H2 of W1 gets no update**;
- the W1 weight for **win = 0** gets **no update**: its gradient is upstream × input = −0.255 × 0 = 0.
The updates with η = 0.1 (biases stay 0 in this example):
= w_out1: 0.7 − 0.1 · (−0.291) = 0.729
= w_out2: 0.2 − 0.1 · 0 = 0.2
= W1 row H1: [0.5, −0.2, 0.3] − 0.1 · [−0.255, 0, −0.255] = [0.5255, −0.2, 0.3255]
Rerun the forward pass: H1 = 0.5255 + 0.3255 = 0.851, z = 0.851 · 0.729 ≈ 0.620, p = σ(0.620) ≈ 0.650 > 0.636. The network is now **more confident** that this email is spam, and the loss went down.
If the label were **y = 0** (not spam), the same formula gives ∂L/∂z = 0.636 − 0 = +0.636, and every update would go the other way.
## Vectors and matrices: backprop through y = Wx
= ∂L/∂W = (∂L/∂y) · xᵀ
= ∂L/∂x = Wᵀ · (∂L/∂y)
**Shape rule: a gradient has the same shape as its variable.** For the last layer of the CIFAR network:
| Quantity | Shape |
|---|---|
| W | 10×3072 |
| x and ∂L/∂x | 3072×1 |
| y = Wx and ∂L/∂y | 10×1 |
| ∂L/∂W = (∂L/∂y) · xᵀ | (10×1)·(1×3072) = 10×3072, matches W |
| ∂L/∂x = Wᵀ · (∂L/∂y) | (3072×10)·(10×1) = 3072×1, matches x |
The full **Jacobian** ∂y/∂W would have 10 × 30 720 = 307 200 entries, almost all zero, so it is **never built**. Forgot a formula? **Arrange the transposes until the shapes match.**
## Modular layers: forward and backward
Every layer — Linear, ReLU, loss — follows the same API. The multiply gate as a layer:
= class Multiply:
=     def forward(self, x, y):
=         self.x, self.y = x, y   # cache
=         return x * y
=     def backward(self, dout):
=         dx = dout * self.y      # swap
=         dy = dout * self.x
=         return dx, dy
- **forward()** computes the output and **caches** what backward will need.
- **backward(dout)** takes the upstream gradient and returns **local × upstream** for each input.
- **Autograd** — PyTorch records this graph during the forward pass and calls every backward **in reverse order**.
## The same network in PyTorch
= model = nn.Sequential(nn.Flatten(), nn.Linear(3*32*32, 100), nn.ReLU(), nn.Linear(100, 10))
= loss_fn = nn.CrossEntropyLoss()
= opt = torch.optim.SGD(model.parameters(), lr=1e-2)
= loss = loss_fn(model(x), y)   # forward
= opt.zero_grad()               # reset old gradients
= loss.backward()               # backprop: every dL/dw
= opt.step()                    # update: w = w - lr * dL/dw
The model is exactly f = W2 · max(0, W1x + b1) + b2: **loss.backward()** is all of backpropagation in one line, and **opt.step()** is the update w ← w − η · ∂L/∂w.
## Gradient check
= ∂f/∂w ≈ [f(w + h) − f(w − h)] / (2h)
= relative error = |a − n| / max(|a|, |n|)
| Gradient | Speed and safety | Use it for |
|---|---|---|
| Numerical | slow, but easy to get right | the reference when checking |
| Analytic (backprop) | fast and exact, but easy to break | training |
- Use **h ≈ 1e-5** and the **centred** difference: it is more accurate than the one-sided [f(w + h) − f(w)] / h.
- Relative error **below 1e-7** → the backward is correct; **about 1e-4** is acceptable with ReLU kinks; **1e-2** → a bug.
- Check a few random weights **before** training.
Worked check on f(w) = w² at w = 3 with h = 0.01:
= [f(3.01) − f(2.99)] / 0.02 = (9.0601 − 8.9401) / 0.02 = 0.12 / 0.02 = 6
= analytic: f′(w) = 2w = 6 → relative error 0
## Four common mistakes
| Mistake | What goes wrong | Fix |
|---|---|---|
| Overwriting at branches | the gradient of one branch replaces the other | add them: use +=, not = |
| Forgetting the cache | backward needs the inputs saved during forward | store x (and y) in forward() |
| Wrong ReLU mask | gradient leaks where the input was negative | pass the gradient only where input > 0 |
| No zero_grad() | PyTorch accumulates gradients across steps | call opt.zero_grad() every step |
PyTorch accumulating gradients is exactly the **copy → adder** rule — that is why zero_grad() is needed every step.
> In practice: each gradient = local × upstream, each gradient has its variable's shape, and a numerical gradient check proves the backward is right.
## Check yourself
?? In the spam network (y = 1, p = 0.636, h = [0.8, 0]) compute ∂L/∂z and the gradients of both output weights. Why does the second one not change?
?= ∂L/∂z = p − y = −0.364; output-weight gradients = −0.364 × [0.8, 0] = [−0.291, 0]. The second weight's input h2 is 0 (ReLU clipped H2's −0.1), and the multiply gate gives upstream × other input = 0.
?? In y = Wx, W is 10×3072 and x is 3072×1. What are the shapes of ∂L/∂W and ∂L/∂x, and how do you get them?
?= ∂L/∂W = (∂L/∂y)·xᵀ is 10×3072 and ∂L/∂x = Wᵀ·(∂L/∂y) is 3072×1: each gradient has the shape of its variable, so arrange the transposes until the shapes match.`,
        ru: `## Обратный проход по сети для спама (y = 1)
Вспомним прямой проход: x = [1, 0, 1], предактивации скрытого слоя [0.8, −0.1], выходы ReLU h = [0.8, 0], выходные веса [0.7, 0.2], z = 0.56, p = σ(z) = 0.636. Письмо действительно спам, поэтому метка **y = 1**; функция потерь — **бинарная кросс-энтропия (BCE)**.
= L = −[y·ln(p) + (1 − y)·ln(1 − p)] = −ln(0.636) ≈ 0.452
= ∂L/∂z = p − y = 0.636 − 1 = −0.364
**Sigmoid + BCE** дают удобный градиент на выходе **p − y** (предсказание минус метка). Дальше каждый шаг — шаблон узла из части 2:
| Шаг | Вычисление | Результат |
|---|---|---|
| Потери (BCE) | L = −ln(0.636) | 0.452 |
| Градиент выхода | ∂L/∂z = p − y | −0.364 |
| Выходные веса | −0.364 × [0.8, 0] | [−0.291, 0] |
| Скрытые выходы | −0.364 × [0.7, 0.2] | [−0.255, −0.073] |
| Через ReLU | вход H2 был −0.1 → градиент заблокирован | [−0.255, 0] |
| W1, строка H1 | −0.255 × [1, 0, 1] | [−0.255, 0, −0.255] |
| Обновление, η = 0.1 | 0.7 − 0.1 × (−0.291) | 0.729 |
Сразу три шаблона:
- **умножение переставляет** — градиент выходного веса равен −0.364 × его скрытый выход; градиент скрытого выхода равен −0.364 × его вес;
- **ReLU маршрутизирует** — вход H2 был −0.1 < 0, поэтому его градиент заблокирован и **строка H2 матрицы W1 не обновляется**;
- вес W1 для **win = 0** **не обновляется**: его градиент = входящий × вход = −0.255 × 0 = 0.
Обновления при η = 0.1 (смещения в этом примере остаются 0):
= w_out1: 0.7 − 0.1 · (−0.291) = 0.729
= w_out2: 0.2 − 0.1 · 0 = 0.2
= W1 row H1: [0.5, −0.2, 0.3] − 0.1 · [−0.255, 0, −0.255] = [0.5255, −0.2, 0.3255]
Повторим прямой проход: H1 = 0.5255 + 0.3255 = 0.851, z = 0.851 · 0.729 ≈ 0.620, p = σ(0.620) ≈ 0.650 > 0.636. Сеть теперь **увереннее**, что это письмо — спам, и потери уменьшились.
Если бы метка была **y = 0** (не спам), та же формула дала бы ∂L/∂z = 0.636 − 0 = +0.636, и все обновления пошли бы в обратную сторону.
## Векторы и матрицы: backprop через y = Wx
= ∂L/∂W = (∂L/∂y) · xᵀ
= ∂L/∂x = Wᵀ · (∂L/∂y)
**Правило формы: градиент имеет ту же форму, что и его переменная.** Для последнего слоя сети на CIFAR:
| Величина | Форма |
|---|---|
| W | 10×3072 |
| x и ∂L/∂x | 3072×1 |
| y = Wx и ∂L/∂y | 10×1 |
| ∂L/∂W = (∂L/∂y) · xᵀ | (10×1)·(1×3072) = 10×3072, совпадает с W |
| ∂L/∂x = Wᵀ · (∂L/∂y) | (3072×10)·(10×1) = 3072×1, совпадает с x |
Полный **якобиан (Jacobian)** ∂y/∂W содержал бы 10 × 30 720 = 307 200 элементов, почти все нули, поэтому его **никогда не строят**. Забыли формулу? **Расставьте транспонирования так, чтобы размеры сошлись.**
## Модульные слои: forward и backward
Каждый слой — Linear, ReLU, функция потерь — следует одному API. Узел умножения в виде слоя:
= class Multiply:
=     def forward(self, x, y):
=         self.x, self.y = x, y   # cache
=         return x * y
=     def backward(self, dout):
=         dx = dout * self.y      # swap
=         dy = dout * self.x
=         return dx, dy
- **forward()** вычисляет выход и **кэширует (cache)** то, что понадобится backward.
- **backward(dout)** принимает входящий градиент и возвращает **local × upstream** для каждого входа.
- **Autograd** — PyTorch записывает этот граф при прямом проходе и вызывает все backward **в обратном порядке**.
## Та же сеть в PyTorch
= model = nn.Sequential(nn.Flatten(), nn.Linear(3*32*32, 100), nn.ReLU(), nn.Linear(100, 10))
= loss_fn = nn.CrossEntropyLoss()
= opt = torch.optim.SGD(model.parameters(), lr=1e-2)
= loss = loss_fn(model(x), y)   # forward
= opt.zero_grad()               # reset old gradients
= loss.backward()               # backprop: every dL/dw
= opt.step()                    # update: w = w - lr * dL/dw
Модель — это ровно f = W2 · max(0, W1x + b1) + b2: **loss.backward()** — весь backpropagation в одной строке, а **opt.step()** — обновление w ← w − η · ∂L/∂w.
## Проверка градиента (gradient check)
= ∂f/∂w ≈ [f(w + h) − f(w − h)] / (2h)
= relative error = |a − n| / max(|a|, |n|)
| Градиент | Скорость и надёжность | Для чего |
|---|---|---|
| Численный | медленный, но его легко посчитать верно | эталон при проверке |
| Аналитический (backprop) | быстрый и точный, но его легко сломать | обучение |
- Берите **h ≈ 1e-5** и **центральную** разность: она точнее односторонней [f(w + h) − f(w)] / h.
- Относительная ошибка **меньше 1e-7** → backward верный; **около 1e-4** допустимо из-за изломов ReLU; **1e-2** → баг.
- Проверяйте несколько случайных весов **до** обучения.
Проверка на примере f(w) = w² при w = 3 и h = 0.01:
= [f(3.01) − f(2.99)] / 0.02 = (9.0601 − 8.9401) / 0.02 = 0.12 / 0.02 = 6
= analytic: f′(w) = 2w = 6 → relative error 0
## Четыре частые ошибки
| Ошибка | Что идёт не так | Как исправить |
|---|---|---|
| Перезапись на ветвлениях | градиент одной ветки затирает другую | складывать: +=, а не = |
| Забытый кэш | backward нужны входы, сохранённые при forward | сохранять x (и y) в forward() |
| Неверная маска ReLU | градиент проходит там, где вход был отрицательным | пропускать градиент только там, где вход > 0 |
| Нет zero_grad() | PyTorch накапливает градиенты между шагами | вызывать opt.zero_grad() на каждом шаге |
Накопление градиентов в PyTorch — это ровно правило **copy → adder**, поэтому zero_grad() нужен на каждом шаге.
> На практике: каждый градиент = local × upstream, у каждого градиента форма его переменной, а численная проверка градиента доказывает, что backward верный.
## Проверь себя
?? В сети для спама (y = 1, p = 0.636, h = [0.8, 0]) найдите ∂L/∂z и градиенты обоих выходных весов. Почему второй вес не меняется?
?= ∂L/∂z = p − y = −0.364; градиенты выходных весов = −0.364 × [0.8, 0] = [−0.291, 0]. Вход второго веса h2 равен 0 (ReLU обрезала −0.1 у H2), а узел умножения даёт входящий × другой вход = 0.
?? В y = Wx матрица W имеет размер 10×3072, а x — 3072×1. Какие формы у ∂L/∂W и ∂L/∂x и как их получить?
?= ∂L/∂W = (∂L/∂y)·xᵀ имеет форму 10×3072, а ∂L/∂x = Wᵀ·(∂L/∂y) — 3072×1: у каждого градиента форма его переменной, поэтому транспонирования расставляют так, чтобы размеры сошлись.`,
      },
      [
        qx("Spam network: label y = 1, prediction p = 0.636. What is the binary cross-entropy loss?", "−ln(0.636) ≈ 0.452", [
          ["−ln(0.364) ≈ 1.011", "−ln(1 − p) is the loss for the label y = 0; here y = 1.", "−ln(1 − p) — потери для метки y = 0; здесь y = 1."],
          ["1 − 0.636 = 0.364", "0.364 is just the gap 1 − p, not the cross-entropy, which takes a logarithm.", "0.364 — просто разность 1 − p, а не кросс-энтропия, в которой есть логарифм."],
          ["(1 − 0.636)² ≈ 0.132", "That is the squared error (MSE); the lecture uses BCE here.", "Это квадратичная ошибка (MSE); здесь в лекции используется BCE."],
        ], "BCE = −[y ln p + (1 − y) ln(1 − p)]; with y = 1 it is −ln(0.636) ≈ 0.452.", "BCE = −[y ln p + (1 − y) ln(1 − p)]; при y = 1 это −ln(0.636) ≈ 0.452."),
        qx("Sigmoid output with BCE loss, p = 0.636 and y = 1. What is ∂L/∂z?", "−0.364", [
          ["0.364", "The sign is flipped: the formula is p − y, not y − p.", "Знак перевёрнут: формула p − y, а не y − p."],
          ["0.636", "0.636 = p − 0 is the gradient for the label y = 0.", "0.636 = p − 0 — градиент для метки y = 0."],
          ["−0.452", "−0.452 is minus the loss value, not its gradient.", "−0.452 — значение потерь со знаком минус, а не градиент."],
        ], "Sigmoid + BCE give ∂L/∂z = p − y = 0.636 − 1 = −0.364.", "Sigmoid + BCE дают ∂L/∂z = p − y = 0.636 − 1 = −0.364."),
        qx("∂L/∂z = −0.364 and the hidden outputs are h = [0.8, 0]. What is the gradient of the two output weights?", "[−0.291, 0]", [
          ["[−0.255, −0.073]", "Those are the hidden-output gradients (−0.364 × the weights), not the weight gradients.", "Это градиенты скрытых выходов (−0.364 × веса), а не градиенты весов."],
          ["[0.291, 0]", "The sign is lost: −0.364 × 0.8 is negative.", "Потерян знак: −0.364 × 0.8 отрицательно."],
          ["[−0.364, −0.364]", "Copying the upstream unchanged is the add rule; the weights sit in a multiply.", "Копировать входящий без изменений — правило сложения; веса стоят в умножении."],
        ], "Multiply swaps: ∂L/∂w = −0.364 × h = −0.364 × [0.8, 0] = [−0.291, 0].", "Умножение переставляет: ∂L/∂w = −0.364 × h = −0.364 × [0.8, 0] = [−0.291, 0]."),
        qx("∂L/∂z = −0.364 and the output weights are [0.7, 0.2]. What gradient reaches the hidden outputs h1, h2?", "[−0.255, −0.073]", [
          ["[−0.291, 0]", "That is the output-weight gradient (−0.364 × h), not the hidden-output gradient.", "Это градиент выходных весов (−0.364 × h), а не скрытых выходов."],
          ["[−0.364, −0.364]", "Each hidden output is multiplied by its weight, so its gradient is scaled by that weight.", "Каждый скрытый выход умножается на свой вес, поэтому его градиент масштабируется этим весом."],
          ["[0.7, 0.2]", "These are only the local gradients; multiply them by the upstream −0.364.", "Это только локальные градиенты; их надо умножить на входящий −0.364."],
        ], "Swap again: ∂L/∂h = −0.364 × [0.7, 0.2] = [−0.255, −0.073].", "Снова перестановка: ∂L/∂h = −0.364 × [0.7, 0.2] = [−0.255, −0.073]."),
        qx("Why does row H2 of W1 get no update in the spam example?", "ReLU blocked it: H2's input was −0.1 < 0", [
          ["Its output weight 0.2 is too small to matter", "H2's output gradient was −0.073, not zero; it is ReLU that blocked it.", "Градиент выхода H2 был −0.073, не ноль; заблокировала его именно ReLU."],
          ["The learning rate η = 0.1 is too small for it", "The learning rate scales all updates equally; H2's gradient is exactly zero.", "Скорость обучения одинаково масштабирует все обновления; градиент H2 равен ровно нулю."],
          ["−0.073 rounds down to zero", "Nothing is rounded: ReLU's local gradient for a negative input is 0.", "Ничего не округляется: локальный градиент ReLU для отрицательного входа равен 0."],
        ], "ReLU routes: H2's pre-activation −0.1 < 0, so its local gradient is 0 and the whole row gets zero gradient.", "ReLU маршрутизирует: предактивация H2 равна −0.1 < 0, локальный градиент 0, и вся строка получает нулевой градиент."),
        qx("Why does the W1 weight for the feature win get a zero gradient for this email?", "Its input is 0: upstream × 0 = 0", [
          ["Its weight −0.2 is negative", "Negative weights still get gradients; what matters is the input value 0.", "Отрицательные веса тоже получают градиенты; дело в том, что вход равен 0."],
          ["ReLU blocks every negative weight", "ReLU acts on pre-activations, not on weights; H1's input was 0.8 > 0.", "ReLU действует на предактивации, а не на веса; вход H1 был 0.8 > 0."],
          ["The gradient check removed it", "A gradient check only verifies gradients; it does not change them.", "Проверка градиента только проверяет градиенты, но не меняет их."],
        ], "In H1 this weight multiplies x_win = 0, so ∂L/∂w = upstream × 0 = 0: −0.255 × [1, 0, 1] = [−0.255, 0, −0.255].", "В H1 этот вес умножается на x_win = 0, поэтому ∂L/∂w = входящий × 0 = 0: −0.255 × [1, 0, 1] = [−0.255, 0, −0.255]."),
        qx("An output weight 0.7 has gradient −0.291 and η = 0.1. What is its value after the update?", "0.729", [
          ["0.671", "0.671 adds the gradient instead of subtracting it: 0.7 + 0.1 · (−0.291).", "0.671 — градиент прибавлен вместо вычитания: 0.7 + 0.1 · (−0.291)."],
          ["0.991", "0.991 forgets η: 0.7 − (−0.291).", "0.991 — забыт η: 0.7 − (−0.291)."],
          ["0.7", "The gradient is not zero, so the weight changes.", "Градиент не нулевой, поэтому вес меняется."],
        ], "w ← 0.7 − 0.1 · (−0.291) = 0.7 + 0.0291 ≈ 0.729: the weight grows.", "w ← 0.7 − 0.1 · (−0.291) = 0.7 + 0.0291 ≈ 0.729: вес растёт."),
        qx("After this update the forward pass is rerun on the same spam email. What happens to p?", "It rises to ≈ 0.650", [
          ["It drops below 0.5", "Every update pushes z up for this email, so p cannot fall below 0.636.", "Все обновления увеличивают z для этого письма, поэтому p не может упасть ниже 0.636."],
          ["It stays at 0.636", "The weights changed (0.7 → 0.729, the H1 row grew), so z and p change.", "Веса изменились (0.7 → 0.729, строка H1 выросла), поэтому z и p меняются."],
          ["It jumps to exactly 1", "A sigmoid never reaches exactly 1, and one small step moves p only a little.", "Sigmoid никогда не достигает ровно 1, и один маленький шаг сдвигает p лишь немного."],
        ], "H1 = 0.5255 + 0.3255 = 0.851, z = 0.851 · 0.729 ≈ 0.620, p = σ(0.620) ≈ 0.650: more confident it is spam, lower loss.", "H1 = 0.5255 + 0.3255 = 0.851, z = 0.851 · 0.729 ≈ 0.620, p = σ(0.620) ≈ 0.650: сеть увереннее, что это спам, потери ниже."),
        qx("In y = Wx, W has shape 10×3072. What is the shape of ∂L/∂W?", "10×3072", [
          ["3072×10", "That is the shape of Wᵀ; a gradient has the shape of its variable W.", "Это форма Wᵀ; градиент имеет форму своей переменной W."],
          ["10×1", "10×1 is the shape of y and ∂L/∂y.", "10×1 — форма y и ∂L/∂y."],
          ["3072×1", "3072×1 is the shape of x and ∂L/∂x.", "3072×1 — форма x и ∂L/∂x."],
        ], "∂L/∂W = (∂L/∂y) · xᵀ = (10×1)·(1×3072) = 10×3072, the same shape as W.", "∂L/∂W = (∂L/∂y) · xᵀ = (10×1)·(1×3072) = 10×3072 — та же форма, что у W."),
        qx("Which expression gives ∂L/∂x for y = Wx?", "Wᵀ · (∂L/∂y)", [
          ["(∂L/∂y) · xᵀ", "That is ∂L/∂W, the gradient for the weights, not for x.", "Это ∂L/∂W — градиент по весам, а не по x."],
          ["W · (∂L/∂y)", "W is 10×3072 and ∂L/∂y is 10×1: without the transpose the shapes do not match.", "W — 10×3072, ∂L/∂y — 10×1: без транспонирования размеры не совпадают."],
          ["(∂L/∂y) · Wᵀ", "(10×1)·(3072×10) is not defined; the transposed W must come first.", "(10×1)·(3072×10) не определено; транспонированная W должна стоять первой."],
        ], "∂L/∂x = Wᵀ · (∂L/∂y): (3072×10)·(10×1) = 3072×1, the shape of x.", "∂L/∂x = Wᵀ · (∂L/∂y): (3072×10)·(10×1) = 3072×1 — форма x."),
        qx("A hidden layer has W of shape 100×3072 and x of shape 3072×1. What are the shapes of y = Wx and ∂L/∂x?", "100×1 and 3072×1", [
          ["100×1 and 100×3072", "100×3072 is the shape of W and ∂L/∂W; ∂L/∂x has the shape of x.", "100×3072 — форма W и ∂L/∂W; у ∂L/∂x форма x."],
          ["3072×1 and 100×1", "The two shapes are swapped: y has 100 rows, x has 3072.", "Размеры перепутаны: у y 100 строк, у x — 3072."],
          ["1×100 and 1×3072", "These are row vectors; with a column x, both y and ∂L/∂x are columns.", "Это строки; при столбце x и y, и ∂L/∂x — столбцы."],
        ], "(100×3072)·(3072×1) = 100×1 for y, and ∂L/∂x = Wᵀ · ∂L/∂y = (3072×100)·(100×1) = 3072×1.", "(100×3072)·(3072×1) = 100×1 для y, и ∂L/∂x = Wᵀ · ∂L/∂y = (3072×100)·(100×1) = 3072×1."),
        qx("Why is the full Jacobian ∂y/∂W never built for the last CIFAR layer (W of shape 10×3072)?", "It has 307 200 entries, almost all zero", [
          ["PyTorch cannot store sparse matrices", "Storage is not the reason: the Jacobian is huge and mostly zeros, so the short formula is used.", "Дело не в хранении: якобиан огромен и почти весь из нулей, поэтому используют короткую формулу."],
          ["It is defined only for square matrices W", "Jacobians exist for any shapes; here it is just wasteful.", "Якобиан определён для любых размеров; здесь он просто расточителен."],
          ["It always equals the identity matrix", "It is not the identity; its non-zero entries are values of x among mostly zeros.", "Это не единичная матрица; его ненулевые элементы — значения x среди почти сплошных нулей."],
        ], "y has 10 entries and W has 30 720, so ∂y/∂W has 10 × 30 720 = 307 200 entries, almost all zero; ∂L/∂W = (∂L/∂y)·xᵀ is used instead.", "У y 10 элементов, у W — 30 720, поэтому ∂y/∂W содержит 10 × 30 720 = 307 200 элементов, почти все нули; вместо него берут ∂L/∂W = (∂L/∂y)·xᵀ."),
        qx("A layer's backward is: dx = dout * self.y; dy = dout * self.x. Which gate does it implement?", "Multiply: each input gets the other input", [
          ["Add: the gradient is copied unchanged", "Add would return dout for both inputs without multiplying by anything.", "Сложение вернуло бы dout обоим входам, ничего не умножая."],
          ["Max: the gradient goes to the larger input", "Max would compare x and y and send dout to only one of them.", "Max сравнил бы x и y и отправил dout только одному из них."],
          ["ReLU: gradient masked where x > 0", "ReLU has one input and multiplies dout by a 0/1 mask.", "У ReLU один вход, и dout умножается на маску из 0 и 1."],
        ], "Multiply swaps: dx = dout × y and dy = dout × x, using the x and y cached in forward().", "Умножение переставляет: dx = dout × y и dy = dout × x, с x и y, сохранёнными в forward()."),
        qx("What must forward() of the Multiply layer save so that backward() can work?", "The inputs x and y", [
          ["Only the output x * y", "The output alone is not enough: dx needs y and dy needs x.", "Одного выхода мало: dx нужен y, а dy нужен x."],
          ["The upstream gradient dout", "dout arrives later as the argument of backward(); forward cannot save it.", "dout приходит позже как аргумент backward(); forward не может его сохранить."],
          ["The learning rate η", "The layer does not need η; the optimizer uses it in the update.", "Слою η не нужен; его использует оптимизатор при обновлении."],
        ], "Forgetting the cache is a common mistake: backward needs the inputs saved during forward (self.x, self.y).", "Забыть кэш — частая ошибка: backward нужны входы, сохранённые при forward (self.x, self.y)."),
        qx("In the PyTorch training loop, which line runs backpropagation?", "loss.backward()", [
          ["opt.step()", "opt.step() applies the update w ← w − η · ∂L/∂w once the gradients exist.", "opt.step() делает обновление w ← w − η · ∂L/∂w, когда градиенты уже есть."],
          ["opt.zero_grad()", "zero_grad() only resets the stored gradients of the previous step.", "zero_grad() лишь обнуляет сохранённые градиенты прошлого шага."],
          ["model(x)", "model(x) is the forward pass that builds the graph.", "model(x) — прямой проход, который строит граф."],
        ], "loss.backward() runs backpropagation: autograd calls every backward in reverse order and fills in ∂L/∂w.", "loss.backward() запускает backpropagation: autograd вызывает все backward в обратном порядке и заполняет ∂L/∂w."),
        qx("A student forgets opt.zero_grad() in the PyTorch training loop. What goes wrong?", "Gradients of past steps keep adding up", [
          ["The weights are reset to zero each step", "zero_grad() resets gradients, not weights; forgetting it leaves the old gradients in place.", "zero_grad() обнуляет градиенты, а не веса; если его забыть, старые градиенты останутся."],
          ["loss.backward() is skipped entirely", "backward still runs, but it adds to the old gradients instead of replacing them.", "backward всё равно выполняется, но прибавляет к старым градиентам вместо замены."],
          ["The model trains on the test set", "Which data is used is decided by the data loader, not by zero_grad().", "Какие данные используются, решает загрузчик данных, а не zero_grad()."],
        ], "PyTorch accumulates gradients (the copy → adder rule), so without zero_grad() every step adds onto the previous ones.", "PyTorch накапливает градиенты (правило copy → adder), поэтому без zero_grad() каждый шаг добавляется к прошлым."),
        qx("Centred difference for f(w) = w² at w = 3 with h = 0.01: what does [f(3.01) − f(2.99)] / 0.02 equal?", "6", [
          ["3", "Dividing by 0.04 instead of 2h = 0.02 halves the true value 6.", "Деление на 0.04 вместо 2h = 0.02 даёт половину верного значения 6."],
          ["12", "12 divides by h = 0.01 instead of 2h = 0.02.", "12 — деление на h = 0.01 вместо 2h = 0.02."],
          ["0.12", "0.12 is only the numerator 9.0601 − 8.9401; it must be divided by 0.02.", "0.12 — только числитель 9.0601 − 8.9401; его надо разделить на 0.02."],
        ], "(9.0601 − 8.9401) / 0.02 = 0.12 / 0.02 = 6, matching the analytic f′(3) = 2·3 = 6.", "(9.0601 − 8.9401) / 0.02 = 0.12 / 0.02 = 6 — совпадает с аналитической f′(3) = 2·3 = 6."),
        qx("A gradient check gives a relative error of 1e-2. What does it tell you?", "Most likely a bug in the backward pass", [
          ["The backward pass is correct, start training", "A correct backward pass gives a relative error below about 1e-7.", "Верный обратный проход даёт относительную ошибку меньше примерно 1e-7."],
          ["Acceptable, because ReLU kinks explain it", "Kinks explain errors around 1e-4, not 1e-2.", "Изломы объясняют ошибки около 1e-4, а не 1e-2."],
          ["h is too small, it should be about 1", "h ≈ 1e-5 is the rule; a huge h makes the numerical gradient inaccurate.", "Правило — h ≈ 1e-5; огромный h делает численный градиент неточным."],
        ], "Relative error = |a − n| / max(|a|, |n|): below 1e-7 is correct, about 1e-4 is acceptable with kinks, 1e-2 means a bug.", "Относительная ошибка = |a − n| / max(|a|, |n|): меньше 1e-7 — верно, около 1e-4 — допустимо из-за изломов, 1e-2 — баг."),
        tfx("In ReLU backward, the gradient is passed where the forward input was positive and set to zero elsewhere.", true, "ReLU's local gradient is 1 for z > 0 and 0 for z < 0, so the mask is built from the forward input.", "Локальный градиент ReLU равен 1 при z > 0 и 0 при z < 0, поэтому маска строится по входу прямого прохода.", "Choosing False suggests a different mask; a wrong ReLU mask is one of the four common mistakes.", "Ответ False предполагает другую маску; неверная маска ReLU — одна из четырёх частых ошибок."),
        tfx("When a value feeds two branches, its gradient should be overwritten by the last branch's gradient (grad = g).", false, "At a copy the gradients of all branches are summed: use grad += g, not grad = g.", "При копировании градиенты всех веток суммируются: grad += g, а не grad = g.", "Choosing True is the overwriting bug: the first branch's contribution would be lost.", "Ответ True — это баг перезаписи: вклад первой ветки пропадёт."),
      ],
    ),
  ],
};
