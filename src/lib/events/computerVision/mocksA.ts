import type { ExamTask, MockExam } from "../types";

/**
 * Пробные варианты мидтерма по Computer Vision, часть A:
 * v1 — образец преподавателя слово в слово (критерии и эталоны наши),
 * v2 — настоящий вариант другой группы (ткани): Q1 как в оригинале,
 * Q2–Q5 новые в том же стиле, с уклоном в магазин одежды.
 * Все числа (оценки, accuracy, Wx + b, SVM loss, формы, разбиения)
 * пересчитаны скриптом на Python.
 */
function task(id: string, label: string, points: number, prompt: string, rubric: string[], en: string, ru: string): ExamTask {
  return { id, label, points, prompt, rubric, answer: { en, ru } };
}

const Q1 = "Question 1 — Image Processing & OpenCV";
const Q2 = "Question 2 — Image Classification";
const Q3 = "Question 3 — Linear Classifier";
const Q4 = "Question 4 — Understand the CV Pipeline";
const Q5 = "Question 5 — Design Your Own CV System";

const v1: MockExam = {
  id: "v1",
  title: { en: "Variant 1 — plant leaves, waste sorting", ru: "Вариант 1 — листья растений, сортировка мусора" },
  minutes: 120,
  source: { en: "Sample from the instructor", ru: "Образец преподавателя" },
  questions: [
    {
      id: "v1-q1",
      title: Q1,
      points: 20,
      context: `A student is building a system to classify healthy and diseased plant leaves. The collected images have different resolutions, lighting conditions, and some contain image noise.`,
      tasks: [
        task("v1-q1-a", "a", 6,
          `Propose three preprocessing operations that could be useful. For each operation, explain why you would use it.`,
          [
            "3 pts — three different valid operations, 1 pt each: resize to a fixed size (e.g. 224 × 224); scaling to [0, 1] or standardization (x − mean) / std; Gaussian or median denoising; histogram equalization / CLAHE or brightness-contrast normalization; white balance / colour normalization; cropping or segmenting the leaf from the background; data augmentation (brightness, rotation, flips). Grayscale conversion counts as an operation here.",
            "3 pts — a reason for each operation, 1 pt each, tied to a problem named in the scenario: resize → the images have different resolutions and the classifier needs one input shape; denoising → some images contain noise (Gaussian for sensor noise, median for salt-and-pepper); equalization / CLAHE / white balance / normalization → different lighting conditions; scaling → comparable pixel ranges and stable training; cropping → the background is not part of the class. A vague reason (‘to improve quality’) earns 0; a reason for grayscale earns 0 — it removes the lesion colour that defines the disease.",
          ],
          `- **Resize to a fixed size (e.g. 224 × 224):** the images have different resolutions, but a classifier needs inputs of one shape; cv2.resize(img, (224, 224)).
- **Denoise with a small blur:** some images contain noise; a Gaussian blur (5, 5) removes sensor noise (a median blur 3 or 5 removes salt-and-pepper dots), so the model does not mistake noise for disease spots.
- **Normalize brightness and contrast:** the lighting differs between photos; scaling to [0, 1] or standardizing each image, CLAHE on the brightness channel, or white balance make the same leaf look the same under different light.
Colour is kept: yellowing and brown spots are the disease signs themselves.`,
          `- **Resize до одного размера (например, 224 × 224):** снимки разного разрешения, а классификатору нужен вход одной формы; cv2.resize(img, (224, 224)).
- **Подавление шума небольшим размытием:** на части снимков есть шум; GaussianBlur (5, 5) убирает шум сенсора (medianBlur 3 или 5 — точки salt-and-pepper), чтобы модель не приняла шум за пятна болезни.
- **Выравнивание яркости и контраста:** освещение на снимках разное; масштабирование в [0, 1] или стандартизация, CLAHE по каналу яркости или баланс белого делают один и тот же лист одинаковым при разном свете.
Цвет сохраняем: пожелтение и бурые пятна — это и есть признаки болезни.`),
        task("v1-q1-b", "b", 4,
          `The student converts every image to grayscale. Give one advantage and one disadvantage of doing this for plant-disease classification.`,
          [
            "2 pts — a valid advantage: 3 channels → 1 (three times less data, faster training, fewer weights), or less sensitivity to the colour of the light; the shape and texture of spots stay visible. 1 pt if the advantage is only named without saying why it helps.",
            "2 pts — a disadvantage tied to plant disease: colour is a key symptom (yellowing, brown or black spots, rust-coloured pustules vs healthy green), and grayscale maps different colours with the same brightness to the same value, so these cues are lost. A generic ‘loses information’ with no link to disease colour earns 1 pt.",
          ],
          `- **Advantage:** one channel instead of three — the input is 3 times smaller, training is faster and the model needs fewer weights; the shape and texture of spots and veins are still visible, and the colour cast of the lamp matters less.
- **Disadvantage:** in plant disease the colour itself is a symptom — yellowing, brown or black spots, rust-orange pustules on green tissue. Gray = 0.299 R + 0.587 G + 0.114 B turns colour into one brightness, so different colours can become the same gray:
= green tissue RGB (60, 160, 50):  0.299*60 + 0.587*160 + 0.114*50 = 117.6
= brown lesion RGB (180, 100, 40): 0.299*180 + 0.587*100 + 0.114*40 = 117.1
Both pixels become ≈ 117: the lesion disappears in grayscale, so the classifier loses its main cue.`,
          `- **Плюс:** один канал вместо трёх — вход в 3 раза меньше, обучение быстрее, весов меньше; форма и текстура пятен и прожилок остаются видны, а цветовой оттенок лампы мешает меньше.
- **Минус:** при болезнях растений сам цвет — симптом: пожелтение, бурые или чёрные пятна, ржаво-оранжевые пустулы на зелёной ткани. Gray = 0.299 R + 0.587 G + 0.114 B сводит цвет к одной яркости, и разные цвета могут дать один и тот же серый:
= green tissue RGB (60, 160, 50):  0.299*60 + 0.587*160 + 0.114*50 = 117.6
= brown lesion RGB (180, 100, 40): 0.299*180 + 0.587*100 + 0.114*40 = 117.1
Оба пикселя становятся ≈ 117: в оттенках серого пятно пропадает, и классификатор теряет главный признак.`),
        task("v1-q1-c", "c", 5,
          `Consider the following code. Identify two problems and provide the corrected code.
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
= blur = cv2.GaussianBlur(gray, (4, 4), 0)`,
          [
            "2 pts — line 2: cv2.imread returns the channels in BGR order, so COLOR_RGB2GRAY is the wrong code (1 pt); fix: cv2.COLOR_BGR2GRAY (1 pt). It runs without an error but swaps the R and B weights, so the gray values are wrong.",
            "2 pts — line 3: the Gaussian kernel size must be positive and odd; (4, 4) raises an error (1 pt); fix: an odd kernel such as (3, 3) or (5, 5) (1 pt).",
            "1 pt — the corrected code written out with both fixes, sigmaX kept (0 is valid: OpenCV computes sigma from the kernel size). Calling sigmaX = 0 or cv2.imread a bug earns nothing.",
          ],
          `- **Problem 1 (line 2):** cv2.imread returns the channels in **BGR** order, so the conversion code must be COLOR_BGR2GRAY. COLOR_RGB2GRAY does not crash — it silently swaps the weights of R and B (a pure red pixel becomes 29 instead of 76), so the gray image is wrong.
- **Problem 2 (line 3):** GaussianBlur needs a **positive odd** kernel; (4, 4) has no centre pixel and raises an error. Use (5, 5) or (3, 3). sigmaX = 0 is fine — sigma is computed from the kernel size.
Corrected code:
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)`,
          `- **Ошибка 1 (строка 2):** cv2.imread возвращает каналы в порядке **BGR**, поэтому нужен код COLOR_BGR2GRAY. COLOR_RGB2GRAY не падает — он молча меняет местами веса R и B (чисто красный пиксель становится 29 вместо 76), и серое изображение получается неверным.
- **Ошибка 2 (строка 3):** GaussianBlur требует **положительное нечётное** ядро; у (4, 4) нет центрального пикселя, вызов падает с ошибкой. Берите (5, 5) или (3, 3). sigmaX = 0 — это нормально: sigma вычисляется по размеру ядра.
Исправленный код:
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)`),
        task("v1-q1-d", "d", 5,
          `A student says: "Applying more preprocessing always improves classification accuracy." Do you agree? Explain using one example.`,
          [
            "1 pt — does not agree (‘no’ / ‘not always’).",
            "2 pts — the general reason: every operation removes or changes information; it helps only when it fixes a real problem of the data and keeps the features that define the class; unnecessary steps can remove the signal or add artifacts.",
            "2 pts — one concrete example that names what is lost, e.g. grayscale removes the yellow/brown colour of diseased leaves; a strong blur (large kernel) erases small spots; resizing to a tiny size (32 × 32) removes small lesions; feeding only Canny edges or a binary threshold drops colour and texture; hue-shift augmentation turns healthy green into disease-like yellow. An example that does not say what information is lost earns 1 pt.",
          ],
          `No. Each preprocessing step removes or changes information, so it helps only when it solves a real problem of the data and keeps what defines the class.
Example: for leaves, converting to grayscale or adding a strong 15 × 15 blur is ‘more preprocessing’, but grayscale removes the yellow and brown colour of the lesions, and the big blur wipes out small disease spots — accuracy goes down. Add one step at a time and keep it only if validation accuracy improves.`,
          `Нет. Каждый шаг предобработки что-то убирает или меняет, поэтому он помогает, только если решает реальную проблему данных и сохраняет то, что определяет класс.
Пример: для листьев перевод в оттенки серого или сильное размытие 15 × 15 — это «больше предобработки», но серый убирает жёлтый и бурый цвет поражений, а сильное размытие стирает мелкие пятна болезни — точность падает. Добавляйте по одному шагу и оставляйте его, только если растёт точность на validation.`),
      ],
    },
    {
      id: "v1-q2",
      title: Q2,
      points: 20,
      context: `A classifier produces the following scores:
| Image | Cat | Dog | Bird | True class |
|---|---|---|---|---|
| A | 2.4 | 0.7 | -0.2 | Cat |
| B | 0.3 | 1.2 | 1.8 | Dog |
| C | -0.5 | 0.4 | 2.1 | Bird |
| D | 1.4 | 1.6 | 0.2 | Dog |`,
      tasks: [
        task("v1-q2-a", "a", 4,
          `Write the predicted class for A, B, C, and D.`,
          [
            "2 pts — A → Cat (2.4 is the highest score) and C → Bird (2.1), 1 pt each.",
            "2 pts — B → Bird (1.8 > 1.2 > 0.3) and D → Dog (1.6 > 1.4 > 0.2), 1 pt each. The prediction is the class with the highest score (argmax), not the true class: writing Dog for B earns 0 for B.",
          ],
          `The predicted class is the one with the highest score (argmax):
= A: max(2.4, 0.7, -0.2) = 2.4   -> Cat
= B: max(0.3, 1.2, 1.8) = 1.8    -> Bird
= C: max(-0.5, 0.4, 2.1) = 2.1   -> Bird
= D: max(1.4, 1.6, 0.2) = 1.6    -> Dog`,
          `Предсказанный класс — тот, у которого наибольшая оценка (argmax):
= A: max(2.4, 0.7, -0.2) = 2.4   -> Cat
= B: max(0.3, 1.2, 1.8) = 1.8    -> Bird
= C: max(-0.5, 0.4, 2.1) = 2.1   -> Bird
= D: max(1.4, 1.6, 0.2) = 1.6    -> Dog`),
        task("v1-q2-b", "b", 4,
          `Calculate classification accuracy. Show your calculation.`,
          [
            "2 pts — compares each prediction with the true class: A, C, D correct, B wrong → 3 correct out of 4, with the formula accuracy = correct / total.",
            "2 pts — the result 3 / 4 = 0.75 = 75%. A bare ‘75%’ with no calculation earns only these 2 pts.",
          ],
          `= correct: A (Cat = Cat), C (Bird = Bird), D (Dog = Dog);  wrong: B (Bird ≠ Dog)
= accuracy = correct / total = 3 / 4 = 0.75 = 75%
Three of the four images are classified correctly.`,
          `= correct: A (Cat = Cat), C (Bird = Bird), D (Dog = Dog);  wrong: B (Bird ≠ Dog)
= accuracy = correct / total = 3 / 4 = 0.75 = 75%
Верно классифицированы три изображения из четырёх.`),
        task("v1-q2-c", "c", 4,
          `Which image was incorrectly classified?`,
          [
            "2 pts — image B (only B; naming any other image as wrong loses these 2 pts).",
            "2 pts — the explanation: B is truly Dog, but its highest score is Bird 1.8 (Dog only 1.2), so it is predicted Bird.",
          ],
          `Image B. Its true class is Dog, but the highest score is Bird (1.8 > Dog 1.2 > Cat 0.3), so the classifier predicts Bird. All other images are correct.`,
          `Изображение B. Его истинный класс — Dog, но наибольшая оценка у Bird (1.8 > Dog 1.2 > Cat 0.3), поэтому классификатор предсказывает Bird. Остальные изображения классифицированы верно.`),
        task("v1-q2-d", "d", 4,
          `Explain the difference between a class score and a class probability.`,
          [
            "2 pts — score (logit): the raw output of the classifier (e.g. one entry of Wx + b), any real number — negative or larger than 1 — and the scores of one image do not sum to 1; only their comparison matters.",
            "2 pts — probability: a value in [0, 1], the probabilities of all classes sum to 1; obtained from the scores with softmax p_k = exp(s_k) / Σ_j exp(s_j); the order and the predicted class (argmax) do not change. 1 pt if neither softmax nor ‘sum to 1’ is mentioned.",
          ],
          `- A **class score** (logit) is the raw number the classifier computes, e.g. s = Wx + b. It is unbounded: it can be negative (Bird −0.2 for A) or bigger than 1 (Cat 2.4), and the scores of an image do not add up to 1 — only which one is larger matters.
- A **class probability** is in [0, 1], and the probabilities of all classes add up to 1. Softmax turns scores into probabilities:
= p_k = exp(s_k) / Σ_j exp(s_j)
= A: exp(2.4), exp(0.7), exp(-0.2) = 11.023, 2.014, 0.819;  sum = 13.856
= p(A) = 11.023 / 13.856, 2.014 / 13.856, 0.819 / 13.856 = 0.796, 0.145, 0.059
The ranking is the same, so the predicted class (Cat) does not change.`,
          `- **Оценка класса (score, logit)** — «сырое» число, которое вычисляет классификатор, например s = Wx + b. Она ничем не ограничена: может быть отрицательной (Bird −0.2 у A) или больше 1 (Cat 2.4), и оценки одного изображения не дают в сумме 1 — важно только, какая больше.
- **Вероятность класса** лежит в [0, 1], и вероятности всех классов в сумме дают 1. Оценки превращает в вероятности softmax:
= p_k = exp(s_k) / Σ_j exp(s_j)
= A: exp(2.4), exp(0.7), exp(-0.2) = 11.023, 2.014, 0.819;  sum = 13.856
= p(A) = 11.023 / 13.856, 2.014 / 13.856, 0.819 / 13.856 = 0.796, 0.145, 0.059
Порядок тот же, поэтому предсказанный класс (Cat) не меняется.`),
        task("v1-q2-e", "e", 4,
          `The model achieves 95% training accuracy but 62% test accuracy. What is the likely problem? Give one possible solution.`,
          [
            "2 pts — overfitting: the model fits (memorizes) the training data, including its noise, and does not generalize — the 33-point gap between train (95%) and test (62%) shows it. ‘Underfitting’ earns 0.",
            "2 pts — one valid fix: more training data or data augmentation, regularization (L2 weight decay, dropout), a simpler / smaller model, early stopping with a validation set (for kNN: a larger k). ‘Train longer’, ‘a bigger model’ or ‘tune on the test set’ earn 0.",
          ],
          `**Overfitting.** The model is very good on the images it was trained on (95%) but much worse on new images (62%): a 33-point gap means it memorized details and noise of the training set instead of general features.
Solution: get more training data or use data augmentation (flips, crops, brightness changes); other valid fixes are L2 regularization or dropout, a simpler model and early stopping on a validation set.`,
          `**Переобучение (overfitting).** На снимках, на которых модель училась, она очень хороша (95%), а на новых — заметно хуже (62%): разрыв в 33 пункта значит, что она запомнила детали и шум обучающего набора вместо общих признаков.
Решение: больше обучающих данных или аугментация (отражения, кропы, изменение яркости); также подходят L2-регуляризация или dropout, более простая модель и ранняя остановка по validation.`),
      ],
    },
    {
      id: "v1-q3",
      title: Q3,
      points: 25,
      context: `Consider a three-class linear image classifier: s = Wx + b
= x = [2, -1]ᵀ
= W = [[1, 2], [-1, 1], [2, -1]]
= b = [0, 1, -1]ᵀ
Classes: 0 = Cat, 1 = Dog, 2 = Bird`,
      tasks: [
        task("v1-q3-a", "a", 12,
          `Calculate s = Wx + b. Show every step.`,
          [
            "6 pts — Wx row by row, 2 pts per row with the products shown: Cat 1·2 + 2·(−1) = 0; Dog (−1)·2 + 1·(−1) = −3; Bird 2·2 + (−1)·(−1) = 5 → Wx = [0, −3, 5]. A row with the right method but one sign or arithmetic slip earns 1 of its 2 pts.",
            "3 pts — adds b element by element, 1 pt per class: 0 + 0 = 0, −3 + 1 = −2, 5 + (−1) = 4.",
            "3 pts — the final answer s = [0, −2, 4] (Cat 0, Dog −2, Bird 4). The final vector alone with no working earns these 3 pts and nothing else.",
          ],
          `W is 3 × 2 and x has 2 values, so s has 3 scores — one row of W (and one b) per class.
= Cat:  1*2 + 2*(-1) = 2 - 2 = 0
= Dog:  (-1)*2 + 1*(-1) = -2 - 1 = -3
= Bird: 2*2 + (-1)*(-1) = 4 + 1 = 5
= Wx = [0, -3, 5]
= s = Wx + b = [0 + 0, -3 + 1, 5 + (-1)] = [0, -2, 4]`,
          `W имеет размер 3 × 2, x — 2 числа, поэтому s — 3 оценки: по строке W (и по одному b) на класс.
= Cat:  1*2 + 2*(-1) = 2 - 2 = 0
= Dog:  (-1)*2 + 1*(-1) = -2 - 1 = -3
= Bird: 2*2 + (-1)*(-1) = 4 + 1 = 5
= Wx = [0, -3, 5]
= s = Wx + b = [0 + 0, -3 + 1, 5 + (-1)] = [0, -2, 4]`),
        task("v1-q3-b", "b", 3,
          `What class does the classifier predict?`,
          [
            "2 pts — class 2, Bird.",
            "1 pt — because s_Bird = 4 is the largest score (4 > 0 > −2, argmax). If a) was wrong, this point is still given for taking the argmax of the student's own s.",
          ],
          `Class 2 — **Bird**, because it has the largest score: 4 > 0 (Cat) > −2 (Dog). The prediction is the argmax of s.`,
          `Класс 2 — **Bird**: у него наибольшая оценка, 4 > 0 (Cat) > −2 (Dog). Предсказание — argmax вектора s.`),
        task("v1-q3-c", "c", 5,
          `Explain in your own words what W and b represent.`,
          [
            "3 pts — W: the weights learned from the training data, one row per class (one weight per class and input value, 3 × 2 here); each row acts as a template of its class — the score is the dot product of that row with the input, so a positive weight raises the class score when that input value is large and a negative weight lowers it. Only ‘W are the weights’ with no meaning earns 1 pt.",
            "2 pts — b: the bias, one learned number per class added to its score independently of the input; it shifts the decision boundary away from the origin / sets a baseline preference for a class. Only ‘b is the bias’ with no meaning earns 1 pt.",
          ],
          `- **W (weights)** — the parameters the classifier learns from the training data. It has one row per class (here 3 rows of 2 numbers). Each row is a **template** of its class: the score is the dot product of the row with the image vector, so a positive weight means ‘this value is typical for the class’ and raises the score, a negative weight lowers it. Here the Bird row [2, −1] matches x = [2, −1] best (2·2 + (−1)·(−1) = 5).
- **b (bias)** — one learned number per class, added to the score whatever the input is. It shifts the decision boundary so that it does not have to pass through the origin, and expresses a prior preference for a class (e.g. Dog gets +1 before the image is even looked at).`,
          `- **W (веса)** — параметры, которые классификатор выучивает по обучающим данным. В W по строке на класс (здесь 3 строки по 2 числа). Каждая строка — **шаблон** своего класса: оценка — скалярное произведение строки на вектор изображения, поэтому положительный вес означает «это значение типично для класса» и повышает оценку, отрицательный — понижает. Здесь строка Bird [2, −1] лучше всего совпадает с x = [2, −1] (2·2 + (−1)·(−1) = 5).
- **b (смещение, bias)** — по одному выученному числу на класс, которое прибавляется к оценке, каким бы ни был вход. Оно сдвигает границу решения, чтобы та не обязана была проходить через начало координат, и задаёт исходное предпочтение класса (например, Dog получает +1 ещё до того, как посмотрели на изображение).`),
        task("v1-q3-d", "d", 5,
          `Why can't a single linear classifier correctly separate every possible dataset? You may include a small drawing.`,
          [
            "2 pts — the reason: every class score is a linear function of x, so the decision boundaries are straight lines / hyperplanes and each class gets one convex region (one template per class); only linearly separable data can be classified perfectly.",
            "3 pts — one concrete dataset it cannot separate, described or drawn: XOR (one class at (0, 0) and (1, 1), the other at (0, 1) and (1, 0)), concentric rings (one class inside a circle, the other around it), or a multi-modal class (one class split into two clusters with another class between them). 1 pt for naming it, 2 pts for explaining why no single straight line works.",
          ],
          `A linear classifier computes s = Wx + b, so the boundary between two classes is where two linear scores are equal — a **straight line** (a hyperplane in more dimensions). Each class gets one convex region, so only **linearly separable** data can be classified perfectly.
Example — **XOR** in 2-D:
= class A: (0, 0) and (1, 1);  class B: (0, 1) and (1, 0)
Drawing: the four points are the corners of a square, the two A points on one diagonal and the two B points on the other. Any straight line that keeps both A points on one side leaves at least one B point on that side too. Concentric rings (one class inside a circle, the other around it) fail for the same reason. A non-linear model (non-linear features or a neural network with a hidden layer) is needed.`,
          `Линейный классификатор вычисляет s = Wx + b, поэтому граница между двумя классами — это место, где две линейные оценки равны, то есть **прямая** (гиперплоскость в большей размерности). Каждому классу достаётся одна выпуклая область, и без ошибок можно разделить только **линейно разделимые** данные.
Пример — **XOR** на плоскости:
= class A: (0, 0) and (1, 1);  class B: (0, 1) and (1, 0)
Рисунок: четыре точки — углы квадрата, точки A на одной диагонали, точки B на другой. Любая прямая, оставляющая обе точки A по одну сторону, оставляет там же хотя бы одну точку B. По той же причине не разделить концентрические кольца (один класс внутри круга, другой вокруг). Нужна нелинейная модель (нелинейные признаки или нейросеть со скрытым слоем).`),
      ],
    },
    {
      id: "v1-q4",
      title: Q4,
      points: 20,
      context: `A student wrote the following image-processing pipeline:
= img = cv2.imread("cat.jpg")
= img = cv2.resize(img, (224, 224))
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
= edges = cv2.Canny(blur, 100, 200)`,
      tasks: [
        task("v1-q4-a", "a", 5,
          `Write the dimensions of img after resizing.`,
          [
            "3 pts — 224 × 224 pixels (height 224, width 224).",
            "2 pts — still 3 colour channels: shape (224, 224, 3), BGR. ‘224 × 224’ without the channels earns 3 pts in total.",
          ],
          `img.shape = (224, 224, 3): height 224, width 224 and 3 colour channels (B, G, R). cv2.resize takes (width, height); here both are 224, so the order does not matter. The values are still uint8, 0–255.`,
          `img.shape = (224, 224, 3): высота 224, ширина 224 и 3 цветовых канала (B, G, R). cv2.resize принимает (width, height); здесь оба числа 224, так что порядок не важен. Значения по-прежнему uint8, 0–255.`),
        task("v1-q4-b", "b", 5,
          `What happens to the number of channels after BGR2GRAY?`,
          [
            "3 pts — it goes from 3 channels (B, G, R) to 1 channel.",
            "2 pts — the explanation: each pixel becomes one brightness value Gray = 0.299 R + 0.587 G + 0.114 B (0–255), shape (224, 224) — a 2-D array with no channel axis; colour is lost. Writing (224, 224, 1) earns 1 of these 2 pts.",
          ],
          `The image goes from **3 channels to 1**. The three values of every pixel are combined into one brightness Gray = 0.299 R + 0.587 G + 0.114 B, so gray.shape = (224, 224) — a 2-D array (blur and edges keep this shape). The colour information is gone.`,
          `Каналов становится **не 3, а 1**. Три значения каждого пикселя сводятся к одной яркости Gray = 0.299 R + 0.587 G + 0.114 B, поэтому gray.shape = (224, 224) — двумерный массив (blur и edges сохраняют эту форму). Информация о цвете пропадает.`),
        task("v1-q4-c", "c", 5,
          `Explain why Gaussian blur might be applied before Canny edge detection.`,
          [
            "3 pts — Canny is based on the image gradient (derivatives); derivatives amplify small high-frequency changes, so noise and tiny texture would produce many false edges.",
            "2 pts — Gaussian blur replaces each pixel by a weighted average of its neighbours, removing that noise while large, consistent intensity changes (real object boundaries) survive; the result is cleaner, more continuous edges and fewer false ones.",
          ],
          `Canny finds edges from the **gradient** (derivatives) of the image. A derivative reacts to every small change, so noisy pixels produce large gradients and appear as many short **false edges**. A Gaussian (5, 5) blur replaces each pixel by a weighted average of its neighbours: random noise is smoothed out, while real object boundaries — big, consistent changes in brightness — remain. Canny then keeps the strong edges (gradient above 200), drops the weak ones (below 100) and keeps the in-between ones only if they connect to a strong edge, so the result is clean, connected outlines.`,
          `Canny ищет края по **градиенту** (производным) изображения. Производная реагирует на любое мелкое изменение, поэтому шумные пиксели дают большой градиент и превращаются во множество коротких **ложных краёв**. Gaussian blur (5, 5) заменяет каждый пиксель взвешенным средним соседей: случайный шум сглаживается, а настоящие границы объектов — большие и согласованные перепады яркости — остаются. Затем Canny оставляет сильные края (градиент выше 200), отбрасывает слабые (ниже 100), а промежуточные сохраняет, только если они связаны с сильным краем, — получаются чистые связные контуры.`),
        task("v1-q4-d", "d", 5,
          `Suppose the classification task depends strongly on object color. Would you feed edges alone to the classifier? Explain your decision.`,
          [
            "1 pt — No.",
            "2 pts — the Canny output is a single-channel map of 0 and 255 that marks only boundaries; colour (and most texture) was already removed by BGR2GRAY, so objects with the same shape but different colours give the same edge map — e.g. a ripe red and an unripe green tomato.",
            "2 pts — what to feed instead: the colour image (BGR/RGB, or HSV to separate hue from brightness) without the grayscale step; edges may be added as an extra input next to the colour, not instead of it.",
          ],
          `No. The edge map is a single channel of 0 and 255 that only marks where the brightness changes; the colour was already thrown away by BGR2GRAY. Two objects with the same outline but different colours — a ripe red tomato and an unripe green one — produce the same edges, so the classifier cannot tell them apart.
I would feed the colour image (BGR, or HSV so that hue is separated from brightness), resized and normalized, and at most add the edges as an extra channel next to the colour.`,
          `Нет. Карта краёв — один канал из 0 и 255, который отмечает только места перепада яркости; цвет был выброшен ещё на шаге BGR2GRAY. Два объекта одной формы, но разного цвета — спелый красный и незрелый зелёный помидор — дают одинаковые края, и классификатор их не различит.
Я бы подавал цветное изображение (BGR или HSV, где оттенок отделён от яркости), приведённое к одному размеру и нормализованное, а края — разве что как дополнительный канал рядом с цветом.`),
      ],
    },
    {
      id: "v1-q5",
      title: Q5,
      points: 15,
      context: `You need to develop a system that classifies waste into Plastic | Paper | Glass | Other. You have collected 2,000 images.`,
      tasks: [
        task("v1-q5-a", "a", 3,
          `How would you organize the dataset?`,
          [
            "2 pts — one folder (or a label in a CSV file) per class — Plastic, Paper, Glass, Other — inside separate train / (validation /) test folders, e.g. data/train/plastic/.",
            "1 pt — data hygiene: check the labels, remove duplicates and near-duplicates before splitting (no leakage between the parts), count the images per class.",
          ],
          `One folder per class inside one folder per split, so the folder name is the label:
= data/train/plastic/  data/train/paper/  data/train/glass/  data/train/other/
= data/val/...   data/test/...
Before splitting I check the labels, remove duplicates and near-identical shots (otherwise the same object lands in train and in test), and count the images per class to see whether the classes are balanced.`,
          `По папке на класс внутри папки каждой части разбиения — имя папки и есть метка:
= data/train/plastic/  data/train/paper/  data/train/glass/  data/train/other/
= data/val/...   data/test/...
Перед разбиением проверяю метки, удаляю дубликаты и почти одинаковые снимки (иначе один и тот же предмет попадёт и в train, и в test) и считаю снимки по классам, чтобы понять, сбалансированы ли они.`),
        task("v1-q5-b", "b", 3,
          `Propose a train/test split and calculate the number of images in each part.`,
          [
            "1 pt — a sensible ratio: 80/20, 70/30, or 70/15/15 with a validation set.",
            "1 pt — correct counts: 80/20 → 1 600 train / 400 test; 70/30 → 1 400 / 600; 70/15/15 → 1 400 / 300 / 300.",
            "1 pt — the split is random and stratified (each class keeps its share in every part), and the test set is used only once, at the end (hyperparameters are tuned on train / validation).",
          ],
          `80% train / 20% test, stratified (each class is split separately, so every part keeps the class proportions):
= train = 2000 * 0.8 = 1600 images
= test  = 2000 * 0.2 = 400 images
For tuning I take a validation set out of train (e.g. 70/15/15 → 1400 / 300 / 300) and use the test set only once, at the end.`,
          `80% train / 20% test, стратифицированно (каждый класс делится отдельно, чтобы в каждой части сохранились доли классов):
= train = 2000 * 0.8 = 1600 images
= test  = 2000 * 0.2 = 400 images
Для подбора гиперпараметров выделяю validation из train (например, 70/15/15 → 1400 / 300 / 300), а test использую один раз, в самом конце.`),
        task("v1-q5-c", "c", 3,
          `Give two preprocessing operations you would consider.`,
          [
            "1.5 pts — a first operation with a reason (0.5 for the operation, 1 for the reason), e.g. resize to a fixed size such as 224 × 224 (the photos differ in size, the model needs one input shape); scaling to [0, 1] / standardization (comparable values, stable training).",
            "1.5 pts — a second, different operation with a reason, e.g. augmentation of the training set only — flips, rotations, brightness/colour changes (more variety, less overfitting); denoising; cropping the object / removing the background. Grayscale earns the 0.5 operation point only: colour helps to tell glass, paper and plastic apart.",
          ],
          `- **Resize to 224 × 224** (cv2.resize(img, (224, 224))): the photos come from different cameras and have different sizes, and the classifier needs one input shape.
- **Normalize pixel values** to [0, 1] (img.astype("float32") / 255.0) or standardize them, so all images are on the same scale and training is stable.
Also useful: augmentation of the training images (flips, small rotations, brightness changes). I keep colour — green or brown glass, white paper and coloured plastic differ in colour.`,
          `- **Resize до 224 × 224** (cv2.resize(img, (224, 224))): снимки с разных камер и разного размера, а классификатору нужен вход одной формы.
- **Нормализация значений пикселей** в [0, 1] (img.astype("float32") / 255.0) или стандартизация — все изображения в одном масштабе, обучение стабильнее.
Также полезна аугментация обучающих снимков (отражения, небольшие повороты, изменение яркости). Цвет сохраняю: зелёное или коричневое стекло, белая бумага и цветной пластик различаются цветом.`),
        task("v1-q5-d", "d", 3,
          `What metric would you use to evaluate your classifier? Explain why.`,
          [
            "1 pt — names a suitable metric: accuracy (if the classes are balanced), and/or per-class precision, recall, F1 / macro-F1, the confusion matrix.",
            "2 pts — a correct reason: accuracy = correct / total is simple and fine when the four classes have similar sizes; with imbalanced classes it hides a weak or rare class, so per-class recall / F1 (macro-F1) and the confusion matrix show which classes are confused (e.g. glass vs plastic). A metric with no reason earns only the 1 pt above.",
          ],
          `**Accuracy** (= correct / total) if the four classes have about the same number of images — it is easy to interpret. Because I do not know the balance, I would also report **per-class precision, recall and F1 (macro-F1)** and the **confusion matrix**: with imbalanced classes a model can reach high accuracy while missing a small class, and the matrix shows which classes are confused, e.g. transparent plastic vs glass.`,
          `**Accuracy** (= верные / все), если в четырёх классах примерно поровну снимков, — её легко понять. Но баланс классов неизвестен, поэтому я бы также считал **precision, recall и F1 по классам (macro-F1)** и строил **матрицу ошибок**: при несбалансированных классах модель может иметь высокую accuracy и при этом пропускать маленький класс, а матрица показывает, какие классы путаются, например прозрачный пластик и стекло.`),
        task("v1-q5-e", "e", 3,
          `Your model performs very well on your dataset but poorly when tested using photos taken by another student's phone. Give one possible reason.`,
          [
            "2 pts — one valid reason: domain (distribution) shift — the other phone has a different sensor, colour processing / white balance, resolution, sharpness or JPEG compression, or the photos have different lighting and backgrounds, so they do not look like the training images; or the model overfitted to cues of the first phone / background.",
            "1 pt — explains the effect (the model learned features specific to the training photos that change with the new camera) or gives a matching fix: photos from several phones and places, augmentation of brightness, colour, blur and scale, normalization, testing on a held-out phone.",
          ],
          `**Domain shift.** All training and test photos came from one phone, so the model learned that phone's colours, sharpness and resolution and the usual backgrounds and lighting. Another phone has a different sensor and colour processing, so its photos differ in pixel values even when a person sees the same bottle.
Fix: collect photos from several phones and places, augment brightness, colour and blur, normalize the inputs, and test on photos from a phone that was not used for training.`,
          `**Сдвиг домена (domain shift).** Все обучающие и тестовые снимки сделаны одним телефоном, и модель выучила его цвета, резкость, разрешение, привычные фоны и освещение. У другого телефона другая матрица и обработка цвета, поэтому его снимки отличаются по значениям пикселей, даже если человек видит ту же бутылку.
Что делать: снимать на несколько телефонов и в разных местах, аугментировать яркость, цвет и размытие, нормализовать входы и проверять на снимках с телефона, который не участвовал в обучении.`),
      ],
    },
  ],
};

