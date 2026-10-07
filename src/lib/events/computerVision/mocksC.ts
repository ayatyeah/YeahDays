import type { ExamQuestion, ExamTask, MockExam } from "../types";

/**
 * Пробные варианты 5 и 6 — новые, той же структуры, что и вариант 1:
 * 20 / 20 / 25 / 20 / 15 баллов. Вариант 6 — самый сложный: две «тихие»
 * ошибки в коде, ничья в Wx, которую решает смещение, ловушка с (width,
 * height) и срезами, несбалансированный датасет в задании 5.
 * Все числа проверены на Python (scratchpad cv/work-mocks-C/verify_v5_parking.py, verify.py).
 */

const task = (id: string, label: string, points: number, prompt: string, rubric: string[], en: string, ru: string): ExamTask => ({
  id,
  label,
  points,
  prompt,
  rubric,
  answer: { en, ru },
});

const question = (id: string, title: string, points: number, context: string, tasks: ExamTask[]): ExamQuestion => ({
  id,
  title,
  points,
  context,
  tasks,
});

const NEW = { en: "New practice variant", ru: "Новый тренировочный вариант" };

// ---------------------------------------------------------------------------
// Variant 5 — parking-lot occupancy (Q1–Q4) and document photos (Q5)
// ---------------------------------------------------------------------------

