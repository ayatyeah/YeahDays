import type { Term, Text } from "../types";

const t = (term: string, en: string, ru: string): Term => ({ term, def: { en, ru } });

/** Глоссарий курса — он же колода карточек «термин → определение». */
export const glossary: Term[] = [
  // Лекция 1 — история
  t("Perceptron", "Rosenblatt's algorithm (about 1958), one of the first that learned its weights from data. Today we recognize it as a linear classifier, so it cannot learn XOR.", "Алгоритм Розенблатта (около 1958 г.), один из первых, что учил свои веса на данных. Сегодня это просто линейный классификатор, поэтому XOR он выучить не может."),
  t("XOR problem", "Minsky and Papert (1969) showed a perceptron cannot learn XOR: (0, 1) and (1, 0) are class 1, (0, 0) and (1, 1) are class 0, and no single straight line separates them. A hidden layer with a non-linearity solves it.", "Минский и Пейперт (1969) показали, что перцептрон не выучит XOR: (0, 1) и (1, 0) — класс 1, (0, 0) и (1, 1) — класс 0, и одной прямой их не разделить. Решает скрытый слой с нелинейностью."),
  t("AlexNet", "The 8-layer CNN of Krizhevsky, Sutskever and Hinton that won ImageNet 2012 with about 16% top-5 error, using ReLU, dropout, data augmentation and two GPUs. It started the deep learning explosion.", "8-слойная CNN Крижевского, Суцкевера и Хинтона, выигравшая ImageNet 2012 с top-5 error около 16% благодаря ReLU, dropout, data augmentation и двум GPU. С неё начался бум deep learning."),

  // Лекция 2 — классификация и kNN
  t("Semantic gap", "The gap between what the computer gets — a grid of numbers 0–255, e.g. 800×600×3 — and the meaning a human sees (‘cat’). A recognizer must stay correct under viewpoint, illumination, deformation, occlusion, background clutter and intraclass variation.", "Разрыв между тем, что получает компьютер, — сеткой чисел 0–255, например 800×600×3, — и смыслом, который видит человек («кошка»). Распознаватель должен не ошибаться при смене ракурса, освещения, деформации, перекрытии, фоне и разнообразии внутри класса."),
  t("k-nearest neighbors (kNN)", "Memorizes all training images and labels a query by a majority vote of its k closest training images under a distance metric; k = 1 is the nearest neighbor classifier. Training is O(1), prediction O(N); a larger k smooths decision boundaries and resists outliers.", "Запоминает все обучающие картинки и метит новую большинством голосов k ближайших по метрике расстояния; k = 1 — классификатор ближайшего соседа. Обучение O(1), предсказание O(N); чем больше k, тем глаже границы и меньше влияние выбросов."),
  t("L1 (Manhattan) distance", "d1 = Σ |I1 − I2| over all pixels: the sum of absolute differences. For [1, 3] and [4, −1]: |1 − 4| + |3 − (−1)| = 3 + 4 = 7.", "d1 = Σ |I1 − I2| по всем пикселям: сумма модулей разностей. Для [1, 3] и [4, −1]: |1 − 4| + |3 − (−1)| = 3 + 4 = 7."),
  t("L2 (Euclidean) distance", "d2 = √(Σ (I1 − I2)²): the straight-line distance between two images seen as pixel vectors. For [1, 3] and [4, −1]: √(9 + 16) = 5.", "d2 = √(Σ (I1 − I2)²): расстояние по прямой между двумя картинками как векторами пикселей. Для [1, 3] и [4, −1]: √(9 + 16) = 5."),
  t("Hyperparameter", "A choice about the learning algorithm that is set before training instead of being learned from data: k and the distance metric in kNN, λ, the learning rate, the number of filters. Pick it by performance on the validation set.", "Настройка алгоритма, которую задают до обучения, а не учат по данным: k и метрика в kNN, λ, learning rate, число фильтров. Выбирают по качеству на validation set."),
  t("Validation set", "Data held out from training and used to choose hyperparameters; the test set is used only once, at the very end. Tuning on the test set gives an over-optimistic estimate of performance on new data.", "Данные, отложенные от обучения, на которых выбирают гиперпараметры; test set трогают один раз, в самом конце. Подбор на test даёт завышенную оценку качества на новых данных."),
  t("Cross-validation", "Split the training data into folds (e.g. 5), use each fold in turn as the validation set and average the results. Reliable for small datasets but too expensive to be common in deep learning.", "Делим обучающие данные на folds (например, 5), по очереди делаем каждый fold валидацией и усредняем результаты. Надёжно на маленьких датасетах, но для deep learning обычно слишком дорого."),
  t("Curse of dimensionality", "To cover a space uniformly, the number of training points needed grows exponentially with the dimension (4, 4², 4³, …). Images have thousands of dimensions, so kNN on raw pixels never has enough data.", "Чтобы равномерно покрыть пространство, число обучающих точек растёт экспоненциально с размерностью (4, 4², 4³, …). У картинок тысячи измерений, поэтому kNN на сырых пикселях всегда не хватает данных."),

  // Лекция 3 — линейные классификаторы
  t("Linear classifier", "A parametric model f(x, W) = Wx + b that outputs one score per class; the predicted class is the argmax. For CIFAR-10, x has 3072 numbers (32×32×3), W is 10×3072 and b has 10 entries.", "Параметрическая модель f(x, W) = Wx + b, выдающая по одному score на класс; предсказание — argmax. Для CIFAR-10 в x 3072 числа (32×32×3), W размера 10×3072, в b 10 чисел."),
  t("Weights W and bias b", "Each row of W is the template of one class: it says how strongly each input value pushes that class score up or down. b adds a fixed per-class offset that does not depend on the input.", "Каждая строка W — шаблон одного класса: насколько сильно каждое входное значение тянет score этого класса вверх или вниз. b добавляет постоянный сдвиг для каждого класса, не зависящий от входа."),
  t("Class score (logit)", "The raw output of the classifier for one class: an unbounded real number of any sign, where higher means the model prefers that class. It is not a probability; softmax turns scores into probabilities without changing the argmax.", "Сырой выход классификатора для класса: неограниченное число любого знака, и чем оно больше, тем сильнее модель за этот класс. Это не вероятность; softmax превращает scores в вероятности, не меняя argmax."),
  t("Linear separability", "Classes are linearly separable when one hyperplane (a straight line in 2D) splits them. A linear classifier draws only such boundaries, so XOR, concentric rings or a class with several separate modes cannot be classified correctly.", "Классы линейно разделимы, если их разделяет одна гиперплоскость (прямая в 2D). Линейный классификатор проводит только такие границы, поэтому XOR, вложенные кольца или класс из нескольких «островков» он верно не разделит."),
  t("Loss function", "A number that measures how bad the current W is on the training data, averaged over examples: L = (1/N) Σ Li. Low loss means a good classifier; training searches for the W that minimizes it.", "Число, показывающее, насколько плох текущий W на обучающих данных, среднее по примерам: L = (1/N) Σ Li. Маленький loss — хороший классификатор; обучение ищет W, который его минимизирует."),
  t("Multiclass SVM loss", "Hinge loss Li = Σ over j ≠ yi of max(0, sj − syi + 1): zero once the correct class beats every other score by a margin of 1. Minimum 0, maximum ∞; with small random scores it is about C − 1.", "Hinge loss Li = Σ по j ≠ yi от max(0, sj − syi + 1): равен нулю, когда верный класс обгоняет каждый другой score с запасом (margin) 1. Минимум 0, максимум ∞; при малых случайных scores — около C − 1."),
  t("Regularization", "A penalty λR(W) added to the data loss so the model prefers simpler weights and does not fit the noise in the training data. λ, the regularization strength, is a hyperparameter.", "Штраф λR(W), добавленный к data loss, чтобы модель предпочитала простые веса и не подгонялась под шум в обучающих данных. λ — сила регуляризации, гиперпараметр."),
  t("L2 regularization", "R(W) = Σ W²: penalizes large weights and prefers weights spread over many inputs ([0.25, 0.25, 0.25, 0.25] over [1, 0, 0, 0]). In training it is called weight decay.", "R(W) = Σ W²: штрафует большие веса и любит веса, размазанные по многим входам ([0.25, 0.25, 0.25, 0.25] лучше, чем [1, 0, 0, 0]). При обучении это называют weight decay."),
  t("L1 regularization", "R(W) = Σ |W|: pushes many weights to exactly zero, giving sparse models. Elastic net adds L1 and L2 together.", "R(W) = Σ |W|: обнуляет многие веса, модель становится разреженной (sparse). Elastic net складывает L1 и L2."),
  t("Softmax", "Turns scores into probabilities: pk = e^sk / Σj e^sj, each in (0, 1), summing to 1, with the same argmax. Scores [3.2, 5.1, −1.7] become [0.13, 0.87, 0.00].", "Превращает scores в вероятности: pk = e^sk / Σj e^sj, каждая в (0, 1), в сумме 1, argmax тот же. Scores [3.2, 5.1, −1.7] становятся [0.13, 0.87, 0.00]."),
  t("Cross-entropy loss", "Li = −log(softmax probability of the correct class); minimum 0, maximum ∞. With small random scores it is about log C (log 10 ≈ 2.3) — a sanity check at initialization.", "Li = −log(вероятности верного класса после softmax); минимум 0, максимум ∞. При малых случайных scores примерно равен log C (log 10 ≈ 2.3) — проверка на старте обучения."),

  // Лекция 4 — нейросети и backprop
  t("Artificial neuron", "Computes a weighted sum plus bias, z = Σ wi xi + b, then an activation a = g(z). Inspired by biological neurons (dendrites → inputs, synapses → weights, axon → output), but not a model of the brain.", "Считает взвешенную сумму плюс bias, z = Σ wi xi + b, затем активацию a = g(z). Вдохновлён биологическим нейроном (дендриты → входы, синапсы → веса, аксон → выход), но не модель мозга."),
  t("Activation function", "The non-linear g(z) applied after a layer's weighted sum: ReLU, sigmoid, tanh, Leaky ReLU, GELU. Without it any stack of linear layers collapses into one: W2(W1x) = (W2W1)x.", "Нелинейная g(z) после взвешенной суммы слоя: ReLU, sigmoid, tanh, Leaky ReLU, GELU. Без неё любая стопка линейных слоёв схлопывается в один: W2(W1x) = (W2W1)x."),
  t("ReLU", "f(z) = max(0, z): the gradient is 1 for z > 0 and 0 otherwise, so it does not saturate for positive inputs and trains faster than sigmoid or tanh. The default hidden activation; units stuck at negative inputs can ‘die’.", "f(z) = max(0, z): градиент 1 при z > 0 и 0 иначе, поэтому нет насыщения на положительных входах и учится быстрее sigmoid и tanh. Активация по умолчанию в скрытых слоях; нейроны с отрицательным входом могут «умереть»."),
  t("Fully connected layer", "Every input is connected to every output with its own weight; parameters = inputs × outputs + outputs (3072 → 10 gives 30 730). It ignores spatial structure and its size grows with the image.", "Каждый вход связан с каждым выходом своим весом; параметров = входы × выходы + выходы (3072 → 10 даёт 30 730). Пространственную структуру не видит, а размер растёт вместе с картинкой."),
  t("Backpropagation", "Finds ∂L/∂w for every weight in one backward pass by the chain rule on the computational graph: downstream gradient = local gradient × upstream gradient. Add gates distribute, multiply gates swap, max gates route, copies sum.", "Находит ∂L/∂w для всех весов за один обратный проход по chain rule на вычислительном графе: downstream = local × upstream. Сложение раздаёт градиент, умножение меняет входы местами, max направляет, копия суммирует."),
  t("Gradient descent", "Updates every weight against its gradient, w ← w − η · ∂L/∂w, repeating until the loss is low. The learning rate η is a hyperparameter.", "Сдвигает каждый вес против градиента, w ← w − η · ∂L/∂w, и повторяет, пока loss не станет маленьким. Learning rate η — гиперпараметр."),

  // Лекция 5 — CNN
  t("Convolution layer", "Slides small learnable filters over the input; each output value is the dot product of a filter with one local patch plus a bias. Local connectivity and weight sharing give few parameters and translation equivariance.", "Скользит маленькими обучаемыми фильтрами по входу; каждое выходное значение — скалярное произведение фильтра на локальный патч плюс bias. Локальность и общие веса дают мало параметров и translation equivariance."),
  t("Filter (kernel)", "A small learnable block of weights, e.g. 3×3×C_in, that always spans the full input depth and detects one pattern such as an edge or a colour contrast. The number of filters sets the output depth.", "Маленький обучаемый блок весов, например 3×3×C_in, всегда на всю глубину входа; ищет один узор — край или цветовой контраст. Число фильтров задаёт глубину выхода."),
  t("Feature map", "The 2D output of sliding one filter over the input, also called an activation map. Six 5×5×3 filters on a 32×32×3 image (stride 1, no padding) give a 28×28×6 output volume.", "2D-выход одного фильтра, прошедшего по всему входу, он же activation map. Шесть фильтров 5×5×3 на картинке 32×32×3 (stride 1, без padding) дают выходной объём 28×28×6."),
  t("Stride", "The step in pixels between neighbouring filter positions; a stride above 1 downsamples. (W − F + 2P)/S + 1 must be a whole number: a 7×7 input with a 3×3 filter fits stride 1 or 2 but not 3.", "Шаг фильтра в пикселях; stride больше 1 уменьшает карту. (W − F + 2P)/S + 1 должно быть целым: вход 7×7 и фильтр 3×3 подходят для stride 1 и 2, но не 3."),
  t("Padding", "A border of zeros added around the input so the borders are used and the size does not shrink. ‘Same’ padding P = (F − 1)/2 at stride 1 keeps the size: P = 1 for 3×3, P = 2 for 5×5.", "Рамка из нулей вокруг входа, чтобы края учитывались и размер не уменьшался. ‘Same’ padding P = (F − 1)/2 при stride 1 сохраняет размер: P = 1 для 3×3, P = 2 для 5×5."),
  t("Receptive field", "The region of the input image that affects one unit; at stride 1 it is 1 + L·(F − 1) after L layers, so three 3×3 layers see 7×7. Stride and pooling make it grow faster.", "Область входной картинки, влияющая на один нейрон; при stride 1 после L слоёв это 1 + L·(F − 1), то есть три слоя 3×3 видят 7×7. Stride и pooling ускоряют рост."),
  t("Max pooling", "Keeps the maximum of each window: 2×2 with stride 2 halves height and width, channel by channel. It has no learnable parameters and gives a little shift invariance.", "Оставляет максимум каждого окна: 2×2 со stride 2 вдвое уменьшает высоту и ширину, по каждому каналу отдельно. Обучаемых параметров нет, даёт небольшую устойчивость к сдвигам."),
  t("Batch normalization", "Normalizes each channel with the mini-batch mean and variance, then applies a learnable scale γ and shift β; placed Conv → BN → ReLU. It stabilizes activations, allows larger learning rates and uses running averages at test time.", "Нормирует каждый канал средним и дисперсией mini-batch, затем применяет обучаемые масштаб γ и сдвиг β; ставят Conv → BN → ReLU. Стабилизирует активации, позволяет больший learning rate, на тесте берёт скользящие средние."),
  t("Dropout", "During training, randomly zeroes units with probability p (mostly in FC layers), so the network cannot rely on any single unit. A regularizer against overfitting; switched off at test time.", "При обучении случайно обнуляет нейроны с вероятностью p (обычно в FC-слоях), чтобы сеть не полагалась на один нейрон. Регуляризатор против переобучения; на тесте выключен."),
  t("Residual connection", "A skip path with output y = F(x) + x, so the layers learn only the residual F(x) = H(x) − x and gradients flow straight through. It solves the degradation problem and lets ResNet train 152 layers and more.", "Обходной путь с выходом y = F(x) + x: слои учат только остаток F(x) = H(x) − x, а градиент проходит напрямую. Решает degradation problem и позволяет ResNet обучать 152 слоя и больше."),
  t("Transfer learning", "Start from a network pretrained on ImageNet and fine-tune it: with a small dataset freeze the backbone and train only the new classifier; with a larger one fine-tune all layers with a small learning rate.", "Берём сеть, предобученную на ImageNet, и дообучаем: на маленьком датасете замораживаем backbone и учим только новый классификатор, на большем — дообучаем все слои с маленьким learning rate."),

  // OpenCV и предобработка
  t("BGR channel order", "OpenCV stores colour images as Blue, Green, Red — not RGB. Convert with COLOR_BGR2GRAY, or COLOR_BGR2RGB for matplotlib; an RGB2… code on an imread image swaps red and blue.", "OpenCV хранит цветные картинки как Blue, Green, Red, а не RGB. Переводить через COLOR_BGR2GRAY или COLOR_BGR2RGB для matplotlib; код RGB2… на картинке из imread путает красный и синий."),
  t("cv2.imread", "Reads an image into a NumPy array of shape (height, width, 3), dtype uint8, values 0–255, BGR order. Flags: IMREAD_COLOR (default), IMREAD_GRAYSCALE → (h, w), IMREAD_UNCHANGED keeps alpha; a missing file returns None without an exception.", "Читает картинку в массив NumPy формы (height, width, 3), uint8, значения 0–255, порядок BGR. Флаги: IMREAD_COLOR (по умолчанию), IMREAD_GRAYSCALE → (h, w), IMREAD_UNCHANGED сохраняет alpha; если файла нет — None без исключения."),
  t("cv2.resize", "cv2.resize(img, (width, height)): dsize is (WIDTH, HEIGHT), while img.shape is (height, width, channels). cv2.resize(img, (224, 224)) on a colour image gives shape (224, 224, 3).", "cv2.resize(img, (width, height)): dsize — это (ШИРИНА, ВЫСОТА), а img.shape — (height, width, channels). cv2.resize(img, (224, 224)) на цветной картинке даёт форму (224, 224, 3)."),
  t("cv2.cvtColor", "Converts between colour spaces: COLOR_BGR2GRAY gives one channel of shape (h, w), COLOR_BGR2RGB is for matplotlib, COLOR_BGR2HSV separates hue from brightness. COLOR_RGB2GRAY on an imread image runs without error but swaps the R and B weights.", "Переводит между цветовыми пространствами: COLOR_BGR2GRAY даёт один канал формы (h, w), COLOR_BGR2RGB — для matplotlib, COLOR_BGR2HSV отделяет оттенок от яркости. COLOR_RGB2GRAY на картинке из imread работает без ошибки, но путает веса R и B."),
  t("Grayscale conversion", "Gray = 0.299 R + 0.587 G + 0.114 B: one channel instead of three, so three times less data and less sensitivity to the colour of the light. The price is that colour is lost — bad when colour defines the class (yellow leaf spots, ripe fruit).", "Gray = 0.299 R + 0.587 G + 0.114 B: один канал вместо трёх — данных втрое меньше, цвет освещения влияет слабее. Цена — теряется цвет, а это плохо, когда класс определяется цветом (жёлтые пятна на листе, спелость плода)."),
  t("Gaussian blur", "cv2.GaussianBlur(src, ksize, sigmaX) replaces each pixel with a Gaussian-weighted average of its neighbourhood. It suppresses general sensor noise, e.g. before Canny, but also softens fine details and edges.", "cv2.GaussianBlur(src, ksize, sigmaX) заменяет пиксель средним по окрестности с гауссовыми весами. Гасит обычный шум сенсора, например перед Canny, но смягчает и мелкие детали, и края."),
  t("Median blur", "cv2.medianBlur(src, k) replaces each pixel with the median of its k×k neighbourhood, k an odd int > 1. The best choice for salt-and-pepper noise, and it keeps edges sharper than a Gaussian.", "cv2.medianBlur(src, k) заменяет пиксель медианой окрестности k×k, k — нечётное целое > 1. Лучший выбор против шума salt-and-pepper, и края сохраняет резче, чем Гаусс."),
  t("Kernel size", "The width and height of a filter window. For GaussianBlur both must be positive and odd — (3, 3), (5, 5); (4, 4) raises an error; a bigger kernel smooths more and erases more detail.", "Ширина и высота окна фильтра. Для GaussianBlur обе положительные и нечётные — (3, 3), (5, 5); (4, 4) вызывает ошибку; чем больше ядро, тем сильнее сглаживание и тем больше деталей теряется."),
  t("sigmaX", "The standard deviation of the Gaussian along x: a required argument of cv2.GaussianBlur, where 0 means ‘compute it from the kernel size’. A larger sigma gives a stronger blur.", "Стандартное отклонение Гаусса по x: обязательный аргумент cv2.GaussianBlur, 0 значит «вычислить по размеру ядра». Чем больше sigma, тем сильнее размытие."),
  t("Thresholding", "ret, dst = cv2.threshold(src, thresh, maxval, type) makes a binary image: with THRESH_BINARY pixels above thresh become maxval and the rest 0. The type argument is required, and the input should be single-channel.", "ret, dst = cv2.threshold(src, thresh, maxval, type) делает бинарную картинку: при THRESH_BINARY пиксели выше thresh становятся maxval, остальные 0. Аргумент type обязателен, вход должен быть одноканальным."),
  t("Otsu's method", "Picks the threshold automatically from the histogram so the two pixel groups are as compact as possible: cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU). It needs a single-channel 8-bit image; ret returns the chosen threshold.", "Сам выбирает порог по гистограмме так, чтобы две группы пикселей были максимально компактными: cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU). Нужна одноканальная 8-битная картинка; в ret — выбранный порог."),
  t("Canny edge detector", "cv2.Canny(img, t1, t2): gradients, edge thinning (non-maximum suppression) and hysteresis give a single-channel 0/255 edge map with no colour. Blur first, because derivatives amplify noise into false edges.", "cv2.Canny(img, t1, t2): градиенты, утончение краёв (non-maximum suppression) и гистерезис дают одноканальную карту краёв 0/255 без цвета. Сначала размытие: производные усиливают шум, и появляются ложные края."),
  t("Hysteresis thresholding", "Canny's two-threshold rule: a gradient above the high threshold is a strong edge, below the low one is discarded, in between is kept only if connected to a strong edge. A common low:high ratio is 1:2 to 1:3, e.g. 100 and 200.", "Правило двух порогов в Canny: градиент выше верхнего порога — сильный край, ниже нижнего — отбрасывается, между ними — остаётся, только если связан с сильным краем. Обычное соотношение 1:2–1:3, например 100 и 200."),
  t("Histogram equalization", "Spreads pixel intensities over the full 0–255 range to raise global contrast: cv2.equalizeHist(gray). It needs an 8-bit single-channel image and can amplify noise.", "Растягивает яркости на весь диапазон 0–255 и поднимает общий контраст: cv2.equalizeHist(gray). Нужна 8-битная одноканальная картинка; может усилить шум."),
  t("CLAHE", "Contrast Limited Adaptive Histogram Equalization: equalizes small tiles separately with a clip limit, so it fixes uneven lighting without blowing up noise. Created with cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)) and applied to a gray image.", "Contrast Limited Adaptive Histogram Equalization: выравнивает маленькие плитки по отдельности с ограничением (clip limit), поэтому лечит неровное освещение, не раздувая шум. Создаётся через cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)) и применяется к серой картинке."),
  t("Normalization", "Putting pixel values on a common scale: img.astype('float32') / 255.0 gives [0, 1]; standardization computes (x − mean) / std with statistics from the training set. Same-scale inputs make training more stable.", "Приведение пикселей к общему масштабу: img.astype('float32') / 255.0 даёт [0, 1]; стандартизация считает (x − mean) / std по статистике обучающей выборки. Входы одного масштаба делают обучение стабильнее."),
  t("Data augmentation", "Random label-preserving changes to training images — flips, crops, rotations, brightness and colour jitter, blur — generated on the fly. It acts as extra data, fights overfitting and makes the model robust to camera and lighting changes; it is applied to the training set only.", "Случайные изменения обучающих картинок, не меняющие метку, — отражения, кропы, повороты, сдвиги яркости и цвета, размытие — на лету. Работает как дополнительные данные, борется с переобучением и делает модель устойчивой к камере и свету; применяют только к train."),
  t("Domain shift", "Test images come from a different distribution than training images: another phone camera, colour response, resolution, lighting or background. Accuracy drops; fix it with diverse data, augmentation and normalization.", "Тестовые картинки из другого распределения, чем обучающие: другая камера телефона, цветопередача, разрешение, свет или фон. Точность падает; лечат разнообразными данными, аугментацией и нормализацией."),

  // Оценка модели
  t("Overfitting", "The model fits the training data, noise included, but generalizes poorly: 95% train vs 62% test. Fixes: more data or augmentation, regularization (L2, dropout), a simpler model, early stopping, tuning on a validation set.", "Модель подогналась под обучающие данные вместе с шумом и плохо обобщает: 95% на train против 62% на test. Лечение: больше данных или аугментация, регуляризация (L2, dropout), модель проще, early stopping, подбор на validation set."),
  t("Stratified split", "A train/validation/test split made per class, so every class keeps the same share in every part. 2 000 images split 80/20 give 1 600 / 400, and each class keeps its proportion in both.", "Разбиение на train/validation/test внутри каждого класса, чтобы доля класса была одинаковой во всех частях. 2 000 картинок по 80/20 дают 1 600 / 400, и в обеих частях каждый класс сохраняет свою долю."),
  t("Accuracy", "Correct predictions divided by all predictions, e.g. 3/4 = 75%. Misleading with imbalanced classes: if 90% of the images are plastic, always answering ‘plastic’ already scores 90%.", "Доля верных предсказаний среди всех, например 3/4 = 75%. Обманчива при несбалансированных классах: если 90% картинок — пластик, ответ «всегда пластик» уже даёт 90%."),
  t("Confusion matrix", "A C×C table with true classes in rows and predicted classes in columns; the diagonal counts correct predictions. Off-diagonal cells show which classes get confused, e.g. glass predicted as plastic.", "Таблица C×C: строки — истинные классы, столбцы — предсказанные; на диагонали верные ответы. Клетки вне диагонали показывают, какие классы путаются, например стекло, принятое за пластик."),
  t("Precision", "TP / (TP + FP) for one class: of all images predicted as this class, the share that truly belongs to it. Low precision means many false alarms.", "TP / (TP + FP) для одного класса: доля действительно своих среди всех картинок, отнесённых к этому классу. Низкий precision — много ложных срабатываний."),
  t("Recall", "TP / (TP + FN) for one class: of all images that truly belong to it, the share the model found. Low recall means many missed cases.", "TP / (TP + FN) для одного класса: какую долю картинок этого класса модель нашла. Низкий recall — много пропусков."),
  t("F1 score", "F1 = 2PR / (P + R), the harmonic mean of precision and recall, high only when both are high. Macro-F1 averages F1 over classes equally — a good single number for imbalanced data.", "F1 = 2PR / (P + R), гармоническое среднее precision и recall, высокое, только если высоки оба. Macro-F1 усредняет F1 по классам с равным весом — хорошее одно число для несбалансированных данных."),
];