const v2: MockExam = {
  id: "v2",
  title: { en: "Variant 2 — fabric patterns, clothing shop", ru: "Вариант 2 — узоры тканей, магазин одежды" },
  minutes: 120,
  source: { en: "Based on a real variant from another group", ru: "По настоящему варианту другой группы" },
  questions: [
    {
      id: "v2-q1",
      title: Q1,
      points: 20,
      context: `A student is building a system for a clothing shop that classifies fabric patterns as striped, checked or plain. The photos have different sizes, were taken under warm and cold lamps, and some contain JPEG compression artifacts.`,
      tasks: [
        task("v2-q1-a", "a", 6,
          `Propose three preprocessing operations that could be useful. For each operation, explain why you would use it.`,
          [
            "3 pts — three different valid operations, 1 pt each: resize (or crop + resize) to a fixed size; grayscale conversion or white balance / colour normalization; a mild blur (Gaussian (3, 3) or median 3) against JPEG artifacts; contrast normalization (equalizeHist / CLAHE); scaling to [0, 1] / standardization; colour-temperature augmentation.",
            "3 pts — a reason for each operation, 1 pt each, tied to a problem of this scenario: different sizes → one input shape; warm / cold lamps → the lamp colour must not decide the class, the pattern lives in brightness; JPEG artifacts → 8 × 8 block edges can look like a checked grid; contrast → faint stripes become visible. No reason point if the operation as described destroys the pattern (a blur with kernel 7 or larger, resizing to a tiny size such as 32 × 32).",
          ],
          `- **Crop and resize to one size** (e.g. a central 256 × 256 patch, or cv2.resize to 128 × 128): the photos have different sizes and the model needs one input shape; cropping keeps the stripes several pixels wide.
- **Grayscale (or white balance):** the class is the pattern, not the colour, and warm and cold lamps tint the same cloth orange or blue; in grayscale the pattern stays, and the lamp colour can no longer become a shortcut (‘warm light = checked’).
- **Mild blur — GaussianBlur (3, 3) or medianBlur 3:** JPEG compression leaves 8 × 8 block edges that can look like a checked grid; a small kernel removes them without erasing thin stripes.`,
          `- **Кроп и resize до одного размера** (например, центральный фрагмент 256 × 256 или cv2.resize до 128 × 128): снимки разного размера, а модели нужен вход одной формы; кроп сохраняет ширину полос в несколько пикселей.
- **Оттенки серого (или баланс белого):** класс — это узор, а не цвет, а тёплые и холодные лампы окрашивают одну и ту же ткань в оранжевый или синий; в сером узор остаётся, а цвет лампы уже не может стать «подсказкой» («тёплый свет = клетка»).
- **Слабое размытие — GaussianBlur (3, 3) или medianBlur 3:** сжатие JPEG оставляет границы блоков 8 × 8, похожие на клетку; маленькое ядро убирает их, не стирая тонкие полосы.`),
        task("v2-q1-b", "b", 4,
          `The student resizes every image to 32 × 32. Give one advantage and one disadvantage of doing this for fabric-pattern classification.`,
          [
            "2 pts — advantage: every image gets the same small shape — 32 × 32 × 3 = 3 072 values instead of 150 528 at 224 × 224 (49 times fewer) → fast training, little memory, a small model. 1 pt if only ‘same size’ or ‘faster’ is named without saying why.",
            "2 pts — disadvantage tied to patterns: thin stripes and small checks become narrower than a pixel, so they vanish (striped looks plain) or alias into false patterns (moiré); non-square photos are also distorted. A generic ‘loses detail’ with no link to the pattern earns 1 pt.",
          ],
          `- **Advantage:** all photos get one small input shape:
= 32 * 32 * 3 = 3072 values,  224 * 224 * 3 = 150528 values  (49 times more)
so training is fast, memory is small and even a simple model can be used.
- **Disadvantage:** the pattern is fine detail. A photo 1 200 pixels wide with 60 stripe pairs (one every 20 pixels), shrunk to 32 pixels, gets
= 32 / 60 = 0.53 pixels per stripe pair
— less than the 2 pixels needed to show one light and one dark line, so the stripes disappear (striped looks plain) or turn into false moiré patterns. Non-square photos are also squashed.`,
          `- **Плюс:** у всех снимков одна маленькая форма входа:
= 32 * 32 * 3 = 3072 values,  224 * 224 * 3 = 150528 values  (49 times more)
поэтому обучение быстрое, памяти нужно мало, подойдёт даже простая модель.
- **Минус:** узор — это мелкие детали. Снимок шириной 1 200 пикселей с 60 парами полос (по паре на 20 пикселей), сжатый до 32 пикселей, получает
= 32 / 60 = 0.53 pixels per stripe pair
— меньше 2 пикселей, нужных, чтобы показать одну светлую и одну тёмную линию, поэтому полосы исчезают (полоска выглядит однотонной) или превращаются в ложный муар. Неквадратные снимки к тому же сплющиваются.`),
        task("v2-q1-c", "c", 5,
          `Consider the following code. Identify two problems and provide the corrected code.
= img = cv2.imread("fabric.jpg")
= blur = cv2.GaussianBlur(img, (3, 3))
= ret, binary = cv2.threshold(blur, 127, 255)`,
          [
            "2 pts — line 2: GaussianBlur is missing the required sigmaX argument, so the call raises an error (1 pt); fix: cv2.GaussianBlur(img, (3, 3), 0) — 0 means sigma is computed from the kernel size (1 pt). The (3, 3) kernel is correct; calling it a bug earns nothing.",
            "2 pts — line 3: threshold is missing the required type argument, so the call raises an error (1 pt); fix: add a type, e.g. cv2.THRESH_BINARY (or THRESH_BINARY + THRESH_OTSU on a gray image) (1 pt).",
            "1 pt — the corrected code written out: both fixes (0.5) and a single-channel input for the binary mask — cv2.imread with cv2.IMREAD_GRAYSCALE or cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) (0.5); on a colour image threshold works on each channel separately.",
          ],
          `- **Problem 1 (line 2):** sigmaX is a **required** argument of GaussianBlur — without it the call fails. Add 0 (OpenCV then computes sigma from the kernel); the (3, 3) kernel itself is fine.
- **Problem 2 (line 3):** threshold needs the **threshold type** as the fourth argument, e.g. cv2.THRESH_BINARY — without it the call fails. It returns the threshold that was used (ret = 127) and the binary image.
- A binary mask should come from **one channel**: on the colour image threshold would work on B, G and R separately, so the photo is read in grayscale.
Corrected code:
= img = cv2.imread("fabric.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.GaussianBlur(img, (3, 3), 0)
= ret, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)`,
          `- **Ошибка 1 (строка 2):** sigmaX — **обязательный** аргумент GaussianBlur, без него вызов падает. Добавьте 0 (тогда OpenCV вычислит sigma по ядру); само ядро (3, 3) правильное.
- **Ошибка 2 (строка 3):** threshold нужен **тип порога** четвёртым аргументом, например cv2.THRESH_BINARY, — без него вызов падает. Функция возвращает использованный порог (ret = 127) и бинарное изображение.
- Бинарная маска должна строиться по **одному каналу**: на цветном изображении threshold сработал бы по B, G и R отдельно, поэтому читаем снимок сразу в оттенках серого.
Исправленный код:
= img = cv2.imread("fabric.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.GaussianBlur(img, (3, 3), 0)
= ret, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)`),
        task("v2-q1-d", "d", 5,
          `A student says: "If the training images look fine to a human, no preprocessing is needed." Do you agree? Explain using one example.`,
          [
            "1 pt — does not agree.",
            "2 pts — why: the model sees arrays of numbers, not what a person perceives; it needs a fixed input size and scaled values however good the photo looks; people automatically ignore the lamp colour (colour constancy) and JPEG blocks, while the model does not and may learn them as shortcuts; the same preprocessing must be applied at test time.",
            "2 pts — one concrete example from this scenario: photos of different sizes must be resized even if they look perfect; checked fabric shot mostly under a warm lamp → the model learns ‘warm tint = checked’ (fix: grayscale / white balance / balance the lamps per class); JPEG 8 × 8 blocks read as a checked grid. An example without the mechanism earns 1 pt.",
          ],
          `No. A person looks at a picture; the model gets an **array of numbers**, and things a human ignores still change those numbers.
Example: most checked fabrics in the training set were photographed under a warm lamp and most striped ones under a cold lamp. To a person every photo looks fine — we correct the colour of the light automatically. The model, however, can learn the shortcut ‘orange tint = checked’ and then call a striped shirt under a warm lamp ‘checked’. Grayscale or white balance removes the lamp colour. Besides, the photos have different sizes, so they must be resized to one input shape however good they look.`,
          `Нет. Человек смотрит на картинку, а модель получает **массив чисел**, и то, что человек не замечает, всё равно меняет эти числа.
Пример: большинство тканей в клетку в обучающем наборе сняты под тёплой лампой, а в полоску — под холодной. Человеку все снимки кажутся нормальными — мы автоматически поправляем цвет освещения. Модель же может выучить «подсказку» «оранжевый оттенок = клетка» и назвать полосатую рубашку под тёплой лампой клетчатой. Оттенки серого или баланс белого убирают цвет лампы. К тому же снимки разного размера, и их всё равно нужно привести к одной форме входа, как бы хорошо они ни выглядели.`),
      ],
    },
    {
      id: "v2-q2",
      title: Q2,
      points: 20,
      context: `A fabric-pattern classifier for a clothing shop produces the following scores for five photos:
| Image | Striped | Checked | Plain | True class |
|---|---|---|---|---|
| F1 | 3.1 | 1.2 | -0.4 | Striped |
| F2 | 0.8 | 2.6 | 2.9 | Checked |
| F3 | -1.0 | 0.5 | 1.7 | Plain |
| F4 | 2.2 | 2.5 | 0.3 | Striped |
| F5 | 0.1 | 1.9 | -0.6 | Checked |`,
      tasks: [
        task("v2-q2-a", "a", 4,
          `Write the predicted class for F1–F5.`,
          [
            "2 pts — the clear cases F1 → Striped (3.1), F3 → Plain (1.7), F5 → Checked (1.9): 2 pts if all three are right, 1 pt if two are right.",
            "2 pts — the close cases, 1 pt each: F2 → Plain (2.9 > 2.6) and F4 → Checked (2.5 > 2.2). The prediction is the argmax of the scores, not the true class — Checked for F2 or Striped for F4 earns 0.",
          ],
          `The predicted class is the argmax of the scores:
= F1: max(3.1, 1.2, -0.4) = 3.1   -> Striped
= F2: max(0.8, 2.6, 2.9) = 2.9    -> Plain
= F3: max(-1.0, 0.5, 1.7) = 1.7   -> Plain
= F4: max(2.2, 2.5, 0.3) = 2.5    -> Checked
= F5: max(0.1, 1.9, -0.6) = 1.9   -> Checked`,
          `Предсказанный класс — argmax оценок:
= F1: max(3.1, 1.2, -0.4) = 3.1   -> Striped
= F2: max(0.8, 2.6, 2.9) = 2.9    -> Plain
= F3: max(-1.0, 0.5, 1.7) = 1.7   -> Plain
= F4: max(2.2, 2.5, 0.3) = 2.5    -> Checked
= F5: max(0.1, 1.9, -0.6) = 1.9   -> Checked`),
        task("v2-q2-b", "b", 4,
          `Calculate classification accuracy. Show your calculation.`,
          [
            "2 pts — compares each prediction with the true class: F1, F3, F5 correct; F2, F4 wrong → 3 correct out of 5, with accuracy = correct / total.",
            "2 pts — the result 3 / 5 = 0.6 = 60%. A bare ‘60%’ with no calculation earns only these 2 pts.",
          ],
          `= correct: F1, F3, F5;  wrong: F2 (Plain ≠ Checked), F4 (Checked ≠ Striped)
= accuracy = correct / total = 3 / 5 = 0.6 = 60%
Three of the five photos are classified correctly.`,
          `= correct: F1, F3, F5;  wrong: F2 (Plain ≠ Checked), F4 (Checked ≠ Striped)
= accuracy = correct / total = 3 / 5 = 0.6 = 60%
Верно классифицированы три фото из пяти.`),
        task("v2-q2-c", "c", 4,
          `Which images were incorrectly classified? For each, give the true and the predicted class.`,
          [
            "2 pts — F2: true Checked, predicted Plain (2.9 > 2.6) — 1 pt for naming F2, 1 pt for the true and the predicted class.",
            "2 pts — F4: true Striped, predicted Checked (2.5 > 2.2) — 1 pt for naming F4, 1 pt for the true and the predicted class. Naming a correctly classified image as wrong costs 1 pt (the task total cannot go below 0).",
          ],
          `- **F2:** true Checked, predicted Plain — Plain 2.9 beats Checked 2.6 by only 0.3.
- **F4:** true Striped, predicted Checked — Checked 2.5 beats Striped 2.2 by only 0.3.
Both errors are close calls: the true class has the second-highest score.`,
          `- **F2:** истинный класс Checked, предсказан Plain — Plain 2.9 обгоняет Checked 2.6 всего на 0.3.
- **F4:** истинный класс Striped, предсказан Checked — Checked 2.5 обгоняет Striped 2.2 всего на 0.3.
Обе ошибки «на грани»: у истинного класса вторая по величине оценка.`),
        task("v2-q2-d", "d", 4,
          `Explain the difference between precision and recall. Then compute both for the class Plain from the table.`,
          [
            "1 pt — precision: of the images predicted as a class, the fraction that really belong to it: TP / (TP + FP).",
            "1 pt — recall: of the images that really belong to a class, the fraction the model found: TP / (TP + FN).",
            "1 pt — precision(Plain): predicted Plain = F2 and F3, only F3 is truly Plain → 1 / 2 = 0.5.",
            "1 pt — recall(Plain): the only truly Plain image, F3, is found → 1 / 1 = 1.0 (100%).",
          ],
          `- **Precision** answers ‘when the model says Plain, how often is it right?’; **recall** answers ‘of all truly Plain photos, how many did the model find?’
= precision = TP / (TP + FP),   recall = TP / (TP + FN)
= predicted Plain: F2, F3  ->  TP = 1 (F3), FP = 1 (F2)
= truly Plain: F3          ->  TP = 1, FN = 0
= precision(Plain) = 1 / (1 + 1) = 0.5,   recall(Plain) = 1 / (1 + 0) = 1.0
The model finds every plain fabric, but half of its ‘Plain’ answers are wrong.`,
          `- **Precision** отвечает на вопрос «когда модель говорит Plain, как часто она права?», **recall** — «сколько из всех действительно однотонных фото модель нашла?».
= precision = TP / (TP + FP),   recall = TP / (TP + FN)
= predicted Plain: F2, F3  ->  TP = 1 (F3), FP = 1 (F2)
= truly Plain: F3          ->  TP = 1, FN = 0
= precision(Plain) = 1 / (1 + 1) = 0.5,   recall(Plain) = 1 / (1 + 0) = 1.0
Модель находит все однотонные ткани, но половина её ответов «Plain» ошибочна.`),
        task("v2-q2-e", "e", 4,
          `Every photo was resized to 32 × 32. The model reaches 58% training accuracy and 55% validation accuracy on the three patterns. What is the likely problem? Give one possible solution.`,
          [
            "2 pts — underfitting: the training accuracy itself is low (random guessing among 3 classes gives about 33%), and train and validation are close (a 3-point gap), so the model is not memorizing — it cannot capture the patterns (too simple a model and/or 32 × 32 inputs that erased the thin stripes). ‘Overfitting’ earns 0.",
            "2 pts — one valid fix: a higher input resolution or crops so the stripes stay visible (e.g. 128 × 128), a more powerful model (a CNN, more layers or filters), better features, longer training, or less regularization. More data, dropout, stronger regularization or early stopping earn 0 — they fight overfitting.",
          ],
          `**Underfitting.** Even on the training set the model is right only 58% of the time (random guessing among 3 classes gives about 33%), and validation (55%) is almost the same — a 3-point gap, so it is not memorizing; it simply cannot represent the patterns. A likely cause is the 32 × 32 input: thin stripes and small checks no longer exist in it.
Solution: use a larger input (e.g. 128 × 128, or crops of the fabric) so the pattern survives, and/or a more powerful model such as a small CNN; train longer and reduce regularization if needed.`,
          `**Недообучение (underfitting).** Даже на обучающем наборе модель права лишь в 58% случаев (случайное угадывание из 3 классов даёт около 33%), а на validation (55%) почти столько же — разрыв 3 пункта, то есть она не запоминает, а просто не может описать узоры. Вероятная причина — вход 32 × 32: тонких полос и мелкой клетки в нём уже нет.
Решение: вход побольше (например, 128 × 128 или кропы ткани), чтобы узор сохранился, и/или более мощная модель, например небольшая CNN; при необходимости обучать дольше и ослабить регуляризацию.`),
      ],
    },
    {
      id: "v2-q3",
      title: Q3,
      points: 25,
      context: `A linear classifier for fabric patterns computes s = Wx + b from a feature vector x of one photo:
= x = [2, 1, -1]ᵀ
= W = [[1, 2, 0], [1, -1, 2], [-1, 3, 1]]
= b = [-1, 0, 2]ᵀ
Classes: 0 = Striped, 1 = Checked, 2 = Plain`,
      tasks: [
        task("v2-q3-a", "a", 12,
          `Calculate s = Wx + b. Show every step.`,
          [
            "6 pts — Wx row by row, 2 pts per row with the products shown: Striped 1·2 + 2·1 + 0·(−1) = 4; Checked 1·2 + (−1)·1 + 2·(−1) = −1; Plain (−1)·2 + 3·1 + 1·(−1) = 0 → Wx = [4, −1, 0]. A row with the right method but one sign or arithmetic slip earns 1 of its 2 pts.",
            "3 pts — adds b element by element, 1 pt per class: 4 + (−1) = 3, −1 + 0 = −1, 0 + 2 = 2.",
            "3 pts — the final answer s = [3, −1, 2] (Striped 3, Checked −1, Plain 2). The final vector alone with no working earns these 3 pts and nothing else.",
          ],
          `W is 3 × 3 and x has 3 values, so s has 3 scores — one row of W and one b per class.
= Striped: 1*2 + 2*1 + 0*(-1) = 2 + 2 + 0 = 4
= Checked: 1*2 + (-1)*1 + 2*(-1) = 2 - 1 - 2 = -1
= Plain:   (-1)*2 + 3*1 + 1*(-1) = -2 + 3 - 1 = 0
= Wx = [4, -1, 0]
= s = Wx + b = [4 + (-1), -1 + 0, 0 + 2] = [3, -1, 2]`,
          `W имеет размер 3 × 3, x — 3 числа, поэтому s — 3 оценки: по строке W и по одному b на класс.
= Striped: 1*2 + 2*1 + 0*(-1) = 2 + 2 + 0 = 4
= Checked: 1*2 + (-1)*1 + 2*(-1) = 2 - 1 - 2 = -1
= Plain:   (-1)*2 + 3*1 + 1*(-1) = -2 + 3 - 1 = 0
= Wx = [4, -1, 0]
= s = Wx + b = [4 + (-1), -1 + 0, 0 + 2] = [3, -1, 2]`),
        task("v2-q3-b", "b", 3,
          `What class does the classifier predict?`,
          [
            "2 pts — class 0, Striped.",
            "1 pt — because s_Striped = 3 is the largest score (3 > 2 > −1, argmax). If a) was wrong, this point is still given for taking the argmax of the student's own s.",
          ],
          `Class 0 — **Striped**: 3 is the largest score (3 > 2 for Plain > −1 for Checked).`,
          `Класс 0 — **Striped**: 3 — наибольшая оценка (3 > 2 у Plain > −1 у Checked).`),
        task("v2-q3-c", "c", 5,
          `The true class of this photo is Plain. Compute the multiclass SVM (hinge) loss L = Σ_{j ≠ y} max(0, s_j − s_y + 1) for this photo and explain what its value means.`,
          [
            "1 pt — uses the true-class score s_y = s_Plain = 2 and sums over the two wrong classes only (Plain itself is excluded).",
            "2 pts — the two terms, 1 pt each: Striped max(0, 3 − 2 + 1) = 2; Checked max(0, −1 − 2 + 1) = max(0, −2) = 0.",
            "1 pt — L = 2 + 0 = 2.",
            "1 pt — the meaning: L > 0 because the Striped score is not below the Plain score by at least the margin 1 (the photo is even misclassified); Checked already satisfies the margin and adds 0; L would be 0 only if s_Plain ≥ 4.",
          ],
          `The true class is Plain, so s_y = 2; only the wrong classes Striped and Checked are summed.
= Striped: max(0, 3 - 2 + 1) = max(0, 2) = 2
= Checked: max(0, -1 - 2 + 1) = max(0, -2) = 0
= L = 2 + 0 = 2
The loss is positive because Striped scores higher than the true class Plain (3 > 2), so the margin of 1 is violated by 2 — the photo is misclassified. Checked is already more than 1 below Plain and adds nothing. The loss would be 0 only if s_Plain were at least 4 (one more than every other score).`,
          `Истинный класс — Plain, значит s_y = 2; суммируем только по неверным классам Striped и Checked.
= Striped: max(0, 3 - 2 + 1) = max(0, 2) = 2
= Checked: max(0, -1 - 2 + 1) = max(0, -2) = 0
= L = 2 + 0 = 2
Потеря положительна, потому что у Striped оценка выше, чем у истинного класса Plain (3 > 2): запас 1 нарушен на 2 — фото классифицировано неверно. Checked и так ниже Plain больше чем на 1 и ничего не добавляет. Потеря была бы 0, только если бы s_Plain было не меньше 4 (на единицу больше любой другой оценки).`),
        task("v2-q3-d", "d", 5,
          `In the shop's data the class Checked contains two very different looks: small black-and-white checks and large red tartan. Explain why one linear classifier may handle this class badly, and describe one other dataset that no linear classifier can separate. You may describe a drawing in words.`,
          [
            "2 pts — multi-modal class: a linear classifier has one row of W (one template) per class and straight boundaries, so each class gets one convex region; the Checked template has to average both looks and matches neither well, and if other classes lie between the two clusters no single linear region contains both.",
            "2 pts — another non-linearly separable dataset with the reason: XOR (corners of a square, the classes on the two diagonals) or concentric rings (one class inside a circle, the other around it) — no single straight line / hyperplane separates them. 1 pt for naming it, 1 pt for why.",
            "1 pt — a remedy: non-linear features or a neural network with a hidden layer and non-linear activations (e.g. a CNN), or splitting Checked into two sub-classes that are merged after prediction.",
          ],
          `- A linear classifier gives each class **one template** (one row of W), and the regions are separated by straight hyperplanes. The Checked row must score high for both small black-and-white checks and big red tartan, so it becomes a blurry average of the two that matches neither well; if Plain or Striped photos lie between the two clusters in feature space, no single linear region can contain both clusters.
- **Concentric rings:** in 2-D the Checked points form a small disk around the origin and the Plain points a ring around it. Any straight line cuts the ring, so some ring points always fall on the disk's side.
- Remedy: a model with non-linear features — e.g. a neural network with a hidden layer and ReLU, or a CNN — or two sub-classes ‘small checks’ and ‘tartan’ that are merged into Checked after prediction.`,
          `- Линейный классификатор даёт каждому классу **один шаблон** (одну строку W), а области разделены прямыми гиперплоскостями. Строка Checked должна давать высокую оценку и мелкой чёрно-белой клетке, и крупному красному тартану, поэтому становится размытым средним двух видов и плохо подходит к обоим; если фото Plain или Striped лежат в пространстве признаков между двумя скоплениями, никакая одна линейная область не вместит оба скопления.
- **Концентрические кольца:** на плоскости точки Checked образуют маленький круг вокруг начала координат, а точки Plain — кольцо вокруг него. Любая прямая разрезает кольцо, и часть его точек всегда оказывается на стороне круга.
- Что делать: модель с нелинейными признаками — например, нейросеть со скрытым слоем и ReLU или CNN — или два подкласса «мелкая клетка» и «тартан», которые после предсказания объединяются в Checked.`),
      ],
    },
    {
      id: "v2-q4",
      title: Q4,
      points: 20,
      context: `A student wrote the following pipeline for fabric photos. The original photo swatch.jpg is 1 200 pixels wide and 800 pixels high.
= img = cv2.imread("swatch.jpg")
= img = cv2.resize(img, (256, 128))
= hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.medianBlur(gray, 3)
= edges = cv2.Canny(blur, 50, 150)`,
      tasks: [
        task("v2-q4-a", "a", 5,
          `Write the shape of img after line 1 and after line 2.`,
          [
            "2 pts — after line 1: (800, 1200, 3) — a NumPy shape is (height, width, channels). (1200, 800, 3) earns 0.",
            "3 pts — after line 2: (128, 256, 3) — cv2.resize takes dsize as (width, height), so width 256 and height 128. (256, 128, 3) earns 0; a clearly labelled ‘width 256, height 128, 3 channels’ without the shape tuple earns 2.",
          ],
          `= line 1: img.shape = (800, 1200, 3)    # (height, width, channels), BGR
= line 2: img.shape = (128, 256, 3)     # dsize = (width 256, height 128)
cv2.resize takes (width, height), but NumPy shapes are (height, width, channels), so the numbers appear in the opposite order. The aspect ratio also changes from 1200 / 800 = 1.5 to 256 / 128 = 2, so the fabric is stretched horizontally.`,
          `= line 1: img.shape = (800, 1200, 3)    # (height, width, channels), BGR
= line 2: img.shape = (128, 256, 3)     # dsize = (width 256, height 128)
cv2.resize принимает (width, height), а форма массива NumPy — (height, width, channels), поэтому числа идут в обратном порядке. Соотношение сторон к тому же меняется с 1200 / 800 = 1.5 на 256 / 128 = 2 — ткань растягивается по горизонтали.`),
        task("v2-q4-b", "b", 5,
          `How many channels do hsv and gray have? What does each channel of hsv contain?`,
          [
            "2 pts — hsv has 3 channels, shape (128, 256, 3); gray has 1 channel, shape (128, 256). 1 pt each.",
            "3 pts — the HSV channels, 1 pt each: H = hue, which colour it is (0–179 in 8-bit OpenCV); S = saturation, how pure / intense the colour is (0 = gray); V = value, the brightness.",
          ],
          `= hsv.shape  = (128, 256, 3)   # 3 channels: H, S, V
= gray.shape = (128, 256)      # 1 channel, no channel axis
- **H (hue)** — which colour it is (red, yellow, blue…); in 8-bit OpenCV the range is 0–179 (degrees / 2).
- **S (saturation)** — how pure the colour is: 0 = gray, white or black, 255 = fully saturated.
- **V (value)** — the brightness, 0–255.
HSV separates colour (H, S) from brightness (V), so a brighter or dimmer lamp mostly changes V.`,
          `= hsv.shape  = (128, 256, 3)   # 3 channels: H, S, V
= gray.shape = (128, 256)      # 1 channel, no channel axis
- **H (hue, оттенок)** — какой это цвет (красный, жёлтый, синий…); в 8-битном OpenCV диапазон 0–179 (градусы / 2).
- **S (saturation, насыщенность)** — насколько цвет чистый: 0 — серый, белый или чёрный, 255 — полностью насыщенный.
- **V (value, яркость)** — яркость, 0–255.
HSV отделяет цвет (H, S) от яркости (V), поэтому более яркая или тусклая лампа меняет в основном V.`),
        task("v2-q4-c", "c", 5,
          `Why does the student apply medianBlur(gray, 3) before Canny, and why is a small kernel (3) a good choice for fabric photos?`,
          [
            "2 pts — Canny uses the image gradient (derivatives), which amplifies noise; JPEG speckles and sensor noise would become many false edges, so the image is smoothed first.",
            "1 pt — why median: it replaces each pixel by the median of its neighbourhood, removing isolated speckles (salt-and-pepper / JPEG noise) while keeping sharp edges better than averaging.",
            "2 pts — why small: in a 256 × 128 image stripes and checks are only a few pixels wide; a larger kernel (5, 7, …) would erase or merge thin stripes and the pattern would be lost; 3 is the smallest valid kernel (odd, greater than 1).",
          ],
          `- **Blur before Canny:** Canny works on the gradient (derivatives) of the image, and derivatives amplify small random changes. JPEG speckles and sensor noise would turn into many short false edges inside the fabric.
- **Why median:** each pixel becomes the median of its 3 × 3 neighbourhood, so isolated noisy pixels are removed while the sharp boundary between a dark and a light stripe stays sharp (an average would smear it).
- **Why only 3:** after resizing to 256 × 128 a stripe may be only 2–4 pixels wide; a 7 × 7 median would replace a thin stripe by the colour of its wider neighbours and the pattern would vanish. 3 is the smallest valid median kernel (odd, greater than 1).`,
          `- **Размытие перед Canny:** Canny работает с градиентом (производными) изображения, а производные усиливают мелкие случайные изменения. Точки от JPEG и шум сенсора превратились бы во множество коротких ложных краёв внутри ткани.
- **Почему медиана:** каждый пиксель заменяется медианой своего окна 3 × 3, поэтому одиночные шумные пиксели исчезают, а резкая граница между тёмной и светлой полосой остаётся резкой (среднее бы её размазало).
- **Почему только 3:** после resize до 256 × 128 полоса может быть шириной всего 2–4 пикселя; медиана 7 × 7 заменила бы тонкую полосу цветом более широких соседей, и узор исчез бы. 3 — наименьшее допустимое ядро медианы (нечётное, больше 1).`),
        task("v2-q4-d", "d", 5,
          `The shop now also wants to tell navy-blue plain fabric from black plain fabric. Which of the arrays hsv, gray or edges would you give the classifier? Explain your decision.`,
          [
            "1 pt — chooses hsv (or the colour image), not edges and not gray.",
            "2 pts — why not edges and gray: plain fabric has no pattern, so both edge maps are almost empty; navy and black are both dark, so their gray values are nearly the same (e.g. navy ≈ 15, black ≈ 20 on 0–255).",
            "2 pts — why hsv: hue and saturation separate them — navy has a blue hue (H ≈ 120 in OpenCV) and high saturation, black has saturation near 0 and a very low V. Only ‘HSV keeps the colour’ without saying what separates the two earns 1 pt.",
          ],
          `I would give the classifier **hsv** (a colour input), not edges or gray.
- **edges:** plain fabric has no pattern, so the edge maps of both fabrics are almost empty — there is nothing to compare.
- **gray:** both colours are dark and get almost the same brightness:
= navy  RGB (0, 0, 128):  gray = 0.114*128 = 14.6,  HSV = (120, 255, 128)
= black RGB (20, 20, 20): gray = 20,                HSV = (0, 0, 20)
- **hsv:** navy has a blue hue (H = 120) and full saturation, black has saturation 0 — the S and H channels separate them clearly. Because warm and cold lamps shift the hue, I would also white-balance the photos or augment the colour temperature.`,
          `Я бы подал классификатору **hsv** (цветной вход), а не edges и не gray.
- **edges:** у однотонной ткани нет узора, поэтому карты краёв обеих тканей почти пустые — сравнивать нечего.
- **gray:** оба цвета тёмные и получают почти одинаковую яркость:
= navy  RGB (0, 0, 128):  gray = 0.114*128 = 14.6,  HSV = (120, 255, 128)
= black RGB (20, 20, 20): gray = 20,                HSV = (0, 0, 20)
- **hsv:** у тёмно-синего синий оттенок (H = 120) и полная насыщенность, у чёрного насыщенность 0 — каналы S и H чётко их разделяют. Тёплые и холодные лампы сдвигают оттенок, поэтому я бы ещё делал баланс белого или аугментацию цветовой температуры.`),
      ],
    },
    {
      id: "v2-q5",
      title: Q5,
      points: 15,
      context: `An online clothing shop wants to sort its product photos into T-shirt | Dress | Jacket | Scarf. It has 2,500 labelled photos: 1,800 T-shirts, 400 dresses, 200 jackets and 100 scarves.`,
      tasks: [
        task("v2-q5-a", "a", 3,
          `How would you organize the dataset?`,
          [
            "2 pts — one folder (or a CSV label column) per class — tshirt, dress, jacket, scarf — inside separate train / val / test folders, e.g. data/train/scarf/.",
            "1 pt — data hygiene relevant here: remove duplicates and near-duplicates (the same product photographed several times) before splitting, or split by product so that one product never appears in two parts; note the imbalance (1 800 T-shirts vs 100 scarves).",
          ],
          `One folder per class inside one folder per split, so the folder name is the label:
= data/train/tshirt/  data/train/dress/  data/train/jacket/  data/train/scarf/
= data/val/...   data/test/...
Shops often have several photos of the same product, so I group the photos by product and keep each product in only one part (otherwise near-duplicates leak from train to test). I also note the counts: T-shirts are 72% of the data, scarves only 4%.`,
          `По папке на класс внутри папки каждой части разбиения — имя папки и есть метка:
= data/train/tshirt/  data/train/dress/  data/train/jacket/  data/train/scarf/
= data/val/...   data/test/...
В магазине обычно несколько снимков одного товара, поэтому я группирую снимки по товару и держу каждый товар только в одной части (иначе почти-дубликаты утекут из train в test). И сразу фиксирую дисбаланс: футболок 72% данных, шарфов — только 4%.`),
        task("v2-q5-b", "b", 3,
          `Propose a train/validation/test split and calculate the number of images of each class in each part.`,
          [
            "1 pt — a sensible ratio with all three parts (70/15/15, 80/10/10 or 60/20/20), stratified: every class is split separately so each part keeps the 72 / 16 / 8 / 4% shares.",
            "1 pt — correct totals: 70/15/15 → 1 750 / 375 / 375; 80/10/10 → 2 000 / 250 / 250; 60/20/20 → 1 500 / 500 / 500.",
            "1 pt — correct per-class counts, e.g. for 70/15/15: T-shirt 1 260 / 270 / 270, Dress 280 / 60 / 60, Jacket 140 / 30 / 30, Scarf 70 / 15 / 15 (for 80/10/10: 1 440 / 180 / 180, 320 / 40 / 40, 160 / 20 / 20, 80 / 10 / 10).",
          ],
          `Stratified 70/15/15 — each class is split on its own, so every part keeps the shares 72 / 16 / 8 / 4%:
| Class | Images | Train 70% | Val 15% | Test 15% |
|---|---|---|---|---|
| T-shirt | 1800 | 1260 | 270 | 270 |
| Dress | 400 | 280 | 60 | 60 |
| Jacket | 200 | 140 | 30 | 30 |
| Scarf | 100 | 70 | 15 | 15 |
| Total | 2500 | 1750 | 375 | 375 |
With a plain random split the number of scarves in the small test set would depend on chance.`,
          `Стратифицированно 70/15/15 — каждый класс делится отдельно, и в каждой части сохраняются доли 72 / 16 / 8 / 4%:
| Класс | Снимков | Train 70% | Val 15% | Test 15% |
|---|---|---|---|---|
| T-shirt | 1800 | 1260 | 270 | 270 |
| Dress | 400 | 280 | 60 | 60 |
| Jacket | 200 | 140 | 30 | 30 |
| Scarf | 100 | 70 | 15 | 15 |
| Всего | 2500 | 1750 | 375 | 375 |
При чисто случайном разбиении число шарфов в небольшом тестовом наборе зависело бы от случая.`),
        task("v2-q5-c", "c", 3,
          `Give two preprocessing or data-augmentation choices you would use and a reason for each.`,
          [
            "1.5 pts — a first choice with a reason (0.5 for the choice, 1 for the reason), e.g. resize to a fixed size such as 224 × 224, padding to a square first so long dresses and scarves are not distorted (one input shape, the silhouette is kept); normalization to [0, 1] / standardization (stable training).",
            "1.5 pts — a second, different choice with a reason, e.g. augmentation of the training set only — horizontal flips, small rotations, random crops, brightness / colour jitter — especially for the rare scarves and jackets (more variety, less overfitting); oversampling the rare classes; cropping the garment from the background. Vertical flips earn the 0.5 choice point only (garments are not upside down in real photos).",
          ],
          `- **Resize to 224 × 224 after padding to a square:** the model needs one input shape; padding first keeps the proportions, because a long dress or a long scarf would otherwise be squashed — and the silhouette is what tells the garment types apart.
- **Augment the training set** (horizontal flips, small rotations, random crops, brightness and colour jitter), more strongly for the rare scarves and jackets: it gives the small classes more variety and makes the model less sensitive to lighting and position. Validation and test photos are not augmented.`,
          `- **Resize до 224 × 224 после дополнения до квадрата (padding):** модели нужен вход одной формы; padding сохраняет пропорции, иначе длинное платье или длинный шарф сплющатся — а именно силуэт отличает типы одежды.
- **Аугментация обучающего набора** (горизонтальные отражения, небольшие повороты, случайные кропы, изменение яркости и цвета), сильнее для редких шарфов и курток: у маленьких классов становится больше разнообразия, а модель меньше зависит от освещения и положения. Снимки validation и test не аугментируются.`),
        task("v2-q5-d", "d", 3,
          `What metric would you use to evaluate your classifier? Explain why accuracy alone can be misleading for this dataset.`,
          [
            "1 pt — per-class precision, recall and F1 with macro-F1 (or balanced accuracy) and/or the confusion matrix. Naming only accuracy earns 0 for this point.",
            "2 pts — why accuracy misleads, with numbers: T-shirts are 1 800 / 2 500 = 72%, so always answering ‘T-shirt’ already gives 72% accuracy with 0 recall for the other three classes; scarves are only 4%, so a model that never recognizes a scarf can still reach up to 96%. Macro-F1 averages the classes equally, so the rare classes count. Without any number or concrete case: 1 pt.",
          ],
          `I would report **per-class recall, precision and F1, their average macro-F1**, and the **confusion matrix**.
Accuracy is dominated by the big class:
= always 'T-shirt' on the test set: accuracy = 270 / 375 = 72%,  recall(Dress) = recall(Jacket) = recall(Scarf) = 0
= macro-F1 of that model = (0.84 + 0 + 0 + 0) / 4 = 0.21
= never predicting Scarf costs at most 15 / 375 = 4%, so accuracy can still be up to 96%
Macro-F1 gives each class the same weight, and the confusion matrix shows which garments are mixed up (e.g. dresses predicted as T-shirts).`,
          `Я бы считал **recall, precision и F1 по каждому классу, их среднее macro-F1** и строил **матрицу ошибок**.
Accuracy определяется большим классом:
= always 'T-shirt' on the test set: accuracy = 270 / 375 = 72%,  recall(Dress) = recall(Jacket) = recall(Scarf) = 0
= macro-F1 of that model = (0.84 + 0 + 0 + 0) / 4 = 0.21
= never predicting Scarf costs at most 15 / 375 = 4%, so accuracy can still be up to 96%
Macro-F1 даёт каждому классу одинаковый вес, а матрица ошибок показывает, какие вещи путаются (например, платья, принятые за футболки).`),
        task("v2-q5-e", "e", 3,
          `The model was trained on the shop's studio photos (garments laid flat on a white background) and scores 94% on its test set, but only 61% on photos that customers upload from their phones. Give one possible reason and one fix.`,
          [
            "2 pts — one valid reason: domain shift — customer photos differ from the studio data (cluttered home backgrounds, garments worn or hanging instead of laid flat, folds, other angles, different phones, lighting, colour and blur), so the inputs no longer look like the training data; the model may also rely on studio cues such as the white background.",
            "1 pt — one matching fix: add labelled customer-style phone photos to training and to a separate test set; augment backgrounds, crops, rotations, brightness, colour and blur; crop or segment the garment before classifying. ‘Train longer’ or ‘a bigger model’ earn 0.",
          ],
          `**Reason — domain shift.** The training and test photos all come from the same studio: one white background, even light, garments laid flat. Customer photos have home backgrounds, folds, people wearing the clothes, other angles, other phones and other lighting. The model may have relied on studio cues (the white background, the flat outline) that are missing in the new photos — the drop from 94% to 61% (33 points) comes from the change of data, not from memorizing individual training images.
**Fix:** collect and label a few hundred customer-style phone photos, add them to training and keep some as a separate test set; meanwhile augment the studio photos with random backgrounds, crops, rotations, brightness, colour and blur.`,
          `**Причина — сдвиг домена (domain shift).** Все обучающие и тестовые снимки из одной студии: один белый фон, ровный свет, вещи разложены плоско. У покупателей — домашний фон, складки, одежда на людях, другие ракурсы, другие телефоны и освещение. Модель могла опираться на студийные признаки (белый фон, плоский силуэт), которых на новых снимках нет: падение с 94% до 61% (33 пункта) вызвано сменой данных, а не запоминанием отдельных обучающих снимков.
**Что делать:** собрать и разметить несколько сотен снимков в стиле покупателей, добавить их в обучение и часть оставить отдельным тестом; пока их нет — аугментировать студийные снимки случайными фонами, кропами, поворотами, яркостью, цветом и размытием.`),
      ],
    },
  ],
};

export const mocksA: MockExam[] = [v1, v2];