const v5: MockExam = {
  id: "v5",
  title: { en: "Variant 5 — parking lot and document photos", ru: "Вариант 5 — парковка и фото документов" },
  minutes: 120,
  source: NEW,
  questions: [
    question(
      "v5-q1",
      "Question 1 — Image Processing & OpenCV",
      20,
      `A university installs fixed cameras over its parking lot. For every marked spot, a patch is cut from the camera frame and classified as Free | Occupied | Blocked (blocked by snow or a barrier). Two camera models are used: 1280 × 720 and 2560 × 1440. Frames are taken by day and at night under street lamps, raindrops on the lens leave blurry spots, and during the day the shadows of trees move across the spots. Spots far from a camera look small and skewed.`,
      [
        task(
          "v5-q1-a",
          "a",
          6,
          `Propose three preprocessing operations that could be useful for these images. For each operation, explain why you would use it.`,
          [
            "2 pts — first operation (1 pt) with a reason tied to these images (1 pt). Acceptable: cut out each spot with its fixed coordinates, ideally with a perspective warp to a top-down rectangle (fixed cameras, far spots small and skewed); resize every spot patch to one size (two camera models, near and far spots); illumination normalization — CLAHE / histogram equalization on gray or V, or per-patch standardization (night, moving tree shadows); denoising with a median or Gaussian filter (night sensor noise); scaling to [0, 1]; comparison with a reference image of the empty spot.",
            "2 pts — a second, different operation from the list (1 pt) with a scenario-specific reason (1 pt).",
            "2 pts — a third, different operation (1 pt) with a reason (1 pt). A generic reason such as 'it improves the image' gets 0 for the reason; the same operation named twice counts once; 'remove the raindrops' without a real method gets 0.",
          ],
          `- **Cut out every spot and warp it to a top-down rectangle:** the cameras are fixed, so the corners of each spot are known once; a perspective warp makes near and far spots look alike instead of small and skewed. (A plain crop with fixed coordinates is the simple version.)
- **Resize every spot patch to one size** (e.g. 64 × 64): the two camera models give 1280 × 720 and 2560 × 1440 frames, and near spots cover many more pixels than far ones, but the classifier needs one input size.
- **Normalize the illumination** — CLAHE on the gray (or V) channel, or standardize each patch: night frames are dark and tree shadows darken part of a spot during the day; without it brightness alone could decide "Occupied".
Also accepted: a median or Gaussian filter against night noise; scaling pixels to [0, 1]; comparing each spot with a reference image of the empty spot.`,
          `- **Вырезать каждое место и выпрямить его в прямоугольник «вид сверху»:** камеры неподвижны, поэтому углы каждого места известны заранее; преобразование перспективы делает ближние и дальние места одинаковыми, а не маленькими и перекошенными. (Простая версия — обрезка по фиксированным координатам.)
- **Привести каждый патч к одному размеру** (например, 64 × 64): две модели камер дают кадры 1280 × 720 и 2560 × 1440, ближние места занимают намного больше пикселей, чем дальние, а классификатору нужен один размер входа.
- **Нормализовать освещение** — CLAHE на канале серого (или V) либо стандартизация каждого патча: ночные кадры тёмные, а днём тени деревьев затемняют часть места; без этого одна только яркость может решить «Occupied».
Тоже засчитывается: медианный или гауссов фильтр против ночного шума; масштабирование пикселей в [0, 1]; сравнение каждого места с эталонным снимком пустого места.`,
        ),
        task(
          "v5-q1-b",
          "b",
          4,
          `The student subtracts a reference photo of the empty lot, taken at sunny noon, from every frame — diff = cv2.absdiff(frame, empty) — and classifies the difference image. Give one advantage and one disadvantage of doing this for parking-spot classification.`,
          [
            "2 pts — one valid advantage tied to this task: the cameras are fixed, so the background (asphalt, lines) cancels out and only changes remain — a car, snow or a barrier shows up as a large difference; the classifier gets a simpler, background-free input.",
            "2 pts — one valid disadvantage tied to this task: the reference is from sunny noon, so at night, in rain or under moving tree shadows a free spot also differs strongly → false 'Occupied'; or Occupied and Blocked (snow) both give large differences and are not separated by the difference alone; or a slightly moved camera or the second camera model needs its own aligned reference. A generic 'loses information' without saying which gets 1.",
          ],
          `- **Advantage:** the cameras are fixed, so the asphalt and the painted lines are the same in the frame and in the reference and cancel out; what remains is the **change** — a car, snow or a barrier gives a large difference, an empty spot almost none. The classifier gets a simple input without the background.
- **Disadvantage:** the reference was taken at **sunny noon**. At night, in rain or when a tree shadow lies across the spot, an **empty** spot also differs strongly from the reference and looks "changed" → it can be classified as Occupied. Also, a car and a snow cover both give large differences, so the difference alone does not separate Occupied from Blocked; and every camera needs its own, exactly aligned reference.`,
          `- **Плюс:** камеры неподвижны, поэтому асфальт и разметка одинаковы в кадре и в эталоне и взаимно вычитаются; остаётся **изменение** — машина, снег или шлагбаум дают большую разницу, пустое место почти никакой. Классификатор получает простой вход без фона.
- **Минус:** эталон снят **в солнечный полдень**. Ночью, в дождь или когда на место падает тень дерева, **пустое** место тоже сильно отличается от эталона и выглядит «изменившимся» → его могут отнести к Occupied. Кроме того, и машина, и снежный покров дают большую разницу, так что одна разница не отличает Occupied от Blocked; и для каждой камеры нужен свой точно совмещённый эталон.`,
        ),
        task(
          "v5-q1-c",
          "c",
          5,
          `Consider the following code. Identify two problems and provide the corrected code.
= img = cv2.imread("parking_cam2.jpg", cv2.IMREAD_GRAYSCALE)
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (7, 7))`,
          [
            "2 pts — line 2: img is already single-channel, shape (h, w), because of IMREAD_GRAYSCALE; COLOR_BGR2GRAY expects 3 channels → error (crash). Fix: delete the line (or read the file in colour and keep the conversion). 'Use COLOR_RGB2GRAY' gets 0.",
            "2 pts — line 3: sigmaX is a required argument of GaussianBlur → error (crash); fix cv2.GaussianBlur(img, (7, 7), 0). The kernel (7, 7) is fine — 'the kernel must be odd' or 'use (6, 6)' gets 0.",
            "1 pt — complete corrected code that runs (grayscale read + blur with sigmaX, or colour read + BGR2GRAY + blur with sigmaX).",
          ],
          `- **Problem 1 (line 2):** the file is read with **IMREAD_GRAYSCALE**, so img already has **one channel**, shape (h, w). COLOR_BGR2GRAY expects a 3-channel image and raises an error — the program crashes. Delete the line (or read the file in colour and keep the conversion).
- **Problem 2 (line 3):** **sigmaX is a required argument** of GaussianBlur, so the call raises an error. Add it: 0 means "compute sigma from the kernel size". The kernel (7, 7) itself is fine — positive and odd.
Corrected code:
= img = cv2.imread("parking_cam2.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.GaussianBlur(img, (7, 7), 0)`,
          `- **Ошибка 1 (строка 2):** файл прочитан с **IMREAD_GRAYSCALE**, поэтому у img уже **один канал**, форма (h, w). COLOR_BGR2GRAY ждёт трёхканальное изображение и вызывает ошибку — программа падает. Строку удалить (или читать файл в цвете и оставить перевод).
- **Ошибка 2 (строка 3):** **sigmaX — обязательный аргумент** GaussianBlur, без него вызов падает с ошибкой. Добавляем: 0 означает «вычислить sigma по размеру ядра». Само ядро (7, 7) правильное — положительное и нечётное.
Исправленный код:
= img = cv2.imread("parking_cam2.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.GaussianBlur(img, (7, 7), 0)`,
        ),
        task(
          "v5-q1-d",
          "d",
          5,
          `A student says: "Our cameras are fixed and never move, so every photo of a spot looks the same. No preprocessing or augmentation is needed." Do you agree? Explain using one example.`,
          [
            "1 pt — disagrees with the claim.",
            "2 pts — principle: a fixed camera fixes the geometry, not the appearance — light (day, night, lamps), weather (rain on the lens, snow), shadows and seasons change the pixels of the same spot, and the two camera models differ; the classifier must handle all of this.",
            "2 pts — one concrete example (1 pt), e.g. a moving tree shadow darkens a free spot in the afternoon and it is classified as Occupied, or a dark night frame of a free spot looks like a dark car; and a fitting fix (1 pt): illumination normalization (CLAHE, standardization), brightness/shadow augmentation, training data from all times of day and seasons.",
          ],
          `No, I disagree. A fixed camera fixes the **geometry** — each spot stays at the same pixels — but not the **appearance**: daylight, street lamps at night, rain on the lens, snow, moving shadows and the seasons all change the pixel values of the same spot, and the two camera models give different images.
- **Example:** in the afternoon the shadow of a tree moves across a **free** spot; a large dark area appears where the asphalt was light, and a model trained mostly on noon photos classifies the spot as **Occupied**. At night a free spot under a lamp can be as dark as a dark car.
- **What is needed:** illumination normalization (CLAHE or per-patch standardization), augmentation with brightness changes and synthetic shadows, and training photos from all times of day and all seasons.`,
          `Нет, не согласен. Неподвижная камера фиксирует **геометрию** — каждое место всегда в тех же пикселях, — но не **внешний вид**: дневной свет, фонари ночью, дождь на объективе, снег, движущиеся тени и времена года меняют значения пикселей одного и того же места, а две модели камер дают разные изображения.
- **Пример:** после обеда тень дерева наползает на **свободное** место; там, где асфальт был светлым, появляется большое тёмное пятно, и модель, обученная в основном на полуденных снимках, относит место к **Occupied**. Ночью свободное место под фонарём может быть таким же тёмным, как тёмная машина.
- **Что нужно:** нормализация освещения (CLAHE или стандартизация каждого патча), аугментация изменениями яркости и искусственными тенями, обучающие снимки за всё время суток и все сезоны.`,
        ),
      ],
    ),
    question(
      "v5-q2",
      "Question 2 — Image Classification",
      20,
      `A classifier for parking-spot patches produces the following scores:
| Image | Free | Occupied | Blocked | True class |
|---|---|---|---|---|
| A | -0.5 | 2.6 | 0.3 | Occupied |
| B | 1.2 | 1.5 | -0.9 | Free |
| C | 0.4 | -0.2 | 1.9 | Blocked |
| D | 2.1 | -1.3 | 0.6 | Free |
| E | 0.8 | 1.0 | 0.9 | Occupied |`,
      [
        task(
          "v5-q2-a",
          "a",
          4,
          `Write the predicted class for A, B, C, D and E.`,
          [
            "1 pt — A: Occupied (2.6) and D: Free (2.1).",
            "1 pt — B: Occupied (1.5 > 1.2). The prediction is the highest score, not the true class — answering 'Free' gets 0.",
            "1 pt — C: Blocked (1.9).",
            "1 pt — E: Occupied (1.0 > 0.9 > 0.8).",
          ],
          `The predicted class is the one with the **highest score** (argmax), whatever the true class is:
| Image | Highest score | Predicted |
|---|---|---|
| A | Occupied 2.6 | Occupied |
| B | Occupied 1.5 (> Free 1.2) | Occupied |
| C | Blocked 1.9 | Blocked |
| D | Free 2.1 | Free |
| E | Occupied 1.0 (> Blocked 0.9 > Free 0.8) | Occupied |`,
          `Предсказанный класс — тот, у которого **наибольшая оценка** (argmax), независимо от истинного класса:
| Image | Наибольшая оценка | Предсказание |
|---|---|---|
| A | Occupied 2.6 | Occupied |
| B | Occupied 1.5 (> Free 1.2) | Occupied |
| C | Blocked 1.9 | Blocked |
| D | Free 2.1 | Free |
| E | Occupied 1.0 (> Blocked 0.9 > Free 0.8) | Occupied |`,
        ),
        task(
          "v5-q2-b",
          "b",
          4,
          `Calculate the classification accuracy. Show your calculation.`,
          [
            "2 pts — compares each prediction with the true class: A, C, D, E correct, B wrong (4 correct). If the predictions from a) were wrong, a count consistent with them earns these points.",
            "2 pts — accuracy = correct / total = 4 / 5 = 0.8 = 80%, with the calculation shown; only '80%' without the calculation gets 1.",
          ],
          `= correct: A (Occupied = Occupied), C (Blocked = Blocked), D (Free = Free), E (Occupied = Occupied); wrong: B (Occupied ≠ Free)
= accuracy = correct / total = 4 / 5 = 0.8 = 80%`,
          `= correct: A (Occupied = Occupied), C (Blocked = Blocked), D (Free = Free), E (Occupied = Occupied); wrong: B (Occupied ≠ Free)
= accuracy = correct / total = 4 / 5 = 0.8 = 80%
Сравниваем предсказание с истинным классом: верны A, C, D, E, ошибка только на B, значит точность 4 из 5 = 80%.`,
        ),
        task(
          "v5-q2-c",
          "c",
          4,
          `Which image was incorrectly classified? Explain why.`,
          [
            "2 pts — B is the (only) misclassified image.",
            "2 pts — explanation: the true class is Free, but Occupied has the highest score, 1.5 > 1.2 (margin 0.3), so B is predicted as Occupied. Naming E as misclassified as well (it is correct, 1.0 > 0.9) loses these 2 points.",
          ],
          `**Image B** is misclassified: the spot is really Free, but Occupied has the highest score (1.5 > 1.2), so it is predicted as Occupied — for example, a tree shadow lying on the empty spot. E is correct, although only by 1.0 − 0.9 = 0.1.`,
          `Ошибка на **снимке B**: место на самом деле свободно (Free), но наибольшая оценка у Occupied (1.5 > 1.2), поэтому предсказан Occupied — например, на пустое место легла тень дерева. E классифицирован верно, хотя перевес всего 1.0 − 0.9 = 0.1.`,
        ),
        task(
          "v5-q2-d",
          "d",
          4,
          `Explain the difference between precision and recall. Compute both for the class Free on these five images, and say which one matters more for an app that sends drivers to free spots.`,
          [
            "1 pt — definitions: precision = of the images predicted as the class, the fraction that really belong to it, TP / (TP + FP); recall = of the images that really belong to the class, the fraction found, TP / (TP + FN) (0.5 each; swapped definitions get 0).",
            "1 pt — precision(Free) = 1 / 1 = 1.0: only D is predicted Free, and it is free.",
            "1 pt — recall(Free) = 1 / 2 = 0.5: of the free spots B and D, only D is found.",
            "1 pt — for guiding drivers, precision of Free matters more: a spot shown as free but actually occupied sends a driver to the wrong place, while a missed free spot only loses an option.",
          ],
          `- **Precision** of a class = of all images **predicted** as that class, the fraction that really belong to it: TP / (TP + FP). **Recall** = of all images that **really** belong to the class, the fraction the model finds: TP / (TP + FN).
= predicted Free: D → really Free: D → precision(Free) = 1 / 1 = 1.0
= true Free: B, D → found: D → recall(Free) = 1 / 2 = 0.5
- For an app that sends drivers to free spots, **precision of Free** matters more: every spot shown as free should really be free, otherwise a driver goes to an occupied spot. A missed free spot (low recall) only means one option fewer.`,
          `- **Precision (точность)** класса = из всех снимков, **предсказанных** этим классом, доля тех, что действительно к нему относятся: TP / (TP + FP). **Recall (полнота)** = из всех снимков, которые **на самом деле** относятся к классу, доля найденных моделью: TP / (TP + FN).
= predicted Free: D → really Free: D → precision(Free) = 1 / 1 = 1.0
= true Free: B, D → found: D → recall(Free) = 1 / 2 = 0.5
- Для приложения, которое отправляет водителей на свободные места, важнее **precision класса Free**: каждое место, показанное свободным, должно быть свободным, иначе водитель поедет к занятому. Пропущенное свободное место (низкий recall) означает лишь на один вариант меньше.`,
        ),
        task(
          "v5-q2-e",
          "e",
          4,
          `The student tried 40 hyperparameter settings and kept the one with the best test accuracy: 96% training accuracy and 91% test accuracy. He reports 91% as the accuracy to expect at other parking lots. What is the problem? Give one possible solution.`,
          [
            "2 pts — diagnosis: the test set was used to choose the hyperparameters, so 91% is an optimistic (biased) estimate — the choice is fitted to this particular test set and the test set is no longer unseen data. Answering only 'overfitting because 96% > 91%' gets 1.",
            "2 pts — fix: split off a validation set (or use k-fold cross-validation on the training data), choose the setting there, and evaluate once on an untouched test set (a fresh one, since the old test set is used up).",
          ],
          `The **test set was used for model selection**. Out of 40 settings, the one that happens to fit these particular test images best was kept, so 91% is an **optimistic, biased** estimate: the test set is no longer unseen data, and at other parking lots the accuracy will probably be lower. The 5-point gap between train and test is not the main problem here.
**Fix:** split off a **validation set** (or use k-fold cross-validation on the training data), choose the hyperparameters on it, and evaluate the final model **once** on a test set that played no part in the choices — here a fresh one, because the old test set has been used up.`,
          `**Тестовая выборка использовалась для выбора модели.** Из 40 настроек оставили ту, что случайно лучше всего подошла именно к этим тестовым снимкам, поэтому 91% — **завышенная, смещённая** оценка: тест больше не «невиданные» данные, и на других парковках точность, скорее всего, будет ниже. Разрыв в 5 пунктов между train и test здесь не главная проблема.
**Решение:** выделить **валидационную выборку** (или k-fold cross-validation на обучающих данных), подбирать гиперпараметры на ней, а итоговую модель оценить **один раз** на тестовой выборке, которая не участвовала в выборе, — здесь на новой, потому что старая уже «израсходована».`,
        ),
      ],
    ),
    question(
      "v5-q3",
      "Question 3 — Linear Classifier",
      25,
      `Consider a three-class linear classifier for parking-spot patches: s = Wx + b, where x is a feature vector of one patch.
= x = [2, -1, -2]T
= W = [[1, 3, -1], [-2, 0, 1], [2, 2, 1]]
= b = [1, 3, -1]T
Classes: 0 = Free, 1 = Occupied, 2 = Blocked`,
      [
        task(
          "v5-q3-a",
          "a",
          12,
          `Calculate s = Wx + b. Show every step.`,
          [
            "3 pts — row 0 (Free): 1·2 + 3·(−1) + (−1)·(−2) = 2 − 3 + 2 = 1 (the final number without the products gets 1).",
            "3 pts — row 1 (Occupied): (−2)·2 + 0·(−1) + 1·(−2) = −4 + 0 − 2 = −6 (the final number without the products gets 1).",
            "3 pts — row 2 (Blocked): 2·2 + 2·(−1) + 1·(−2) = 4 − 2 − 2 = 0 (the final number without the products gets 1).",
            "3 pts — adds b element by element: s = [1 + 1, −6 + 3, 0 − 1] = [2, −3, −1]T. With an arithmetic slip earlier, a correct addition of b to the student's own Wx earns 2.",
          ],
          `Each score is the dot product of one row of W with x, plus the bias of that class.
= Wx[0] = 1·2 + 3·(−1) + (−1)·(−2) = 2 − 3 + 2 = 1
= Wx[1] = (−2)·2 + 0·(−1) + 1·(−2) = −4 + 0 − 2 = −6
= Wx[2] = 2·2 + 2·(−1) + 1·(−2) = 4 − 2 − 2 = 0
= Wx = [1, −6, 0]T
= s = Wx + b = [1 + 1, −6 + 3, 0 + (−1)]T = [2, −3, −1]T`,
          `Каждая оценка — скалярное произведение строки W на x плюс смещение своего класса.
= Wx[0] = 1·2 + 3·(−1) + (−1)·(−2) = 2 − 3 + 2 = 1
= Wx[1] = (−2)·2 + 0·(−1) + 1·(−2) = −4 + 0 − 2 = −6
= Wx[2] = 2·2 + 2·(−1) + 1·(−2) = 4 − 2 − 2 = 0
= Wx = [1, −6, 0]T
= s = Wx + b = [1 + 1, −6 + 3, 0 + (−1)]T = [2, −3, −1]T`,
        ),
        task(
          "v5-q3-b",
          "b",
          3,
          `What class does the classifier predict?`,
          [
            "2 pts — class 0 = Free.",
            "1 pt — because s[0] = 2 is the largest score (argmax). With a wrong s from a), the argmax of the student's own s earns full points.",
          ],
          `The highest score is s[0] = 2 (2 > −1 > −3), so the classifier predicts **class 0 = Free**.`,
          `Наибольшая оценка — s[0] = 2 (2 > −1 > −3), поэтому классификатор предсказывает **класс 0 = Free**.`,
        ),
        task(
          "v5-q3-c",
          "c",
          5,
          `Rewrite this classifier with the bias trick: write the extended matrix W′ and vector x′, and show that W′x′ gives the same scores. Why is the trick useful?`,
          [
            "1.5 pts — W′ = W with b appended as an extra column, shape 3 × 4: [[1, 3, −1, 1], [−2, 0, 1, 3], [2, 2, 1, −1]] (b as the first column is also fine if x′ matches).",
            "1 pt — x′ = x with a constant 1 appended: [2, −1, −2, 1]T.",
            "1.5 pts — shows W′x′ row by row = [2, −3, −1]T, the same s as in a) (0.5 per row).",
            "1 pt — why useful: one parameter matrix instead of W and b, s = W′x′; the bias is learned like any other weight, so formulas and code get simpler.",
          ],
          `The bias becomes an **extra column** of W, and x gets a **constant 1** at the end:
= W′ = [[1, 3, −1, 1], [−2, 0, 1, 3], [2, 2, 1, −1]]   (3 × 4)
= x′ = [2, −1, −2, 1]T   (4)
= W′x′[0] = 1·2 + 3·(−1) + (−1)·(−2) + 1·1 = 2 − 3 + 2 + 1 = 2
= W′x′[1] = (−2)·2 + 0·(−1) + 1·(−2) + 3·1 = −4 + 0 − 2 + 3 = −3
= W′x′[2] = 2·2 + 2·(−1) + 1·(−2) + (−1)·1 = 4 − 2 − 2 − 1 = −1
W′x′ = [2, −3, −1]T = s. **Why useful:** there is one parameter matrix instead of W and b, the score is a single product s = W′x′, and the bias is learned like any other weight — simpler formulas and code.`,
          `Смещение становится **дополнительным столбцом** W, а к x в конце дописывается **константа 1**:
= W′ = [[1, 3, −1, 1], [−2, 0, 1, 3], [2, 2, 1, −1]]   (3 × 4)
= x′ = [2, −1, −2, 1]T   (4)
= W′x′[0] = 1·2 + 3·(−1) + (−1)·(−2) + 1·1 = 2 − 3 + 2 + 1 = 2
= W′x′[1] = (−2)·2 + 0·(−1) + 1·(−2) + 3·1 = −4 + 0 − 2 + 3 = −3
= W′x′[2] = 2·2 + 2·(−1) + 1·(−2) + (−1)·1 = 4 − 2 − 2 − 1 = −1
W′x′ = [2, −3, −1]T = s. **Зачем:** вместо W и b одна матрица параметров, оценка — одно произведение s = W′x′, а смещение обучается как обычный вес — формулы и код проще.`,
        ),
        task(
          "v5-q3-d",
          "d",
          5,
          `Suppose each patch is described by two binary features (x1, x2). The points (0, 0) and (1, 1) belong to class A, and the points (0, 1) and (1, 0) to class B (the XOR pattern). Can a single linear classifier separate A from B? Explain (you may describe a small drawing in words) and propose one fix.`,
          [
            "2 pts — No: for two classes a linear classifier decides by the sign of f(x) = w·x + c, so its decision boundary is a straight line.",
            "2 pts — explains why no line works: the A points sit on one diagonal of the unit square and the B points on the other, so any line that puts both A corners on one side leaves at least one B corner with them; or algebraically f(0,0) + f(1,1) = f(0,1) + f(1,0) = w1 + w2 + 2c, so both A values cannot be positive while both B values are negative. A drawing described in words is accepted.",
            "1 pt — one fix: add the feature x1·x2 (then f = x1 + x2 − 2·x1·x2 − 0.5 separates them), or a non-linear model (a neural network with a hidden layer and ReLU, kNN).",
          ],
          `No. For two classes a linear classifier decides by the sign of f(x) = w·x + c, so the **decision boundary is a straight line**.
Drawing in words: the four corners of a unit square; A on one diagonal, (0, 0) and (1, 1), B on the other, (0, 1) and (1, 0). A line that puts both A corners on one side always leaves at least one B corner on the same side. Algebraically, for any w and c:
= f(0, 0) + f(1, 1) = c + (w1 + w2 + c) = w1 + w2 + 2c = f(0, 1) + f(1, 0)
so the two A values cannot both be positive while the two B values are both negative.
**Fix:** add the feature x3 = x1·x2 — then f = x1 + x2 − 2·x3 − 0.5 gives −0.5 for both A points and +0.5 for both B points, a linear rule in the new features. Or use a non-linear model: a neural network with a hidden layer and ReLU, or kNN.`,
          `Нет. Для двух классов линейный классификатор решает по знаку f(x) = w·x + c, поэтому **граница решения — прямая**.
Рисунок словами: четыре угла единичного квадрата; A на одной диагонали, (0, 0) и (1, 1), B — на другой, (0, 1) и (1, 0). Прямая, оставляющая оба угла A с одной стороны, всегда оставляет с ними хотя бы один угол B. Алгебраически, для любых w и c:
= f(0, 0) + f(1, 1) = c + (w1 + w2 + c) = w1 + w2 + 2c = f(0, 1) + f(1, 0)
поэтому оба значения на A не могут быть положительными, когда оба значения на B отрицательные.
**Решение:** добавить признак x3 = x1·x2 — тогда f = x1 + x2 − 2·x3 − 0.5 даёт −0.5 на обеих точках A и +0.5 на обеих точках B: правило линейно в новых признаках. Или взять нелинейную модель: нейросеть со скрытым слоем и ReLU или kNN.`,
        ),
      ],
    ),
    question(
      "v5-q4",
      "Question 4 — Understand the CV Pipeline",
      20,
      `A student measures how many edges there are in one parking spot. The frame comes from the newer camera, 2560 pixels wide and 1440 pixels high:
= img = cv2.imread("lot_cam1.jpg")
= img = cv2.resize(img, (640, 360))
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
= edges = cv2.Canny(blur, 50, 150)
= ratio = cv2.countNonZero(edges[200:280, 300:420]) / (80 * 120)`,
      [
        task(
          "v5-q4-a",
          "a",
          5,
          `Write the shape of img after line 2 and the shape of the region edges[200:280, 300:420] used in line 6.`,
          [
            "3 pts — img after line 2: (360, 640, 3), because dsize (640, 360) is (width, height). (640, 360, 3) gets 0; the correct shape without the 3 channels gets 2.",
            "2 pts — the region: (80, 120) — slicing is [rows, columns]: 280 − 200 = 80 rows, 300 to 420 = 120 columns; one channel, 80 · 120 = 9 600 pixels (the denominator in line 6). (120, 80) gets 0.",
          ],
          `= line 1: img.shape = (1440, 2560, 3)   # (height, width, channels)
= line 2: img.shape = (360, 640, 3)     # dsize (640, 360) means width 640, height 360
= edges[200:280, 300:420].shape = (80, 120)   # rows 200..279, columns 300..419
cv2.resize takes (width, height), shapes list the height first, and slicing is [rows, columns]. The region has one channel and 80 · 120 = 9 600 pixels — exactly the denominator in line 6. The aspect ratio 640 / 360 = 2560 / 1440 = 16 : 9 is kept.`,
          `= line 1: img.shape = (1440, 2560, 3)   # (height, width, channels)
= line 2: img.shape = (360, 640, 3)     # dsize (640, 360) means width 640, height 360
= edges[200:280, 300:420].shape = (80, 120)   # rows 200..279, columns 300..419
cv2.resize принимает (width, height), в форме сначала идёт высота, а срез — [строки, столбцы]. В области один канал и 80 · 120 = 9 600 пикселей — ровно знаменатель в строке 6. Пропорции 640 / 360 = 2560 / 1440 = 16 : 9 сохраняются.`,
        ),
        task(
          "v5-q4-b",
          "b",
          5,
          `How many channels does gray have after line 3? What values can the pixels of edges take, and in what range does ratio lie?`,
          [
            "2 pts — BGR2GRAY turns 3 channels into 1; gray.shape = (360, 640).",
            "1 pt — each gray value is a weighted brightness of B, G, R (0.299 R + 0.587 G + 0.114 B), 0–255.",
            "1 pt — edges: one channel, same size (360, 640), values only 0 or 255 (255 on edge pixels).",
            "1 pt — ratio is the fraction of edge pixels in the spot: countNonZero counts the 255 pixels, divided by 9 600 → a number between 0 and 1.",
          ],
          `- BGR2GRAY turns **3 channels into 1**: each pixel becomes a brightness 0–255, Gray = 0.299 R + 0.587 G + 0.114 B.
= gray.shape = (360, 640)
= edges.shape = (360, 640)    # one channel; values 0 or 255
- countNonZero counts the edge pixels (255) in the spot, and dividing by 9 600 gives the **fraction of edge pixels**, so ratio lies between **0 and 1** (0 = no edges at all, 1 = every pixel is an edge).`,
          `- BGR2GRAY превращает **3 канала в 1**: каждый пиксель — яркость 0–255, Gray = 0.299 R + 0.587 G + 0.114 B.
= gray.shape = (360, 640)
= edges.shape = (360, 640)    # one channel; values 0 or 255
- countNonZero считает пиксели-границы (255) в месте, а деление на 9 600 даёт **долю пикселей-границ**, поэтому ratio лежит **от 0 до 1** (0 — границ нет совсем, 1 — каждый пиксель граница).`,
        ),
        task(
          "v5-q4-c",
          "c",
          5,
          `Explain what line 6 measures and why this value can help to tell a Free spot from an Occupied one.`,
          [
            "2 pts — what it measures: the edge density of one spot — the share of Canny edge pixels inside the spot's 80 × 120 region.",
            "2 pts — why it helps: a car has many contours (body, windows, wheels, mirrors) → high density; empty asphalt is smooth, with only the painted lines → low density; a threshold between them (learned on validation data) separates the two.",
            "1 pt — a remark: the density is normalized by the region size, so spots or frames can be compared; or the Gaussian blur before Canny keeps noise from raising the density of an empty spot.",
          ],
          `- **What it measures:** the **edge density** of one spot — how many of its 80 × 120 = 9 600 pixels are Canny edges, as a fraction.
- **Why it helps:** a car has many contours — the outline of the body, windows, wheels, mirrors — so an occupied spot gives a high density (for example 1 450 / 9 600 ≈ 0.15). Empty asphalt is smooth, with only the painted lines, so a free spot gives a low one (for example 190 / 9 600 ≈ 0.02). A threshold between the two, chosen on validation data, separates Free from Occupied.
- Dividing by the region size makes the value comparable between spots; the Gaussian blur before Canny keeps noise from creating false edges that would raise the density of an empty spot.`,
          `- **Что измеряет:** **плотность границ** в одном месте — какая доля из его 80 × 120 = 9 600 пикселей приходится на границы Canny.
- **Почему помогает:** у машины много контуров — очертания кузова, окна, колёса, зеркала, — поэтому занятое место даёт высокую плотность (например, 1 450 / 9 600 ≈ 0.15). Пустой асфальт гладкий, на нём только разметка, поэтому свободное место даёт низкую (например, 190 / 9 600 ≈ 0.02). Порог между ними, выбранный на валидационных данных, отделяет Free от Occupied.
- Деление на размер области делает значение сравнимым для разных мест; гауссово размытие перед Canny не даёт шуму создавать ложные границы, которые подняли бы плотность у пустого места.`,
        ),
        task(
          "v5-q4-d",
          "d",
          5,
          `Would you decide between Free, Occupied and Blocked using this edge ratio alone? Explain your decision, considering snow and the moving tree shadows.`,
          [
            "1 pt — No, not the edge ratio alone.",
            "2 pts — snow: a spot covered with snow (Blocked) is smooth and white → few edges, a low ratio like a Free spot, so edges cannot separate Blocked from Free; brightness/colour (white snow: high V, low S) is needed.",
            "1 pt — shadows: the border of a tree shadow or a dark night frame creates or hides edges, so the ratio of a free spot can rise (false Occupied) or a car's ratio can drop.",
            "1 pt — a better design: combine edge features with colour/brightness features (gray or HSV statistics) or train a classifier on the whole colour patch, with photos from all seasons and times of day.",
          ],
          `No. The edge ratio separates "smooth" from "busy" spots, but that is not the same as Free vs Occupied vs Blocked.
- **Snow:** a spot covered with snow is **Blocked**, but snow is smooth and white, so it has few edges and a low ratio — just like a **Free** spot. The difference is in **brightness and colour** (snow is very bright with low saturation), which the edge map has thrown away.
- **Shadows and night:** the sharp border of a tree shadow adds edges to an empty spot (a false Occupied), while in a dark night frame a car's contours are weak and its ratio drops.
- **Better:** combine the edge ratio with colour and brightness features (mean gray, HSV statistics) or train a classifier on the whole colour patch, using photos from all seasons and times of day.`,
          `Нет. Доля границ отделяет «гладкие» места от «пёстрых», но это не то же самое, что Free / Occupied / Blocked.
- **Снег:** место под снегом — **Blocked**, но снег гладкий и белый, границ мало, доля низкая — как у **Free**. Разница — в **яркости и цвете** (снег очень яркий и малонасыщенный), а карта границ это выбросила.
- **Тени и ночь:** резкий край тени дерева добавляет границы пустому месту (ложный Occupied), а на тёмном ночном кадре контуры машины слабые, и её доля падает.
- **Лучше:** объединить долю границ с признаками цвета и яркости (средний серый, статистики HSV) или обучать классификатор на всём цветном патче, на снимках за все сезоны и время суток.`,
        ),
      ],
    ),
    question(
      "v5-q5",
      "Question 5 — Design Your Own CV System",
      15,
      `A bookkeeping app sorts the photos that users take of their documents into Receipt | Invoice | ID card | Handwritten note. You have 2 800 labelled photos: 1 000 receipts, 800 invoices, 700 handwritten notes and 300 ID cards.`,
      [
        task(
          "v5-q5-a",
          "a",
          3,
          `How would you organize the dataset?`,
          [
            "1 pt — one folder (or label) per class (receipt, invoice, id_card, note) inside separate train / validation / test parts.",
            "1 pt — the split is fixed before training and never mixed; duplicates removed, and several photos of the same document kept in one part.",
            "1 pt — privacy: ID cards and invoices contain personal data — secure storage, restricted access, users' consent, masking data that is not needed.",
          ],
          `- One folder (label) per class inside separate train / val / test folders:
= data/train/receipt/, data/train/invoice/, data/train/id_card/, data/train/note/
= data/val/... and data/test/... with the same four class folders
- Fix the split **before** training and never mix the parts; remove duplicates, and keep several photos of the same document in the **same** part so that near-duplicates do not leak into the test set.
- ID cards and invoices contain **personal data**: store the dataset securely, restrict access, use only photos with the users' consent, and mask data the classifier does not need.`,
          `- Одна папка (метка) на класс внутри отдельных папок train / val / test:
= data/train/receipt/, data/train/invoice/, data/train/id_card/, data/train/note/
= data/val/... and data/test/... with the same four class folders
- Разбиение фиксируем **до** обучения и никогда не смешиваем части; убираем дубликаты, а несколько снимков одного документа кладём в **одну** часть, чтобы почти одинаковые снимки не «протекли» в тест.
- В удостоверениях и счетах-фактурах есть **персональные данные**: датасет храним защищённо, доступ ограничиваем, берём только снимки с согласия пользователей и маскируем данные, которые классификатору не нужны.`,
        ),
        task(
          "v5-q5-b",
          "b",
          3,
          `Propose a train/validation/test split and calculate the number of images of each class in each part.`,
          [
            "1 pt — a stratified split (every class split in the same proportions) with a validation part, e.g. 70 / 15 / 15 or 80 / 10 / 10.",
            "1 pt — correct per-class counts, e.g. 70 / 15 / 15: Receipt 700 / 150 / 150, Invoice 560 / 120 / 120, Handwritten note 490 / 105 / 105, ID card 210 / 45 / 45 (80 / 10 / 10: 800 / 100 / 100, 640 / 80 / 80, 560 / 70 / 70, 240 / 30 / 30).",
            "1 pt — correct totals that add up to 2 800 (1 960 / 420 / 420 or 2 240 / 280 / 280) and the role of each part (train fits, validation tunes, test once at the end).",
          ],
          `A **stratified** 70 / 15 / 15 split — every class keeps its share in every part:
| Class | Total | Train (70%) | Validation (15%) | Test (15%) |
|---|---|---|---|---|
| Receipt | 1 000 | 700 | 150 | 150 |
| Invoice | 800 | 560 | 120 | 120 |
| Handwritten note | 700 | 490 | 105 | 105 |
| ID card | 300 | 210 | 45 | 45 |
| All | 2 800 | 1 960 | 420 | 420 |
Train fits the model, validation chooses hyperparameters, the test set is used once at the end. (80 / 10 / 10 is also fine: 2 240 / 280 / 280.)`,
          `**Стратифицированное** разбиение 70 / 15 / 15 — у каждого класса в каждой части та же доля:
| Класс | Всего | Train (70%) | Validation (15%) | Test (15%) |
|---|---|---|---|---|
| Receipt | 1 000 | 700 | 150 | 150 |
| Invoice | 800 | 560 | 120 | 120 |
| Handwritten note | 700 | 490 | 105 | 105 |
| ID card | 300 | 210 | 45 | 45 |
| Все | 2 800 | 1 960 | 420 | 420 |
На train обучаем, на validation подбираем гиперпараметры, test используем один раз в конце. (Подходит и 80 / 10 / 10: 2 240 / 280 / 280.)`,
        ),
        task(
          "v5-q5-c",
          "c",
          3,
          `Give two preprocessing or augmentation operations you would use. Explain each one in terms of these photos.`,
          [
            "1.5 pts — first operation (0.5) with a reason tied to document photos (1). Acceptable: detect the document and correct the perspective (photos taken at an angle); resize while keeping the aspect ratio, with padding (receipts are long and narrow); grayscale plus contrast normalization, CLAHE or adaptive thresholding (shadows, uneven light); augmentation with small rotations, perspective changes, brightness changes and slight blur.",
            "1.5 pts — a second, different operation (0.5) with a reason (1). Horizontal or vertical flips get 0 — mirrored text never occurs in real photos.",
          ],
          `- **Detect the document, correct the perspective, then resize with padding:** users photograph documents at an angle and on different backgrounds; a top-down, cropped document makes the classes comparable. Keep the aspect ratio and pad to the input size — a long, narrow receipt squeezed into a square loses its most typical shape.
- **Augment with small rotations (±10°), perspective changes, brightness changes and slight blur:** this mimics real phone photos — tilted shots, shadows, dim light, shaky hands. Mirror flips are not used: mirrored text never appears in real photos.`,
          `- **Найти документ, исправить перспективу, затем resize с дополнением полями (padding):** пользователи снимают документы под углом и на разном фоне; вырезанный документ в виде сверху делает классы сопоставимыми. Пропорции сохраняем и дополняем полями до размера входа — длинный узкий чек, сжатый в квадрат, теряет свою самую характерную форму.
- **Аугментация небольшими поворотами (±10°), изменениями перспективы, яркости и лёгким размытием:** так имитируются настоящие фото с телефона — наклон, тени, тусклый свет, дрожащие руки. Зеркальные отражения не используем: зеркального текста на реальных снимках не бывает.`,
        ),
        task(
          "v5-q5-d",
          "d",
          3,
          `What metric would you use to evaluate your classifier? Explain why.`,
          [
            "1 pt — a suitable metric: per-class recall and precision or macro-F1 (accuracy alongside them is fine).",
            "1 pt — why, with the class counts: ID cards are only 300 / 2 800 ≈ 11%, so accuracy can stay high while ID cards are often missed (e.g. all 45 test ID cards wrong, everything else right → 375 / 420 ≈ 89%).",
            "1 pt — a confusion matrix to see which classes are mixed up (e.g. receipt vs invoice).",
          ],
          `I would report **accuracy together with per-class recall and precision (macro-F1)**. The classes are not balanced: ID cards are only 300 / 2 800 ≈ 11%. If the model got all 45 test ID cards wrong and everything else right, accuracy would still be (420 − 45) / 420 = 375 / 420 ≈ 89%, while recall(ID card) would be 0. Macro-F1 gives every class the same weight.
A **confusion matrix** shows which classes are mixed up — most likely receipts and invoices, which both contain printed tables of amounts.`,
          `Я бы считал **accuracy вместе с recall и precision по классам (macro-F1)**. Классы не сбалансированы: удостоверений всего 300 / 2 800 ≈ 11%. Если модель ошибётся на всех 45 удостоверениях из теста, а всё остальное угадает, accuracy всё равно будет (420 − 45) / 420 = 375 / 420 ≈ 89%, а recall(ID card) = 0. Macro-F1 даёт каждому классу одинаковый вес.
**Матрица ошибок** покажет, какие классы путаются, — скорее всего, чеки и счета-фактуры: в обоих есть напечатанные таблицы сумм.`,
        ),
        task(
          "v5-q5-e",
          "e",
          3,
          `Your model reaches 95% test accuracy. Most training and test photos were taken by your team on a white desk under office light. In the released app, many receipts photographed on dark café tables at an angle are classified as Handwritten note. Give one likely reason and one fix.`,
          [
            "2 pts — reason: domain shift — the training data had flat documents on a white desk in office light; dark backgrounds, perspective and dim light were never seen, and the model may rely on background and global brightness; the test set came from the same setup, so 95% could not reveal it.",
            "1 pt — fix: collect and label real user photos (different backgrounds, angles, light) and fine-tune/retrain; augment backgrounds, perspective and brightness; detect and rectify the document before classification.",
          ],
          `- **Reason:** **domain shift**. The model learned from flat documents on a white desk in office light; dark tables, tilted shots and dim café light never appeared in training, and the model may partly rely on the background and the global brightness instead of the document itself. The test set came from the same setup, so 95% could not reveal this.
- **Fix:** collect and label real photos from users — different backgrounds, angles and light — and fine-tune or retrain; augment backgrounds, perspective and brightness; detect and rectify the document before classifying it, so the background no longer matters.`,
          `- **Причина:** **сдвиг домена (domain shift)**. Модель училась на ровно лежащих документах на белом столе при офисном свете; тёмных столов, снимков под углом и тусклого света кафе в обучении не было, и модель может частично опираться на фон и общую яркость, а не на сам документ. Тестовая выборка была из той же обстановки, поэтому 95% этого показать не могли.
- **Решение:** собрать и разметить настоящие снимки пользователей — с разным фоном, углом и светом — и дообучить или переобучить модель; аугментировать фон, перспективу и яркость; перед классификацией находить и выпрямлять документ, чтобы фон перестал влиять.`,
        ),
      ],
    ),
  ],
};

