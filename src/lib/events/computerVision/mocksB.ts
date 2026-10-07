import type { MockExam } from "../types";

/**
 * Пробные варианты 3 и 4 — новые тренировочные, в структуре настоящего
 * мидтерма (5 вопросов, 20/20/25/20/15 баллов). Вариант 3 — фотоловушки
 * (Q5 — спелость бананов, классы сбалансированы), вариант 4 — блюда в
 * столовой (Q5 — повреждения машин, классы несбалансированы). Все числа
 * (argmax, accuracy, precision/recall, Wx + b, SVM loss, softmax, формы
 * массивов, разбиения) проверены на Python и OpenCV.
 */
export const mocksB: MockExam[] = [
  {
    id: "v3",
    title: { en: "Variant 3 — wildlife camera traps", ru: "Вариант 3 — фотоловушки в заповеднике" },
    minutes: 120,
    source: { en: "New practice variant", ru: "Новый тренировочный вариант" },
    questions: [
      {
        id: "v3-q1",
        title: "Question 1 — Image Processing & OpenCV",
        points: 20,
        context: `A nature reserve uses camera traps that take a photo whenever an animal moves in front of them. A student is building a system that classifies each photo as Deer, Fox or Boar (wild boar). The traps come from three different manufacturers, so the photos have different resolutions. Daytime photos are in colour; night photos are taken with infrared light and look gray and very dark. Many night photos contain isolated bright and dark dots (salt-and-pepper noise), and photos taken at dawn have low contrast.`,
        tasks: [
          {
            id: "v3-q1-a",
            label: "a",
            points: 6,
            prompt: `Propose three preprocessing operations that would be useful for these photos. For each operation, explain why you would use it.`,
            rubric: [
              "3 pts — three different valid operations, 1 pt each. Accept: resize to one fixed size (e.g. 224 × 224, possibly after cropping or padding to one aspect ratio); a median filter (cv2.medianBlur, k = 3 or 5); a Gaussian blur for sensor noise; histogram equalization or CLAHE (on the gray image or on the V channel); converting ALL photos to grayscale; scaling to [0, 1] or standardization (x − mean) / std; cropping off the information banner (date, temperature). Two variants of one idea (Gaussian and median blur) count as one operation.",
              "3 pts — a reason tied to THIS scenario for each operation, 1 pt each: three manufacturers → different resolutions, while the model needs one input size; salt-and-pepper dots in the night photos → a median filter removes isolated dots and keeps edges; dark night and low-contrast dawn photos → equalization/CLAHE spreads the intensities; infrared night photos have no colour → grayscale for all photos makes day and night images alike; values 0–255 → stable training after scaling. A generic reason ('to improve quality', 'to make the image better') gets 0.",
            ],
            answer: {
              en: `- **Resize to one fixed size**, e.g. cv2.resize(img, (224, 224)), after cropping or padding to one aspect ratio: the three trap models give different resolutions, and a classifier needs inputs of one size.
- **Median filter**, cv2.medianBlur(img, 3): the night photos contain salt-and-pepper dots; the median of a neighbourhood ignores isolated outliers, so the dots disappear while the animal's edges stay sharp (a strong Gaussian blur would smear them).
- **Contrast enhancement** — histogram equalization or CLAHE on the gray image (or on the V channel of HSV): night and dawn photos are dark and flat; spreading the intensities over 0–255 makes the body outline and the fur texture visible and gives all photos a similar brightness range.
Also acceptable: converting all photos to grayscale (night infrared photos have no colour anyway, so day and night images become alike), scaling to [0, 1] or standardization, cropping off the banner with date and temperature.`,
              ru: `- **Привести к одному размеру**, например cv2.resize(img, (224, 224)), предварительно обрезав или дополнив до одного соотношения сторон: три модели фотоловушек дают разные разрешения, а классификатору нужен вход одного размера.
- **Медианный фильтр**, cv2.medianBlur(img, 3): на ночных снимках шум «соль и перец»; медиана окрестности не замечает одиночные выбросы, поэтому точки исчезают, а края животного остаются резкими (сильный Gaussian blur их бы размазал).
- **Повышение контраста** — выравнивание гистограммы или CLAHE на сером изображении (или на канале V в HSV): ночные и рассветные снимки тёмные и плоские; растягивание яркостей на 0–255 делает видимыми контур тела и текстуру шерсти и приводит все снимки к похожему диапазону яркости.
Тоже засчитывается: перевод всех снимков в оттенки серого (ночные ИК-снимки всё равно без цвета, и дневные с ночными становятся похожи), масштабирование в [0, 1] или стандартизация, обрезка плашки с датой и температурой.`,
            },
          },
          {
            id: "v3-q1-b",
            label: "b",
            points: 4,
            prompt: `The student crops the central part of every photo (the middle 50% of the width and 50% of the height) and throws the rest away. Give one advantage and one disadvantage of doing this for camera-trap classification.`,
            rubric: [
              "2 pts — one valid advantage tied to the task: the crop removes background at the frame edges (trees, grass, sky) and the info banner with date and temperature that the model could use as a shortcut; an animal in the centre fills a larger part of the input; the image has 4 times fewer pixels (0.5 × 0.5 = 25% of the area) → faster training. A generic 'the image becomes smaller' without a consequence gets 1 pt.",
              "2 pts — one valid disadvantage: a camera trap fires when the animal ENTERS the frame, so animals are often near the edge or only partly visible; a fixed central crop can cut off the animal or the parts that identify it (antlers, tail, snout), so the photo keeps its label but no longer shows the class (label noise); context is lost. 'Some information is lost' without saying what gets 1 pt.",
            ],
            answer: {
              en: `- **Advantage:** the crop removes most of the background (trees, grass, sky) and the banner with date and temperature at the top or bottom of the frame, which the model could otherwise use as a shortcut (for example, 'night photo → boar'). If the animal is in the centre, it fills a larger part of the input, and the image has 4 times fewer pixels (0.5 × 0.5 = 25% of the area), so training is faster.
- **Disadvantage:** a camera trap fires when the animal **enters** the frame, so animals are often at the edge or only partly visible. A fixed central crop can cut off the animal or the parts that identify it (antlers, tail, snout): the photo still carries the label Deer but shows only grass — noisy labels and lower accuracy. A crop around the detected animal would be safer than a fixed central crop.`,
              ru: `- **Плюс:** обрезка убирает бо́льшую часть фона (деревья, траву, небо) и плашку с датой и температурой сверху или снизу кадра, по которой модель могла бы «срезать путь» (например, «ночной снимок → кабан»). Если животное в центре, оно занимает бо́льшую часть входа, а пикселей становится в 4 раза меньше (0.5 × 0.5 = 25% площади) — обучение быстрее.
- **Минус:** фотоловушка срабатывает, когда животное **входит** в кадр, поэтому оно часто у края или видно лишь частично. Фиксированная центральная обрезка может отрезать животное или его отличительные части (рога, хвост, морду): у снимка остаётся метка Deer, а на нём одна трава — шумные метки и ниже точность. Безопаснее обрезать вокруг найденного животного, а не фиксированный центр.`,
            },
          },
          {
            id: "v3-q1-c",
            label: "c",
            points: 5,
            prompt: `Consider the following code for one night photo. Identify two problems and provide the corrected code.
= img = cv2.imread("trap_0412.jpg")
= eq = cv2.equalizeHist(img)
= clean = cv2.medianBlur(eq, (5, 5))`,
            rubric: [
              "2 pts — line 2: cv2.equalizeHist accepts only an 8-bit SINGLE-channel image, but imread returns a 3-channel BGR image of shape (h, w, 3) → error (crash). Fix: read with cv2.IMREAD_GRAYSCALE or convert first with cv2.cvtColor(img, cv2.COLOR_BGR2GRAY); equalizing only the V channel of HSV is also accepted.",
              "2 pts — line 3: the kernel size of cv2.medianBlur is ONE odd integer greater than 1, not a tuple → error (crash). Fix: cv2.medianBlur(eq, 5) or 3. Keeping (5, 5) or using an even number gets 0 for this line.",
              "1 pt — the complete corrected code is written and would run. A fix with COLOR_RGB2GRAY, or an invented third bug that is not an error (the file name, the .jpg format), loses this point; an optional remark that denoising before equalizing is better is fine.",
            ],
            answer: {
              en: `- **Problem 1 (line 2):** imread returns a 3-channel BGR image of shape (h, w, 3), but equalizeHist works only on an 8-bit **single-channel** image → the call raises an error. Read the photo in grayscale (cv2.IMREAD_GRAYSCALE) or convert it with cv2.COLOR_BGR2GRAY first.
- **Problem 2 (line 3):** medianBlur takes the kernel size as **one odd integer > 1**, not a tuple like GaussianBlur → error. Use 5 (or 3).
Corrected code:
= img = cv2.imread("trap_0412.jpg", cv2.IMREAD_GRAYSCALE)
= eq = cv2.equalizeHist(img)
= clean = cv2.medianBlur(eq, 5)
Both bugs crash the program. Optional improvement: remove the dots first (median), then equalize — equalization also stretches the noise.`,
              ru: `- **Ошибка 1 (строка 2):** imread возвращает трёхканальное BGR-изображение формы (h, w, 3), а equalizeHist работает только с 8-битным **одноканальным** изображением → вызов падает с ошибкой. Нужно читать снимок сразу в сером (cv2.IMREAD_GRAYSCALE) или сначала перевести его через cv2.COLOR_BGR2GRAY.
- **Ошибка 2 (строка 3):** medianBlur принимает размер ядра **одним нечётным целым > 1**, а не кортежем, как GaussianBlur → ошибка. Нужно 5 (или 3).
Исправленный код:
= img = cv2.imread("trap_0412.jpg", cv2.IMREAD_GRAYSCALE)
= eq = cv2.equalizeHist(img)
= clean = cv2.medianBlur(eq, 5)
Обе ошибки роняют программу. Необязательное улучшение: сначала убрать точки (медиана), потом выравнивать — выравнивание растягивает и шум.`,
            },
          },
          {
            id: "v3-q1-d",
            label: "d",
            points: 5,
            prompt: `A student says: "Data augmentation can only help — the more random transformations we apply to the training images, the more accurate the model becomes." Do you agree? Explain using one example.`,
            rubric: [
              "1 pt — does not agree ('it depends' with the right condition is accepted).",
              "2 pts — the principle: an augmentation helps only if the transformed image is still realistic for the test photos AND keeps its label; transformations that create impossible images or destroy the feature that defines the class add wrong training examples, so accuracy can drop (and training gets slower).",
              "2 pts — one concrete example of a harmful augmentation, explained: a vertical flip or 180° rotation (animals upside down — a camera trap never sees this); a strong hue shift that turns a red fox gray; a random crop that cuts the animal out of the frame; rotating a digit 6 by 180° turns it into a 9. An example where augmentation only helps (e.g. a horizontal flip) earns these points only if it is contrasted with a harmful one.",
            ],
            answer: {
              en: `I do not agree. Augmentation helps when each new image is something the model could really meet at test time **and** still has the same label; then it teaches invariance and reduces overfitting.
Example: for camera traps a **horizontal flip** is useful (animals walk both left and right), but a **vertical flip** or a 180° rotation produces deer standing on the sky — a camera trap never takes such photos, so the model spends capacity on impossible images. A strong **hue shift** is even worse: it can turn a red fox gray, removing the colour that separates it from a boar, while the label still says Fox. Such transformations add wrong examples and can lower accuracy. So augmentations must be chosen for the task, not added on the principle 'the more, the better'.`,
              ru: `Не согласен. Аугментация помогает, когда новое изображение — это то, что модель действительно может встретить на тесте, **и** метка у него та же; тогда модель учится инвариантности и меньше переобучается.
Пример: для фотоловушек **горизонтальное отражение** полезно (животные идут и влево, и вправо), а **вертикальное отражение** или поворот на 180° дают оленя, стоящего на небе, — таких снимков фотоловушка не делает, и модель тратит ёмкость на невозможные картинки. Сильный **сдвиг оттенка (hue)** ещё хуже: рыжая лиса становится серой, исчезает цвет, который отличает её от кабана, а метка по-прежнему Fox. Такие преобразования добавляют неверные примеры и могут снизить точность. Аугментации подбирают под задачу, а не по принципу «чем больше, тем лучше».`,
            },
          },
        ],
      },
      {
        id: "v3-q2",
        title: "Question 2 — Image Classification",
        points: 20,
        context: `A classifier for the camera-trap photos produces the following scores:
| Image | Deer | Fox | Boar | True class |
|---|---|---|---|---|
| A | 1.9 | 0.4 | −0.6 | Deer |
| B | −0.3 | 0.8 | 1.1 | Fox |
| C | 0.2 | −1.4 | 2.5 | Boar |
| D | −2.0 | −0.5 | −1.2 | Fox |
| E | 1.3 | 0.6 | 1.5 | Deer |`,
        tasks: [
          {
            id: "v3-q2-a",
            label: "a",
            points: 4,
            prompt: `Write the predicted class for A, B, C, D and E.`,
            rubric: [
              "1 pt — A: Deer (1.9 is the largest score).",
              "1 pt — B: Boar (1.1 > 0.8 > −0.3).",
              "1 pt — C: Boar (2.5) and D: Fox (−0.5 is the largest even though all of D's scores are negative); 0.5 pt each.",
              "1 pt — E: Boar (1.5 > 1.3). Writing the true class instead of the class with the highest score gets 0 for that image.",
            ],
            answer: {
              en: `The predicted class is the column with the **highest score** in each row (argmax):
| Image | Highest score | Predicted |
|---|---|---|
| A | 1.9 (Deer) | Deer |
| B | 1.1 (Boar) | Boar |
| C | 2.5 (Boar) | Boar |
| D | −0.5 (Fox) | Fox |
| E | 1.5 (Boar) | Boar |
For D all scores are negative, but only the comparison matters: −0.5 > −1.2 > −2.0, so Fox.`,
              ru: `Предсказанный класс — столбец с **наибольшим score** в строке (argmax):
| Снимок | Наибольший score | Предсказание |
|---|---|---|
| A | 1.9 (Deer) | Deer |
| B | 1.1 (Boar) | Boar |
| C | 2.5 (Boar) | Boar |
| D | −0.5 (Fox) | Fox |
| E | 1.5 (Boar) | Boar |
У D все scores отрицательные, но важно только сравнение: −0.5 > −1.2 > −2.0, значит Fox.`,
            },
          },
          {
            id: "v3-q2-b",
            label: "b",
            points: 4,
            prompt: `Calculate the classification accuracy. Show your calculation.`,
            rubric: [
              "2 pts — compares each prediction with the true class: A correct, B wrong (Boar vs Fox), C correct, D correct, E wrong (Boar vs Deer) → 3 correct out of 5.",
              "2 pts — accuracy = correct / total = 3 / 5 = 0.6 = 60%. The right number with no calculation gets 1 pt; a correct accuracy computed from the student's own (wrong) predictions in a) gets full marks.",
            ],
            answer: {
              en: `Compare each prediction with the true class and count the correct ones:
= A: Deer = Deer    correct
= B: Boar != Fox    wrong
= C: Boar = Boar    correct
= D: Fox = Fox      correct
= E: Boar != Deer   wrong
= accuracy = correct / total = 3 / 5 = 0.6 = 60%`,
              ru: `Сравниваем предсказание с истинным классом и считаем верные:
= A: Deer = Deer    correct
= B: Boar != Fox    wrong
= C: Boar = Boar    correct
= D: Fox = Fox      correct
= E: Boar != Deer   wrong
= accuracy = correct / total = 3 / 5 = 0.6 = 60%`,
            },
          },
          {
            id: "v3-q2-c",
            label: "c",
            points: 4,
            prompt: `Which image(s) were incorrectly classified? For each one, give the true and the predicted class.`,
            rubric: [
              "2 pts — image B: true Fox, predicted Boar (1.1 > 0.8).",
              "2 pts — image E: true Deer, predicted Boar (1.5 > 1.3). Listing a correctly classified image as wrong (e.g. D because its scores are negative) costs 1 pt, minimum 0.",
            ],
            answer: {
              en: `- **B** — true class Fox, predicted Boar: the Boar score 1.1 beats the Fox score 0.8.
- **E** — true class Deer, predicted Boar: 1.5 beats 1.3, a close call.
D is **not** an error: negative scores are fine, Fox still has the highest one.`,
              ru: `- **B** — истинный класс Fox, предсказан Boar: score кабана 1.1 больше score лисы 0.8.
- **E** — истинный класс Deer, предсказан Boar: 1.5 больше 1.3, с небольшим отрывом.
D — **не** ошибка: отрицательные scores допустимы, у Fox всё равно наибольший.`,
            },
          },
          {
            id: "v3-q2-d",
            label: "d",
            points: 4,
            prompt: `Explain the difference between precision and recall. Then compute the precision and the recall of the class Boar for these five images.`,
            rubric: [
              "1 pt — precision: of the images PREDICTED as the class, the fraction that truly belong to it: TP / (TP + FP).",
              "1 pt — recall: of the images that TRULY belong to the class, the fraction the model found: TP / (TP + FN).",
              "1 pt — Boar precision: predicted Boar = B, C, E; only C is truly Boar → 1 / 3 ≈ 0.33 (33%).",
              "1 pt — Boar recall: the only true Boar (C) is found → 1 / 1 = 1.0 (100%). Swapping the two numbers loses both calculation points.",
            ],
            answer: {
              en: `- **Precision** answers: when the model says Boar, how often is it right? precision = TP / (TP + FP).
- **Recall** answers: of all real boars, how many did the model find? recall = TP / (TP + FN).
= predicted Boar: B, C, E  ->  truly Boar: only C  ->  TP = 1, FP = 2
= true Boar: only C, and it is predicted Boar      ->  TP = 1, FN = 0
= precision(Boar) = 1 / (1 + 2) = 1/3 = 0.33
= recall(Boar) = 1 / (1 + 0) = 1.0
The model finds every boar (recall 100%) but raises two false alarms (precision 33%): it says Boar too often.`,
              ru: `- **Precision (точность)** отвечает: когда модель говорит Boar, как часто она права? precision = TP / (TP + FP).
- **Recall (полнота)** отвечает: из всех настоящих кабанов скольких модель нашла? recall = TP / (TP + FN).
= predicted Boar: B, C, E  ->  truly Boar: only C  ->  TP = 1, FP = 2
= true Boar: only C, and it is predicted Boar      ->  TP = 1, FN = 0
= precision(Boar) = 1 / (1 + 2) = 1/3 = 0.33
= recall(Boar) = 1 / (1 + 0) = 1.0
Модель находит всех кабанов (recall 100%), но дважды ошибается тревогой (precision 33%): она слишком часто говорит Boar.`,
            },
          },
          {
            id: "v3-q2-e",
            label: "e",
            points: 4,
            prompt: `After training a linear classifier on raw pixels, the student gets 58% training accuracy and 55% validation accuracy. What is the likely problem? Give one possible solution.`,
            rubric: [
              "2 pts — underfitting (the model is too simple / high bias): both accuracies are low and close to each other, so the model cannot even fit the training data. Answering 'overfitting' gets 0 for this line.",
              "2 pts — one fix that increases model capacity or improves the features: a neural network / CNN instead of a linear classifier on raw pixels (or features from a pretrained CNN), more layers or units, training longer, weaker regularization (smaller λ, less dropout). Fixes for overfitting (more regularization, dropout, early stopping, a simpler model) and 'more data' alone get 0.",
            ],
            answer: {
              en: `**Underfitting.** Training accuracy is only 58% and validation accuracy is almost the same (55%): the gap is small, so the model is not memorizing — it is too simple to fit even the training photos. A linear classifier on raw pixels keeps one template per class and cannot capture animals in different poses, sizes and lighting.
**Fix:** use a more expressive model — a small CNN, or features from a CNN pretrained on ImageNet with a new classifier on top; also train longer and reduce regularization (smaller λ). More regularization or a simpler model would make it worse.`,
              ru: `**Недообучение (underfitting).** Точность на обучении всего 58%, на валидации почти столько же (55%): разрыв маленький, модель не запоминает данные — она слишком проста, чтобы описать даже обучающие снимки. Линейный классификатор на сырых пикселях хранит один шаблон на класс и не справляется с животными в разных позах, размерах и освещении.
**Что делать:** взять более выразительную модель — небольшую CNN или признаки CNN, предобученной на ImageNet, с новым классификатором сверху; учить дольше и ослабить регуляризацию (меньше λ). Больше регуляризации или более простая модель сделают только хуже.`,
            },
          },
        ],
      },
      {
        id: "v3-q3",
        title: "Question 3 — Linear Classifier",
        points: 25,
        context: `Consider a three-class linear classifier for the camera-trap photos: s = Wx + b
= W = [[2, -1, 0], [1, 3, -2], [-1, 0, 2]]
= x = [1, 2, -1]^T
= b = [3, -4, 1]^T
Classes: 0 = Deer, 1 = Fox, 2 = Boar`,
        tasks: [
          {
            id: "v3-q3-a",
            label: "a",
            points: 12,
            prompt: `Calculate s = Wx + b. Show every step.`,
            rubric: [
              "3 pts — s0 (Deer): row 0 of W times x = 2·1 + (−1)·2 + 0·(−1) = 0 (2 pts), plus b0 = 3 → s0 = 3 (1 pt).",
              "3 pts — s1 (Fox): 1·1 + 3·2 + (−2)·(−1) = 1 + 6 + 2 = 9 (2 pts), plus b1 = −4 → s1 = 5 (1 pt).",
              "3 pts — s2 (Boar): (−1)·1 + 0·2 + 2·(−1) = −3 (2 pts), plus b2 = 1 → s2 = −2 (1 pt).",
              "3 pts — the working is shown step by step (each row of W times x, then + b) and the final vector s = [3, 5, −2] is stated. Bare final numbers without working get 0 for this line; after a sign error in one product, the later steps are followed through.",
            ],
            answer: {
              en: `Each score is one row of W times x (a dot product), plus the bias of that class. W is 3 × 3 and x has 3 values, so s has 3 values.
= s0 (Deer) = 2*1 + (-1)*2 + 0*(-1) + 3    = 2 - 2 + 0 + 3 = 3
= s1 (Fox)  = 1*1 + 3*2 + (-2)*(-1) + (-4) = 1 + 6 + 2 - 4 = 5
= s2 (Boar) = (-1)*1 + 0*2 + 2*(-1) + 1    = -1 + 0 - 2 + 1 = -2
= Wx = [0, 9, -3],  s = Wx + b = [0 + 3, 9 - 4, -3 + 1] = [3, 5, -2]`,
              ru: `Каждый score — это строка W, умноженная скалярно на x, плюс bias своего класса. W имеет размер 3 × 3, в x три числа, поэтому в s тоже три числа.
= s0 (Deer) = 2*1 + (-1)*2 + 0*(-1) + 3    = 2 - 2 + 0 + 3 = 3
= s1 (Fox)  = 1*1 + 3*2 + (-2)*(-1) + (-4) = 1 + 6 + 2 - 4 = 5
= s2 (Boar) = (-1)*1 + 0*2 + 2*(-1) + 1    = -1 + 0 - 2 + 1 = -2
= Wx = [0, 9, -3],  s = Wx + b = [0 + 3, 9 - 4, -3 + 1] = [3, 5, -2]`,
            },
          },
          {
            id: "v3-q3-b",
            label: "b",
            points: 3,
            prompt: `What class does the classifier predict?`,
            rubric: [
              "2 pts — class 1, Fox (follow-through: the argmax of the student's own s from a) earns these points).",
              "1 pt — the reason: the prediction is the argmax of s — 5 is the largest of 3, 5 and −2. Choosing by the largest weight, the largest bias or the largest absolute value gets 0 for this line.",
            ],
            answer: {
              en: `**Class 1 — Fox**, because the prediction is the class with the largest score (argmax): s1 = 5 > s0 = 3 > s2 = −2.`,
              ru: `**Класс 1 — Fox**: предсказание — это класс с наибольшим score (argmax), а s1 = 5 > s0 = 3 > s2 = −2.`,
            },
          },
          {
            id: "v3-q3-c",
            label: "c",
            points: 5,
            prompt: `Suppose this photo actually shows a deer (true class 0). Compute the multiclass SVM (hinge) loss with margin 1 for this example and explain what the result means.`,
            rubric: [
              "1 pt — the correct formula: L_i = Σ over j ≠ y_i of max(0, s_j − s_yi + 1) with y_i = Deer; the true class's own term is not included.",
              "2 pts — Fox term max(0, 5 − 3 + 1) = 3 and Boar term max(0, −2 − 3 + 1) = max(0, −4) = 0, 1 pt each.",
              "1 pt — L_i = 3 + 0 = 3 (follow-through from the student's own s).",
              "1 pt — the meaning: the loss is positive because a wrong class (Fox) scores higher than the true class instead of at least 1 below it; Boar is already more than the margin below and costs nothing; the loss would be 0 only if s0 ≥ max(s1, s2) + 1 = 6.",
            ],
            answer: {
              en: `= L_i = sum over j != y_i of max(0, s_j - s_yi + 1),   y_i = 0 (Deer),  s_yi = 3
= Fox:  max(0, 5 - 3 + 1)  = max(0, 3)  = 3
= Boar: max(0, -2 - 3 + 1) = max(0, -4) = 0
= L_i = 3 + 0 = 3
The loss is positive because a wrong class, Fox, scores 2 points **above** the true class instead of at least 1 point below it. Boar is already more than the margin below Deer, so it costs nothing. The loss would be 0 only if s0 ≥ max(5, −2) + 1 = 6.`,
              ru: `= L_i = sum over j != y_i of max(0, s_j - s_yi + 1),   y_i = 0 (Deer),  s_yi = 3
= Fox:  max(0, 5 - 3 + 1)  = max(0, 3)  = 3
= Boar: max(0, -2 - 3 + 1) = max(0, -4) = 0
= L_i = 3 + 0 = 3
Потери положительные: неверный класс Fox набрал на 2 балла **больше** истинного, а должен был отставать хотя бы на 1 (margin). Boar и так ниже Deer больше чем на margin, поэтому ничего не добавляет. Потери были бы 0, только если s0 ≥ max(5, −2) + 1 = 6.`,
            },
          },
          {
            id: "v3-q3-d",
            label: "d",
            points: 5,
            prompt: `The Deer class contains deer facing left and deer facing right, photographed in colour by day and in infrared gray at night. Using the template view of a linear classifier, explain why one linear classifier may struggle with this class. Then give one other example of data that a single linear classifier cannot separate (you may describe a small drawing in words), and name one way to fix the problem.`,
            rubric: [
              "2 pts — template view: each class has ONE row of W, i.e. one template, and the score measures how well the image matches it; deer facing left/right and colour by day vs gray by night are different modes, so the single template becomes a blurred average of them (e.g. a two-headed deer) that matches none of them well.",
              "2 pts — one more non-separable example described correctly, with the reason: XOR (class A in quadrants 1 and 3, class B in 2 and 4), one class inside a ring of the other, or a class made of several separate clusters; a linear classifier separates classes with straight lines (hyperplanes), and no single line separates these.",
              "1 pt — a remedy: non-linear features (e.g. x1·x2 for XOR, the radius for rings), a neural network with a hidden layer and a non-linear activation / a CNN, or splitting the class into sub-classes (deer-left, deer-right, deer-night).",
            ],
            answer: {
              en: `- **Template view:** each row of W is **one template** per class, and the score shows how well the image matches it. A class with several very different looks (deer facing left and right, colour by day and gray at night) still gets only one template, which becomes a blurred average of all of them — like a two-headed deer — and matches none of the real photos well.
- **Another impossible case — XOR:** in 2-D put class A in the 1st and 3rd quadrants and class B in the 2nd and 4th. A linear classifier separates classes with a straight line (a hyperplane in general), and no single line puts both A quadrants on one side and both B quadrants on the other. (A class inside a ring of the other class fails for the same reason.)
- **Fix:** non-linear features (for XOR the product x1·x2 is positive for A and negative for B) or a neural network with a hidden layer and a non-linear activation such as ReLU; splitting Deer into sub-classes (deer-left, deer-right, deer-night) also helps a linear model.`,
              ru: `- **Взгляд через шаблоны:** каждая строка W — **один шаблон** класса, а score показывает, насколько изображение на него похоже. У класса с несколькими очень разными обликами (олень влево и вправо, цветной днём и серый ночью) всё равно только один шаблон — размытое среднее всех обликов, вроде «двухголового оленя», — и он плохо совпадает с любым настоящим снимком.
- **Ещё один невозможный случай — XOR:** на плоскости класс A в 1-й и 3-й четвертях, класс B — во 2-й и 4-й. Линейный классификатор разделяет классы прямой (в общем случае гиперплоскостью), и никакая одна прямая не оставит обе четверти A с одной стороны, а обе четверти B — с другой. (Класс внутри кольца другого класса не разделяется по той же причине.)
- **Как исправить:** нелинейные признаки (для XOR произведение x1·x2 положительно у A и отрицательно у B) или нейросеть со скрытым слоем и нелинейной активацией, например ReLU; разбиение Deer на подклассы (олень влево, вправо, ночью) тоже помогает линейной модели.`,
            },
          },
        ],
      },
      {
        id: "v3-q4",
        title: "Question 4 — Understand the CV Pipeline",
        points: 20,
        context: `A student wrote the following pipeline for the night photos. The camera saves photos of 1280 × 720 pixels (width × height).
= img = cv2.imread("night_017.jpg")
= img = cv2.resize(img, (320, 180))
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= eq = cv2.equalizeHist(gray)
= blur = cv2.GaussianBlur(eq, (5, 5), 0)
= edges = cv2.Canny(blur, 50, 150)`,
        tasks: [
          {
            id: "v3-q4-a",
            label: "a",
            points: 5,
            prompt: `Write the shape of img after line 1 and after line 2.`,
            rubric: [
              "2 pts — after line 1: (720, 1280, 3) — NumPy lists (height, width, channels), and imread returns 3 channels by default even for a gray-looking infrared photo. (1280, 720, 3) gets 0.",
              "3 pts — after line 2: (180, 320, 3) — dsize is (width, height), so the image is 320 wide and 180 high. (320, 180, 3) gets 0; (180, 320) without the channels gets 2.",
            ],
            answer: {
              en: `= img = cv2.imread(...)              ->  (720, 1280, 3)   height 720, width 1280, channels B, G, R
= img = cv2.resize(img, (320, 180))  ->  (180, 320, 3)
cv2.resize takes dsize as **(width, height)**, while the NumPy shape is **(height, width, channels)**, so the numbers appear in the opposite order. The aspect ratio is kept: 1280 / 720 = 320 / 180 ≈ 1.78. The photo looks gray, but imread still returns 3 channels by default.`,
              ru: `= img = cv2.imread(...)              ->  (720, 1280, 3)   height 720, width 1280, channels B, G, R
= img = cv2.resize(img, (320, 180))  ->  (180, 320, 3)
cv2.resize принимает dsize как **(ширина, высота)**, а форма массива NumPy — **(высота, ширина, каналы)**, поэтому числа идут в обратном порядке. Пропорции сохранены: 1280 / 720 = 320 / 180 ≈ 1.78. Снимок выглядит серым, но imread по умолчанию всё равно возвращает 3 канала.`,
            },
          },
          {
            id: "v3-q4-b",
            label: "b",
            points: 5,
            prompt: `How many channels do gray, eq and edges have? What values can the pixels of edges take?`,
            rubric: [
              "2 pts — gray: 1 channel, shape (180, 320) — BGR2GRAY combines B, G and R into one brightness value per pixel (0.299 R + 0.587 G + 0.114 B).",
              "2 pts — eq and edges: still 1 channel each, shape (180, 320) — equalizeHist, GaussianBlur and Canny keep the size and the number of channels (1 pt for eq, 1 pt for edges).",
              "1 pt — edges contains only two values: 0 (no edge) and 255 (edge), dtype uint8.",
            ],
            answer: {
              en: `= gray  -> (180, 320)   1 channel, values 0..255
= eq    -> (180, 320)   1 channel, contrast stretched
= blur  -> (180, 320)   1 channel
= edges -> (180, 320)   1 channel, only 0 or 255
BGR2GRAY turns three channels into one brightness value per pixel (0.299 R + 0.587 G + 0.114 B). The next steps change the values, not the shape. Canny outputs a binary edge map: 255 where an edge is, 0 elsewhere.`,
              ru: `= gray  -> (180, 320)   1 channel, values 0..255
= eq    -> (180, 320)   1 channel, contrast stretched
= blur  -> (180, 320)   1 channel
= edges -> (180, 320)   1 channel, only 0 or 255
BGR2GRAY превращает три канала в одно значение яркости на пиксель (0.299 R + 0.587 G + 0.114 B). Дальнейшие шаги меняют значения, а не форму. Canny выдаёт бинарную карту краёв: 255 там, где край, и 0 в остальных местах.`,
            },
          },
          {
            id: "v3-q4-c",
            label: "c",
            points: 5,
            prompt: `Explain what equalizeHist (line 4) does and why it is useful for these night photos.`,
            rubric: [
              "2 pts — what it does: spreads the intensity histogram over the full 0–255 range by mapping each value through the cumulative histogram → higher global contrast.",
              "2 pts — why here: infrared night photos are dark and low-contrast (values crowded in a narrow dark range); after equalization the animal's outline has larger brightness differences, so Canny with its fixed thresholds (50 and 150) detects it, and photos from different nights get a similar brightness distribution.",
              "1 pt — a correct remark on its requirement or cost: it needs a single-channel 8-bit image (that is why it comes after BGR2GRAY), or it also amplifies noise (that is why the blur follows).",
            ],
            answer: {
              en: `- **What it does:** it builds the histogram of the gray values and remaps every value through the **cumulative histogram**, so values that were crowded in a narrow range are spread over the full 0–255 range → higher global contrast.
- **Why here:** infrared night photos are dark and flat — for example, all values lie between 10 and 70. After equalization they span 0–255, so the animal's outline becomes a large brightness step. Canny uses fixed thresholds (50 and 150); without equalization many real edges of a dark photo would stay below them. It also makes photos from different nights look alike.
- **Requirement and cost:** it needs a single-channel 8-bit image — that is why it comes after BGR2GRAY — and it also amplifies noise, which is why the blur follows.`,
              ru: `- **Что делает:** строит гистограмму серых значений и переотображает каждое значение через **кумулятивную гистограмму**; значения, сбившиеся в узкий диапазон, растягиваются на весь 0–255 → глобальный контраст выше.
- **Зачем здесь:** ночные ИК-снимки тёмные и плоские — например, все значения между 10 и 70. После выравнивания они занимают 0–255, и контур животного становится большим перепадом яркости. У Canny фиксированные пороги (50 и 150); без выравнивания многие настоящие края тёмного снимка остались бы ниже них. Заодно снимки разных ночей становятся похожими по яркости.
- **Условие и цена:** нужен одноканальный 8-битный вход — поэтому шаг идёт после BGR2GRAY; кроме того, выравнивание усиливает шум — поэтому следом идёт размытие.`,
            },
          },
          {
            id: "v3-q4-d",
            label: "d",
            points: 5,
            prompt: `A teammate wants to change the blur kernel from (5, 5) to (21, 21) "to remove all the noise". In the 320 × 180 images a fox is often only about 40 pixels tall, and its legs and ears are 2–4 pixels wide. Would you make this change? Explain your decision.`,
            rubric: [
              "1 pt — decision: no, keep a small kernel such as (3, 3) or (5, 5). Answering 'yes' gets 0 for this line.",
              "3 pts — reasoning: a larger Gaussian kernel averages over a larger neighbourhood (21 px is about half the height of a 40-px fox); details 2–4 px wide (legs, ears, tail) are smeared into the background, the brightness step across the outline becomes weak, and Canny loses exactly the edges that separate a fox from a boar; the trade-off 'less noise, but less detail' is stated.",
              "1 pt — a better alternative: a median blur (k = 3 or 5) for the salt-and-pepper dots, tuning the Canny thresholds, or choosing the kernel size on validation data.",
            ],
            answer: {
              en: `**No.** A Gaussian blur replaces each pixel with a weighted average of its neighbourhood; a 21 × 21 kernel averages over a window about half as tall as the whole fox (21 / 40 ≈ 0.5). Legs and ears only 2–4 pixels wide are mixed with the background, the brightness step across the outline becomes small, and Canny with thresholds 50/150 no longer finds the outline — the shape cues that tell a fox from a boar disappear, while only large blobs survive. Blurring is a trade-off: less noise, but less detail.
Better: keep (3, 3) or (5, 5); for the salt-and-pepper dots use cv2.medianBlur(eq, 3), which removes isolated dots and keeps edges; tune the Canny thresholds or the kernel size on the validation set.`,
              ru: `**Нет.** Gaussian blur заменяет каждый пиксель взвешенным средним окрестности; ядро 21 × 21 усредняет по окну высотой примерно в половину всей лисы (21 / 40 ≈ 0.5). Лапы и уши шириной 2–4 пикселя смешиваются с фоном, перепад яркости на контуре становится маленьким, и Canny с порогами 50/150 перестаёт находить контур — пропадают как раз признаки формы, отличающие лису от кабана, остаются только крупные пятна. Размытие — это компромисс: меньше шума, но и меньше деталей.
Лучше: оставить (3, 3) или (5, 5); против точек «соль и перец» взять cv2.medianBlur(eq, 3) — она убирает одиночные точки и сохраняет края; пороги Canny или размер ядра подбирать на валидации.`,
            },
          },
        ],
      },
      {
        id: "v3-q5",
        title: "Question 5 — Design Your Own CV System",
        points: 15,
        context: `A fruit wholesaler wants a system that sorts bananas into Unripe | Ripe | Overripe | Rotten. You have collected 2 400 photos — 600 per class — at one market stall, in daylight, over two weeks; most bunches were photographed several times.`,
        tasks: [
          {
            id: "v3-q5-a",
            label: "a",
            points: 3,
            prompt: `How would you organize the dataset?`,
            rubric: [
              "1 pt — one folder per class inside each split (or a CSV file → label), with train / validation / test kept separate, e.g. data/train/ripe/….",
              "1 pt — consistent labels: a written rule for the borderline classes (Ripe vs Overripe vs Rotten) and a check or relabelling of unclear photos.",
              "1 pt — photos of the same bunch (or session) are kept in the same split and duplicates are removed before splitting, so near-identical photos do not leak from train into test.",
            ],
            answer: {
              en: `- One folder per class inside each split — the folder name is the label:
= data/train/unripe/  data/train/ripe/  data/train/overripe/  data/train/rotten/
= data/val/...   data/test/...
- Write a labelling rule for the borderline classes (e.g. Overripe = brown spots on part of the peel, Rotten = mostly black or mouldy) and let a second person check unclear photos.
- Keep a table with a bunch ID and the date of every photo: all photos of one bunch go into the same split, and duplicates are removed before splitting, so near-identical photos cannot leak from train into test.`,
              ru: `- По папке на класс внутри каждой части разбиения — имя папки и есть метка:
= data/train/unripe/  data/train/ripe/  data/train/overripe/  data/train/rotten/
= data/val/...   data/test/...
- Записать правило разметки для пограничных классов (например, Overripe — коричневые пятна на части кожуры, Rotten — почти чёрная или с плесенью) и дать второму человеку проверить спорные снимки.
- Вести таблицу с ID грозди и датой каждого снимка: все снимки одной грозди попадают в одну часть, дубликаты удаляются до разбиения — тогда почти одинаковые снимки не «протекут» из train в test.`,
            },
          },
          {
            id: "v3-q5-b",
            label: "b",
            points: 3,
            prompt: `Propose a train/validation/test split and calculate the number of images in each part.`,
            rubric: [
              "1 pt — a sensible split with the role of each part: train fits the weights, validation tunes hyperparameters, test is used once at the end (an 80/20 train/test split is also accepted).",
              "1 pt — correct totals for the chosen split: 70/15/15 → 1 680 / 360 / 360; 80/10/10 → 1 920 / 240 / 240; 80/20 → 1 920 / 480.",
              "1 pt — stratified per class with the per-class counts: 70/15/15 → 420 / 90 / 90 of each class (80/10/10 → 480 / 60 / 60; 80/20 → 480 / 120).",
            ],
            answer: {
              en: `Stratified 70/15/15 — every class is split the same way:
= per class: 600 * 0.70 = 420 train,  600 * 0.15 = 90 val,  600 * 0.15 = 90 test
= total:     420 * 4 = 1680 train,  90 * 4 = 360 val,  90 * 4 = 360 test   (1680 + 360 + 360 = 2400)
Train fits the weights, validation chooses hyperparameters (learning rate, image size, augmentation), and the test set is used once at the end. Photos of the same bunch stay in the same part.`,
              ru: `Стратифицированное 70/15/15 — каждый класс делится одинаково:
= per class: 600 * 0.70 = 420 train,  600 * 0.15 = 90 val,  600 * 0.15 = 90 test
= total:     420 * 4 = 1680 train,  90 * 4 = 360 val,  90 * 4 = 360 test   (1680 + 360 + 360 = 2400)
Train подбирает веса, validation — гиперпараметры (learning rate, размер изображения, аугментации), test используется один раз в самом конце. Снимки одной грозди остаются в одной части.`,
            },
          },
          {
            id: "v3-q5-c",
            label: "c",
            points: 3,
            prompt: `Give two preprocessing or augmentation operations you would use, and explain why.`,
            rubric: [
              "1.5 pts — first choice: a valid operation (0.5) with a reason tied to bananas or the market (1). Valid: resize to a fixed size (e.g. 224 × 224); scaling to [0, 1] or standardization; white balance / colour normalization; mild brightness and contrast augmentation; horizontal flips, small rotations, random crops (training set only).",
              "1.5 pts — second choice, same rule; it must differ from the first. Grayscale conversion and strong hue / colour-shift augmentation get 0: the colour (green → yellow → brown spots → black) is exactly what defines the class.",
            ],
            answer: {
              en: `- **Resize to 224 × 224 and scale to [0, 1]** (or standardize with the dataset mean and std): the classifier needs one input size and values in a stable range.
- **Augmentation of the training set only:** horizontal flips, small rotations and random crops (a bunch can lie in any direction), plus mild brightness and contrast changes (sun and shade at the stall).
Keep the photos in **colour** and avoid strong hue shifts: green → yellow → brown spots → black **is** the ripeness, so grayscale or a hue shift would destroy the label.`,
              ru: `- **Resize до 224 × 224 и масштабирование в [0, 1]** (или стандартизация по среднему и std датасета): классификатору нужен один размер входа и значения в устойчивом диапазоне.
- **Аугментация только обучающей части:** горизонтальные отражения, небольшие повороты и случайные кропы (гроздь может лежать как угодно), плюс мягкие изменения яркости и контраста (солнце и тень на прилавке).
Снимки оставить **цветными** и не делать сильных сдвигов оттенка: зелёный → жёлтый → коричневые пятна → чёрный — это **и есть** спелость, поэтому серый цвет или сдвиг hue уничтожили бы метку.`,
            },
          },
          {
            id: "v3-q5-d",
            label: "d",
            points: 3,
            prompt: `What metric would you use to evaluate your classifier? Explain why.`,
            rubric: [
              "1 pt — accuracy (or macro-F1) as the main number.",
              "1 pt — why it is fair here: the classes are balanced (600 each, 25% each), so accuracy is not inflated by a majority class — always predicting one class gives only 25%.",
              "1 pt — also the confusion matrix or per-class recall, to see which neighbouring stages are confused (Ripe ↔ Overripe, Overripe ↔ Rotten).",
            ],
            answer: {
              en: `**Accuracy** as the main number, together with the **confusion matrix** (or per-class recall / macro-F1).
- The classes are **balanced** (600 each, 25% each), so accuracy is not inflated by a majority class: a model that always says Ripe gets only 25%.
- The confusion matrix shows **which neighbouring stages** are mixed up — Ripe ↔ Overripe or Overripe ↔ Rotten — which tells you where to collect more examples or clarify the labelling rule.`,
              ru: `**Accuracy** как основное число вместе с **матрицей ошибок** (или recall по классам / macro-F1).
- Классы **сбалансированы** (по 600, по 25%), поэтому accuracy не завышается большим классом: модель, которая всегда говорит Ripe, получит лишь 25%.
- Матрица ошибок показывает, **какие соседние стадии** путаются — Ripe ↔ Overripe или Overripe ↔ Rotten, — и подсказывает, где добрать примеры или уточнить правило разметки.`,
            },
          },
          {
            id: "v3-q5-e",
            label: "e",
            points: 3,
            prompt: `The model reaches 92% on your test set. A supermarket installs it under cold white LED lamps, and it labels many ripe bananas as Unripe. Give one possible reason and a fix.`,
            rubric: [
              "1.5 pts — reason: domain shift — all training photos were taken in daylight at one stall, while cold LED light (and another camera's white balance) changes the recorded colours (yellow looks paler or greener), and colour is the cue the model uses for ripeness; the test set had the same light as training, so it did not reveal the problem.",
              "1.5 pts — a fix that matches the reason: photos under several light sources and from several shops in training; white balance / colour normalization (gray-world or a reference gray card) before the classifier; mild colour-temperature and brightness augmentation; then evaluation on photos from the new shop. 'Train longer' or 'a bigger model' alone gets 0.",
            ],
            answer: {
              en: `**Reason — domain shift in colour:** all training photos were taken in daylight at one stall. Cold LED light (and a different camera's white balance) changes the colours the camera records: the yellow peel looks paler and greener, and colour is exactly the cue the model uses for ripeness. The test set had the same light as training, so 92% did not reveal this.
**Fix:** add photos taken under several light sources and in several shops; apply white balance / colour normalization (gray-world, or a gray reference card in the frame) before the classifier; use mild colour-temperature and brightness augmentation; then evaluate on a held-out set from the new shop.`,
              ru: `**Причина — сдвиг домена по цвету:** все обучающие снимки сделаны при дневном свете на одном прилавке. Холодный LED-свет (и баланс белого другой камеры) меняет цвета на снимке: жёлтая кожура выглядит бледнее и зеленее, а цвет — именно тот признак, по которому модель судит о спелости. Тестовая часть была снята при том же свете, что и обучение, поэтому 92% этого не показали.
**Что делать:** добавить снимки при разных источниках света и из разных магазинов; перед классификатором делать баланс белого / нормализацию цвета (gray-world или серая карточка в кадре); мягкая аугментация цветовой температуры и яркости; затем проверить на отложенных снимках из нового магазина.`,
            },
          },
        ],
      },
    ],
  },
  {
    id: "v4",
    title: { en: "Variant 4 — canteen dishes", ru: "Вариант 4 — блюда в столовой" },
    minutes: 120,
    source: { en: "New practice variant", ru: "Новый тренировочный вариант" },
    questions: [
      {
        id: "v4-q1",
        title: "Question 1 — Image Processing & OpenCV",
        points: 20,
        context: `A university canteen wants a ceiling camera to recognize the dish on each tray (Soup, Salad, Plov and others) for automatic billing. The photos come from two canteens: one has warm yellow lamps, the other cold white LEDs. One camera saves 1920 × 1080 images, the other 1280 × 960. Steam from hot dishes makes some photos hazy, and the tray is not always in the same place under the camera.`,
        tasks: [
          {
            id: "v4-q1-a",
            label: "a",
            points: 6,
            prompt: `Propose three preprocessing operations that would be useful for these photos. For each operation, explain why you would use it.`,
            rubric: [
              "3 pts — three different valid operations, 1 pt each. Accept: white balance / colour normalization (gray-world, a reference patch); cropping the tray or plate region; resize to one fixed size after cropping or padding to one aspect ratio; contrast enhancement (CLAHE on the V or L channel); scaling to [0, 1] or standardization; a mild Gaussian blur against sensor noise. Two variants of one idea count as one operation. Grayscale conversion is a weak choice here (colour separates the dishes): it earns at most 1 of its 2 points, and only if the answer admits that colour is lost.",
              "3 pts — a reason tied to THIS scenario for each operation, 1 pt each: warm vs cold lamps change the colours of the same dish → white balance; the tray moves and the background varies → crop; 1920 × 1080 (16:9) and 1280 × 960 (4:3) → one size and one aspect ratio, otherwise dishes are stretched differently; steam lowers contrast → CLAHE; values 0–255 → stable training. A generic reason ('to improve quality') gets 0.",
            ],
            answer: {
              en: `- **White balance / colour normalization** (e.g. gray-world: scale B, G and R so that their means are equal, or use a gray reference patch on the tray): the same plov looks orange under warm lamps and paler under cold LEDs; normalizing removes the lamp colour, so the model learns the dish, not the canteen.
- **Crop the tray (or plate) region, then resize to one size**, e.g. 224 × 224: the tray is in different places, and the two cameras have different sizes and aspect ratios (16:9 vs 4:3); without a common crop the dishes would be stretched differently.
- **Contrast enhancement with CLAHE** on the V (or L) channel: steam makes photos hazy and flat; CLAHE restores local contrast without changing the hue.
Also acceptable: scaling to [0, 1] or standardization, a mild Gaussian blur against sensor noise.`,
              ru: `- **Баланс белого / нормализация цвета** (например, gray-world: масштабировать B, G и R так, чтобы их средние совпали, или серая контрольная наклейка на подносе): один и тот же плов под тёплыми лампами оранжевый, а под холодными LED — бледнее; нормализация убирает цвет ламп, и модель учит блюдо, а не столовую.
- **Обрезать область подноса (или тарелки), затем resize до одного размера**, например 224 × 224: поднос стоит в разных местах, а у двух камер разные размеры и пропорции (16:9 и 4:3); без общей обрезки блюда растянулись бы по-разному.
- **Повышение контраста через CLAHE** на канале V (или L): пар делает снимки мутными и плоскими; CLAHE возвращает локальный контраст, не меняя оттенок.
Тоже засчитывается: масштабирование в [0, 1] или стандартизация, мягкий Gaussian blur против шума сенсора.`,
            },
          },
          {
            id: "v4-q1-b",
            label: "b",
            points: 4,
            prompt: `The student converts every image to HSV and feeds ONLY the H (hue) channel to the classifier. Give one advantage and one disadvantage of doing this for dish recognition.`,
            rubric: [
              "2 pts — one valid advantage: hue describes which colour a pixel has, separately from brightness, so shadows, darker or brighter photos and part of the steam haze change H little, while the colour that separates many dishes (green salad, orange plov, red borscht) remains; a 3 times smaller one-channel input. A generic advantage without a link to the task gets 1 pt.",
              "2 pts — one valid disadvantage with a concrete case: S and V are thrown away, and with them texture and shape (rice grains, leaves); hue is undefined or noisy for low-saturation pixels (white rice, white plates, steam, gray soups), so those dishes become noise; warm vs cold lamps shift the hue itself, so H alone does not remove the lamp difference; hue is circular (0 and 179 are both red in OpenCV). 'Information is lost' without saying which gets 1 pt.",
            ],
            answer: {
              en: `- **Advantage:** hue describes **which colour** a pixel has, separately from brightness (V) and vividness (S). Shadows, darker or brighter photos and part of the steam haze change V and S much more than H, while the colour that separates many dishes — green salad, orange plov, red borscht — stays. The input is also 3 times smaller (one channel).
- **Disadvantage:** S and V are thrown away, and with them most of the **texture and shape** (rice grains, leaves, noodles). Hue is also unreliable where saturation is low: a white plate pixel (B, G, R) = (200, 200, 200) has H = 0, while the almost identical (205, 200, 200) has H = 120 — so white rice, white plates, steam and gray soups get almost random hue and become noise. The warm vs cold lamps shift the hue itself, so H alone does not remove the lamp difference. (In OpenCV, H is 0–179 and circular: 2 and 178 are both red.)`,
              ru: `- **Плюс:** hue описывает, **какой цвет** у пикселя, отдельно от яркости (V) и насыщенности (S). Тени, более тёмные или светлые снимки и отчасти пар меняют V и S гораздо сильнее, чем H, а цвет, который отличает многие блюда, — зелёный салат, оранжевый плов, красный борщ — остаётся. Вход к тому же в 3 раза меньше (один канал).
- **Минус:** S и V выбрасываются, а с ними бо́льшая часть **текстуры и формы** (зёрна риса, листья, лапша). К тому же hue ненадёжен при низкой насыщенности: пиксель белой тарелки (B, G, R) = (200, 200, 200) имеет H = 0, а почти такой же (205, 200, 200) — H = 120; белый рис, белые тарелки, пар и серые супы получают почти случайный hue и превращаются в шум. Тёплые и холодные лампы сдвигают сам оттенок, так что один H не убирает разницу ламп. (В OpenCV H от 0 до 179 и замкнут по кругу: 2 и 178 — оба красные.)`,
            },
          },
          {
            id: "v4-q1-c",
            label: "c",
            points: 5,
            prompt: `The student wants every photo to be 640 pixels wide and 480 pixels high, and then a binary mask made with Otsu's method. Identify two problems in the code and provide the corrected code.
= img = cv2.imread("tray_01.jpg")
= small = cv2.resize(img, (480, 640))
= ret, mask = cv2.threshold(small, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)`,
            rubric: [
              "2 pts — line 2: dsize is (width, height); (480, 640) gives an image 480 wide and 640 high, shape (640, 480, 3) instead of (480, 640, 3). It runs without an error (silent bug) but stretches the tray. Fix: cv2.resize(img, (640, 480)).",
              "2 pts — line 3: Otsu thresholding (THRESH_OTSU) works only on a single-channel 8-bit image, but small has 3 channels → error. Fix: convert first, gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY) (or read with IMREAD_GRAYSCALE, or threshold one HSV channel), and threshold gray.",
              "1 pt — complete corrected code, and the answer says which bug is silent (line 2) and which crashes (line 3). Using COLOR_RGB2GRAY, or calling the threshold value 0 a bug (with THRESH_OTSU it is ignored), loses this point.",
            ],
            answer: {
              en: `- **Problem 1 (line 2, silent):** cv2.resize takes dsize as **(width, height)**. (480, 640) makes the image 480 wide and 640 high — shape (640, 480, 3) — so the tray is squeezed horizontally. No error is raised. Use (640, 480) → shape (480, 640, 3).
- **Problem 2 (line 3, crash):** Otsu's method needs an 8-bit **single-channel** image, but small has 3 channels (BGR) → error. Convert to gray first.
Corrected code:
= img = cv2.imread("tray_01.jpg")
= small = cv2.resize(img, (640, 480))
= gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
= ret, mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
The threshold 0 is fine: with THRESH_OTSU it is ignored, and ret returns the threshold that Otsu found.`,
              ru: `- **Ошибка 1 (строка 2, молчаливая):** cv2.resize принимает dsize как **(ширина, высота)**. (480, 640) даёт картинку шириной 480 и высотой 640 — форма (640, 480, 3), — поднос сжат по горизонтали. Ошибки не возникает. Нужно (640, 480) → форма (480, 640, 3).
- **Ошибка 2 (строка 3, падение):** метод Otsu требует 8-битное **одноканальное** изображение, а у small 3 канала (BGR) → ошибка. Сначала перевести в серый.
Исправленный код:
= img = cv2.imread("tray_01.jpg")
= small = cv2.resize(img, (640, 480))
= gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
= ret, mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
Порог 0 — не ошибка: с THRESH_OTSU он игнорируется, а в ret возвращается порог, найденный методом Otsu.`,
            },
          },
          {
            id: "v4-q1-d",
            label: "d",
            points: 5,
            prompt: `A student says: "A bigger input image always gives a better classifier, so we should feed the full-resolution photos to the model without resizing." Do you agree? Explain using one example.`,
            rubric: [
              "1 pt — does not agree (it depends on the task).",
              "2 pts — reasons: more pixels = more input values → more parameters, memory and time, and with a limited dataset more overfitting (curse of dimensionality); the extra detail here (steam, crumbs, JPEG noise) does not define the dish; a model needs one fixed input size, and the two cameras differ (1920 × 1080 vs 1280 × 960). Any two of these reasons, 1 pt each.",
              "2 pts — one concrete example: e.g. 1920 × 1080 × 3 = 6 220 800 input values vs 224 × 224 × 3 = 150 528 (about 41 times more) while soup vs salad is obvious at 224 × 224; or the opposite case where resolution matters (hairline cracks in concrete), showing that the answer depends on the task.",
            ],
            answer: {
              en: `I do not agree — it depends on the task.
- More pixels mean many more input values: 1920 × 1080 × 3 = 6 220 800 numbers per photo versus 224 × 224 × 3 = 150 528 — about 41 times more. That means more memory and time and, for a linear classifier, 41 times more weights per class; with a few thousand tray photos such a model overfits easily.
- The extra detail here is mostly steam, crumbs and JPEG noise; soup, salad and plov are easy to tell apart at 224 × 224 by colour and coarse shape.
- A model also needs one fixed input size, and the two cameras give 1920 × 1080 and 1280 × 960 — their photos could not even be put in one batch.
Higher resolution helps only when the class depends on tiny details (e.g. hairline cracks in concrete); then a larger size or crops are justified. So 'always' is wrong.`,
              ru: `Не согласен — всё зависит от задачи.
- Больше пикселей — гораздо больше входных чисел: 1920 × 1080 × 3 = 6 220 800 чисел на снимок против 224 × 224 × 3 = 150 528 — примерно в 41 раз больше. Это больше памяти и времени, а у линейного классификатора — в 41 раз больше весов на класс; с несколькими тысячами снимков подносов такая модель легко переобучается.
- Лишние детали здесь — в основном пар, крошки и JPEG-шум; суп, салат и плов легко различить и на 224 × 224 по цвету и общей форме.
- Модели к тому же нужен один фиксированный размер входа, а камеры дают 1920 × 1080 и 1280 × 960 — их снимки даже нельзя сложить в один батч.
Высокое разрешение помогает, только когда класс зависит от мелких деталей (например, волосяные трещины в бетоне); тогда больший размер или кропы оправданы. Поэтому «всегда» — неверно.`,
            },
          },
        ],
      },
      {
        id: "v4-q2",
        title: "Question 2 — Image Classification",
        points: 20,
        context: `A classifier for the canteen trays produces the following scores:
| Image | Soup | Salad | Plov | True class |
|---|---|---|---|---|
| A | 2.6 | 0.3 | 1.1 | Soup |
| B | 0.8 | 1.9 | 2.0 | Salad |
| C | −0.2 | −1.5 | −0.4 | Soup |
| D | 0.0 | 3.1 | −0.7 | Salad |
| E | 1.2 | −0.5 | 1.8 | Plov |`,
        tasks: [
          {
            id: "v4-q2-a",
            label: "a",
            points: 4,
            prompt: `Write the predicted class for A, B, C, D and E.`,
            rubric: [
              "1 pt — A: Soup (2.6) and D: Salad (3.1); 0.5 pt each.",
              "1 pt — B: Plov (2.0 > 1.9 — a close call, but the largest score wins).",
              "1 pt — C: Soup (−0.2 is the largest; all scores being negative does not matter).",
              "1 pt — E: Plov (1.8 > 1.2). Writing the true class instead of the class with the highest score gets 0 for that image.",
            ],
            answer: {
              en: `The predicted class is the column with the **highest score** in each row (argmax):
| Image | Highest score | Predicted |
|---|---|---|
| A | 2.6 (Soup) | Soup |
| B | 2.0 (Plov) | Plov |
| C | −0.2 (Soup) | Soup |
| D | 3.1 (Salad) | Salad |
| E | 1.8 (Plov) | Plov |
B is a close call (2.0 vs 1.9), but only the largest score counts. For C all scores are negative: −0.2 > −0.4 > −1.5, so Soup.`,
              ru: `Предсказанный класс — столбец с **наибольшим score** в строке (argmax):
| Снимок | Наибольший score | Предсказание |
|---|---|---|
| A | 2.6 (Soup) | Soup |
| B | 2.0 (Plov) | Plov |
| C | −0.2 (Soup) | Soup |
| D | 3.1 (Salad) | Salad |
| E | 1.8 (Plov) | Plov |
У B отрыв минимальный (2.0 против 1.9), но считается только наибольший score. У C все scores отрицательные: −0.2 > −0.4 > −1.5, значит Soup.`,
            },
          },
          {
            id: "v4-q2-b",
            label: "b",
            points: 4,
            prompt: `Calculate the classification accuracy. Show your calculation.`,
            rubric: [
              "2 pts — compares each prediction with the true class: A, C, D and E correct; B wrong (Plov vs Salad) → 4 correct out of 5.",
              "2 pts — accuracy = correct / total = 4 / 5 = 0.8 = 80%. The right number with no calculation gets 1 pt; a correct accuracy computed from the student's own (wrong) predictions in a) gets full marks.",
            ],
            answer: {
              en: `Compare each prediction with the true class and count the correct ones:
= A: Soup = Soup     correct
= B: Plov != Salad   wrong
= C: Soup = Soup     correct
= D: Salad = Salad   correct
= E: Plov = Plov     correct
= accuracy = correct / total = 4 / 5 = 0.8 = 80%`,
              ru: `Сравниваем предсказание с истинным классом и считаем верные:
= A: Soup = Soup     correct
= B: Plov != Salad   wrong
= C: Soup = Soup     correct
= D: Salad = Salad   correct
= E: Plov = Plov     correct
= accuracy = correct / total = 4 / 5 = 0.8 = 80%`,
            },
          },
          {
            id: "v4-q2-c",
            label: "c",
            points: 4,
            prompt: `Which image(s) were incorrectly classified? Explain why.`,
            rubric: [
              "2 pts — only image B: true Salad, predicted Plov.",
              "2 pts — the explanation: Plov's score 2.0 is higher than Salad's 1.9 (by only 0.1), and the prediction is the argmax. Listing a correctly classified image as wrong (e.g. C because its scores are negative) costs 1 pt, minimum 0.",
            ],
            answer: {
              en: `Only **image B**: its true class is Salad, but Plov has the highest score (2.0 > 1.9), so the classifier predicts Plov. The margin is only 0.1 — a borderline case.
C is **not** an error: all its scores are negative, but Soup (−0.2) is still the largest.`,
              ru: `Только **снимок B**: истинный класс Salad, но наибольший score у Plov (2.0 > 1.9), поэтому классификатор выдаёт Plov. Отрыв всего 0.1 — пограничный случай.
C — **не** ошибка: все его scores отрицательные, но у Soup (−0.2) всё равно наибольший.`,
            },
          },
          {
            id: "v4-q2-d",
            label: "d",
            points: 4,
            prompt: `The scores are not probabilities. Convert the scores of image B into class probabilities with softmax (use e^0.8 ≈ 2.23, e^1.9 ≈ 6.69, e^2.0 ≈ 7.39). Does the predicted class change? Explain the difference between a score and a probability.`,
            rubric: [
              "1 pt — softmax: p_k = e^(s_k) / Σ_j e^(s_j); the sum 2.23 + 6.69 + 7.39 = 16.31.",
              "1 pt — probabilities ≈ Soup 0.14, Salad 0.41, Plov 0.45 (they sum to 1; ±0.01 rounding accepted).",
              "1 pt — the predicted class does not change (still Plov): softmax keeps the order of the scores because exp is increasing.",
              "1 pt — the difference: scores (logits) are unbounded real numbers of any sign and only their comparison matters; probabilities lie in (0, 1) and sum to 1 over the classes; here they show that the model is unsure (0.45 vs 0.41).",
            ],
            answer: {
              en: `= p_k = exp(s_k) / sum_j exp(s_j)
= exp: Soup 2.23,  Salad 6.69,  Plov 7.39   ->  sum = 16.31
= p(Soup)  = 2.23 / 16.31 = 0.14
= p(Salad) = 6.69 / 16.31 = 0.41
= p(Plov)  = 7.39 / 16.31 = 0.45      (0.14 + 0.41 + 0.45 = 1)
The prediction **does not change** — still Plov: exp is increasing, so softmax keeps the order of the scores.
A **score** (logit) is a raw number of any sign and size; only which one is largest matters. A **probability** lies between 0 and 1, and the probabilities of all classes sum to 1, so it can be read as confidence: here the model is torn between Plov (45%) and Salad (41%).`,
              ru: `= p_k = exp(s_k) / sum_j exp(s_j)
= exp: Soup 2.23,  Salad 6.69,  Plov 7.39   ->  sum = 16.31
= p(Soup)  = 2.23 / 16.31 = 0.14
= p(Salad) = 6.69 / 16.31 = 0.41
= p(Plov)  = 7.39 / 16.31 = 0.45      (0.14 + 0.41 + 0.45 = 1)
Предсказание **не меняется** — по-прежнему Plov: exp возрастает, поэтому softmax сохраняет порядок scores.
**Score** (logit) — сырое число любого знака и размера, важно лишь, какое из них наибольшее. **Вероятность** лежит между 0 и 1, а вероятности всех классов в сумме дают 1, поэтому её можно читать как уверенность: здесь модель колеблется между Plov (45%) и Salad (41%).`,
            },
          },
          {
            id: "v4-q2-e",
            label: "e",
            points: 4,
            prompt: `During training, the training accuracy rises steadily from 60% at epoch 1 to 99% at epoch 40. The validation accuracy rises to 86% at epoch 12 and then slowly falls to 74% at epoch 40. What is happening? What would you do?`,
            rubric: [
              "2 pts — overfitting that starts around epoch 12: after that the model keeps memorizing the training trays (train ↑ to 99%) while it generalizes worse (validation ↓ from 86% to 74%). 'Underfitting' or 'the validation set is too hard' gets 0 for this line.",
              "2 pts — a fix: early stopping — stop training or keep the checkpoint with the best validation accuracy (≈ epoch 12); or augmentation, L2 weight decay, dropout, more data, a smaller model. Choosing the epoch by the TEST accuracy gets 0 for this line.",
            ],
            answer: {
              en: `**Overfitting, starting at about epoch 12.** Up to epoch 12 both curves rise — the model learns useful patterns. After that, training accuracy keeps climbing to 99% while validation accuracy drops from 86% to 74%: the model memorizes details of the training photos (particular trays, lighting, crumbs) that do not generalize.
**What to do:** **early stopping** — keep the weights from the epoch with the best validation accuracy (≈ 12), or stop when validation stops improving; also add augmentation (flips, crops, brightness), L2 weight decay or dropout, or collect more photos. The test set stays untouched until the very end.`,
              ru: `**Переобучение, начиная примерно с 12-й эпохи.** До 12-й эпохи обе кривые растут — модель учит полезные закономерности. Дальше точность на обучении растёт до 99%, а на валидации падает с 86% до 74%: модель запоминает детали обучающих снимков (конкретные подносы, свет, крошки), которые не обобщаются.
**Что делать:** **ранняя остановка (early stopping)** — сохранить веса эпохи с лучшей точностью на валидации (≈ 12) или остановиться, когда валидация перестала расти; плюс аугментация (отражения, кропы, яркость), L2 weight decay или dropout, больше снимков. Тестовая часть не трогается до самого конца.`,
            },
          },
        ],
      },
      {
        id: "v4-q3",
        title: "Question 3 — Linear Classifier",
        points: 25,
        context: `Consider a three-class linear classifier for the tray photos: s = Wx + b
= W = [[3, -1], [-2, 2], [1, 4]]
= x = [-1, 2]^T
= b = [-1, 3, 0]^T
Classes: 0 = Soup, 1 = Salad, 2 = Plov`,
        tasks: [
          {
            id: "v4-q3-a",
            label: "a",
            points: 12,
            prompt: `Calculate s = Wx + b. Show every step.`,
            rubric: [
              "3 pts — s0 (Soup): row 0 of W times x = 3·(−1) + (−1)·2 = −5 (2 pts), plus b0 = −1 → s0 = −6 (1 pt).",
              "3 pts — s1 (Salad): (−2)·(−1) + 2·2 = 2 + 4 = 6 (2 pts), plus b1 = 3 → s1 = 9 (1 pt).",
              "3 pts — s2 (Plov): 1·(−1) + 4·2 = −1 + 8 = 7 (2 pts), plus b2 = 0 → s2 = 7 (1 pt).",
              "3 pts — the working is shown step by step (each row of W times x, then + b) and the final vector s = [−6, 9, 7] is stated. Bare final numbers without working get 0 for this line; after a sign error in one product, the later steps are followed through.",
            ],
            answer: {
              en: `Each score is one row of W times x, plus that class's bias. W is 3 × 2 and x has 2 values, so s has 3 values.
= s0 (Soup)  = 3*(-1) + (-1)*2 + (-1) = -3 - 2 - 1 = -6
= s1 (Salad) = (-2)*(-1) + 2*2 + 3    = 2 + 4 + 3  = 9
= s2 (Plov)  = 1*(-1) + 4*2 + 0       = -1 + 8 + 0 = 7
= Wx = [-5, 6, 7],  s = Wx + b = [-5 - 1, 6 + 3, 7 + 0] = [-6, 9, 7]`,
              ru: `Каждый score — строка W, умноженная скалярно на x, плюс bias своего класса. W имеет размер 3 × 2, в x два числа, поэтому в s три числа.
= s0 (Soup)  = 3*(-1) + (-1)*2 + (-1) = -3 - 2 - 1 = -6
= s1 (Salad) = (-2)*(-1) + 2*2 + 3    = 2 + 4 + 3  = 9
= s2 (Plov)  = 1*(-1) + 4*2 + 0       = -1 + 8 + 0 = 7
= Wx = [-5, 6, 7],  s = Wx + b = [-5 - 1, 6 + 3, 7 + 0] = [-6, 9, 7]`,
            },
          },
          {
            id: "v4-q3-b",
            label: "b",
            points: 3,
            prompt: `What class does the classifier predict?`,
            rubric: [
              "2 pts — class 1, Salad (follow-through: the argmax of the student's own s from a) earns these points).",
              "1 pt — the reason: the prediction is the argmax of s — 9 is the largest of −6, 9 and 7. Choosing by the largest weight, the largest bias or the largest absolute value gets 0 for this line.",
            ],
            answer: {
              en: `**Class 1 — Salad**, because the prediction is the class with the largest score (argmax): s1 = 9 > s2 = 7 > s0 = −6.`,
              ru: `**Класс 1 — Salad**: предсказание — класс с наибольшим score (argmax), а s1 = 9 > s2 = 7 > s0 = −6.`,
            },
          },
          {
            id: "v4-q3-c",
            label: "c",
            points: 5,
            prompt: `(i) Rewrite the classifier with the bias trick, so that it becomes a single matrix product: write the new W' and x'. (ii) What would the classifier predict if b were all zeros? What does this tell you about the role of b?`,
            rubric: [
              "2 pts — bias trick: b is appended as an extra column of W and a constant 1 is appended to x: W' = [[3, −1, −1], [−2, 2, 3], [1, 4, 0]] (3 × 3), x' = [−1, 2, 1]; W'x' gives the same s = [−6, 9, 7]. 1 pt if the idea is right but W' or x' has an error.",
              "2 pts — with b = 0: s = Wx = [−5, 6, 7] → argmax = Plov (class 2), so the prediction changes from Salad to Plov.",
              "1 pt — the role of b: a per-class offset added to the score whatever the image is (a learned preference for the class; geometrically it shifts the decision boundary away from the origin); here b1 = 3 is large enough to flip the decision.",
            ],
            answer: {
              en: `- **Bias trick:** append b as an extra column of W and a constant 1 to x:
= W' = [[3, -1, -1], [-2, 2, 3], [1, 4, 0]]   (3 x 3),   x' = [-1, 2, 1]
= W'x' = [-3 - 2 - 1, 2 + 4 + 3, -1 + 8 + 0] = [-6, 9, 7]   (the same s)
- **Without b:** s = Wx = [−5, 6, 7] → argmax = **Plov** (class 2) instead of Salad.
- **Role of b:** b adds a fixed amount to each class score **whatever the image is** — a learned per-class offset (a prior preference for the class); geometrically it shifts the decision boundary away from the origin. Here b1 = 3 for Salad is large enough to flip the decision from Plov to Salad.`,
              ru: `- **Bias trick:** дописываем b как дополнительный столбец W, а к x — константу 1:
= W' = [[3, -1, -1], [-2, 2, 3], [1, 4, 0]]   (3 x 3),   x' = [-1, 2, 1]
= W'x' = [-3 - 2 - 1, 2 + 4 + 3, -1 + 8 + 0] = [-6, 9, 7]   (the same s)
- **Без b:** s = Wx = [−5, 6, 7] → argmax = **Plov** (класс 2) вместо Salad.
- **Роль b:** b добавляет к score каждого класса фиксированную величину **независимо от изображения** — обучаемый сдвиг класса (априорное предпочтение); геометрически он отодвигает границу решения от начала координат. Здесь b1 = 3 у Salad достаточно велик, чтобы перевернуть решение с Plov на Salad.`,
            },
          },
          {
            id: "v4-q3-d",
            label: "d",
            points: 5,
            prompt: `Suppose each tray photo is reduced to two features (x1, x2). The Soup photos form a small cluster around the origin (distance from (0, 0) less than 1), and the Plov photos form a ring around them (distance between 2 and 3). Can a linear classifier separate these two classes? Explain (you may describe a small drawing in words) and suggest one way to fix it.`,
            rubric: [
              "1 pt — no, not with s = Wx + b on (x1, x2).",
              "2 pts — the reason: the boundary between two classes is where their scores are equal, (w_soup − w_plov)·x + (b_soup − b_plov) = 0, a straight line; Plov surrounds Soup on every side, so any line leaves Plov points on both sides (e.g. the origin is the midpoint of the Plov points (2.5, 0) and (−2.5, 0), and a linear function at a midpoint is the average of its values at the two ends).",
              "2 pts — a fix: a non-linear feature such as r = √(x1² + x2²) or r² (then r < 1.5 vs r > 1.5 is a linear rule in r); or a neural network with a hidden layer and a non-linear activation (ReLU); or kNN.",
            ],
            answer: {
              en: `**No.** Drawing: a small disk of Soup points in the centre and a ring of Plov points around it.
- For two classes the boundary is where their scores are equal: (w_soup − w_plov) · x + (b_soup − b_plov) = 0 — a **straight line**. Plov surrounds Soup on every side, so any line leaves Plov points on both sides of it.
- Short proof: the origin (Soup) is the midpoint of the Plov points (2.5, 0) and (−2.5, 0). A linear function at a midpoint equals the average of its values at the two ends, so if both Plov points are on the Plov side, the origin is on the Plov side too.
- **Fix:** a non-linear feature, e.g. the radius r = √(x1² + x2²): Soup has r < 1 and Plov 2 ≤ r ≤ 3, so the rule r < 1.5 is linear in r. Or use a neural network with a hidden layer and a non-linear activation (ReLU), or kNN.`,
              ru: `**Нет.** Рисунок: маленький диск точек Soup в центре и кольцо точек Plov вокруг него.
- Для двух классов граница — там, где их scores равны: (w_soup − w_plov) · x + (b_soup − b_plov) = 0 — это **прямая**. Plov окружает Soup со всех сторон, поэтому любая прямая оставит точки Plov по обе стороны от себя.
- Короткое доказательство: начало координат (Soup) — середина отрезка между точками Plov (2.5, 0) и (−2.5, 0). Линейная функция в середине отрезка равна среднему её значений на концах, поэтому если обе точки Plov на стороне Plov, то и начало координат там же.
- **Как исправить:** нелинейный признак, например радиус r = √(x1² + x2²): у Soup r < 1, у Plov 2 ≤ r ≤ 3, и правило r < 1.5 линейно по r. Или нейросеть со скрытым слоем и нелинейной активацией (ReLU), или kNN.`,
            },
          },
        ],
      },
      {
        id: "v4-q4",
        title: "Question 4 — Understand the CV Pipeline",
        points: 20,
        context: `A student segments the food on a tray before classification. The camera saves photos of 1280 × 960 pixels (width × height).
= img = cv2.imread("tray_07.jpg")
= img = cv2.resize(img, (400, 300))
= hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
= sat = hsv[:, :, 1]
= blur = cv2.GaussianBlur(sat, (5, 5), 0)
= ret, mask = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)`,
        tasks: [
          {
            id: "v4-q4-a",
            label: "a",
            points: 5,
            prompt: `Write the shape of img after line 2. Is the food stretched compared with the original photo? Explain.`,
            rubric: [
              "3 pts — (300, 400, 3): dsize (400, 300) means 400 wide and 300 high, and the NumPy shape is (height, width, channels). (400, 300, 3) gets 0; (300, 400) without the channels gets 2.",
              "2 pts — not stretched: the aspect ratio is kept, 1280 / 960 = 400 / 300 = 4 / 3 (both sides are scaled by 0.3125). Answering 'stretched' gets 0 for this line.",
            ],
            answer: {
              en: `= after line 1: (960, 1280, 3)
= after line 2: (300, 400, 3)    height 300, width 400, 3 channels
dsize is **(width, height)**, the shape is **(height, width, channels)**. The food is **not stretched**: 1280 / 960 = 400 / 300 = 4 / 3 — both sides are multiplied by the same factor 0.3125.`,
              ru: `= after line 1: (960, 1280, 3)
= after line 2: (300, 400, 3)    height 300, width 400, 3 channels
dsize — это **(ширина, высота)**, форма — **(высота, ширина, каналы)**. Еда **не растянута**: 1280 / 960 = 400 / 300 = 4 / 3 — обе стороны умножены на один и тот же коэффициент 0.3125.`,
            },
          },
          {
            id: "v4-q4-b",
            label: "b",
            points: 5,
            prompt: `How many channels do hsv and sat have? What does each channel of hsv describe?`,
            rubric: [
              "2 pts — hsv has 3 channels, shape (300, 400, 3): converting BGR to HSV re-describes each pixel and does not drop channels. 'One channel' gets 0 for this line.",
              "2 pts — sat = hsv[:, :, 1] has 1 channel, shape (300, 400): index 1 of the last axis is the S channel.",
              "1 pt — the meaning: H = hue (which colour; 0–179 in 8-bit OpenCV), S = saturation (vivid vs grayish), V = value (brightness).",
            ],
            answer: {
              en: `= hsv -> (300, 400, 3)   3 channels: H, S, V
= sat -> (300, 400)      1 channel: S only
- Converting BGR to HSV **re-describes** each pixel; it does not remove channels (unlike BGR2GRAY).
- **H (hue)** — which colour (red, orange, green…); 0–179 in 8-bit OpenCV. **S (saturation)** — how vivid the colour is: 0 = gray or white, 255 = pure colour. **V (value)** — brightness, 0–255.
- hsv[:, :, 1] takes index 1 of the last axis, i.e. the S channel, as one 2-D array.`,
              ru: `= hsv -> (300, 400, 3)   3 channels: H, S, V
= sat -> (300, 400)      1 channel: S only
- Перевод BGR в HSV **переописывает** каждый пиксель, а не убирает каналы (в отличие от BGR2GRAY).
- **H (hue, оттенок)** — какой цвет (красный, оранжевый, зелёный…); в 8-битном OpenCV 0–179. **S (saturation, насыщенность)** — насколько цвет яркий: 0 — серый или белый, 255 — чистый цвет. **V (value)** — яркость, 0–255.
- hsv[:, :, 1] берёт индекс 1 последней оси, то есть канал S, как один двумерный массив.`,
            },
          },
          {
            id: "v4-q4-c",
            label: "c",
            points: 5,
            prompt: `Explain why the Gaussian blur (line 5) is applied before the Otsu threshold (line 6).`,
            rubric: [
              "2 pts — Otsu chooses the threshold automatically from the histogram, looking for the value that best separates two groups (unsaturated plate/tray vs saturated food); noise and fine texture (rice grains, highlights, JPEG blocks) widen and mix the two peaks, so the chosen threshold is less reliable.",
              "2 pts — without the blur, pixel-by-pixel thresholding gives a speckled mask: white dots on the plate, black holes inside the food, ragged borders; the blur averages each pixel with its neighbours, so isolated outliers disappear and the regions become solid.",
              "1 pt — the trade-off: a small kernel such as (5, 5) removes noise but keeps the outline of the food; a very large kernel would smear the border between food and plate.",
            ],
            answer: {
              en: `- Otsu picks the threshold automatically from the **histogram**: it looks for the value that best separates two groups — here the unsaturated plate and tray and the saturated food. Noise and fine texture (grains of rice, specular highlights, JPEG blocks) widen and mix the two peaks, so the threshold becomes less reliable.
- Thresholding a noisy image pixel by pixel gives a speckled mask: white dots on the plate and black holes inside the food, with ragged borders. A Gaussian blur replaces each pixel with a weighted average of its neighbours, so isolated outliers disappear and the regions become solid.
- A small kernel (5 × 5) is enough: it removes noise but keeps the outline of the food; a very large kernel would smear the border between food and plate.`,
              ru: `- Otsu выбирает порог автоматически по **гистограмме**: ищет значение, лучше всего разделяющее две группы, — здесь ненасыщенные тарелку и поднос и насыщенную еду. Шум и мелкая текстура (зёрна риса, блики, JPEG-блоки) расширяют и смешивают два пика, и порог становится менее надёжным.
- Попиксельный порог по шумному изображению даёт «рябую» маску: белые точки на тарелке и чёрные дыры внутри еды, рваные края. Gaussian blur заменяет каждый пиксель взвешенным средним соседей, одиночные выбросы исчезают, области становятся сплошными.
- Маленького ядра (5 × 5) достаточно: оно убирает шум, но сохраняет контур еды; очень большое ядро размазало бы границу между едой и тарелкой.`,
            },
          },
          {
            id: "v4-q4-d",
            label: "d",
            points: 5,
            prompt: `A teammate proposes to replace lines 3–4 with gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) and to threshold gray instead of the S channel. The plates and trays are white or light gray, the food is colourful, and the lamps and shadows differ between the two canteens. Would you accept this change? Explain with an example.`,
            rubric: [
              "1 pt — decision: no, keep the S channel (gray is the worse choice for this mask).",
              "2 pts — reason: white and gray plates/trays have saturation ≈ 0 at ANY brightness, while colourful food has high saturation; gray mixes colour into brightness, so lamps and shadows move the gray values and a shaded plate can be as dark as the food — one threshold on gray cannot separate them reliably.",
              "2 pts — a concrete example: e.g. a shaded white plate (B, G, R) = (120, 120, 120) → gray 120, S 0; plov (40, 110, 170) → gray ≈ 120, S 195 — identical in gray, clearly different in S. A qualitative example only (a shadow on the plate becomes 'food' in gray) gets 1 pt.",
            ],
            answer: {
              en: `**No — keep the S channel.**
The plate and tray are white or gray: their **saturation is about 0 at any brightness**, lit or in shadow. Food is colourful, so its saturation is high. Grayscale mixes colour into one brightness number (0.299 R + 0.587 G + 0.114 B), so lamps and shadows move the values of both plate and food, and the two can coincide.
= shaded plate (B, G, R) = (120, 120, 120):  gray = 120,  S = 0
= plov (B, G, R) = (40, 110, 170):  gray = 0.299*170 + 0.587*110 + 0.114*40 = 120,  S = 195
In gray the two pixels are identical, so no threshold can separate them; in S they are 0 vs 195. (Limitation: white food such as rice also has low S, so it would need another cue, e.g. the known plate position.)`,
              ru: `**Нет — оставить канал S.**
Тарелка и поднос белые или серые: их **насыщенность около 0 при любой яркости** — и на свету, и в тени. Еда цветная, её насыщенность высокая. Серый смешивает цвет в одно число яркости (0.299 R + 0.587 G + 0.114 B), поэтому лампы и тени сдвигают значения и тарелки, и еды, и они могут совпасть.
= shaded plate (B, G, R) = (120, 120, 120):  gray = 120,  S = 0
= plov (B, G, R) = (40, 110, 170):  gray = 0.299*170 + 0.587*110 + 0.114*40 = 120,  S = 195
В сером два пикселя одинаковы, и никакой порог их не разделит; в S это 0 против 195. (Ограничение: у белой еды, например риса, S тоже низкая — для неё нужен другой признак, например известное положение тарелки.)`,
            },
          },
        ],
      },
      {
        id: "v4-q5",
        title: "Question 5 — Design Your Own CV System",
        points: 15,
        context: `An insurance company wants to classify photos of cars sent with claims into No damage | Scratch | Dent | Broken glass. You have 3 000 labelled photos: 2 400 No damage, 300 Scratch, 200 Dent and 100 Broken glass. Each car was photographed 4–6 times from different sides.`,
        tasks: [
          {
            id: "v4-q5-a",
            label: "a",
            points: 3,
            prompt: `How would you organize the dataset?`,
            rubric: [
              "1 pt — one folder per class inside each split (or a CSV file → label), e.g. data/train/dent/….",
              "1 pt — all photos of the same car (claim) go into the same split (group by car ID), so near-identical views do not leak from train into test.",
              "1 pt — a rule for unclear labels (a photo with two damages, damage hardly visible from this side) with a second check, or recorded metadata (car ID, phone, daylight/night).",
            ],
            answer: {
              en: `- One folder per class inside each split (or a CSV: file → label):
= data/train/no_damage/  data/train/scratch/  data/train/dent/  data/train/broken_glass/
= data/val/...   data/test/...
- Keep a **car (claim) ID** for every photo and put all photos of one car into the **same** split; otherwise near-identical views of the same car appear in train and test and the test score is inflated (leakage).
- Write labelling rules for unclear cases (a photo showing two damages, damage hardly visible from this side) and let a second person check them; record the phone, the time of day and the weather.`,
              ru: `- По папке на класс внутри каждой части (или CSV: файл → метка):
= data/train/no_damage/  data/train/scratch/  data/train/dent/  data/train/broken_glass/
= data/val/...   data/test/...
- Хранить **ID машины (заявки)** у каждого снимка и класть все снимки одной машины в **одну** часть; иначе почти одинаковые ракурсы одной машины окажутся и в train, и в test, и оценка на тесте будет завышена (утечка).
- Записать правила разметки спорных случаев (на снимке два повреждения, повреждение почти не видно с этой стороны) и дать второму человеку их проверить; записывать телефон, время суток и погоду.`,
            },
          },
          {
            id: "v4-q5-b",
            label: "b",
            points: 3,
            prompt: `Propose a train/validation/test split and calculate the number of images in each part.`,
            rubric: [
              "1 pt — a split with the role of each part (train / validation / test, or train / test with cross-validation on train).",
              "1 pt — correct totals for the chosen split: 70/15/15 → 2 100 / 450 / 450; 80/10/10 → 2 400 / 300 / 300; 80/20 → 2 400 / 600.",
              "1 pt — stratified per class with the counts, e.g. 70/15/15: No damage 1 680 / 360 / 360, Scratch 210 / 45 / 45, Dent 140 / 30 / 30, Broken glass 70 / 15 / 15 — a purely random split could leave very few Broken glass photos in the test set.",
            ],
            answer: {
              en: `Stratified 70/15/15, split by car:
| Class | Total | Train 70% | Val 15% | Test 15% |
|---|---|---|---|---|
| No damage | 2 400 | 1 680 | 360 | 360 |
| Scratch | 300 | 210 | 45 | 45 |
| Dent | 200 | 140 | 30 | 30 |
| Broken glass | 100 | 70 | 15 | 15 |
| Total | 3 000 | 2 100 | 450 | 450 |
Stratification keeps the 80 / 10 / 6.7 / 3.3% class shares in every part; a purely random split could leave only a handful of Broken glass photos in the test set. With only 15 test photos of Broken glass its score will be noisy, so cross-validation on train + validation helps.`,
              ru: `Стратифицированное 70/15/15, с разбиением по машинам:
| Класс | Всего | Train 70% | Val 15% | Test 15% |
|---|---|---|---|---|
| No damage | 2 400 | 1 680 | 360 | 360 |
| Scratch | 300 | 210 | 45 | 45 |
| Dent | 200 | 140 | 30 | 30 |
| Broken glass | 100 | 70 | 15 | 15 |
| Итого | 3 000 | 2 100 | 450 | 450 |
Стратификация сохраняет доли классов 80 / 10 / 6.7 / 3.3% в каждой части; при чисто случайном разбиении в тест могло бы попасть лишь несколько снимков Broken glass. Даже так их в тесте всего 15, и оценка по этому классу будет шумной — помогает кросс-валидация на train + validation.`,
            },
          },
          {
            id: "v4-q5-c",
            label: "c",
            points: 3,
            prompt: `Give two preprocessing or augmentation operations you would use, and explain why.`,
            rubric: [
              "1.5 pts — first choice: a valid operation (0.5) with a reason tied to car-damage photos (1). Valid: resize to a fixed size that still keeps thin scratches visible (e.g. 384 × 384, or crops of the damaged area); scaling to [0, 1] or standardization; horizontal flips, small rotations, random crops; brightness, contrast and slight blur augmentation for different phones, night and rain; oversampling the rare classes (Dent, Broken glass) with augmentation.",
              "1.5 pts — second choice, same rule; it must differ from the first. A very small resize (e.g. 32 × 32) or a strong blur gets 0: thin scratches and small dents disappear.",
            ],
            answer: {
              en: `- **Resize to a fixed, not too small size** (e.g. 384 × 384) and scale to [0, 1]: the model needs one input size, but thin scratches vanish at 32 × 32, so the size must keep them visible.
- **Augmentation of the training set**, stronger for the rare classes: horizontal flips (left and right sides of a car), small rotations and crops (different shooting angles), brightness, contrast and slight blur (cheap phones, night, rain). Oversampling Broken glass and Dent with these augmentations reduces the imbalance.`,
              ru: `- **Resize до фиксированного, не слишком маленького размера** (например, 384 × 384) и масштабирование в [0, 1]: модели нужен один размер входа, но тонкие царапины на 32 × 32 исчезают, так что размер должен их сохранять.
- **Аугментация обучающей части**, сильнее для редких классов: горизонтальные отражения (левый и правый борт), небольшие повороты и кропы (разные ракурсы), яркость, контраст и лёгкое размытие (дешёвые телефоны, ночь, дождь). Oversampling классов Broken glass и Dent с такими аугментациями уменьшает дисбаланс.`,
            },
          },
          {
            id: "v4-q5-d",
            label: "d",
            points: 3,
            prompt: `What metric would you use to evaluate your classifier? Explain why.`,
            rubric: [
              "1 pt — per-class precision and recall with macro-F1 and/or the confusion matrix, not accuracy alone. Accuracy as the only metric gets 0 for this line.",
              "1 pt — why accuracy misleads, with numbers: 80% of the photos are No damage, so a model that always answers No damage gets 360 / 450 = 80% accuracy on the test set (2 400 / 3 000 overall) while detecting no damage at all.",
              "1 pt — which errors matter: recall of the damage classes (a missed dent or broken window is a wrongly rejected claim) and precision (a false damage costs money); macro-F1 gives the small Broken glass class the same weight as No damage.",
            ],
            answer: {
              en: `**Per-class precision and recall, macro-F1 and the confusion matrix** — not accuracy alone.
= always 'No damage' on the test set: accuracy = 360 / 450 = 80%,  recall(Dent) = 0 / 30 = 0
- 80% of the photos are No damage, so a useless model already gets 80% accuracy. The recall of each damage class shows how many real scratches, dents and broken windows are found; precision shows how many reported damages are real; macro-F1 averages F1 over the four classes, so the small Broken glass class counts as much as No damage. The confusion matrix shows, for example, Scratch ↔ Dent confusions.`,
              ru: `**Precision и recall по классам, macro-F1 и матрица ошибок** — а не одна accuracy.
= always 'No damage' on the test set: accuracy = 360 / 450 = 80%,  recall(Dent) = 0 / 30 = 0
- 80% снимков — No damage, поэтому бесполезная модель уже получает 80% accuracy. Recall каждого класса повреждений показывает, сколько настоящих царапин, вмятин и разбитых стёкол найдено; precision — сколько найденных повреждений настоящие; macro-F1 усредняет F1 по четырём классам, и маленький класс Broken glass весит столько же, сколько No damage. Матрица ошибок показывает, например, путаницу Scratch ↔ Dent.`,
            },
          },
          {
            id: "v4-q5-e",
            label: "e",
            points: 3,
            prompt: `The model scores well on your test set, but on photos uploaded by customers it often answers No damage for cars that clearly have dents. Give one possible reason and a fix.`,
            rubric: [
              "1.5 pts — a plausible reason: domain shift (training photos taken by agents in daylight, close up, on clean cars; customers send photos at night, in rain, from far away, with other phones — a dent is visible mostly through reflections, which change with the light) OR class imbalance (80% No damage, so the model is biased toward the majority class and says No damage when unsure).",
              "1.5 pts — a fix that matches the reason: customer-like photos (night, rain, many phones) in training and validation, brightness/blur/reflection augmentation, photo instructions for customers; for imbalance — class weights or oversampling of the damage classes, a lower decision threshold for damage, choosing the model by recall or macro-F1 on validation. 'Train longer' or 'a bigger model' alone gets 0.",
            ],
            answer: {
              en: `**Reason — domain shift (plus imbalance):** the training photos were taken by agents in daylight, close up, on clean cars; customers upload photos taken at night, in rain, from far away, with other phones. A dent changes only the **reflections** on the panel, and these look completely different under street lights or on a wet car, so the features the model learned are not there. Because 80% of the training photos are No damage, the model falls back to that class when unsure.
**Fix:** add customer-like photos (night, rain, many phones) to training and validation, augment brightness, blur and reflections, and give customers simple photo instructions; against the imbalance use class weights or oversampling and choose the model by the recall of the damage classes.`,
              ru: `**Причина — сдвиг домена (плюс дисбаланс):** обучающие снимки делали агенты днём, вблизи, на чистых машинах; клиенты присылают снимки ночью, в дождь, издалека, с других телефонов. Вмятина меняет только **отражения** на панели, а они совсем иначе выглядят под уличными фонарями или на мокрой машине, — признаков, которые выучила модель, просто нет. А раз 80% обучающих снимков — No damage, при сомнении модель выбирает этот класс.
**Что делать:** добавить в обучение и валидацию снимки «как у клиентов» (ночь, дождь, разные телефоны), аугментировать яркость, размытие и блики, дать клиентам простую инструкцию по съёмке; против дисбаланса — веса классов или oversampling и выбор модели по recall классов повреждений.`,
            },
          },
        ],
      },
    ],
  },
];