/** Шпаргалка на одну страницу — формулы, OpenCV и разбор варианта мидтерма. */
export const cheatSheet: Text = {
  en: `## Linear classifier and losses
= s = Wx + b     W: (C, D)   x: (D,)   b: (C,)   s: (C,)
- CIFAR-10: x = 32×32×3 = **3072** numbers, W is **10×3072**, b has 10 entries; the prediction is the **argmax** of s.
- Each row of **W** is one class template (how much every input pushes that score); **b** is a per-class offset that does not depend on x.
= SVM:  Li = Σ_{j≠yi} max(0, s_j − s_yi + 1)
= softmax:  p_k = e^(s_k) / Σ_j e^(s_j)
= cross-entropy:  Li = −log(p_yi)
= L = (1/N) Σ_i Li + λ·R(W)
= L2:  R(W) = Σ W²        L1:  R(W) = Σ |W|
- SVM loss: min **0**, max **∞**, about **C − 1** with small random scores. Cross-entropy: min 0, max ∞, **log C** at initialization (log 10 ≈ 2.3).
- **Scores** (logits) are unbounded and can be negative; **probabilities** from softmax lie in (0, 1) and sum to 1; the argmax does not change.
- L2 (weight decay) spreads weights out, L1 makes them sparse; **λ** is a hyperparameter chosen on the validation set.
- Worked example from the slides — scores cat 3.2, car 5.1, frog −1.7, true class cat:
= SVM: max(0, 5.1 − 3.2 + 1) + max(0, −1.7 − 3.2 + 1) = 2.9 + 0 = 2.9
= softmax: exp → 24.5, 164.0, 0.18 → p = 0.13, 0.87, 0.00 → CE = −log(0.13) = 2.04
- A linear classifier draws only hyperplanes, so **XOR**, rings or a class with several modes cannot be separated — you need non-linear features or a neural network.
## Metrics and overfitting
= accuracy = correct / total
= precision = TP / (TP + FP)        recall = TP / (TP + FN)
= F1 = 2 · P · R / (P + R)
- Balanced classes: accuracy is fine. Imbalanced: per-class precision, recall, F1 (**macro-F1**) and the **confusion matrix** (rows = true, columns = predicted).
- **95% train vs 62% test** = overfitting → more data or augmentation, L2 or dropout, a simpler model, early stopping; tune on **validation**, never on test.
## CNN arithmetic
= O = (W − F + 2P) / S + 1
= params(conv) = C_out · (F · F · C_in + 1)        params(FC) = in · out + out
- W input size, F filter size (K on the slides), P padding, S stride; the division must be exact. Same padding P = (F − 1) / 2 keeps the size at S = 1.
| Case | Output | Parameters |
|---|---|---|
| 32×32×3, ten 5×5 filters, S = 1, P = 2 | **32×32×10** | 10 · (5·5·3 + 1) = **760** |
| 32×32×3, six 5×5 filters, S = 1, P = 0 | 28×28×6 | 6 · (75 + 1) = 456 |
| 7×7, 3×3 filter, S = 2, P = 0 | 3×3 | — |
| 7×7, 3×3 filter, S = 3, P = 0 | 2.33 → **does not fit** | — |
| conv 3×3, 64 → 128 channels, S = 1, P = 1 | same H×W, 128 channels | 128 · (64·9 + 1) = 73 856 |
| FC 3072 → 10 | 10 scores | 3072·10 + 10 = **30 730** |
- Max pool 2×2, S = 2 halves H and W and has **no parameters**. Receptive field at stride 1: 1 + L·(F − 1), so three 3×3 layers see **7×7** with 27C² weights instead of 49C².
## OpenCV: call → result → common bug
| Call | Result | Common bug |
|---|---|---|
| cv2.imread(path) | (h, w, 3), uint8, 0–255, **BGR** | wrong path → **None**, no exception |
| cv2.imread(path, cv2.IMREAD_GRAYSCALE) | (h, w), 1 channel | BGR2GRAY on it → error, it already has 1 channel |
| cv2.resize(img, (224, 224)) | (224, 224, 3) | dsize is **(width, height)**, shape is (h, w, c) |
| cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) | (h, w), 1 channel | **COLOR_RGB2GRAY** runs but swaps the R and B weights |
| cv2.GaussianBlur(src, (5, 5), 0) | same shape | even kernel (4, 4) → error; sigmaX left out → error |
| cv2.medianBlur(src, 5) | same shape | k must be an odd int > 1 |
| cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY) | ret, 0/255 image | type left out → error |
| cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU) | ret = chosen threshold | Otsu on a colour image |
| cv2.Canny(blur, 100, 200) | (h, w), 0/255 edges | no blur → false edges from noise; colour is gone |
| cv2.equalizeHist(gray) | (h, w), stronger contrast | colour input → error; uneven light → CLAHE |
= gray = 0.299·R + 0.587·G + 0.114·B          x = img.astype("float32") / 255.0
- **Gaussian** blur for general sensor noise, **median** blur for salt-and-pepper noise. Show in matplotlib with **COLOR_BGR2RGB**; hue via **COLOR_BGR2HSV**.
- Canny hysteresis: above high = strong edge, below low = discarded, in between = kept only if connected to a strong edge; low:high ratio 1:2–1:3.
## Variant 1 — model answers in brief
- **1a** leaves: resize to one size (different resolutions), normalize or CLAHE (lighting), Gaussian or median blur (noise) — each with its reason.
- **1b** grayscale: + one channel, 3× less data, less sensitive to the colour of light; − colour is lost, and yellow or brown disease spots are a colour cue.
- **1c** imread gives BGR → COLOR_BGR2GRAY; the kernel must be odd → (5, 5):
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
- **1d** disagree: a strong blur or a tiny resize erases small disease spots, and grayscale throws away colour — the wrong preprocessing hurts accuracy.
- **2** A Cat ✓, B Bird ✗ (true Dog), C Bird ✓, D Dog ✓ → accuracy **3/4 = 75%**, B is misclassified. Scores are unbounded, probabilities come from softmax; 95% vs 62% → overfitting → augmentation or regularization.
- **3** s = Wx + b with W = [[1, 2], [−1, 1], [2, −1]], x = [2, −1], b = [0, 1, −1]:
= s0 = 1·2 + 2·(−1) + 0 = 0
= s1 = (−1)·2 + 1·(−1) + 1 = −2
= s2 = 2·2 + (−1)·(−1) + (−1) = 4
- s = [0, −2, 4] → class 2, **Bird**. W = per-class templates (weights of each input), b = per-class offset; one hyperplane cannot split XOR.
- **4** after resize **(224, 224, 3)**; after BGR2GRAY one channel, **(224, 224)**; blur first because derivatives amplify noise; colour task → do not feed edges alone, Canny drops colour.
- **5** one folder per class (data/train/plastic/…); 80/20 of 2 000 → **1 600 / 400** (70/15/15 → 1 400 / 300 / 300), stratified; macro-F1 + confusion matrix; another phone = **domain shift**.
- **Fabric variant**: read in grayscale, add sigmaX, add the threshold type; 32×32 is fast and small but blurs fine stripes and checks:
= img = cv2.imread("fabric.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.GaussianBlur(img, (3, 3), 0)
= ret, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)
- ‘Looks fine to a human, so no preprocessing’ — disagree: the model sees numbers; warm vs cold lamps shift every colour value, sizes differ and JPEG artifacts add noise.
## How to get full points
| Question | What the grader wants |
|---|---|
| 1 Preprocessing | each operation **+ why**, tied to the scenario (sizes → resize, lamps → normalize, noise → blur) |
| 1 Trade-off | exactly **one advantage + one disadvantage**, both about this task |
| 1 Code | **both bugs** named, why each is wrong, the **corrected lines** written out |
| 1 Claim | a clear yes or no **+ one concrete example** |
| 2 Scores | argmax for every row, accuracy as **correct / total** with numbers, the wrong image named |
| 3 Linear | every product written out, then the argmax, then W and b in your own words |
| 4 Pipeline | shape and channels after **each line**, plus the reason for each step |
| 5 Design | folders per class, a split **with counts**, a metric **with why**, a cause of failure + a fix |
> Show the steps and add one sentence of why — a bare number or a bare yes earns only partial credit.`,
  ru: `## Линейный классификатор и функции потерь
= s = Wx + b     W: (C, D)   x: (D,)   b: (C,)   s: (C,)
- CIFAR-10: x = 32×32×3 = **3072** числа, W размера **10×3072**, в b 10 чисел; предсказание — **argmax** вектора s.
- Каждая строка **W** — шаблон одного класса (насколько каждый вход двигает этот score); **b** — сдвиг класса, не зависящий от x.
= SVM:  Li = Σ_{j≠yi} max(0, s_j − s_yi + 1)
= softmax:  p_k = e^(s_k) / Σ_j e^(s_j)
= cross-entropy:  Li = −log(p_yi)
= L = (1/N) Σ_i Li + λ·R(W)
= L2:  R(W) = Σ W²        L1:  R(W) = Σ |W|
- SVM loss: минимум **0**, максимум **∞**, около **C − 1** при малых случайных scores. Cross-entropy: минимум 0, максимум ∞, на старте обучения **log C** (log 10 ≈ 2.3).
- **Scores** (logits) не ограничены и бывают отрицательными; **вероятности** после softmax лежат в (0, 1) и в сумме дают 1; argmax не меняется.
- L2 (weight decay) размазывает веса, L1 делает их разреженными; **λ** — гиперпараметр, его подбирают на validation set.
- Разбор со слайдов — scores cat 3.2, car 5.1, frog −1.7, верный класс cat:
= SVM: max(0, 5.1 − 3.2 + 1) + max(0, −1.7 − 3.2 + 1) = 2.9 + 0 = 2.9
= softmax: exp → 24.5, 164.0, 0.18 → p = 0.13, 0.87, 0.00 → CE = −log(0.13) = 2.04
- Линейный классификатор проводит только гиперплоскости, поэтому **XOR**, кольца или класс из нескольких «островков» не разделить — нужны нелинейные признаки или нейросеть.
## Метрики и переобучение
= accuracy = correct / total
= precision = TP / (TP + FP)        recall = TP / (TP + FN)
= F1 = 2 · P · R / (P + R)
- Классы сбалансированы — accuracy подходит. Не сбалансированы — precision, recall, F1 по классам (**macro-F1**) и **confusion matrix** (строки — истина, столбцы — предсказание).
- **95% на train и 62% на test** = переобучение → больше данных или аугментация, L2 или dropout, модель проще, early stopping; подбирать на **validation**, никогда на test.
## Арифметика CNN
= O = (W − F + 2P) / S + 1
= params(conv) = C_out · (F · F · C_in + 1)        params(FC) = in · out + out
- W — размер входа, F — размер фильтра (на слайдах K), P — padding, S — stride; деление должно быть нацело. Same padding P = (F − 1) / 2 при S = 1 сохраняет размер.
| Случай | Выход | Параметры |
|---|---|---|
| 32×32×3, десять фильтров 5×5, S = 1, P = 2 | **32×32×10** | 10 · (5·5·3 + 1) = **760** |
| 32×32×3, шесть фильтров 5×5, S = 1, P = 0 | 28×28×6 | 6 · (75 + 1) = 456 |
| 7×7, фильтр 3×3, S = 2, P = 0 | 3×3 | — |
| 7×7, фильтр 3×3, S = 3, P = 0 | 2.33 → **не помещается** | — |
| conv 3×3, 64 → 128 каналов, S = 1, P = 1 | те же H×W, 128 каналов | 128 · (64·9 + 1) = 73 856 |
| FC 3072 → 10 | 10 scores | 3072·10 + 10 = **30 730** |
- Max pool 2×2, S = 2 вдвое уменьшает H и W, **параметров нет**. Receptive field при stride 1: 1 + L·(F − 1), то есть три слоя 3×3 видят **7×7** при 27C² весах вместо 49C².
## OpenCV: вызов → результат → типичная ошибка
| Вызов | Результат | Типичная ошибка |
|---|---|---|
| cv2.imread(path) | (h, w, 3), uint8, 0–255, **BGR** | неверный путь → **None**, без исключения |
| cv2.imread(path, cv2.IMREAD_GRAYSCALE) | (h, w), 1 канал | BGR2GRAY поверх → ошибка, канал уже один |
| cv2.resize(img, (224, 224)) | (224, 224, 3) | dsize — это **(width, height)**, а shape — (h, w, c) |
| cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) | (h, w), 1 канал | **COLOR_RGB2GRAY** работает, но путает веса R и B |
| cv2.GaussianBlur(src, (5, 5), 0) | та же форма | чётное ядро (4, 4) → ошибка; нет sigmaX → ошибка |
| cv2.medianBlur(src, 5) | та же форма | k — нечётное целое > 1 |
| cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY) | ret, картинка 0/255 | нет type → ошибка |
| cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU) | ret = выбранный порог | Otsu на цветной картинке |
| cv2.Canny(blur, 100, 200) | (h, w), края 0/255 | без размытия → ложные края от шума; цвета больше нет |
| cv2.equalizeHist(gray) | (h, w), контраст выше | цветной вход → ошибка; неровный свет → CLAHE |
= gray = 0.299·R + 0.587·G + 0.114·B          x = img.astype("float32") / 255.0
- **Гауссово** размытие — от обычного шума сенсора, **медианное** — от шума salt-and-pepper. Для matplotlib — **COLOR_BGR2RGB**; оттенок — через **COLOR_BGR2HSV**.
- Гистерезис Canny: выше верхнего порога — сильный край, ниже нижнего — отброшен, между — остаётся, только если связан с сильным краем; соотношение порогов 1:2–1:3.
## Вариант 1 — образцы ответов коротко
- **1a** листья: resize к одному размеру (разные разрешения), нормализация или CLAHE (освещение), гауссово или медианное размытие (шум) — у каждой операции своя причина.
- **1b** grayscale: + один канал, данных втрое меньше, цвет освещения влияет слабее; − теряется цвет, а жёлтые и бурые пятна болезни — цветовой признак.
- **1c** imread даёт BGR → COLOR_BGR2GRAY; ядро должно быть нечётным → (5, 5):
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
- **1d** не согласен: сильное размытие или слишком маленький resize стирает мелкие пятна болезни, а grayscale выбрасывает цвет — неподходящая предобработка снижает accuracy.
- **2** A Cat ✓, B Bird ✗ (на самом деле Dog), C Bird ✓, D Dog ✓ → accuracy **3/4 = 75%**, ошибка на B. Scores не ограничены, вероятности даёт softmax; 95% против 62% → переобучение → аугментация или регуляризация.
- **3** s = Wx + b при W = [[1, 2], [−1, 1], [2, −1]], x = [2, −1], b = [0, 1, −1]:
= s0 = 1·2 + 2·(−1) + 0 = 0
= s1 = (−1)·2 + 1·(−1) + 1 = −2
= s2 = 2·2 + (−1)·(−1) + (−1) = 4
- s = [0, −2, 4] → класс 2, **Bird**. W — шаблоны классов (веса каждого входа), b — сдвиг каждого класса; одна гиперплоскость не разделит XOR.
- **4** после resize **(224, 224, 3)**; после BGR2GRAY один канал, **(224, 224)**; размытие до Canny, потому что производные усиливают шум; задача про цвет → одни края не подавать, Canny выбрасывает цвет.
- **5** по папке на класс (data/train/plastic/…); 80/20 от 2 000 → **1 600 / 400** (70/15/15 → 1 400 / 300 / 300), стратифицированно; macro-F1 + confusion matrix; другой телефон = **domain shift**.
- **Вариант с тканью**: читать в grayscale, добавить sigmaX, добавить тип порога; 32×32 — быстро и компактно, но мелкие полоски и клетки размываются:
= img = cv2.imread("fabric.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.GaussianBlur(img, (3, 3), 0)
= ret, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)
- «Человеку картинки нравятся — значит, предобработка не нужна» — не согласен: модель видит числа; тёплые и холодные лампы сдвигают все значения цвета, размеры разные, а JPEG-артефакты добавляют шум.
## Как получить полный балл
| Вопрос | Что хочет проверяющий |
|---|---|
| 1 Предобработка | каждая операция **+ зачем**, привязанная к сценарию (разные размеры → resize, лампы → нормализация, шум → размытие) |
| 1 Компромисс | ровно **один плюс + один минус**, оба про эту задачу |
| 1 Код | названы **обе ошибки**, почему каждая неверна, **исправленные строки** выписаны |
| 1 Утверждение | чёткое да или нет **+ один конкретный пример** |
| 2 Scores | argmax по каждой строке, accuracy как **верные / все** с числами, названа ошибочная картинка |
| 3 Линейный | каждое произведение выписано, затем argmax, затем W и b своими словами |
| 4 Пайплайн | форма и каналы после **каждой строки** плюс причина каждого шага |
| 5 Дизайн | папки по классам, split **с количествами**, метрика **с причиной**, причина провала + способ исправить |
> Показывай шаги и добавляй одно предложение «почему» — голое число или голое «да» дают только частичный балл.`,
};