// ---------------------------------------------------------------------------
// Variant 6 — fruit ripeness (Q1–Q4) and tile defects (Q5); the hardest one
// ---------------------------------------------------------------------------

const v6: MockExam = {
  id: "v6",
  title: { en: "Variant 6 — fruit ripeness and tile defects (hardest)", ru: "Вариант 6 — спелость фруктов и дефекты плитки (самый сложный)" },
  minutes: 120,
  source: NEW,
  questions: [
    question(
      "v6-q1",
      "Question 1 — Image Processing & OpenCV",
      20,
      `A start-up builds an app that tells buyers at a city market whether tomatoes and bananas are unripe, ripe or overripe. Photos come from many different phones. Some market rows are lit by warm yellow lamps and others by cold white LEDs, fruit is often photographed through glossy plastic bags that create bright reflections, and the fruit fills only part of the frame.`,
      [
        task(
          "v6-q1-a",
          "a",
          6,
          `Propose three preprocessing operations that could be useful. For each operation, explain why you would use it.`,
          [
            "2 pts — first operation (1 pt) with a reason tied to the market photos (1 pt). Acceptable: white balance / colour constancy (warm vs cold lamps change the apparent colour, and ripeness is colour); crop or segment the fruit (background colours distort colour features); resize to one size (different phones); convert to HSV or Lab (separate colour from brightness and shadows); mask or suppress saturated reflections from the bags; mild denoising with a small Gaussian or median kernel (JPEG noise); scaling to [0, 1] or standardization.",
            "2 pts — a second, different operation (1 pt) with a scenario-specific reason (1 pt).",
            "2 pts — a third, different operation (1 pt) with a reason (1 pt). 0 for the operation: converting to grayscale (destroys the ripeness colour) or equalizing B, G, R separately (shifts the hues). A generic reason ('makes the image better') gets 0 for the reason.",
          ],
          `- **White balance / colour constancy** (e.g. the gray-world method: scale B, G and R so that their averages are equal): warm and cold lamps change the apparent colour, and ripeness is judged by colour — without it a green tomato under a yellow lamp can look ripe.
- **Crop or segment the fruit, then resize** to one size (e.g. 224 × 224): the fruit fills only part of the frame, and background pixels (stall, bags, hands) would distort the colour statistics; different phones give different resolutions.
- **Convert to HSV (or Lab):** hue separates the colour from the brightness, so shadows and brighter or darker lamps change V much more than H.
Also accepted: masking saturated highlights from the plastic bags (pixels near 255); mild denoising (Gaussian 3 × 3) against JPEG noise; scaling to [0, 1]. **Not** good here: grayscale (removes the ripeness colour) and equalizing B, G, R separately (shifts the colours).`,
          `- **Баланс белого / цветовое постоянство** (например, метод gray world: масштабировать B, G и R так, чтобы их средние совпали): тёплые и холодные лампы меняют видимый цвет, а спелость определяется по цвету — без этого зелёный помидор под жёлтой лампой может выглядеть спелым.
- **Вырезать или сегментировать фрукт, затем resize** к одному размеру (например, 224 × 224): фрукт занимает лишь часть кадра, а пиксели фона (прилавок, пакеты, руки) исказят цветовую статистику; разные телефоны дают разное разрешение.
- **Перевести в HSV (или Lab):** hue отделяет цвет от яркости, поэтому тени и более яркие или тусклые лампы меняют V намного сильнее, чем H.
Тоже засчитывается: маскирование пересвеченных бликов от пакетов (пиксели около 255); лёгкое шумоподавление (Gaussian 3 × 3) против шума JPEG; масштабирование в [0, 1]. **Не** подходит здесь: оттенки серого (убирают цвет спелости) и выравнивание B, G, R по отдельности (сдвигает цвета).`,
        ),
        task(
          "v6-q1-b",
          "b",
          4,
          `The student converts every photo to HSV and keeps only the H (hue) channel as the classifier input. Give one advantage and one disadvantage of doing this for ripeness classification.`,
          [
            "2 pts — one valid advantage: hue separates the colour type from brightness, so shadows and lamp intensity change mostly V, not H; ripening is mainly a hue change (green → yellow/red); one channel instead of three. Only 'faster' without the colour argument gets 1.",
            "2 pts — one valid disadvantage tied to ripeness: S and V are thrown away, so the dark brown spots and dull colour of overripe fruit (low V, low S) are lost; or hue is unstable on dark, unsaturated or glare pixels; or red wraps around (0 and 179 are both red in OpenCV); or hue does not remove a coloured lamp cast. 'Loses information' without saying which gets 1.",
          ],
          `- **Advantage:** hue describes the colour type and is largely independent of brightness, so shadows and brighter or darker lamps change mostly V, not H. Ripening is mainly a hue change (green → yellow or red), so one channel keeps the main cue and makes the input 3 times smaller.
- **Disadvantage:** S and V are thrown away, but an **overripe** fruit is recognised by **dark brown spots** and a dull colour — mostly low V and low S — so Ripe and Overripe become hard to separate. Hue is also unreliable on dark, unsaturated or glare pixels (noisy or meaningless when S ≈ 0), and red wraps around: in 8-bit OpenCV H is 0–179, and a red tomato has hues near both 0 and 179.`,
          `- **Плюс:** hue описывает тип цвета и почти не зависит от яркости, поэтому тени и более яркие или тусклые лампы меняют в основном V, а не H. Созревание — это в основном смена оттенка (зелёный → жёлтый или красный), так что один канал сохраняет главный признак и делает вход втрое меньше.
- **Минус:** S и V выброшены, а **перезрелый** фрукт узнаётся по **тёмно-коричневым пятнам** и тусклому цвету — это в основном низкие V и S, — поэтому Ripe и Overripe становится трудно различить. К тому же hue ненадёжен на тёмных, ненасыщенных и бликующих пикселях (при S ≈ 0 он шумный или бессмысленный), а красный «заворачивается»: в 8-битном OpenCV H от 0 до 179, и у красного помидора оттенки и около 0, и около 179.`,
        ),
        task(
          "v6-q1-c",
          "c",
          5,
          `The model expects HSV images 128 pixels wide and 96 pixels high. Consider the following code. Identify two problems, say for each one whether the program crashes or runs silently, and provide the corrected code.
= img = cv2.imread("tomato_017.jpg")
= small = cv2.resize(img, (96, 128))
= hsv = cv2.cvtColor(small, cv2.COLOR_RGB2HSV)`,
          [
            "2 pts — line 2: dsize is (width, height), so (96, 128) gives 96 wide × 128 high, shape (128, 96, 3) instead of (96, 128, 3); fix cv2.resize(img, (128, 96)).",
            "2 pts — line 3: imread returns BGR, so COLOR_RGB2HSV swaps R and B (a red tomato gets a blue hue, H ≈ 120 instead of ≈ 0); fix cv2.COLOR_BGR2HSV. Claiming that imread returns RGB loses these points.",
            "1 pt — states that both problems run silently (no error, wrong result) and gives the complete corrected code. Saying that either line crashes loses this point.",
          ],
          `- **Problem 1 (line 2):** cv2.resize takes dsize as **(width, height)**. (96, 128) gives an image 96 wide and 128 high, shape (128, 96, 3), instead of 128 wide and 96 high, shape (96, 128, 3). It runs **silently** — no error, just the wrong size, and the fruit is squeezed in the wrong direction.
- **Problem 2 (line 3):** imread returns **BGR**, so the code must be **COLOR_BGR2HSV**. COLOR_RGB2HSV runs **silently** but swaps R and B: a pure red pixel gets H = 120 (blue) instead of H = 0, and a ripe tomato pixel (B, G, R) = (40, 50, 200) gets H ≈ 118 instead of ≈ 2 — the ripeness colour is wrong.
Corrected code:
= img = cv2.imread("tomato_017.jpg")
= small = cv2.resize(img, (128, 96))
= hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)`,
          `- **Ошибка 1 (строка 2):** cv2.resize принимает dsize как **(width, height)**. (96, 128) даёт картинку шириной 96 и высотой 128, форма (128, 96, 3), а нужна ширина 128 и высота 96, форма (96, 128, 3). Код работает **молча** — ошибки нет, просто неверный размер, и фрукт сжат не в ту сторону.
- **Ошибка 2 (строка 3):** imread возвращает **BGR**, значит, нужен **COLOR_BGR2HSV**. COLOR_RGB2HSV работает **молча**, но меняет местами R и B: чисто красный пиксель получает H = 120 (синий) вместо H = 0, а пиксель спелого помидора (B, G, R) = (40, 50, 200) — H ≈ 118 вместо ≈ 2. Цвет спелости неверный.
Исправленный код:
= img = cv2.imread("tomato_017.jpg")
= small = cv2.resize(img, (128, 96))
= hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)`,
        ),
        task(
          "v6-q1-d",
          "d",
          5,
          `A student says: "Histogram equalization always makes photos better, so I will apply cv2.equalizeHist to each of the B, G and R channels of every fruit photo." Do you agree? Explain using one example.`,
          [
            "1 pt — disagrees: equalization is not always an improvement.",
            "2 pts — mechanism: equalizing B, G and R separately changes the ratios between the channels, so the hue changes (1 pt), and ripeness is judged by hue, so the label information is distorted (1 pt). Noise amplification in flat areas may replace one of these points.",
            "2 pts — a concrete example (1 pt), e.g. a yellow banana under a warm lamp whose low B channel is stretched turns grayish and may be predicted Unripe, or a well-exposed photo gets unnatural contrast; and a better alternative (1 pt): white balance, or equalization/CLAHE of the brightness channel only (V of HSV or L of Lab).",
          ],
          `No. Histogram equalization is not always an improvement, and equalizing **each colour channel separately** is especially harmful for a colour task.
- **Mechanism:** every channel gets its own remapping, so the **ratios between B, G and R change** — the hue changes. Ripeness is judged by hue, so the label information itself is distorted. Equalization also amplifies noise and JPEG artefacts in flat areas, and a well-exposed photo has nothing to fix.
- **Example:** a close-up of a ripe banana under a warm lamp has (B, G, R) ≈ (40, 180, 220): B is squeezed into low values. Equalizing each channel stretches all three over 0–255, so the average colour moves to about (128, 128, 128) — the yellow banana turns grayish with random colour noise and can be predicted Unripe or Overripe.
- **Better:** white balance, or equalize (or CLAHE) only the brightness channel — V of HSV or L of Lab — which leaves the hue alone.`,
          `Нет. Выравнивание гистограммы улучшает снимок не всегда, а выравнивание **каждого цветового канала по отдельности** особенно вредно в задаче, где важен цвет.
- **Механизм:** каждый канал преобразуется своей функцией, поэтому **соотношения между B, G и R меняются** — меняется оттенок. Спелость определяют по оттенку, значит, искажается сама информация о метке. Кроме того, выравнивание усиливает шум и артефакты JPEG на однородных участках, а хорошо экспонированному снимку исправлять нечего.
- **Пример:** крупный план спелого банана под тёплой лампой: (B, G, R) ≈ (40, 180, 220), канал B сжат в низких значениях. Выравнивание каждого канала растягивает все три на 0–255, и средний цвет уходит примерно к (128, 128, 128) — жёлтый банан становится сероватым со случайным цветным шумом, и модель может назвать его Unripe или Overripe.
- **Лучше:** баланс белого или выравнивание (или CLAHE) только канала яркости — V в HSV или L в Lab, — которое не трогает оттенок.`,
        ),
      ],
    ),
    question(
      "v6-q2",
      "Question 2 — Image Classification",
      20,
      `The ripeness classifier produces the following scores:
| Image | Unripe | Ripe | Overripe | True class |
|---|---|---|---|---|
| A | 0.5 | 2.2 | 1.9 | Ripe |
| B | -0.3 | -1.4 | -2.0 | Unripe |
| C | -1.1 | 1.6 | 1.2 | Overripe |
| D | 1.3 | 0.9 | -0.7 | Ripe |
| E | -2.5 | 0.4 | 3.0 | Overripe |`,
      [
        task(
          "v6-q2-a",
          "a",
          4,
          `Write the predicted class for A, B, C, D and E.`,
          [
            "1 pt — A: Ripe (2.2 > 1.9) and E: Overripe (3.0).",
            "1 pt — B: Unripe (−0.3 is the largest of −0.3, −1.4, −2.0). 'No prediction because all scores are negative' or 'Overripe because |−2.0| is the largest' gets 0.",
            "1 pt — C: Ripe (1.6 > 1.2).",
            "1 pt — D: Unripe (1.3 > 0.9).",
          ],
          `The predicted class is the argmax of the scores — negative scores are compared in the same way:
| Image | Highest score | Predicted |
|---|---|---|
| A | Ripe 2.2 (> Overripe 1.9) | Ripe |
| B | Unripe -0.3 (> -1.4 > -2.0) | Unripe |
| C | Ripe 1.6 (> Overripe 1.2) | Ripe |
| D | Unripe 1.3 (> Ripe 0.9) | Unripe |
| E | Overripe 3.0 | Overripe |
For B all scores are negative, but −0.3 is still the largest, so B is predicted Unripe.`,
          `Предсказанный класс — argmax оценок; отрицательные оценки сравниваются так же:
| Image | Наибольшая оценка | Предсказание |
|---|---|---|
| A | Ripe 2.2 (> Overripe 1.9) | Ripe |
| B | Unripe -0.3 (> -1.4 > -2.0) | Unripe |
| C | Ripe 1.6 (> Overripe 1.2) | Ripe |
| D | Unripe 1.3 (> Ripe 0.9) | Unripe |
| E | Overripe 3.0 | Overripe |
У B все оценки отрицательные, но −0.3 всё равно наибольшая, поэтому B предсказан как Unripe.`,
        ),
        task(
          "v6-q2-b",
          "b",
          4,
          `Calculate the classification accuracy. Show your calculation.`,
          [
            "2 pts — compares each prediction with the true class: A, B, E correct; C, D wrong (3 correct). If the predictions from a) were wrong, a count consistent with them earns these points.",
            "2 pts — accuracy = correct / total = 3 / 5 = 0.6 = 60%, with the calculation shown; only '60%' without the calculation gets 1.",
          ],
          `= correct: A (Ripe = Ripe), B (Unripe = Unripe), E (Overripe = Overripe); wrong: C, D
= accuracy = correct / total = 3 / 5 = 0.6 = 60%`,
          `= correct: A (Ripe = Ripe), B (Unripe = Unripe), E (Overripe = Overripe); wrong: C, D
= accuracy = correct / total = 3 / 5 = 0.6 = 60%
Верно классифицированы A, B, E, ошибки на C и D: точность 3 из 5 = 60%.`,
        ),
        task(
          "v6-q2-c",
          "c",
          4,
          `Which images were incorrectly classified? For each one, give the true class, the predicted class and by how much the predicted class's score beats the true class's score.`,
          [
            "2 pts — C: true Overripe, predicted Ripe, 1.6 − 1.2 = 0.4.",
            "2 pts — D: true Ripe, predicted Unripe, 1.3 − 0.9 = 0.4. Naming A or B as misclassified loses 1 point each (within this task's points).",
          ],
          `| Image | True | Predicted | Predicted score − true score |
|---|---|---|---|
| C | Overripe | Ripe | 1.6 − 1.2 = 0.4 |
| D | Ripe | Unripe | 1.3 − 0.9 = 0.4 |
Both mistakes are one ripeness step off, and in both cases the true class has the second-highest score. A is correct although its margin is small (2.2 − 1.9 = 0.3), and B is correct although all its scores are negative.`,
          `| Image | Истинный | Предсказанный | Оценка предсказанного − оценка истинного |
|---|---|---|---|
| C | Overripe | Ripe | 1.6 − 1.2 = 0.4 |
| D | Ripe | Unripe | 1.3 − 0.9 = 0.4 |
Обе ошибки — на одну ступень спелости, и в обоих случаях у истинного класса вторая по величине оценка. A классифицирован верно, хотя разрыв мал (2.2 − 1.9 = 0.3), а B — верно, хотя все его оценки отрицательные.`,
        ),
        task(
          "v6-q2-d",
          "d",
          4,
          `The softmax probabilities of image A are [0.095, 0.520, 0.385]. (i) A teammate adds 3 to all three scores of A. (ii) Another teammate multiplies all three scores of A by 2. In each case, does the predicted class change? Do the probabilities change? Explain.`,
          [
            "1 pt — (i) the prediction stays Ripe: adding a constant keeps the order.",
            "1 pt — (i) the probabilities do not change: e^(s + 3) = e^3 · e^s, and the common factor e^3 cancels in the normalization (softmax depends only on score differences).",
            "1 pt — (ii) the prediction stays Ripe: multiplying by a positive number keeps the order.",
            "1 pt — (ii) the probabilities change and become more peaked (Ripe ≈ 0.63, Unripe ≈ 0.02, Overripe ≈ 0.35); the exact values are not required, the direction 'more confident' is.",
          ],
          `- **(i) +3 to every score:** the order does not change, so the **prediction stays Ripe**, and the **probabilities do not change either**: softmax uses e^(s + 3) = e^3 · e^s, and the common factor e^3 cancels in the normalization. Softmax depends only on the differences between the scores.
- **(ii) ×2:** multiplying by a positive number keeps the order, so the **prediction stays Ripe**, but all differences double, so the **probabilities change** — they become more peaked:
= softmax([1.0, 4.4, 3.8]) ≈ [0.021, 0.632, 0.347]   (before: [0.095, 0.520, 0.385])
- Lesson: a score (logit) is an unbounded number whose argmax gives the class; a softmax probability also depends on the scale of the scores, so "52% sure" is not a calibrated confidence by itself.`,
          `- **(i) +3 к каждой оценке:** порядок не меняется, поэтому **предсказание остаётся Ripe**, и **вероятности тоже не меняются**: softmax берёт e^(s + 3) = e^3 · e^s, и общий множитель e^3 сокращается при нормировке. Softmax зависит только от разностей оценок.
- **(ii) ×2:** умножение на положительное число сохраняет порядок, поэтому **предсказание остаётся Ripe**, но все разности удваиваются, и **вероятности меняются** — распределение становится острее:
= softmax([1.0, 4.4, 3.8]) ≈ [0.021, 0.632, 0.347]   (before: [0.095, 0.520, 0.385])
- Вывод: оценка (logit) — неограниченное число, argmax которого даёт класс; вероятность softmax зависит ещё и от масштаба оценок, поэтому «уверена на 52%» само по себе не откалиброванная уверенность.`,
        ),
        task(
          "v6-q2-e",
          "e",
          4,
          `Every fruit was photographed 5 times in a burst from slightly different angles: 3 000 photos of 600 fruits. The student shuffled all photos randomly and split them 80/20 into training and validation. Training accuracy is 99% and validation accuracy 98%, but on photos of new fruit taken a week later at the same market the accuracy is 71%. What is the likely problem? Give one possible solution.`,
          [
            "2 pts — diagnosis: data leakage — near-duplicate burst photos of the same fruit are in both training and validation, so the 98% validation accuracy rewards memorizing individual fruits and is not an honest estimate (overfitting hidden by the split). Only 'overfitting' without explaining why validation is also high gets 1; 'underfitting' gets 0.",
            "2 pts — fix: split by fruit (a group split: all 5 photos of one fruit in the same part, e.g. 480 / 120 fruits = 2 400 / 600 photos) or by day/vendor, then evaluate again. Generic overfitting fixes alone (dropout, L2, augmentation) without fixing the split get 0.5.",
          ],
          `**Data leakage through near-duplicates.** The 5 burst photos of one fruit are almost identical, and a random shuffle puts photos of the same fruit into both training and validation: for a validation photo, the chance that at least one of its 4 twins is in training is about 1 − 0.2^4 ≈ 99.8%. The model memorizes individual fruits, validation rewards that memorization, so 98% is not an honest estimate — new fruit shows the real level, 71%. It is overfitting hidden by a bad split.
**Fix:** split **by fruit** (a group split): all 5 photos of a fruit go to the same part — 480 fruits (2 400 photos) for training and 120 fruits (600 photos) for validation; better still, split by day or by vendor. Then tune again, adding regularization and augmentation if the gap stays large.`,
          `**Утечка данных через почти одинаковые снимки.** 5 снимков одной серии почти не отличаются, и случайное перемешивание кладёт фото одного и того же фрукта и в обучение, и в валидацию: для снимка из валидации вероятность, что хотя бы один из 4 его «двойников» попал в обучение, примерно 1 − 0.2^4 ≈ 99.8%. Модель запоминает конкретные фрукты, валидация за это «награждает», поэтому 98% — нечестная оценка; новые фрукты показывают реальный уровень, 71%. Это переобучение, скрытое плохим разбиением.
**Решение:** делить **по фруктам** (group split): все 5 снимков фрукта — в одну часть, 480 фруктов (2 400 снимков) в обучение и 120 фруктов (600 снимков) в валидацию; ещё лучше — по дням или по продавцам. Затем заново подобрать модель, добавив регуляризацию и аугментацию, если разрыв останется большим.`,
        ),
      ],
    ),
    question(
      "v6-q3",
      "Question 3 — Linear Classifier",
      25,
      `Consider a three-class linear classifier for the ripeness app: s = Wx + b, where x is a feature vector of one fruit photo.
= x = [3, -2, 1]T
= W = [[1, 2, -1], [2, 1, 0], [0, -1, 2]]
= b = [1, -1, 0]T
Classes: 0 = Unripe, 1 = Ripe, 2 = Overripe`,
      [
        task(
          "v6-q3-a",
          "a",
          12,
          `Calculate s = Wx + b. Show every step.`,
          [
            "3 pts — row 0 (Unripe): 1·3 + 2·(−2) + (−1)·1 = 3 − 4 − 1 = −2 (the final number without the products gets 1).",
            "3 pts — row 1 (Ripe): 2·3 + 1·(−2) + 0·1 = 6 − 2 + 0 = 4 (the final number without the products gets 1).",
            "3 pts — row 2 (Overripe): 0·3 + (−1)·(−2) + 2·1 = 0 + 2 + 2 = 4 (the final number without the products gets 1).",
            "3 pts — adds b element by element: s = [−2 + 1, 4 − 1, 4 + 0] = [−1, 3, 4]T. With an arithmetic slip earlier, a correct addition of b to the student's own Wx earns 2.",
          ],
          `Each score is the dot product of one row of W with x, plus the bias of that class.
= Wx[0] = 1·3 + 2·(−2) + (−1)·1 = 3 − 4 − 1 = −2
= Wx[1] = 2·3 + 1·(−2) + 0·1 = 6 − 2 + 0 = 4
= Wx[2] = 0·3 + (−1)·(−2) + 2·1 = 0 + 2 + 2 = 4
= Wx = [−2, 4, 4]T
= s = Wx + b = [−2 + 1, 4 + (−1), 4 + 0]T = [−1, 3, 4]T`,
          `Каждая оценка — скалярное произведение строки W на x плюс смещение своего класса.
= Wx[0] = 1·3 + 2·(−2) + (−1)·1 = 3 − 4 − 1 = −2
= Wx[1] = 2·3 + 1·(−2) + 0·1 = 6 − 2 + 0 = 4
= Wx[2] = 0·3 + (−1)·(−2) + 2·1 = 0 + 2 + 2 = 4
= Wx = [−2, 4, 4]T
= s = Wx + b = [−2 + 1, 4 + (−1), 4 + 0]T = [−1, 3, 4]T`,
        ),
        task(
          "v6-q3-b",
          "b",
          3,
          `What class does the classifier predict? Would the prediction be the same if b were [0, 0, 0]T?`,
          [
            "1.5 pts — class 2 = Overripe, because s[2] = 4 is the largest score. With a wrong s from part a, the argmax of the student's own s earns these points.",
            "1.5 pts — with b = 0 the scores are Wx = [−2, 4, 4]: Ripe and Overripe tie, so the prediction is undecided; the bias breaks the tie (b_Ripe = −1 lowers Ripe to 3). Answering 'yes, still Overripe' without noticing the tie gets 0.",
          ],
          `The largest score is s[2] = 4, so the classifier predicts **class 2 = Overripe**.
With b = [0, 0, 0]T the scores would be Wx = [−2, 4, 4]T: Ripe and Overripe **tie** at 4, and the prediction is undecided (an argmax function would simply return the first index, Ripe). Here the **bias breaks the tie**: b_Ripe = −1 lowers Ripe to 3, while Overripe stays at 4.`,
          `Наибольшая оценка — s[2] = 4, поэтому классификатор предсказывает **класс 2 = Overripe**.
При b = [0, 0, 0]T оценки были бы Wx = [−2, 4, 4]T: у Ripe и Overripe **ничья** (по 4), и предсказание не определено (функция argmax просто вернула бы первый индекс, Ripe). Здесь **ничью решает смещение**: b_Ripe = −1 опускает Ripe до 3, а Overripe остаётся 4.`,
        ),
        task(
          "v6-q3-c",
          "c",
          5,
          `The fruit is actually Ripe. (i) Compute the multiclass SVM (hinge) loss with margin 1. (ii) Keeping W and the other biases fixed, what is the smallest increase of b_1 (the Ripe bias) that makes the loss 0? (iii) What are the prediction and the loss if b_1 is increased by only 1.5?`,
          [
            "1 pt — Unripe term: max(0, −1 − 3 + 1) = max(0, −3) = 0.",
            "1 pt — Overripe term: max(0, 4 − 3 + 1) = 2, so L = 0 + 2 = 2.",
            "2 pts — the smallest increase is 2: the loss is 0 when s_Ripe ≥ s_Overripe + 1 = 5, so b_1 goes from −1 to 1 (s = [−1, 5, 4]). Answering 1 (only enough to win) gets 0.",
            "1 pt — with +1.5: s = [−1, 4.5, 4], the prediction becomes Ripe (correct), but L = max(0, 4 − 4.5 + 1) = 0.5 > 0 — a correct prediction alone does not make the hinge loss 0.",
          ],
          `(i)
= L = Σ_{j ≠ Ripe} max(0, s_j − s_Ripe + 1),   s_Ripe = 3
= Unripe:   max(0, −1 − 3 + 1) = max(0, −3) = 0
= Overripe: max(0, 4 − 3 + 1) = max(0, 2) = 2
= L = 0 + 2 = 2
(ii) The loss is 0 when s_Ripe ≥ s_Overripe + 1 = 5 (Unripe is already far below). s_Ripe = 3 + Δ, so the smallest Δ = 2: b_1 goes from −1 to **+1**, s = [−1, 5, 4], L = max(0, −1 − 5 + 1) + max(0, 4 − 5 + 1) = 0 + 0 = 0.
(iii) With Δ = 1.5: s = [−1, 4.5, 4]. The prediction becomes **Ripe** (correct), but L = max(0, 4 − 4.5 + 1) = **0.5 > 0**: winning is not enough for zero hinge loss — the correct class must win by the margin 1.`,
          `(i)
= L = Σ_{j ≠ Ripe} max(0, s_j − s_Ripe + 1),   s_Ripe = 3
= Unripe:   max(0, −1 − 3 + 1) = max(0, −3) = 0
= Overripe: max(0, 4 − 3 + 1) = max(0, 2) = 2
= L = 0 + 2 = 2
(ii) Потери равны 0, когда s_Ripe ≥ s_Overripe + 1 = 5 (Unripe и так далеко внизу). s_Ripe = 3 + Δ, значит, наименьшее Δ = 2: b_1 меняется с −1 на **+1**, s = [−1, 5, 4], L = max(0, −1 − 5 + 1) + max(0, 4 − 5 + 1) = 0 + 0 = 0.
(iii) При Δ = 1.5: s = [−1, 4.5, 4]. Предсказание становится **Ripe** (верно), но L = max(0, 4 − 4.5 + 1) = **0.5 > 0**: просто победить мало для нулевых hinge-потерь — правильный класс должен выиграть с отступом 1.`,
        ),
        task(
          "v6-q3-d",
          "d",
          5,
          `The app adds a second fruit, so Ripe now contains red tomatoes and yellow bananas. In a 2-D feature space the Ripe photos form two clusters around (-3, 0) and (3, 0), the Unripe photos one cluster around (0, 0), and the Overripe photos one cluster around (0, 3). Can a single linear classifier (one row of W per class) classify Ripe and Unripe correctly here? Explain, and propose one fix.`,
          [
            "2 pts — No, with a valid argument: Ripe vs Unripe is decided by f(x) = s_Ripe − s_Unripe = w·x + c, a linear function, and (0, 0) is the midpoint of (−3, 0) and (3, 0), so f(0, 0) = (f(−3, 0) + f(3, 0)) / 2 > 0 whenever both Ripe clusters win — Unripe is then called Ripe; or 'one straight boundary cannot cut out the middle cluster of a class lying on both sides of it'.",
            "1 pt — template view: one Ripe template (row of W) must match red tomatoes and yellow bananas at once, so it becomes an average that fits neither well (like the two-headed horse template) — a multi-modal class.",
            "2 pts — one working fix with a reason: split Ripe into Ripe-tomato and Ripe-banana sub-classes (each cluster is then linearly separable) and merge them after prediction; or a non-linear model (a neural network with a hidden layer and ReLU, kNN); or a feature such as x1² that puts both Ripe clusters on one side.",
          ],
          `No. Between two classes a linear classifier compares f(x) = s_Ripe − s_Unripe = w·x + c, and f is linear (affine). The Unripe centre (0, 0) is the midpoint of the two Ripe centres (−3, 0) and (3, 0), so
= f(0, 0) = (f(−3, 0) + f(3, 0)) / 2
If both Ripe clusters get f > 0 (Ripe wins there), then f(0, 0) > 0 as well, and the Unripe fruit is also called Ripe. One straight boundary cannot cut the middle cluster out of a class that lies on both sides of it.
In the template view, the single Ripe row of W must match red tomatoes and yellow bananas at once, so it becomes an averaged template that fits neither well — like the two-headed horse template of CIFAR-10. Ripe is a **multi-modal** class.
**Fix:** split Ripe into two sub-classes, Ripe-tomato and Ripe-banana — each cluster is then linearly separable, with 4 rows of W — and merge them into "Ripe" after prediction. Alternatives: a non-linear model (a neural network with a hidden layer and ReLU, or kNN), or a feature such as x1², which puts both Ripe clusters at 9 and Unripe at 0.`,
          `Нет. Между двумя классами линейный классификатор сравнивает f(x) = s_Ripe − s_Unripe = w·x + c, а f — линейная (аффинная) функция. Центр Unripe (0, 0) — середина между центрами Ripe (−3, 0) и (3, 0), поэтому
= f(0, 0) = (f(−3, 0) + f(3, 0)) / 2
Если на обоих скоплениях Ripe f > 0 (Ripe побеждает), то и f(0, 0) > 0 — неспелый фрукт тоже назовут Ripe. Одна прямая граница не может вырезать среднее скопление из класса, который лежит по обе стороны от него.
С точки зрения шаблонов: единственная строка W для Ripe должна одновременно подходить к красным помидорам и к жёлтым бананам, поэтому выходит усреднённый шаблон, который плохо подходит к обоим, — как шаблон лошади с двумя головами в CIFAR-10. Ripe — **многомодальный** класс.
**Решение:** разделить Ripe на два подкласса, Ripe-tomato и Ripe-banana — тогда каждое скопление линейно отделимо, в W 4 строки, — а после предсказания объединять их в «Ripe». Другие варианты: нелинейная модель (нейросеть со скрытым слоем и ReLU или kNN) или признак вроде x1², который переводит оба скопления Ripe в 9, а Unripe — в 0.`,
        ),
      ],
    ),
    question(
      "v6-q4",
      "Question 4 — Understand the CV Pipeline",
      20,
      `A student prepares fruit photos for the ripeness classifier. The photo is a portrait shot, 1080 pixels wide and 1920 pixels high.
= img = cv2.imread("banana_portrait.jpg")
= small = cv2.resize(img, (270, 480))
= crop = small[90:390, 35:235]
= blur = cv2.GaussianBlur(crop, (5, 5), 0)
= hsv = cv2.cvtColor(blur, cv2.COLOR_BGR2HSV)
= hue = hsv[:, :, 0]`,
      [
        task(
          "v6-q4-a",
          "a",
          5,
          `Write the shapes of img, small and crop.`,
          [
            "1 pt — img: (1920, 1080, 3) — height first.",
            "2 pts — small: (480, 270, 3), because dsize (270, 480) is (width, height). (270, 480, 3) gets 0.",
            "2 pts — crop: (300, 200, 3), because slicing is [rows, columns] = [y, x]: 390 − 90 = 300 rows, 235 − 35 = 200 columns. (200, 300, 3) gets 0.",
          ],
          `= img.shape   = (1920, 1080, 3)   # portrait: height 1920, width 1080
= small.shape = (480, 270, 3)     # dsize (270, 480) = width 270, height 480
= crop.shape  = (300, 200, 3)     # rows 90:390 → 300, columns 35:235 → 200
cv2.resize takes **(width, height)**, but NumPy slicing is **[rows, columns] = [y, x]**, and shapes list the height first. The resize keeps the aspect ratio (270 / 480 = 1080 / 1920 = 0.5625).`,
          `= img.shape   = (1920, 1080, 3)   # portrait: height 1920, width 1080
= small.shape = (480, 270, 3)     # dsize (270, 480) = width 270, height 480
= crop.shape  = (300, 200, 3)     # rows 90:390 → 300, columns 35:235 → 200
cv2.resize принимает **(width, height)**, а срез NumPy — **[строки, столбцы] = [y, x]**, и в форме сначала идёт высота. Resize сохраняет пропорции (270 / 480 = 1080 / 1920 = 0.5625).`,
        ),
        task(
          "v6-q4-b",
          "b",
          5,
          `How many channels do hsv and hue have? What does each channel of hsv contain?`,
          [
            "2 pts — hsv has 3 channels, shape (300, 200, 3): BGR2HSV changes the meaning of the channels, not their number. Answering 1 channel gets 0.",
            "1.5 pts — meanings: H = hue, the colour type (0–179 in 8-bit OpenCV); S = saturation, how pure or vivid the colour is; V = value, the brightness (0.5 each).",
            "1.5 pts — hue = hsv[:, :, 0] is a single channel: a 2-D array of shape (300, 200) holding only H.",
          ],
          `- hsv has **3 channels**, shape (300, 200, 3): BGR2HSV changes what the channels mean, not how many there are.
- **H** = hue, the colour type (in 8-bit OpenCV 0–179, i.e. degrees / 2); **S** = saturation, how pure or vivid the colour is; **V** = value, the brightness.
- hue = hsv[:, :, 0] takes only the H plane: **1 channel**, a 2-D array of shape (300, 200).`,
          `- У hsv **3 канала**, форма (300, 200, 3): BGR2HSV меняет смысл каналов, а не их число.
- **H** = hue, тип цвета (в 8-битном OpenCV 0–179, то есть градусы / 2); **S** = saturation, насыщенность — насколько цвет чистый и яркий; **V** = value, яркость.
- hue = hsv[:, :, 0] берёт только плоскость H: **1 канал**, двумерный массив формы (300, 200).`,
        ),
        task(
          "v6-q4-c",
          "c",
          5,
          `Explain why the student crops small[90:390, 35:235] before computing colour features. Give one benefit and one risk of this step.`,
          [
            "3 pts — benefit tied to colour features: keeps the central region where the fruit is and removes the background (stall, bags, hands, price tags), whose colours would distort the hue/colour statistics. Only 'smaller and faster' gets 1.",
            "2 pts — risk: the window is fixed, so it assumes a centred fruit of similar size; an off-centre or small fruit is cut off or mixed with background (detecting or segmenting the fruit is more robust).",
          ],
          `- **Benefit:** the crop keeps the central 300 × 200 region (about 46% of the 480 × 270 frame), where the fruit is, and drops the background — the stall, bags, hands, price tags. Colour features such as a hue histogram are computed over all pixels, so background colours would distort them; after the crop they describe the fruit.
- **Risk:** the window is **fixed**: it assumes the fruit is centred and of a similar size in every photo. An off-centre or small fruit is partly cut off or surrounded by background, and the features become wrong. Detecting or segmenting the fruit is more robust.`,
          `- **Польза:** обрезка оставляет центральную область 300 × 200 (около 46% кадра 480 × 270), где находится фрукт, и убирает фон — прилавок, пакеты, руки, ценники. Цветовые признаки, например гистограмма hue, считаются по всем пикселям, и цвета фона их исказили бы; после обрезки они описывают фрукт.
- **Риск:** окно **фиксированное**: оно предполагает, что фрукт в центре и одного размера на всех снимках. Смещённый или маленький фрукт частично обрежется или окажется среди фона, и признаки станут неверными. Надёжнее находить или сегментировать фрукт.`,
        ),
        task(
          "v6-q4-d",
          "d",
          5,
          `A teammate suggests cv2.GaussianBlur(crop, (25, 25), 0) to "remove noise better". Overripe bananas are recognised by small brown spots 3–6 pixels wide in crop. Would you accept this change? Explain your decision.`,
          [
            "1 pt — rejects the change (keeps a small kernel).",
            "2 pts — mechanism: a 25 × 25 kernel averages over a window of 625 pixels, far larger than the 3–6-pixel spots, so the spots are blended into the surrounding yellow and their contrast disappears.",
            "1 pt — consequence: the main Overripe cue is lost, so overripe bananas look Ripe.",
            "1 pt — a sensible alternative: keep (3, 3) or (5, 5), a median filter with k = 3, or no blur — the kernel must be smaller than the smallest feature needed. Rejecting because '(25, 25) crashes' gets 0 here — 25 is odd, the call runs.",
          ],
          `No, I would keep a small kernel. A 25 × 25 Gaussian averages each pixel with its neighbours over a 625-pixel window — far larger than the 3–6-pixel brown spots. The spots are blended into the yellow around them and practically disappear, so the main **Overripe** cue is lost and overripe bananas look ripe.
A blur kernel must be **smaller than the smallest feature** you need: keep (3, 3) or (5, 5), use cv2.medianBlur(crop, 3) for speckle noise, or no blur at all. (25 is odd, so the code would run — the problem is the result, not an error.)`,
          `Нет, оставил бы маленькое ядро. Гауссово ядро 25 × 25 усредняет каждый пиксель по окну из 625 пикселей — гораздо больше коричневых пятен в 3–6 пикселей. Пятна смешиваются с жёлтым вокруг и практически исчезают, главный признак **Overripe** теряется, и перезрелые бананы выглядят спелыми.
Ядро размытия должно быть **меньше самой мелкой нужной детали**: оставить (3, 3) или (5, 5), взять cv2.medianBlur(crop, 3) против точечного шума или вообще не размывать. (25 — нечётное число, код выполнится: проблема в результате, а не в ошибке.)`,
        ),
      ],
    ),
    question(
      "v6-q5",
      "Question 5 — Design Your Own CV System",
      15,
      `A tile factory wants a camera above the conveyor that sorts ceramic tiles into OK | Chip | Glaze stain | Crack. You have 6 000 labelled photos: 5 280 OK, 360 Chip, 240 Glaze stain and 120 Crack.`,
      [
        task(
          "v6-q5-a",
          "a",
          3,
          `How would you organize the dataset?`,
          [
            "1 pt — one folder (or label) per class (ok, chip, stain, crack) inside separate train / validation / test parts.",
            "1 pt — metadata kept for every photo (batch, date, shift, glaze colour, camera) and consistent naming, to split fairly and check results per group.",
            "1 pt — care for the rare classes: expert check of the crack/chip labels, or repeated photos of the same tile/batch kept in one part so near-duplicates do not leak into the test set.",
          ],
          `- One folder (label) per class inside separate train / val / test folders:
= data/train/ok/, data/train/chip/, data/train/stain/, data/train/crack/
= data/val/... and data/test/... with the same four class folders
- Keep **metadata** for every photo — production batch, date, shift, glaze colour, camera: it is needed to split fairly and to check results per group.
- The rare classes need extra care: have an expert check the 120 crack and 360 chip labels, and keep repeated photos of the same tile (or batch) in one part so that near-duplicates do not leak into the test set.`,
          `- Одна папка (метка) на класс внутри отдельных папок train / val / test:
= data/train/ok/, data/train/chip/, data/train/stain/, data/train/crack/
= data/val/... and data/test/... with the same four class folders
- Хранить **метаданные** каждого снимка — партия, дата, смена, цвет глазури, камера: они нужны, чтобы честно делить данные и проверять качество по группам.
- Редким классам — особое внимание: эксперт проверяет метки 120 трещин и 360 сколов, а повторные снимки одной плитки (или партии) лежат в одной части, чтобы почти одинаковые снимки не «протекли» в тест.`,
        ),
        task(
          "v6-q5-b",
          "b",
          3,
          `Propose a train/validation/test split and calculate the number of images of each class in each part.`,
          [
            "1 pt — a stratified split (every class split in the same proportions) with a validation part, e.g. 70 / 15 / 15 or 80 / 10 / 10; an unstratified random split gets 0 here — the test set could get almost no cracks.",
            "1 pt — correct per-class counts, e.g. 70 / 15 / 15: OK 3 696 / 792 / 792, Chip 252 / 54 / 54, Glaze stain 168 / 36 / 36, Crack 84 / 18 / 18 (80 / 10 / 10: 4 224 / 528 / 528, 288 / 36 / 36, 192 / 24 / 24, 96 / 12 / 12).",
            "1 pt — correct totals that add up to 6 000 (4 200 / 900 / 900 or 4 800 / 600 / 600) and the role of each part (train fits, validation tunes, test once at the end).",
          ],
          `A **stratified** 70 / 15 / 15 split — every class is split in the same proportions, so the test set still contains cracks:
| Class | Total | Train (70%) | Validation (15%) | Test (15%) |
|---|---|---|---|---|
| OK | 5 280 | 3 696 | 792 | 792 |
| Chip | 360 | 252 | 54 | 54 |
| Glaze stain | 240 | 168 | 36 | 36 |
| Crack | 120 | 84 | 18 | 18 |
| All | 6 000 | 4 200 | 900 | 900 |
Train fits the model, validation tunes it, and the test set is used once at the end. Only 18 cracks are in the test set, so their recall is a rough estimate.`,
          `**Стратифицированное** разбиение 70 / 15 / 15 — каждый класс делится в тех же пропорциях, поэтому в тесте тоже есть трещины:
| Класс | Всего | Train (70%) | Validation (15%) | Test (15%) |
|---|---|---|---|---|
| OK | 5 280 | 3 696 | 792 | 792 |
| Chip | 360 | 252 | 54 | 54 |
| Glaze stain | 240 | 168 | 36 | 36 |
| Crack | 120 | 84 | 18 | 18 |
| Все | 6 000 | 4 200 | 900 | 900 |
На train обучаем, на validation настраиваем, test используем один раз в конце. В тесте всего 18 трещин, поэтому их recall — грубая оценка.`,
        ),
        task(
          "v6-q5-c",
          "c",
          3,
          `Give two preprocessing or augmentation operations you would consider. Explain each one in terms of this dataset.`,
          [
            "1.5 pts — first choice (0.5) with a reason tied to this dataset (1). Acceptable: augmentation of the rare classes (90° rotations, flips, small brightness changes — a rotated crack is still a crack); oversampling or class weights against the 88% OK majority; cropping and aligning the tile (removing the conveyor); lighting normalization (CLAHE, standardization) or a fixed light box; resizing that keeps hairline cracks visible.",
            "1.5 pts — a second, different choice (0.5) with a reason (1). Shrinking to a tiny size such as 32 × 32 (cracks vanish) or augmenting the test set gets 0.",
          ],
          `- **Augment the rare classes:** rotations by 90°, flips and small brightness changes — a square tile with a crack is still a crack after rotation, and Chip, Stain and Crack get many more varied training examples. Combine it with oversampling or class weights so that the 88% OK class does not dominate training.
- **Crop and align the tile, then normalize the lighting:** remove the conveyor belt around the tile (perspective correction) and use CLAHE or standardization so that shadows and lamp changes do not look like stains. Keep the resolution high enough for hairline cracks — shrinking to 32 × 32 would erase them.`,
          `- **Аугментация редких классов:** повороты на 90°, отражения и небольшие изменения яркости — квадратная плитка с трещиной остаётся плиткой с трещиной после поворота, а у Chip, Stain и Crack становится намного больше разнообразных примеров. Вместе с этим — oversampling или веса классов, чтобы класс OK (88%) не доминировал в обучении.
- **Вырезать и выровнять плитку, затем нормализовать освещение:** убрать ленту конвейера вокруг плитки (коррекция перспективы) и применить CLAHE или стандартизацию, чтобы тени и смена ламп не выглядели как пятна. Разрешение сохранять достаточным для волосяных трещин — уменьшение до 32 × 32 их сотрёт.`,
        ),
        task(
          "v6-q5-d",
          "d",
          3,
          `A teammate's model reaches 90% test accuracy, and he calls it excellent. Do you agree? What metric would you use, and why?`,
          [
            "1 pt — disagrees, with the baseline: always predicting OK already gives 5 280 / 6 000 = 88% (792 / 900 on the test set), so 90% is barely better and may still miss every crack.",
            "1 pt — metric: per-class recall and precision, macro-F1 and/or the confusion matrix.",
            "1 pt — why: the classes are imbalanced and the rare defects are the costly ones (a missed crack ships a defective tile), so recall of Crack matters most; accuracy is dominated by OK.",
          ],
          `No. The dataset is **imbalanced**: a model that always answers "OK" already gets 5 280 / 6 000 = 88%, on the test set 792 / 900 = 88%. 90% means 810 / 900 correct — only 18 more than doing nothing — and it could still miss every one of the 18 test cracks.
Use **per-class recall and precision, macro-F1** and the **confusion matrix**. Recall of Crack matters most: a missed crack ships a defective tile, while a false alarm only costs a second look. Macro-F1 averages the four classes equally, so the rare defects count as much as OK.`,
          `Нет. Датасет **несбалансированный**: модель, которая всегда отвечает «OK», уже получает 5 280 / 6 000 = 88%, на тесте 792 / 900 = 88%. 90% — это 810 / 900 верных, всего на 18 больше, чем «ничего не делать», и такая модель может пропускать все 18 трещин из теста.
Нужны **recall и precision по классам, macro-F1** и **матрица ошибок**. Важнее всего recall класса Crack: пропущенная трещина — бракованная плитка у покупателя, а ложная тревога стоит лишь повторной проверки. Macro-F1 усредняет четыре класса с равным весом, так что редкие дефекты весят столько же, сколько OK.`,
        ),
        task(
          "v6-q5-e",
          "e",
          3,
          `Your final model reaches macro-F1 0.91 on the test set. A month later the factory starts producing tiles with a dark-brown glaze, and the system misses most cracks on them. Give one likely reason and one fix.`,
          [
            "2 pts — reason: domain shift — no dark-glaze tiles in training; on a dark glaze a crack has low contrast or looks different, so features learned on light glazes do not transfer; the old test set came from the same production, so it could not reveal this.",
            "1 pt — fix: collect and label dark-glaze photos (especially with cracks) and fine-tune/retrain; brightness/contrast augmentation or CLAHE can support it; monitor recall per glaze after deployment.",
          ],
          `- **Reason:** **domain shift** — the training data had no dark-brown tiles. On a dark glaze a crack has low contrast (or appears as a light line instead of a dark one), so the features learned on light glazes do not transfer; the test set came from the same old production, so macro-F1 0.91 could not reveal it.
- **Fix:** collect and label dark-glaze photos, especially with cracks, and fine-tune or retrain; add brightness and contrast augmentation and contrast normalization (CLAHE); after deployment, monitor recall separately for each glaze.`,
          `- **Причина:** **сдвиг домена (domain shift)** — в обучающих данных не было тёмно-коричневых плиток. На тёмной глазури трещина малоконтрастна (или видна светлой линией вместо тёмной), поэтому признаки, выученные на светлой глазури, не переносятся; тестовая выборка была из той же старой продукции, так что macro-F1 0.91 этого показать не мог.
- **Решение:** собрать и разметить снимки с тёмной глазурью, особенно с трещинами, и дообучить или переобучить модель; добавить аугментацию яркости и контраста и нормализацию контраста (CLAHE); после внедрения следить за recall отдельно для каждой глазури.`,
        ),
      ],
    ),
  ],
};

export const mocksC: MockExam[] = [v5, v6];
