import type { MockExam } from "../types";

/**
 * Пробные варианты 7 и 8.
 *
 * v7 — настоящий «Variant 5» другой группы (птицы на фотоловушках): всё, что
 * видно на фото студентов, перенесено дословно (сценарий, формулировки, оба
 * фрагмента кода); недостающее (Q2, Q3 a–b, Q5 c–e) дописано в том же стиле.
 * v8 — свой вариант из тех же типов вопросов (индексация img[y, x], imwrite
 * float-картинки, BGR2RGB, деление на 255, два resize с (width, height),
 * «всегда применяй X», цвет против краёв, 32 × 32) на новом сценарии.
 * Все числа проверены скриптом с numpy и OpenCV.
 */
export const mocksD: MockExam[] = [
  {
    id: "v7",
    title: { en: "Variant 7 — Bird species on trail cameras", ru: "Вариант 7 — виды птиц на фотоловушках" },
    minutes: 120,
    source: { en: "Based on a real variant (Variant 5) from another group", ru: "По настоящему варианту 5 другой группы" },
    questions: [
      {
        id: "v7-q1",
        title: "Question 1 — Image Processing & OpenCV",
        points: 20,
        context: `A nature reserve classifies bird species from trail-camera photos. Cameras differ in resolution, many photos are taken at dawn or dusk (low light), and night shots are grainy.`,
        tasks: [
          {
            id: "v7-q1-a",
            label: "a",
            points: 6,
            prompt: `Propose three preprocessing operations that could be useful. For each operation, explain why you would use it.`,
            rubric: [
              "2 pts — first operation (1 pt) with a reason tied to this scenario (1 pt). Accepted operations: resize to one fixed size (cameras differ in resolution); denoising with a Gaussian, median or non-local-means filter (grainy night shots); brightness/contrast correction — gamma, CLAHE or histogram equalization on the L or V channel (dawn/dusk low light); normalization to [0, 1] or standardization (one input scale); cropping to the bird / region of interest; white balance or colour normalization (colour cast of dawn light).",
              "2 pts — second operation, different from the first (1 pt), with its own scenario reason (1 pt).",
              "2 pts — third different operation (1 pt) with its own scenario reason (1 pt). Two kinds of blur count as one operation; a generic reason ('it improves accuracy') earns 0 for the reason; grayscale conversion does not fix low light, noise or different resolutions (0 unless argued for infrared night shots, which are effectively gray).",
            ],
            answer: {
              en: `- **Resize to one fixed size**, e.g. cv2.resize(img, (224, 224)) → shape (224, 224, 3): the cameras differ in resolution, and the classifier needs inputs of one shape.
- **Denoise the grainy night shots** with cv2.GaussianBlur(img, (5, 5), 0) (a median or non-local-means filter also works): sensor noise would otherwise look like feather texture and confuse the model.
- **Correct brightness and contrast** of dawn and dusk photos: gamma correction or CLAHE on the L channel of Lab (or V of HSV) makes the plumage visible in dark photos; changing only the lightness keeps the feather colours.
- Also valid: normalization to [0, 1], cropping to the bird, white balance for the warm dawn light.`,
              ru: `- **Привести к одному размеру**, например cv2.resize(img, (224, 224)) → форма (224, 224, 3): у камер разное разрешение, а классификатору нужен вход одной формы.
- **Убрать шум с зернистых ночных снимков**: cv2.GaussianBlur(img, (5, 5), 0) (подойдёт и median или non-local means) — иначе шум сенсора похож на текстуру перьев и сбивает модель.
- **Поправить яркость и контраст** снимков на рассвете и в сумерках: gamma-коррекция или CLAHE по каналу L в Lab (или V в HSV) — оперение становится видно, а цвета перьев не меняются, потому что трогаем только яркость.
- Тоже засчитывается: нормализация в [0, 1], кадрирование до птицы, баланс белого для тёплого рассветного света.`,
            },
          },
          {
            id: "v7-q1-b",
            label: "b",
            points: 4,
            prompt: `The student resizes every image to 32 × 32 pixels. Give one advantage and one disadvantage of doing this for bird species classification.`,
            rubric: [
              "2 pts — advantage: a small, uniform input — fast training and inference, little memory (32 × 32 × 3 = 3,072 values per image), photos from all cameras get the same shape. 1 pt for the advantage, 1 pt for explaining it.",
              "2 pts — disadvantage tied to birds: the fine details that separate species (plumage pattern, beak shape, eye ring) and small distant birds are lost; the aspect ratio may be distorted. 'The image gets smaller' without saying what is lost earns 1 pt.",
            ],
            answer: {
              en: `- **Advantage:** each photo becomes only 32 × 32 × 3 = 3,072 numbers (instead of 150,528 at 224 × 224), so training and prediction are fast and need little memory, and photos from cameras with different resolutions get the same input shape.
- **Disadvantage:** bird species often differ in small details — plumage pattern, beak shape, an eye ring. At 32 × 32 these details are gone; a bird 60 pixels wide in a 1920-pixel-wide photo shrinks to 60 × 32 / 1920 = 1 pixel. Squashing a wide photo into a square also distorts the bird's shape.`,
              ru: `- **Плюс:** каждое фото — всего 32 × 32 × 3 = 3 072 числа (вместо 150 528 при 224 × 224), поэтому обучение и предсказание быстрые и требуют мало памяти, а снимки камер с разным разрешением получают одинаковую форму входа.
- **Минус:** виды птиц часто различаются мелкими деталями — рисунком оперения, формой клюва, кольцом вокруг глаза. При 32 × 32 эти детали пропадают; птица шириной 60 пикселей на снимке шириной 1920 пикселей превращается в 60 × 32 / 1920 = 1 пиксель. Если широкий кадр сжать в квадрат, ещё и искажаются пропорции птицы.`,
            },
          },
          {
            id: "v7-q1-c",
            label: "c",
            points: 5,
            prompt: `Consider the following code. Identify two problems and provide the corrected code.
= img = cv2.imread("bird.jpg")
= # read the pixel at x = 50 (column), y = 20 (row)
= pixel = img[50, 20]
= norm = img / 255.0
= cv2.imwrite("bird_norm.jpg", norm)   # save a copy for checking`,
            rubric: [
              "2 pts — problem 1: NumPy indexing is img[row, col] = img[y, x], so img[50, 20] reads x = 20, y = 50 — the wrong pixel, silently (IndexError only if the image has fewer than 51 rows); fix: pixel = img[20, 50]. 1 pt for spotting the swap, 1 pt for the correct index.",
              "2 pts — problem 2: norm is a float64 array with values in [0, 1]; cv2.imwrite stores an 8-bit JPEG, so the values become about 0–1 out of 255 and the saved image is almost black — no error; fix: save (norm * 255).astype('uint8') or simply save img. 1 pt for the cause, 1 pt for a working fix.",
              "1 pt — complete corrected code with both fixes. Other remarks (no None check, the pixel is [B, G, R]) earn nothing and lose nothing; claiming that img / 255.0 crashes or that imread returns RGB loses this point.",
            ],
            answer: {
              en: `**Problem 1 — row and column swapped (silent bug).** NumPy indexes an image as img[row, col] = img[y, x]. img[50, 20] is the pixel at x = 20, y = 50, not at x = 50, y = 20. There is no error, just a wrong value (an IndexError would appear only if the image had fewer than 51 rows). Fix: img[20, 50], which returns [B, G, R] of the wanted pixel.
**Problem 2 — saving a float image (silent bug).** img / 255.0 gives float64 values in [0, 1]. A JPEG is 8-bit, so cv2.imwrite turns them into values of about 0–1 out of 255 and bird_norm.jpg comes out almost black, without any error. Fix: scale back to uint8 before saving (or save img itself).
Corrected code:
= img = cv2.imread("bird.jpg")
= # read the pixel at x = 50 (column), y = 20 (row)
= pixel = img[20, 50]
= norm = img / 255.0
= cv2.imwrite("bird_norm.jpg", (norm * 255).astype("uint8"))`,
              ru: `**Ошибка 1 — перепутаны строка и столбец (тихая ошибка).** В NumPy картинка индексируется как img[строка, столбец] = img[y, x]. img[50, 20] — это пиксель с x = 20, y = 50, а не x = 50, y = 20. Ошибки нет, просто читается не тот пиксель (IndexError был бы, только если в картинке меньше 51 строки). Исправление: img[20, 50] — вернёт [B, G, R] нужного пикселя.
**Ошибка 2 — сохранение float-картинки (тихая ошибка).** img / 255.0 даёт float64 со значениями в [0, 1]. JPEG — 8-битный формат, поэтому cv2.imwrite превращает их в значения около 0–1 из 255, и bird_norm.jpg получается почти чёрным — без всякой ошибки. Исправление: перед сохранением вернуть масштаб и тип uint8 (или сохранить сам img).
Исправленный код:
= img = cv2.imread("bird.jpg")
= # read the pixel at x = 50 (column), y = 20 (row)
= pixel = img[20, 50]
= norm = img / 255.0
= cv2.imwrite("bird_norm.jpg", (norm * 255).astype("uint8"))`,
            },
          },
          {
            id: "v7-q1-d",
            label: "d",
            points: 5,
            prompt: `A student says: "Histogram equalization should be applied to every image dataset." Do you agree? Explain using one example.`,
            rubric: [
              "1 pt — clear position: do not agree; equalization helps only when contrast or exposure is poor.",
              "2 pts — a correct reason why it can hurt: it amplifies sensor noise in dark grainy images; it destroys brightness information that carries the label; applied to B, G, R separately it shifts colours; on well-exposed images it adds little; cv2.equalizeHist needs an 8-bit single-channel image (equalize only V of HSV / L of Lab, or use CLAHE).",
              "2 pts — one concrete example that supports the reason, e.g. grainy night trail-camera shots (noise stretched into bright speckles), X-ray density or fruit ripeness where brightness itself is the cue, feather colours changed by equalizing B, G, R separately. An example that does not show harm or uselessness earns 0.",
            ],
            answer: {
              en: `I do not agree. Histogram equalization stretches the intensity histogram over 0–255. It helps on low-contrast or badly exposed images, but it is not universal.
Example: a grainy night shot from a trail camera consists mostly of dark pixels plus sensor noise. Equalization spreads these dark levels over the whole range, so the noise turns into bright speckles that look like plumage texture, and the classifier gets worse. In addition, cv2.equalizeHist works on one 8-bit channel; equalizing B, G and R separately would shift exactly the feather colours that tell species apart.
Better: apply CLAHE (contrast-limited) to the L channel of Lab or the V channel of HSV, only where photos really are too dark (dawn, dusk), and check on the validation set that it helps.`,
              ru: `Не согласен. Выравнивание гистограммы растягивает яркости на весь диапазон 0–255. Оно помогает на малоконтрастных или плохо экспонированных снимках, но не универсально.
Пример: зернистый ночной снимок фотоловушки — это в основном тёмные пиксели плюс шум сенсора. Выравнивание растягивает эти тёмные уровни на весь диапазон, шум превращается в яркие крапинки, похожие на текстуру оперения, и классификатор ошибается чаще. Кроме того, cv2.equalizeHist работает с одним 8-битным каналом; если выравнивать B, G и R по отдельности, сдвинутся как раз цвета перьев, по которым различаются виды.
Лучше: CLAHE (с ограничением контраста) по каналу L в Lab или V в HSV, только там, где снимки действительно слишком тёмные (рассвет, сумерки), и проверить на validation, что это помогает.`,
            },
          },
        ],
      },
      {
        id: "v7-q2",
        title: "Question 2 — Image Classification",
        points: 20,
        context: `A classifier produces the following scores:
| Image | Owl | Pheasant | Magpie | True class |
|---|---|---|---|---|
| A | 2.1 | -0.3 | 0.4 | Owl |
| B | 0.6 | 1.9 | 1.1 | Pheasant |
| C | 1.5 | 0.2 | 1.3 | Magpie |
| D | -0.8 | 0.9 | 2.4 | Magpie |
| E | 1.2 | 1.0 | -0.5 | Pheasant |`,
        tasks: [
          {
            id: "v7-q2-a",
            label: "a",
            points: 4,
            prompt: `Write the predicted class for A, B, C, D, and E.`,
            rubric: [
              "1 pt — A: Owl (2.1 is the largest score) and B: Pheasant (1.9); 0.5 pts each.",
              "1 pt — C: Owl, because 1.5 > 1.3 > 0.2. Writing the true class (Magpie) instead of the prediction earns 0.",
              "1 pt — D: Magpie (2.4).",
              "1 pt — E: Owl, because 1.2 > 1.0 > -0.5. Writing the true class (Pheasant) earns 0.",
            ],
            answer: {
              en: `The predicted class is the one with the largest score in the row (argmax), whatever the true class is:
- A: max(2.1, -0.3, 0.4) = 2.1 → **Owl**
- B: max(0.6, 1.9, 1.1) = 1.9 → **Pheasant**
- C: max(1.5, 0.2, 1.3) = 1.5 → **Owl**
- D: max(-0.8, 0.9, 2.4) = 2.4 → **Magpie**
- E: max(1.2, 1.0, -0.5) = 1.2 → **Owl**`,
              ru: `Предсказанный класс — тот, у которого в строке наибольшая оценка (argmax), независимо от истинного класса:
- A: max(2.1, -0.3, 0.4) = 2.1 → **Owl**
- B: max(0.6, 1.9, 1.1) = 1.9 → **Pheasant**
- C: max(1.5, 0.2, 1.3) = 1.5 → **Owl**
- D: max(-0.8, 0.9, 2.4) = 2.4 → **Magpie**
- E: max(1.2, 1.0, -0.5) = 1.2 → **Owl**`,
            },
          },
          {
            id: "v7-q2-b",
            label: "b",
            points: 4,
            prompt: `Calculate classification accuracy. Show your calculation.`,
            rubric: [
              "2 pts — compares every prediction with the true class: A ✓, B ✓, C ✗, D ✓, E ✗ → 3 correct out of 5.",
              "2 pts — accuracy = correct / total = 3 / 5 = 0.6 = 60%. Follow-through: full points for a correct division based on the student's own predictions from a).",
            ],
            answer: {
              en: `Compare each prediction with the true class: A Owl = Owl ✓, B Pheasant = Pheasant ✓, C Owl ≠ Magpie ✗, D Magpie = Magpie ✓, E Owl ≠ Pheasant ✗.
= accuracy = correct / total = 3 / 5 = 0.6 = 60%`,
              ru: `Сравниваем каждое предсказание с истинным классом: A Owl = Owl ✓, B Pheasant = Pheasant ✓, C Owl ≠ Magpie ✗, D Magpie = Magpie ✓, E Owl ≠ Pheasant ✗.
= accuracy = correct / total = 3 / 5 = 0.6 = 60%`,
            },
          },
          {
            id: "v7-q2-c",
            label: "c",
            points: 4,
            prompt: `Which image(s) were incorrectly classified?`,
            rubric: [
              "2 pts — C: predicted Owl (1.5) but the true class is Magpie (1.3).",
              "2 pts — E: predicted Owl (1.2) but the true class is Pheasant (1.0). If a correctly classified image is also listed, give at most 1 pt for this line.",
            ],
            answer: {
              en: `**C and E.**
- C: Owl 1.5 beats Magpie 1.3, but the photo shows a magpie.
- E: Owl 1.2 beats Pheasant 1.0, but the photo shows a pheasant.
Both errors are false «Owl» predictions with a small margin (0.2) — perhaps dark dawn or dusk photos that the model links with owls.`,
              ru: `**C и E.**
- C: Owl 1.5 больше Magpie 1.3, а на фото сорока (Magpie).
- E: Owl 1.2 больше Pheasant 1.0, а на фото фазан (Pheasant).
Обе ошибки — ложные «Owl» с маленьким отрывом (0.2); возможно, это тёмные снимки на рассвете или в сумерках, которые модель связывает с совами.`,
            },
          },
          {
            id: "v7-q2-d",
            label: "d",
            points: 4,
            prompt: `Owls are rare and protected, so the reserve mainly wants to find every owl photo. Explain the difference between precision and recall. Which one matters more for the Owl class here?`,
            rubric: [
              "1.5 pts — precision (Owl): of all images predicted Owl, the fraction that really are owls = TP / (TP + FP).",
              "1.5 pts — recall (Owl): of all real owl images, the fraction the model finds = TP / (TP + FN).",
              "1 pt — recall matters more here (a missed protected owl is costly; a false alarm is just checked by a ranger), ideally with the table: Owl recall = 1/1 = 100%, precision = 1/3 ≈ 33%. Choosing precision earns 0 for this line.",
            ],
            answer: {
              en: `- **Precision** answers «when the model says Owl, how often is it right?» = TP / (TP + FP).
- **Recall** answers «of all real owls, how many did the model find?» = TP / (TP + FN).
In the table, A, C and E are predicted Owl, but only A is an owl:
= precision(Owl) = 1 / (1 + 2) ≈ 33%
= recall(Owl) = 1 / (1 + 0) = 100%
**Recall** matters more here: missing a rare, protected owl is worse than a false alarm that a ranger can reject in a second. Precision should still be watched, because too many false «Owl» alerts waste the rangers' time.`,
              ru: `- **Precision** отвечает на вопрос «когда модель говорит Owl, как часто она права?» = TP / (TP + FP).
- **Recall** — «из всех настоящих сов сколько модель нашла?» = TP / (TP + FN).
В таблице Owl предсказан для A, C и E, но сова только на A:
= precision(Owl) = 1 / (1 + 2) ≈ 33%
= recall(Owl) = 1 / (1 + 0) = 100%
Здесь важнее **recall**: пропустить редкую охраняемую сову хуже, чем ложная тревога, которую инспектор отклонит за секунду. Precision всё равно стоит отслеживать: слишком много ложных «Owl» отнимает время инспекторов.`,
            },
          },
          {
            id: "v7-q2-e",
            label: "e",
            points: 4,
            prompt: `The model achieves 97% training accuracy but 61% test accuracy. What is the likely problem? Give one possible solution.`,
            rubric: [
              "2 pts — overfitting: the model memorized the training photos (high variance) and does not generalize; the 36-point gap between train and test is the evidence. 'Underfitting' or 'the test set is too hard' earns 0.",
              "2 pts — one valid fix with a short explanation: more or more varied photos, data augmentation (crops, flips, brightness changes), regularization (L2 weight decay, dropout), a simpler model, early stopping on a validation set, transfer learning from a pretrained network. Tuning on the test set earns 0.",
            ],
            answer: {
              en: `**Overfitting.** 97% on the training set but only 61% on unseen photos means the model learned the training photos themselves — backgrounds, particular cameras, individual birds — instead of features that generalize.
Fix: **data augmentation** of the training set — random crops, horizontal flips and brightness changes create new realistic photos, including dawn and dusk lighting. Also possible: more data, L2 weight decay or dropout, a smaller model, or early stopping chosen on a validation set.`,
              ru: `**Переобучение (overfitting).** 97% на обучающей выборке и лишь 61% на новых фото значит, что модель запомнила сами обучающие снимки — фон, конкретные камеры, отдельных птиц, — а не признаки, которые обобщаются.
Решение: **аугментация** обучающей выборки — случайные кропы, горизонтальные отражения и изменения яркости дают новые правдоподобные снимки, в том числе с рассветным и сумеречным светом. Также подойдут: больше данных, L2 weight decay или dropout, модель попроще, early stopping по validation.`,
            },
          },
        ],
      },
      {
        id: "v7-q3",
        title: "Question 3 — Linear Classifier",
        points: 25,
        context: `Consider a three-class linear image classifier: s = Wx + b
= x = [1, 2, -1]ᵀ
= W = [[2, 1, -1], [0, 2, 1], [-1, 1, 3]]
= b = [-3, 1, 2]ᵀ
Classes: 0 = Owl, 1 = Pheasant, 2 = Magpie`,
        tasks: [
          {
            id: "v7-q3-a",
            label: "a",
            points: 12,
            prompt: `Calculate s = Wx + b. Show every step.`,
            rubric: [
              "3 pts — row 0 (Owl): 2·1 + 1·2 + (-1)·(-1) = 2 + 2 + 1 = 5, then 5 + (-3) = 2. 1 pt for the products, 1 pt for the sum 5, 1 pt for adding b0.",
              "3 pts — row 1 (Pheasant): 0·1 + 2·2 + 1·(-1) = 0 + 4 - 1 = 3, then 3 + 1 = 4 (same split).",
              "3 pts — row 2 (Magpie): (-1)·1 + 1·2 + 3·(-1) = -1 + 2 - 3 = -2, then -2 + 2 = 0 (same split).",
              "3 pts — the final vector clearly stated: s = [2, 4, 0]ᵀ, with Wx = [5, 3, -2] shown before adding b. A bare final answer without steps earns at most these 3 pts.",
            ],
            answer: {
              en: `Each score is one row of W times x (a dot product), plus the bias of that class.
= Wx[0] = 2·1 + 1·2 + (-1)·(-1) = 2 + 2 + 1 = 5
= Wx[1] = 0·1 + 2·2 + 1·(-1) = 0 + 4 - 1 = 3
= Wx[2] = (-1)·1 + 1·2 + 3·(-1) = -1 + 2 - 3 = -2
= Wx = [5, 3, -2]
= s = Wx + b = [5 + (-3), 3 + 1, -2 + 2] = [2, 4, 0]`,
              ru: `Каждая оценка — строка W, умноженная на x (скалярное произведение), плюс bias этого класса.
= Wx[0] = 2·1 + 1·2 + (-1)·(-1) = 2 + 2 + 1 = 5
= Wx[1] = 0·1 + 2·2 + 1·(-1) = 0 + 4 - 1 = 3
= Wx[2] = (-1)·1 + 1·2 + 3·(-1) = -1 + 2 - 3 = -2
= Wx = [5, 3, -2]
= s = Wx + b = [5 + (-3), 3 + 1, -2 + 2] = [2, 4, 0]`,
            },
          },
          {
            id: "v7-q3-b",
            label: "b",
            points: 3,
            prompt: `What class does the classifier predict?`,
            rubric: [
              "2 pts — class 1, Pheasant. Owl (the argmax of Wx = [5, 3, -2], i.e. forgetting the bias) earns 0.",
              "1 pt — reason: the prediction is argmax(s); the largest score 4 is at index 1. Follow-through: if s in a) was wrong, full points for the correct argmax of the student's own s.",
            ],
            answer: {
              en: `argmax(s) = argmax([2, 4, 0]) = 1 → **Pheasant** (4 > 2 > 0).
The bias matters here: without b, Wx = [5, 3, -2] would have predicted Owl.`,
              ru: `argmax(s) = argmax([2, 4, 0]) = 1 → **Pheasant** (4 > 2 > 0).
Здесь важен bias: без b вектор Wx = [5, 3, -2] дал бы Owl.`,
            },
          },
          {
            id: "v7-q3-c",
            label: "c",
            points: 5,
            prompt: `Explain in your own words what W and b represent.`,
            rubric: [
              "2 pts — W is the learned weight matrix with one row per class and one column per input value (3 × 3 here); W[k][i] says how strongly input i raises (positive) or lowers (negative) the score of class k.",
              "1 pt — a deeper view of W: each row is a template of its class (the score is a dot product, i.e. template matching), or each row sets the orientation of a decision boundary (hyperplane).",
              "2 pts — b is the bias vector: one learned offset per class, added regardless of the input; it shifts that class's score up or down (a built-in preference) and moves the decision boundary away from the origin. 'b is the error' or 'b is the learning rate' earns 0.",
            ],
            answer: {
              en: `- **W (weights)** is a learned matrix with one row per class and one column per input value (here 3 × 3). W[k][i] says how much input i pushes the score of class k up (positive weight) or down (negative weight). Each row works as a **template** of its class: the score is the dot product of the template and the image, i.e. how well the image matches it. Geometrically a row sets the direction of a decision boundary.
- **b (bias)** is one learned number per class, added whatever the input is. It shifts that class's score — a built-in preference for or against the class — and moves the decision boundary away from the origin. In this question b changes the answer: Wx alone favours Owl, Wx + b favours Pheasant.
- Both are learned from the training data; only x comes from the image.`,
              ru: `- **W (веса)** — выученная матрица: строка на каждый класс и столбец на каждое входное значение (здесь 3 × 3). W[k][i] показывает, насколько вход i поднимает (положительный вес) или опускает (отрицательный вес) оценку класса k. Каждая строка — **шаблон (template)** своего класса: оценка — скалярное произведение шаблона и картинки, то есть насколько картинка на него похожа. Геометрически строка задаёт направление границы решения.
- **b (bias, смещение)** — по одному выученному числу на класс, прибавляется независимо от входа. Сдвигает оценку класса — встроенное предпочтение за или против класса — и отодвигает границу решения от начала координат. В этой задаче b меняет ответ: по одному Wx побеждает Owl, по Wx + b — Pheasant.
- Оба параметра выучиваются на обучающих данных; из картинки берётся только x.`,
            },
          },
          {
            id: "v7-q3-d",
            label: "d",
            points: 5,
            prompt: `Why can't a single linear classifier correctly separate every possible dataset? You may include a small drawing.`,
            rubric: [
              "2 pts — a linear classifier draws straight-line / hyperplane decision boundaries (each score is a linear function of x; each class gets one convex region, one template), so it can only separate linearly separable classes.",
              "2 pts — one concrete counter-example, drawn or described in words: XOR (class A in quadrants 1 and 3, class B in 2 and 4), concentric rings (a disc of class A inside a ring of class B), or a multi-modal class split into separate blobs.",
              "1 pt — what helps: non-linear features or a feature transform (e.g. polar coordinates for rings), a neural network with hidden layers / CNN, or kNN.",
            ],
            answer: {
              en: `Because s = Wx + b is linear in x, the boundary between two classes is where their two linear scores are equal — a straight line (a hyperplane in more dimensions). So each class gets one convex region, one template. Many datasets are not like that, for example XOR:
= B | A
= A | B      (class A in quadrants 1 and 3, class B in quadrants 2 and 4)
No single line puts both A quadrants on one side and both B quadrants on the other. Other examples: class A is a disc surrounded by a ring of class B, or one class consists of two separate blobs (owls by day and owls at night) with another class between them.
What helps: a non-linear model — a neural network with hidden layers or a CNN, or kNN — or non-linear features (polar coordinates turn the rings into a problem a line can split).`,
              ru: `Поскольку s = Wx + b линейна по x, граница между двумя классами — там, где их линейные оценки равны, то есть прямая (гиперплоскость в многомерном случае). Каждому классу достаётся одна выпуклая область, один шаблон. Многие наборы данных так не устроены, например XOR:
= B | A
= A | B      (class A in quadrants 1 and 3, class B in quadrants 2 and 4)
Ни одна прямая не оставит обе четверти A по одну сторону, а обе четверти B — по другую. Другие примеры: класс A — круг, окружённый кольцом класса B, или класс из двух отдельных облаков (совы днём и совы ночью), между которыми лежит другой класс.
Что помогает: нелинейная модель — нейросеть со скрытыми слоями или CNN, kNN — или нелинейные признаки (полярные координаты превращают кольца в задачу, которую делит прямая).`,
            },
          },
        ],
      },
      {
        id: "v7-q4",
        title: "Question 4 — Understand the CV Pipeline",
        points: 20,
        context: `A student wrote the following image-processing pipeline:
= img = cv2.imread("bird.jpg")
= img = cv2.resize(img, (300, 200))
= rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
= small = cv2.resize(rgb, (150, 100))
= norm = small / 255.0`,
        tasks: [
          {
            id: "v7-q4-a",
            label: "a",
            points: 5,
            prompt: `Write the shape of img after the first resize and the shape of small.`,
            rubric: [
              "2.5 pts — img after the first resize: (200, 300, 3) — dsize is (width, height), the shape is (height, width, channels). (300, 200, 3) earns 0 for this line; (200, 300) without the 3 channels earns 1.5.",
              "2.5 pts — small: (100, 150, 3). (150, 100, 3) earns 0 for this line; (100, 150) without the channels earns 1.5.",
            ],
            answer: {
              en: `cv2.resize takes dsize = (width, height), while a NumPy shape is (height, width, channels); BGR2RGB keeps 3 channels.
= img = cv2.resize(img, (300, 200))     → img.shape = (200, 300, 3)
= small = cv2.resize(rgb, (150, 100))   → small.shape = (100, 150, 3)`,
              ru: `cv2.resize принимает dsize = (ширина, высота), а форма массива NumPy — (высота, ширина, каналы); BGR2RGB оставляет 3 канала.
= img = cv2.resize(img, (300, 200))     → img.shape = (200, 300, 3)
= small = cv2.resize(rgb, (150, 100))   → small.shape = (100, 150, 3)`,
            },
          },
          {
            id: "v7-q4-b",
            label: "b",
            points: 5,
            prompt: `What happens to the number of channels after BGR2RGB? What changes?`,
            rubric: [
              "2 pts — the number of channels stays 3; the shape stays (200, 300, 3). The answer '3 channels → 1 channel' (confusing it with BGR2GRAY) earns 0 for this line.",
              "2 pts — what changes: only the order of the channels — the first (B) and third (R) channels are swapped, so a pixel [B, G, R] becomes [R, G, B]; pixel values and image size do not change.",
              "1 pt — why it is done: OpenCV reads images as BGR, while matplotlib and models pretrained on RGB images expect RGB.",
            ],
            answer: {
              en: `The number of channels does **not** change: rgb still has 3 channels and shape (200, 300, 3). Only the **order** of the channels changes — cv2.imread stores B, G, R, and COLOR_BGR2RGB swaps the first and the third channel:
= img[y, x] = [40, 90, 210]   (B, G, R)   →   rgb[y, x] = [210, 90, 40]   (R, G, B)
No value is changed or lost. It is done because matplotlib and networks pretrained on RGB images expect red first. Going from 3 channels to 1 happens with COLOR_BGR2GRAY, not here.`,
              ru: `Число каналов **не меняется**: у rgb по-прежнему 3 канала и форма (200, 300, 3). Меняется только **порядок** каналов — cv2.imread хранит B, G, R, а COLOR_BGR2RGB меняет местами первый и третий канал:
= img[y, x] = [40, 90, 210]   (B, G, R)   →   rgb[y, x] = [210, 90, 40]   (R, G, B)
Ни одно значение не меняется и не теряется. Это нужно, потому что matplotlib и сети, обученные на RGB-картинках, ждут красный канал первым. Из 3 каналов в 1 переходит COLOR_BGR2GRAY, а не этот шаг.`,
            },
          },
          {
            id: "v7-q4-c",
            label: "c",
            points: 5,
            prompt: `Why are pixel values divided by 255.0? What range do they have after this step?`,
            rubric: [
              "2 pts — why: small is uint8 with values 0–255; dividing by 255.0 normalizes all inputs to one small common scale, which makes gradient-based training more stable and faster and matches what models expect.",
              "2 pts — the range after the step is [0, 1] (0 → 0.0, 255 → 1.0). Saying [0, 255] or [-1, 1] earns 0 for this line.",
              "1 pt — the result is a float array (float64, because 255.0 is a float) with the same shape (100, 150, 3).",
            ],
            answer: {
              en: `small is uint8 with values from 0 to 255. Dividing by 255.0 is **normalization**: all inputs end up on the same small scale, which keeps weights and gradients in a reasonable range, makes gradient-based training more stable and faster, and matches the input scale most models expect.
= norm = small / 255.0   → float64, shape (100, 150, 3), values in [0.0, 1.0]
= 0 → 0.0,   128 → 0.502,   255 → 1.0`,
              ru: `small — uint8 со значениями от 0 до 255. Деление на 255.0 — это **нормализация**: все входы оказываются в одном небольшом масштабе, веса и градиенты остаются в разумных пределах, обучение градиентным спуском стабильнее и быстрее, и вход совпадает с масштабом, которого ждёт большинство моделей.
= norm = small / 255.0   → float64, shape (100, 150, 3), values in [0.0, 1.0]
= 0 → 0.0,   128 → 0.502,   255 → 1.0`,
            },
          },
          {
            id: "v7-q4-d",
            label: "d",
            points: 5,
            prompt: `Two bird species differ mainly in feather color. Would you convert the images to edges before classification? Explain.`,
            rubric: [
              "1 pt — decision: no, do not feed edges alone.",
              "2 pts — reason: an edge detector such as Canny outputs a single-channel 0/255 map of brightness changes (outlines); all colour information is discarded, so two species with the same shape but different feather colour give almost the same edge map.",
              "2 pts — what to do instead: keep the colour image (RGB, or HSV where hue describes the colour), possibly with white balance for dawn light; edges may be added as extra information, not as a replacement. 'Yes, edges remove noise' earns 0 for the whole sub-question.",
            ],
            answer: {
              en: `No. An edge detector such as cv2.Canny returns a single-channel map with values 0 or 255 that only marks where the brightness changes — the outline of the bird, branches, borders between feather areas. The colour is thrown away, so two species with the same silhouette but different feather colours give almost the same edge map, and the classifier loses exactly the feature that separates them.
I would keep the colour image — RGB, or HSV so that the hue describes the feather colour — and correct the colour cast of dawn light (white balance). Edges could at most be added as extra shape information.`,
              ru: `Нет. Детектор краёв вроде cv2.Canny возвращает одноканальную карту со значениями 0 или 255, где отмечено только изменение яркости — контур птицы, ветки, границы участков оперения. Цвет выбрасывается, поэтому два вида с одинаковым силуэтом и разным цветом перьев дают почти одинаковые карты краёв — классификатор теряет именно тот признак, который их различает.
Я оставил бы цветное изображение — RGB или HSV, где оттенок (hue) описывает цвет перьев, — и поправил бы цветовой оттенок рассветного света (баланс белого). Края можно разве что добавить как дополнительную информацию о форме.`,
            },
          },
        ],
      },
      {
        id: "v7-q5",
        title: "Question 5 — Design Your Own CV System",
        points: 15,
        context: `You need to develop a system that sorts clothing for an online shop: Shirt | Trousers | Dress | Shoes. You have collected 5,000 images.`,
        tasks: [
          {
            id: "v7-q5-a",
            label: "a",
            points: 3,
            prompt: `How would you organize the dataset?`,
            rubric: [
              "1 pt — one folder (or one label column in a CSV file) per class: shirt/, trousers/, dress/, shoes/, with consistent, checked labels.",
              "1 pt — separate train / (validation) / test parts that never overlap, e.g. data/train/shirt/..., data/test/shirt/....",
              "1 pt — data hygiene: check how many images each class has, remove duplicates (the same product photo in train and test) and broken or mislabeled files, keep all four classes in every part (stratified).",
            ],
            answer: {
              en: `= data/train/shirt/   data/train/trousers/   data/train/dress/   data/train/shoes/
= data/val/...   data/test/...   (the same four class folders)
- One folder per class (or a CSV with file name and label); labels checked by hand on a sample.
- Train, validation and test kept separate and never mixed; every part contains all four classes in the same proportions (stratified split).
- Before splitting: remove duplicates (the same product must not end up in both train and test) and broken files, and count the images per class.`,
              ru: `= data/train/shirt/   data/train/trousers/   data/train/dress/   data/train/shoes/
= data/val/...   data/test/...   (the same four class folders)
- По папке на класс (или CSV с именем файла и меткой); метки выборочно проверены вручную.
- Train, validation и test хранятся отдельно и не смешиваются; в каждой части все четыре класса в тех же пропорциях (стратифицированное разбиение).
- До разбиения: убрать дубликаты (один и тот же товар не должен попасть и в train, и в test) и битые файлы, посчитать картинки по классам.`,
            },
          },
          {
            id: "v7-q5-b",
            label: "b",
            points: 3,
            prompt: `Propose a train/test split and calculate the number of images in each part.`,
            rubric: [
              "1 pt — a sensible ratio: 80/20, 70/30, or train/validation/test 70/15/15 or 80/10/10.",
              "1 pt — correct counts for that ratio: 80/20 → 4,000 / 1,000; 70/30 → 3,500 / 1,500; 70/15/15 → 3,500 / 750 / 750; 80/10/10 → 4,000 / 500 / 500.",
              "1 pt — the split is random and stratified per class (e.g. if balanced, 1,250 per class → 1,000 train + 250 test), and the test part is used only once at the end.",
            ],
            answer: {
              en: `80% train / 20% test, randomly and per class (stratified):
= train = 0.8 × 5,000 = 4,000 images
= test = 0.2 × 5,000 = 1,000 images
= if balanced: 1,250 per class → 1,000 train + 250 test per class
For choosing hyperparameters I would take a validation part out of train, e.g. 70/15/15 → 3,500 / 750 / 750. The test part is used only once, at the end.`,
              ru: `80% train / 20% test, случайно и по каждому классу отдельно (стратифицированно):
= train = 0.8 × 5,000 = 4,000 images
= test = 0.2 × 5,000 = 1,000 images
= if balanced: 1,250 per class → 1,000 train + 250 test per class
Для подбора гиперпараметров отделил бы от train ещё validation, например 70/15/15 → 3 500 / 750 / 750. Test используется один раз, в самом конце.`,
            },
          },
          {
            id: "v7-q5-c",
            label: "c",
            points: 3,
            prompt: `Give two preprocessing operations you would consider.`,
            rubric: [
              "1.5 pts — first operation with a reason: resize to a fixed size (e.g. 224 × 224, padding to keep the aspect ratio), normalization to [0, 1] / standardization, cropping or background removal, colour normalization / white balance, or training-set augmentation (flips, small rotations, brightness). 0.5 pts if no reason is given.",
              "1.5 pts — second, different operation with a reason. Grayscale is accepted only with a reason (the classes differ by shape, not colour); without a reason 0.5 pts.",
            ],
            answer: {
              en: `- **Resize to a fixed size**, e.g. 224 × 224, after padding the photo to a square so that long dresses and trousers are not squashed: the network needs one input shape, and the photos come from different cameras.
- **Normalize** the pixel values to [0, 1] with img.astype("float32") / 255.0 (or standardize with the dataset mean and std): inputs on one scale make training stable and faster.
- Also good: augmentation of the training set — horizontal flips, small rotations, brightness changes; a mirrored shirt is still a shirt.`,
              ru: `- **Привести к одному размеру**, например 224 × 224, предварительно дополнив фото до квадрата, чтобы длинные платья и брюки не сплющились: сети нужен вход одной формы, а фото сняты разными камерами.
- **Нормализовать** значения пикселей в [0, 1]: img.astype("float32") / 255.0 (или стандартизировать по mean и std датасета) — входы в одном масштабе делают обучение стабильнее и быстрее.
- Тоже хорошо: аугментация обучающей выборки — горизонтальные отражения, небольшие повороты, изменения яркости; отражённая рубашка остаётся рубашкой.`,
            },
          },
          {
            id: "v7-q5-d",
            label: "d",
            points: 3,
            prompt: `What metric would you use to evaluate your classifier? Explain why.`,
            rubric: [
              "1 pt — names a suitable metric: accuracy (with the confusion matrix) if the four classes are balanced; per-class precision / recall / F1 or macro-F1 if they are not.",
              "2 pts — explains why: accuracy = correct / total is easy to read and fair when classes are balanced; with imbalanced classes a model can score high by predicting the majority class and accuracy hides a weak class, so per-class metrics, macro-F1 and the confusion matrix (e.g. Shirt vs Dress confusions) are needed.",
            ],
            answer: {
              en: `If the four classes are roughly balanced (about 1,250 images each), **accuracy** = correct / total is a fair, easy summary, and I would add the **confusion matrix** to see which classes are confused (e.g. long shirts vs dresses).
If the classes are imbalanced, accuracy misleads: with 3,500 shirts out of 5,000, always answering «Shirt» already gives 3,500 / 5,000 = 70%. Then I would report per-class **precision, recall and F1** and their unweighted mean, **macro-F1**.`,
              ru: `Если классы примерно сбалансированы (около 1 250 картинок в каждом), **accuracy** = верные / все — честная и понятная сводка; к ней добавил бы **confusion matrix**, чтобы видеть, какие классы путаются (например, длинные рубашки и платья).
Если классы несбалансированы, accuracy вводит в заблуждение: при 3 500 рубашках из 5 000 ответ «всегда Shirt» уже даёт 3 500 / 5 000 = 70%. Тогда нужны **precision, recall и F1** по каждому классу и их невзвешенное среднее — **macro-F1**.`,
            },
          },
          {
            id: "v7-q5-e",
            label: "e",
            points: 3,
            prompt: `Your model performs very well on your dataset but poorly when tested using photos taken by another student's phone. Give one possible reason.`,
            rubric: [
              "1.5 pts — names a valid reason: domain shift / a different data distribution — another camera (colour processing, resolution, noise, sharpness), different lighting, background or angle; or overfitting to the conditions of the original photos.",
              "1.5 pts — explains it concretely for this scenario, e.g. the training photos are shop photos on a white background while the new phone shows clothes on a bed or worn by a person, so the cues the model relied on are missing. A fix (more varied data, augmentation, fine-tuning) may be mentioned but is not required.",
            ],
            answer: {
              en: `**Domain shift:** the new photos come from a different distribution than the training data. For example, the dataset consists of shop photos on a clean white background in even studio light, while the other student's phone gives clothes lying on a bed or worn by a person, in warm indoor light, with a different camera's colours and sharpness. The model partly learned these dataset-specific cues (background, lighting, colour processing) instead of the garment shapes, so it fails when they change.
Fix: collect training photos from several phones and settings, augment brightness, colour, blur, crops and backgrounds, and fine-tune on a few labelled photos from the new phone.`,
              ru: `**Сдвиг домена (domain shift):** новые фото из другого распределения, чем обучающие. Например, в датасете — фото магазина на чистом белом фоне при ровном студийном свете, а телефон другого студента снимает вещи на кровати или на человеке, при тёплом комнатном свете, с другой цветопередачей и резкостью. Модель частично выучила эти особенности датасета (фон, свет, обработку цвета), а не форму одежды, и ошибается, когда они меняются.
Как исправить: собрать обучающие фото с разных телефонов и в разной обстановке, аугментировать яркость, цвет, размытие, кропы и фон, дообучить на нескольких размеченных фото с нового телефона.`,
            },
          },
        ],
      },
    ],
  },
  {
    id: "v8",
    title: { en: "Variant 8 — Road signs on dashcams", ru: "Вариант 8 — дорожные знаки на видеорегистраторах" },
    minutes: 120,
    source: { en: "New practice variant built from real exam questions", ru: "Новый вариант по вопросам настоящих экзаменов" },
    questions: [
      {
        id: "v8-q1",
        title: "Question 1 — Image Processing & OpenCV",
        points: 20,
        context: `A driver-assistance startup classifies road signs in dashcam frames. The dashcams record at different resolutions (1920 × 1080 and 1280 × 720), about half of the frames are taken at night with headlight glare, and night frames are noisy.`,
        tasks: [
          {
            id: "v8-q1-a",
            label: "a",
            points: 6,
            prompt: `Propose three preprocessing operations that could be useful. For each operation, explain why you would use it.`,
            rubric: [
              "2 pts — first operation (1 pt) with a reason tied to this scenario (1 pt). Accepted: resize to one fixed size (two dashcam resolutions); cropping the sign region / ROI (a sign is a small part of the frame); denoising with a Gaussian, median or non-local-means filter (noisy night frames); brightness/contrast correction — gamma or CLAHE on the V or L channel (dark night frames, glare); normalization to [0, 1] / standardization; HSV conversion to find red and blue sign colours under different lighting.",
              "2 pts — second operation, different from the first (1 pt), with its own scenario reason (1 pt).",
              "2 pts — third different operation (1 pt) with its own scenario reason (1 pt). Two kinds of blur count as one operation; a generic reason ('it improves accuracy') earns 0 for the reason; grayscale is not a fix for darkness, noise or different resolutions.",
            ],
            answer: {
              en: `- **Crop the sign region and resize the crop to one fixed size** (e.g. 64 × 64): the two dashcams give 1920 × 1080 and 1280 × 720 frames, a sign covers only a small part of a frame, and the classifier needs one input shape.
- **Denoise the night frames** with cv2.GaussianBlur(img, (3, 3), 0) or a median / non-local-means filter: night sensor noise would otherwise create false edges and texture on the sign.
- **Correct brightness and contrast**: gamma correction or CLAHE on the V channel of HSV (or L of Lab) makes the symbol on a dark night sign visible without changing the sign's colour and limits the effect of glare.
- Also valid: normalization to [0, 1]; HSV to locate red and blue signs under different light.`,
              ru: `- **Вырезать область знака и привести её к одному размеру** (например, 64 × 64): у двух регистраторов кадры 1920 × 1080 и 1280 × 720, знак занимает малую часть кадра, а классификатору нужен вход одной формы.
- **Убрать шум с ночных кадров**: cv2.GaussianBlur(img, (3, 3), 0) или median / non-local means — иначе ночной шум сенсора даёт ложные края и текстуру на знаке.
- **Поправить яркость и контраст**: gamma-коррекция или CLAHE по каналу V в HSV (или L в Lab) — символ на тёмном ночном знаке становится виден, цвет знака не меняется, а влияние бликов от фар уменьшается.
- Тоже засчитывается: нормализация в [0, 1]; HSV, чтобы находить красные и синие знаки при разном освещении.`,
            },
          },
          {
            id: "v8-q1-b",
            label: "b",
            points: 4,
            prompt: `The student resizes every whole dashcam frame to 32 × 32 pixels before classification. Give one advantage and one disadvantage of doing this for road-sign classification.`,
            rubric: [
              "2 pts — advantage: a very small, uniform input (32 × 32 × 3 = 3,072 values) — fast enough for real-time use in a car, little memory, frames from both dashcams get the same shape. 1 pt for the advantage, 1 pt for explaining it.",
              "2 pts — disadvantage tied to this setup: a sign is a small part of the frame and almost disappears (a 64 × 64 sign in a 1280 × 720 frame becomes about 1.6 × 2.8 pixels), the digits of speed-limit signs (30 vs 80) become unreadable, and the 16:9 frame is squashed into a square, distorting shapes. A generic 'details are lost' without saying which earns 1 pt.",
            ],
            answer: {
              en: `- **Advantage:** each frame becomes only 32 × 32 × 3 = 3,072 numbers, so the classifier is fast enough for real time in a car and needs little memory, and frames from both dashcams get the same input shape.
- **Disadvantage:** the whole frame is shrunk 1280 / 32 = 40 times horizontally and 720 / 32 = 22.5 times vertically. A sign of 64 × 64 pixels becomes about 64 / 40 = 1.6 by 64 / 22.5 ≈ 2.8 pixels — the classifier can hardly see it, let alone read 30 vs 80 on a speed-limit sign. The 16:9 frame is also squashed into a square, distorting round and triangular shapes. Better: crop the sign first, then resize the crop to 32 × 32.`,
              ru: `- **Плюс:** каждый кадр — всего 32 × 32 × 3 = 3 072 числа, поэтому классификатор работает в реальном времени прямо в машине и требует мало памяти, а кадры обоих регистраторов получают одинаковую форму входа.
- **Минус:** весь кадр сжимается в 1280 / 32 = 40 раз по горизонтали и в 720 / 32 = 22.5 раза по вертикали. Знак размером 64 × 64 пикселя превращается примерно в 64 / 40 = 1.6 на 64 / 22.5 ≈ 2.8 пикселя — классификатор его почти не видит, не говоря уже о том, чтобы отличить 30 от 80 на знаке ограничения скорости. Кадр 16:9 ещё и сплющивается в квадрат, искажая круглые и треугольные формы. Лучше сначала вырезать знак, а потом привести вырезку к 32 × 32.`,
            },
          },
          {
            id: "v8-q1-c",
            label: "c",
            points: 5,
            prompt: `Consider the following code. Identify two problems and provide the corrected code.
= img = cv2.imread("frame.jpg")   # a 1280 x 720 dashcam frame
= # crop the sign at x = 600..663 (columns), y = 200..263 (rows)
= sign = img[600:664, 200:264]
= norm = sign.astype("float32") / 255.0
= cv2.imwrite("sign_check.jpg", norm)   # save the crop to look at it`,
            rubric: [
              "2 pts — problem 1: NumPy slicing is img[rows, cols] = img[y, x]; img[600:664, 200:264] takes y = 600..663 and x = 200..263 — a valid 64 × 64 crop of the wrong area (bottom-left of the frame), with no error. Fix: img[200:264, 600:664]. 1 pt for the swap and its effect, 1 pt for the fix.",
              "2 pts — problem 2: norm is a float32 array with values in [0, 1]; cv2.imwrite stores an 8-bit JPEG, so the values become about 0–1 out of 255 and the saved crop is almost black, with no error. Fix: cv2.imwrite('sign_check.jpg', (norm * 255).astype('uint8')) or save sign. 1 pt for the cause, 1 pt for the fix.",
              "1 pt — complete corrected code with both fixes. Saying the slice raises an IndexError on this 1280 × 720 frame is wrong (slices never raise; here it is a valid but wrong region) and loses this point; other remarks (no None check) earn nothing.",
            ],
            answer: {
              en: `**Problem 1 — rows and columns swapped (silent bug).** A NumPy image is indexed img[rows, cols] = img[y, x]. img[600:664, 200:264] takes rows 600–663 and columns 200–263 — a valid 64 × 64 crop, but of the wrong area (the bottom-left of the 720-row frame, probably road), so nothing crashes. (Slices never raise an IndexError: on a 640 × 480 frame the same slice would be empty, shape (0, 64, 3), and imwrite would then fail.) Fix: img[200:264, 600:664].
**Problem 2 — saving a float image (silent bug).** norm is float32 with values in [0, 1]. A JPEG is 8-bit, so cv2.imwrite turns them into values of about 0–1 out of 255 and sign_check.jpg is almost black. Fix: convert back to uint8 before saving (or save sign itself).
Corrected code:
= img = cv2.imread("frame.jpg")   # a 1280 x 720 dashcam frame
= # crop the sign at x = 600..663 (columns), y = 200..263 (rows)
= sign = img[200:264, 600:664]
= norm = sign.astype("float32") / 255.0
= cv2.imwrite("sign_check.jpg", (norm * 255).astype("uint8"))`,
              ru: `**Ошибка 1 — перепутаны строки и столбцы (тихая ошибка).** Картинка в NumPy индексируется img[строки, столбцы] = img[y, x]. img[600:664, 200:264] берёт строки 600–663 и столбцы 200–263 — корректную вырезку 64 × 64, но не из того места (левый нижний угол кадра высотой 720 строк, скорее всего дорога), поэтому ничего не падает. (Срез вообще не вызывает IndexError: на кадре 640 × 480 тот же срез был бы пустым, форма (0, 64, 3), и упал бы уже imwrite.) Исправление: img[200:264, 600:664].
**Ошибка 2 — сохранение float-картинки (тихая ошибка).** norm — float32 со значениями в [0, 1]. JPEG 8-битный, поэтому cv2.imwrite превращает их в значения около 0–1 из 255, и sign_check.jpg получается почти чёрным. Исправление: перед сохранением вернуть масштаб и тип uint8 (или сохранить сам sign).
Исправленный код:
= img = cv2.imread("frame.jpg")   # a 1280 x 720 dashcam frame
= # crop the sign at x = 600..663 (columns), y = 200..263 (rows)
= sign = img[200:264, 600:664]
= norm = sign.astype("float32") / 255.0
= cv2.imwrite("sign_check.jpg", (norm * 255).astype("uint8"))`,
            },
          },
          {
            id: "v8-q1-d",
            label: "d",
            points: 5,
            prompt: `A student says: "Random horizontal flipping should be used for every image dataset, because it doubles the training data for free." Do you agree? Explain using one example.`,
            rubric: [
              "1 pt — clear position: do not agree; augmentation is only valid when it keeps the label correct.",
              "2 pts — reason: a flip is safe only if the mirrored image is still a realistic example of the same class; for classes defined by left/right direction or containing text/digits, flipping creates wrong labels or unrealistic images.",
              "2 pts — one concrete example: a 'Turn left' sign flipped looks like a 'Turn right' sign but keeps the label 'Turn left' (or 'Keep right' ↔ 'Keep left'); mirrored digits on a speed-limit sign; handwritten letters (b ↔ d). Mentioning where flips are fine (birds, cats, concrete cracks) is good but not required.",
            ],
            answer: {
              en: `I do not agree. Augmentation must keep the label correct: a flipped image is only «free data» if the mirror image is still a realistic example of the **same** class.
Example: in this road-sign dataset, cv2.flip(img, 1) turns a **Turn left** sign into a picture of a **Turn right** sign, while the label still says Turn left. The model is trained on contradictory labels and starts mixing up exactly these two classes. Mirrored digits on a «Speed limit 30» sign also never appear on real roads. The same problem exists for handwritten letters (b ↔ d) and text.
Flips are fine where left and right do not matter — birds, cats, concrete cracks — so augmentation must be chosen per dataset; for signs I would use small rotations, brightness changes and blur instead.`,
              ru: `Не согласен. Аугментация не должна портить метку: отражённая картинка — «бесплатные данные», только если зеркальное изображение по-прежнему правдоподобный пример **того же** класса.
Пример: в датасете дорожных знаков cv2.flip(img, 1) превращает знак **Turn left** в картинку знака **Turn right**, а метка остаётся Turn left. Модель учится на противоречивых метках и начинает путать как раз эти два класса. Зеркальные цифры на знаке «Speed limit 30» тоже не встречаются на настоящих дорогах. Та же проблема с рукописными буквами (b ↔ d) и текстом.
Отражения уместны там, где лево и право не важны, — птицы, кошки, трещины в бетоне, — поэтому аугментацию выбирают под датасет; для знаков я взял бы небольшие повороты, изменения яркости и размытие.`,
            },
          },
        ],
      },
      {
        id: "v8-q2",
        title: "Question 2 — Image Classification",
        points: 20,
        context: `A classifier produces the following scores:
| Image | Stop | Yield | Speed limit | True class |
|---|---|---|---|---|
| A | 3.2 | 0.5 | -1.0 | Stop |
| B | 0.4 | 0.9 | 2.2 | Speed limit |
| C | 1.1 | 1.4 | 0.6 | Stop |
| D | -0.7 | 2.5 | 0.3 | Yield |
| E | 0.8 | -0.2 | 1.5 | Speed limit |`,
        tasks: [
          {
            id: "v8-q2-a",
            label: "a",
            points: 4,
            prompt: `Write the predicted class for A, B, C, D, and E.`,
            rubric: [
              "1 pt — A: Stop (3.2) and B: Speed limit (2.2); 0.5 pts each.",
              "1 pt — C: Yield, because 1.4 > 1.1 > 0.6. Writing the true class (Stop) instead of the prediction earns 0.",
              "1 pt — D: Yield (2.5).",
              "1 pt — E: Speed limit (1.5 > 0.8 > -0.2).",
            ],
            answer: {
              en: `The predicted class is the argmax of each row, whatever the true class is:
- A: max(3.2, 0.5, -1.0) = 3.2 → **Stop**
- B: max(0.4, 0.9, 2.2) = 2.2 → **Speed limit**
- C: max(1.1, 1.4, 0.6) = 1.4 → **Yield**
- D: max(-0.7, 2.5, 0.3) = 2.5 → **Yield**
- E: max(0.8, -0.2, 1.5) = 1.5 → **Speed limit**`,
              ru: `Предсказанный класс — argmax каждой строки, независимо от истинного класса:
- A: max(3.2, 0.5, -1.0) = 3.2 → **Stop**
- B: max(0.4, 0.9, 2.2) = 2.2 → **Speed limit**
- C: max(1.1, 1.4, 0.6) = 1.4 → **Yield**
- D: max(-0.7, 2.5, 0.3) = 2.5 → **Yield**
- E: max(0.8, -0.2, 1.5) = 1.5 → **Speed limit**`,
            },
          },
          {
            id: "v8-q2-b",
            label: "b",
            points: 4,
            prompt: `Calculate classification accuracy. Show your calculation.`,
            rubric: [
              "2 pts — compares every prediction with the true class: A ✓, B ✓, C ✗, D ✓, E ✓ → 4 correct out of 5.",
              "2 pts — accuracy = correct / total = 4 / 5 = 0.8 = 80%. Follow-through: full points for a correct division based on the student's own predictions from a).",
            ],
            answer: {
              en: `Compare each prediction with the true class: A Stop ✓, B Speed limit ✓, C Yield ≠ Stop ✗, D Yield ✓, E Speed limit ✓.
= accuracy = correct / total = 4 / 5 = 0.8 = 80%`,
              ru: `Сравниваем каждое предсказание с истинным классом: A Stop ✓, B Speed limit ✓, C Yield ≠ Stop ✗, D Yield ✓, E Speed limit ✓.
= accuracy = correct / total = 4 / 5 = 0.8 = 80%`,
            },
          },
          {
            id: "v8-q2-c",
            label: "c",
            points: 4,
            prompt: `Which image(s) were incorrectly classified? For each, give the predicted and the true class.`,
            rubric: [
              "2 pts — only C is misclassified; A, B, D and E are correct. Listing an extra image earns at most 1 pt for this line.",
              "2 pts — for C: predicted Yield (score 1.4), true class Stop (score 1.1).",
            ],
            answer: {
              en: `Only **C**: the classifier predicts **Yield** (1.4), but the true class is **Stop** (1.1). The margin is small (0.3) — for example a dark night frame in which the red Stop sign is hard to see. All other images are classified correctly.`,
              ru: `Только **C**: классификатор предсказал **Yield** (1.4), а истинный класс — **Stop** (1.1). Отрыв маленький (0.3) — например, тёмный ночной кадр, где красный знак Stop плохо виден. Остальные картинки классифицированы верно.`,
            },
          },
          {
            id: "v8-q2-d",
            label: "d",
            points: 4,
            prompt: `A teammate applies softmax to the scores of image C. Explain the difference between a class score and a class probability. Does the predicted class of C change after softmax?`,
            rubric: [
              "1.5 pts — scores (logits) are raw, unbounded real numbers of any sign that do not sum to anything; only their order and differences matter.",
              "1.5 pts — softmax turns them into probabilities: p_k = exp(s_k) / Σ exp(s_j), each in (0, 1), all summing to 1. For C ≈ [0.34, 0.46, 0.21] — the numbers are a bonus, not required.",
              "1 pt — the prediction does not change: softmax is monotonic, so the largest score keeps the largest probability → C is still Yield.",
            ],
            answer: {
              en: `A **score** (logit) is the raw output of the classifier: any real number, possibly negative, not bounded and not summing to anything — it only says which class is preferred. A **probability** comes from softmax: exp makes every value positive, and dividing by the sum puts the values in (0, 1) and makes them add up to 1.
= exp(1.1) = 3.004,   exp(1.4) = 4.055,   exp(0.6) = 1.822,   sum = 8.881
= p = [3.004, 4.055, 1.822] / 8.881 ≈ [0.34, 0.46, 0.21]
The predicted class does **not** change: exp is increasing, so the largest score (Yield, 1.4) keeps the largest probability (0.46). Softmax only shows that the model is not confident about C.`,
              ru: `**Оценка (score, logit)** — сырой выход классификатора: любое действительное число, может быть отрицательным, ничем не ограничено и ни к чему не суммируется — показывает лишь, какой класс предпочтительнее. **Вероятность** даёт softmax: exp делает все значения положительными, а деление на сумму переводит их в (0, 1) так, что в сумме получается 1.
= exp(1.1) = 3.004,   exp(1.4) = 4.055,   exp(0.6) = 1.822,   sum = 8.881
= p = [3.004, 4.055, 1.822] / 8.881 ≈ [0.34, 0.46, 0.21]
Предсказанный класс **не меняется**: exp возрастает, поэтому у наибольшей оценки (Yield, 1.4) и наибольшая вероятность (0.46). Softmax лишь показывает, что модель в C не уверена.`,
            },
          },
          {
            id: "v8-q2-e",
            label: "e",
            points: 4,
            prompt: `A linear classifier trained on raw 32 × 32 pixels reaches 58% training accuracy and 55% test accuracy. What is the likely problem? Give one possible solution.`,
            rubric: [
              "2 pts — underfitting (high bias): the model is too simple — even the training set is not learned (58%), and the small 3-point gap shows it is NOT overfitting. 'Overfitting' earns 0 for the whole sub-question.",
              "2 pts — one fix that increases the model's capacity, with a reason: a more expressive model (neural network with hidden layers / CNN, pretrained network), better features, longer training, weaker regularization (smaller λ), a larger input or a crop of the sign. Dropout, stronger regularization or 'more data' alone earn 0.",
            ],
            answer: {
              en: `**Underfitting.** The training accuracy itself is low (58%) and the test accuracy is close to it (55%), so the model has not even learned the training set — it is too simple: one linear template per class cannot capture signs seen by day and night, at different sizes and angles. This is the opposite of overfitting, so dropout or stronger regularization would not help.
Fix: a more powerful model — e.g. a small CNN that learns edge and shape features, or a pretrained network — or train longer and reduce regularization (smaller λ).`,
              ru: `**Недообучение (underfitting).** Точность уже на обучающей выборке низкая (58%), а на тесте близкая к ней (55%) — модель не выучила даже обучающие данные, она слишком простая: один линейный шаблон на класс не охватывает знаки днём и ночью, разного размера и под разными углами. Это противоположность переобучения, поэтому dropout или более сильная регуляризация не помогут.
Решение: более мощная модель — например, небольшая CNN, которая сама выучивает признаки краёв и форм, или предобученная сеть, — либо учить дольше и ослабить регуляризацию (меньше λ).`,
            },
          },
        ],
      },
      {
        id: "v8-q3",
        title: "Question 3 — Linear Classifier",
        points: 25,
        context: `Consider a three-class linear image classifier: s = Wx + b
= x = [3, -2]ᵀ
= W = [[1, 2], [2, -1], [-1, -3]]
= b = [2, -3, 1]ᵀ
Classes: 0 = Stop, 1 = Yield, 2 = Speed limit`,
        tasks: [
          {
            id: "v8-q3-a",
            label: "a",
            points: 12,
            prompt: `Calculate s = Wx + b. Show every step.`,
            rubric: [
              "3 pts — row 0 (Stop): 1·3 + 2·(-2) = 3 - 4 = -1, then -1 + 2 = 1. 1 pt for the products, 1 pt for the sum -1, 1 pt for adding b0.",
              "3 pts — row 1 (Yield): 2·3 + (-1)·(-2) = 6 + 2 = 8, then 8 + (-3) = 5 (same split; (-1)·(-2) = +2 is the usual trap).",
              "3 pts — row 2 (Speed limit): (-1)·3 + (-3)·(-2) = -3 + 6 = 3, then 3 + 1 = 4 (same split).",
              "3 pts — the final vector clearly stated: s = [1, 5, 4]ᵀ, with Wx = [-1, 8, 3] shown before adding b. A bare final answer without steps earns at most these 3 pts.",
            ],
            answer: {
              en: `Each score is one row of W times x, plus the bias of that class.
= Wx[0] = 1·3 + 2·(-2) = 3 - 4 = -1
= Wx[1] = 2·3 + (-1)·(-2) = 6 + 2 = 8
= Wx[2] = (-1)·3 + (-3)·(-2) = -3 + 6 = 3
= Wx = [-1, 8, 3]
= s = Wx + b = [-1 + 2, 8 + (-3), 3 + 1] = [1, 5, 4]`,
              ru: `Каждая оценка — строка W, умноженная на x, плюс bias этого класса.
= Wx[0] = 1·3 + 2·(-2) = 3 - 4 = -1
= Wx[1] = 2·3 + (-1)·(-2) = 6 + 2 = 8
= Wx[2] = (-1)·3 + (-3)·(-2) = -3 + 6 = 3
= Wx = [-1, 8, 3]
= s = Wx + b = [-1 + 2, 8 + (-3), 3 + 1] = [1, 5, 4]`,
            },
          },
          {
            id: "v8-q3-b",
            label: "b",
            points: 3,
            prompt: `What class does the classifier predict?`,
            rubric: [
              "2 pts — class 1, Yield.",
              "1 pt — reason: the prediction is argmax(s), the index of the largest score 5. Follow-through: if s in a) was wrong, full points for the correct argmax of the student's own s.",
            ],
            answer: {
              en: `argmax(s) = argmax([1, 5, 4]) = 1 → **Yield** (5 > 4 > 1).`,
              ru: `argmax(s) = argmax([1, 5, 4]) = 1 → **Yield** (5 > 4 > 1).`,
            },
          },
          {
            id: "v8-q3-c",
            label: "c",
            points: 5,
            prompt: `Suppose this sign is really a Speed limit sign (class 2). Compute the multiclass SVM (hinge) loss with margin 1, showing each term. By how much would b2 have to increase for the loss to become 0?`,
            rubric: [
              "1 pt — the formula: L = Σ over j ≠ y of max(0, s_j - s_y + 1), with y = Speed limit and s_y = 4.",
              "1.5 pts — the Stop term: max(0, 1 - 4 + 1) = max(0, -2) = 0.",
              "1.5 pts — the Yield term: max(0, 5 - 4 + 1) = max(0, 2) = 2, so L = 0 + 2 = 2.",
              "1 pt — b2 must increase by at least 2 (then s2 = 6 and max(0, 5 - 6 + 1) = 0). Answering 1 (enough to tie Yield but not to beat it by the margin) earns 0 for this line.",
            ],
            answer: {
              en: `Multiclass SVM loss for the true class y = Speed limit (s_y = 4):
= L = Σ (j ≠ y) max(0, s_j - s_y + 1)
= Stop:   max(0, 1 - 4 + 1) = max(0, -2) = 0
= Yield:  max(0, 5 - 4 + 1) = max(0, 2) = 2
= L = 0 + 2 = 2
Stop is already more than the margin below the correct score, so it adds nothing; Yield beats the correct class, so it is penalized. For L = 0 the correct score must exceed every other score by at least the margin: s2 ≥ 5 + 1 = 6, so b2 must grow by at least **2** (from 1 to 3).`,
              ru: `Multiclass SVM loss для истинного класса y = Speed limit (s_y = 4):
= L = Σ (j ≠ y) max(0, s_j - s_y + 1)
= Stop:   max(0, 1 - 4 + 1) = max(0, -2) = 0
= Yield:  max(0, 5 - 4 + 1) = max(0, 2) = 2
= L = 0 + 2 = 2
Stop и так ниже правильной оценки больше чем на отступ — вклад 0; Yield обгоняет правильный класс — за это штраф. Чтобы L = 0, правильная оценка должна быть больше каждой другой хотя бы на отступ: s2 ≥ 5 + 1 = 6, значит, b2 нужно увеличить минимум на **2** (с 1 до 3).`,
            },
          },
          {
            id: "v8-q3-d",
            label: "d",
            points: 5,
            prompt: `In your data, Speed limit signs photographed by day and at night form two separate clusters, and the Stop signs lie between them (along one feature: night Speed limit | Stop | day Speed limit). Can a single linear classifier separate Speed limit from Stop here? Explain why, and suggest one way to fix it. You may include a small drawing.`,
            rubric: [
              "1 pt — answer: no.",
              "2 pts — why: a linear classifier's boundary is a straight line / hyperplane; along that feature the difference of the two scores is a linear function that changes sign at most once (one threshold), so it cannot put both outer clusters on the Speed limit side and the middle one on the Stop side; each class gets one convex region, one template, and this class is multi-modal.",
              "2 pts — a fix: split Speed limit into two sub-classes (day / night) and merge their predictions; a non-linear model (neural network with a hidden layer, CNN, kNN) or non-linear features; brightness normalization that pulls the two clusters together is also accepted.",
            ],
            answer: {
              en: `No. Along that feature the data look like this:
= SL(night)  o o o     x x x  Stop     o o o  SL(day)
The difference of the two linear scores, (w_SL - w_Stop)·x + (b_SL - b_Stop), is a linear function, so it changes sign at most once: one straight boundary can put the left or the right cluster on the Speed-limit side, but never both while Stop stays in the middle. In general a linear classifier gives each class one convex region — one template — so a class made of two separate modes with another class between them cannot be captured (like the horse template with two heads).
Fix: split the class into «Speed limit (day)» and «Speed limit (night)» and merge them after prediction; or use a non-linear model — a neural network with a hidden layer, a CNN or kNN; or normalize brightness (CLAHE, gamma) so day and night signs fall into one cluster.`,
              ru: `Нет. Вдоль этого признака данные выглядят так:
= SL(night)  o o o     x x x  Stop     o o o  SL(day)
Разность двух линейных оценок, (w_SL - w_Stop)·x + (b_SL - b_Stop), — линейная функция, она меняет знак не больше одного раза: одна прямая граница может отнести к Speed limit левое или правое облако, но не оба сразу, если Stop лежит посередине. В общем случае линейный классификатор даёт каждому классу одну выпуклую область — один шаблон, — поэтому класс из двух отдельных мод, между которыми лежит другой класс, он не охватит (как шаблон лошади с двумя головами).
Как исправить: разбить класс на «Speed limit (day)» и «Speed limit (night)» и объединять их после предсказания; или взять нелинейную модель — нейросеть со скрытым слоем, CNN или kNN; или выровнять яркость (CLAHE, gamma), чтобы дневные и ночные знаки попали в одно облако.`,
            },
          },
        ],
      },
      {
        id: "v8-q4",
        title: "Question 4 — Understand the CV Pipeline",
        points: 20,
        context: `A student wrote the following image-processing pipeline:
= img = cv2.imread("sign.jpg")
= img = cv2.resize(img, (128, 96))
= rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
= small = cv2.resize(rgb, (48, 32))
= x = small.astype("float32") / 255.0`,
        tasks: [
          {
            id: "v8-q4-a",
            label: "a",
            points: 5,
            prompt: `Write the shape of img after the first resize and the shape of small.`,
            rubric: [
              "2.5 pts — img after the first resize: (96, 128, 3) — dsize is (width, height), the shape is (height, width, channels). (128, 96, 3) earns 0 for this line; (96, 128) without the channels earns 1.5.",
              "2.5 pts — small: (32, 48, 3). (48, 32, 3) earns 0 for this line; (32, 48) without the channels earns 1.5.",
            ],
            answer: {
              en: `cv2.resize takes dsize = (width, height), while a NumPy shape is (height, width, channels); BGR2RGB keeps 3 channels.
= img = cv2.resize(img, (128, 96))    → img.shape = (96, 128, 3)
= small = cv2.resize(rgb, (48, 32))   → small.shape = (32, 48, 3)`,
              ru: `cv2.resize принимает dsize = (ширина, высота), а форма массива NumPy — (высота, ширина, каналы); BGR2RGB оставляет 3 канала.
= img = cv2.resize(img, (128, 96))    → img.shape = (96, 128, 3)
= small = cv2.resize(rgb, (48, 32))   → small.shape = (32, 48, 3)`,
            },
          },
          {
            id: "v8-q4-b",
            label: "b",
            points: 5,
            prompt: `How many channels does rgb have? If img[0, 0] is [30, 60, 200], what is rgb[0, 0], and what colour is this pixel?`,
            rubric: [
              "2 pts — rgb still has 3 channels; the shape (96, 128, 3) is unchanged. '1 channel' earns 0 for this line.",
              "2 pts — rgb[0, 0] = [200, 60, 30]: the B and R values are swapped, G stays, no value changes.",
              "1 pt — the pixel is red (R = 200 is the strongest; in img it is stored as B = 30, G = 60, R = 200); the colour itself does not change, only the storage order. Calling it blue earns 0.",
            ],
            answer: {
              en: `rgb has **3 channels**, shape (96, 128, 3): BGR2RGB only reorders the channels; it does not add, remove or change any value.
= img[0, 0] = [30, 60, 200]   → B = 30, G = 60, R = 200
= rgb[0, 0] = [200, 60, 30]   → R = 200, G = 60, B = 30
The pixel is **red** (strong R, weak G and B) in both arrays — a typical Stop-sign colour; only the order in memory changed, which matters for matplotlib and for models trained on RGB images.`,
              ru: `У rgb **3 канала**, форма (96, 128, 3): BGR2RGB только переставляет каналы и не добавляет, не убирает и не меняет значения.
= img[0, 0] = [30, 60, 200]   → B = 30, G = 60, R = 200
= rgb[0, 0] = [200, 60, 30]   → R = 200, G = 60, B = 30
Пиксель **красный** (сильный R, слабые G и B) в обоих массивах — типичный цвет знака Stop; изменился только порядок хранения, а это важно для matplotlib и моделей, обученных на RGB.`,
            },
          },
          {
            id: "v8-q4-c",
            label: "c",
            points: 5,
            prompt: `Why are the values divided by 255.0? What dtype and range does x have? What range would you get with small / 127.5 - 1 instead?`,
            rubric: [
              "2 pts — why: small is uint8 with values 0–255; dividing normalizes all inputs to one small common scale, which makes gradient-based training more stable and faster and matches the scale a model expects.",
              "2 pts — x is float32 (because of astype) with values in [0, 1]; the shape stays (32, 48, 3).",
              "1 pt — small / 127.5 - 1 gives values in [-1, 1] (0 → -1, 255 → 1), centred around 0.",
            ],
            answer: {
              en: `small is uint8 with values 0–255. Dividing by 255.0 is **normalization**: every input lands in the same small range, so weights and gradients stay on a reasonable scale and training is more stable and faster; pretrained models also expect a fixed input scale.
= x = small.astype("float32") / 255.0   → float32, shape (32, 48, 3), values in [0.0, 1.0]
= small / 127.5 - 1   → values in [-1.0, 1.0]:   0 → -1.0,   127.5 → 0.0,   255 → 1.0
The second version also centres the data around 0, which some networks expect.`,
              ru: `small — uint8 со значениями 0–255. Деление на 255.0 — **нормализация**: все входы попадают в один небольшой диапазон, веса и градиенты остаются в разумном масштабе, обучение стабильнее и быстрее; предобученные модели тоже ждут фиксированный масштаб входа.
= x = small.astype("float32") / 255.0   → float32, shape (32, 48, 3), values in [0.0, 1.0]
= small / 127.5 - 1   → values in [-1.0, 1.0]:   0 → -1.0,   127.5 → 0.0,   255 → 1.0
Второй вариант ещё и центрирует данные около 0 — некоторые сети ждут именно такой вход.`,
            },
          },
          {
            id: "v8-q4-d",
            label: "d",
            points: 5,
            prompt: `Your client also wants to tell permanent warning signs (white background) from temporary road-works warning signs (yellow background, the same red triangle and the same black symbol). Would you convert the images to edges before classification? Explain.`,
            rubric: [
              "1 pt — decision: no, not edges alone.",
              "2 pts — reason: Canny returns a single-channel 0/255 map of brightness changes; the triangle outline and the symbol are the same in both classes, and the only difference — a white vs a yellow background — is uniform inside the sign and produces no edges, so the edge maps are (almost) identical and the classes cannot be told apart.",
              "2 pts — instead: keep the colour image (RGB, or HSV where saturation/hue separate yellow from white), possibly with white balance or brightness correction for night frames; edges may only be added as extra shape information.",
            ],
            answer: {
              en: `No. cv2.Canny produces a single-channel map with values 0 and 255 that marks only strong brightness changes. Both classes have the same red triangle and the same black symbol, so their edges are in the same places; the only difference is the background colour inside the triangle, which is uniform and produces no edges at all. After edge detection the two classes look the same, so the classifier cannot learn the difference.
I would keep the colour: the RGB image, or HSV, where yellow (high saturation, hue ≈ 30 in OpenCV) and white (saturation ≈ 0) are clearly separated — with brightness and white-balance correction for night frames under yellowish headlights. Edges could be added as extra shape features, never as the only input.`,
              ru: `Нет. cv2.Canny даёт одноканальную карту со значениями 0 и 255, где отмечены только резкие перепады яркости. У обоих классов одинаковые красный треугольник и чёрный символ, поэтому края на тех же местах; единственное отличие — цвет фона внутри треугольника, он однородный и краёв не даёт вовсе. После выделения краёв два класса выглядят одинаково, и классификатор не может выучить разницу.
Я оставил бы цвет: RGB или HSV, где жёлтый (высокая насыщенность, hue ≈ 30 в OpenCV) и белый (насыщенность ≈ 0) чётко разделены, — с коррекцией яркости и баланса белого для ночных кадров при желтоватом свете фар. Края можно добавить как дополнительные признаки формы, но не как единственный вход.`,
            },
          },
        ],
      },
      {
        id: "v8-q5",
        title: "Question 5 — Design Your Own CV System",
        points: 15,
        context: `You need to develop a system that inspects concrete walls from drone photos: No defect | Crack | Spalling | Rust stain. You have collected 3,200 images: 2,240 No defect, 480 Crack, 320 Spalling and 160 Rust stain.`,
        tasks: [
          {
            id: "v8-q5-a",
            label: "a",
            points: 3,
            prompt: `How would you organize the dataset?`,
            rubric: [
              "1 pt — one folder (or one label column) per class: no_defect/, crack/, spalling/, rust_stain/, with checked labels.",
              "1 pt — separate train / validation / test parts that never overlap.",
              "1 pt — keep the photos of one wall section (and ideally one building) together in one part and record where each photo comes from; or other concrete hygiene: remove duplicates, count images per class, stratify so the rare Rust stain class is in every part.",
            ],
            answer: {
              en: `= data/train/no_defect/   data/train/crack/   data/train/spalling/   data/train/rust_stain/
= data/val/...   data/test/...   (the same four class folders)
- One folder per class, labels checked by an engineer on a sample; a CSV records the building and wall section of every photo.
- Train, validation and test never overlap; every part contains all four classes, including the rare Rust stain (stratified).
- Shots of the same wall section taken seconds apart stay together in one part, so near-duplicates cannot leak from train into test.`,
              ru: `= data/train/no_defect/   data/train/crack/   data/train/spalling/   data/train/rust_stain/
= data/val/...   data/test/...   (the same four class folders)
- По папке на класс, метки выборочно проверены инженером; в CSV записано, с какого здания и участка стены каждое фото.
- Train, validation и test не пересекаются; в каждой части есть все четыре класса, включая редкий Rust stain (стратификация).
- Снимки одного участка стены, сделанные с разницей в секунды, остаются вместе в одной части, чтобы почти-дубликаты не утекли из train в test.`,
            },
          },
          {
            id: "v8-q5-b",
            label: "b",
            points: 3,
            prompt: `Propose a train/validation/test split and calculate the number of images in each part for every class.`,
            rubric: [
              "1 pt — a sensible ratio (e.g. 70/15/15 or 80/10/10), applied per class (stratified) so the rare Rust stain class appears in every part.",
              "1 pt — correct totals: 70/15/15 → 2,240 / 480 / 480 (80/10/10 → 2,560 / 320 / 320).",
              "1 pt — correct per-class counts, e.g. for 70/15/15: No defect 1,568 / 336 / 336, Crack 336 / 72 / 72, Spalling 224 / 48 / 48, Rust stain 112 / 24 / 24 (for 80/10/10: 1,792 / 224 / 224, 384 / 48 / 48, 256 / 32 / 32, 128 / 16 / 16).",
            ],
            answer: {
              en: `70% train / 15% validation / 15% test, separately for every class (stratified):
| Class | Total | Train 70% | Val 15% | Test 15% |
|---|---|---|---|---|
| No defect | 2,240 | 1,568 | 336 | 336 |
| Crack | 480 | 336 | 72 | 72 |
| Spalling | 320 | 224 | 48 | 48 |
| Rust stain | 160 | 112 | 24 | 24 |
| Total | 3,200 | 2,240 | 480 | 480 |
Each part keeps the 70 / 15 / 10 / 5% class mix. Validation is for tuning; the test part is used once at the end.`,
              ru: `70% train / 15% validation / 15% test, отдельно для каждого класса (стратифицированно):
| Класс | Всего | Train 70% | Val 15% | Test 15% |
|---|---|---|---|---|
| No defect | 2,240 | 1,568 | 336 | 336 |
| Crack | 480 | 336 | 72 | 72 |
| Spalling | 320 | 224 | 48 | 48 |
| Rust stain | 160 | 112 | 24 | 24 |
| Итого | 3,200 | 2,240 | 480 | 480 |
В каждой части сохраняется соотношение классов 70 / 15 / 10 / 5%. Validation — для настройки, test используется один раз в конце.`,
            },
          },
          {
            id: "v8-q5-c",
            label: "c",
            points: 3,
            prompt: `Give two preprocessing or augmentation operations you would use and explain why.`,
            rubric: [
              "1.5 pts — first operation with a scenario reason: cutting the large photos into fixed-size tiles or resizing carefully (thin cracks must survive); normalization; brightness/contrast correction or CLAHE (shadows, wet concrete); augmentation with flips and 90° rotations (a crack has no fixed orientation, so the label stays correct); brightness/colour jitter (sun vs shade); denoising. 0.5 pts if no reason is given.",
              "1.5 pts — second, different operation with a reason. Heavy blur or strong downscaling that erases hairline cracks earns 0.",
            ],
            answer: {
              en: `- **Cut the large drone photos into fixed-size tiles** (e.g. 224 × 224) instead of shrinking the whole photo: hairline cracks are only a few pixels wide and would disappear after strong downscaling.
- **Augment the training set with flips, 90° rotations and brightness changes**: a crack or a rust stain is the same defect in any orientation, so the label stays correct (unlike road signs), and brightness changes cover sun, shade and wet concrete. This also gives the rare classes more variety.
- Also fine: normalization to [0, 1], CLAHE for shadowed areas.`,
              ru: `- **Резать большие фото с дрона на тайлы фиксированного размера** (например, 224 × 224), а не сжимать фото целиком: волосяные трещины шириной в несколько пикселей при сильном уменьшении исчезнут.
- **Аугментировать обучающую выборку отражениями, поворотами на 90° и изменением яркости**: трещина или ржавое пятно — тот же дефект в любой ориентации, метка не портится (в отличие от дорожных знаков), а яркость покрывает солнце, тень и мокрый бетон. Заодно редкие классы получают больше разнообразия.
- Тоже подходит: нормализация в [0, 1], CLAHE для затенённых участков.`,
            },
          },
          {
            id: "v8-q5-d",
            label: "d",
            points: 3,
            prompt: `What metric would you use to evaluate your classifier? Explain why plain accuracy can be misleading on this dataset.`,
            rubric: [
              "1 pt — names suitable metrics: per-class recall (especially for the defect classes), precision and F1, macro-F1, and/or the confusion matrix.",
              "2 pts — explains with the data: 70% of the images are No defect, so a model that always answers No defect gets 2,240 / 3,200 = 70% accuracy (336 / 480 on the test part) while finding no defects at all — recall 0 for Crack, Spalling and Rust stain (macro-F1 only about 0.21).",
            ],
            answer: {
              en: `Accuracy is dominated by the majority class:
= always «No defect»:  accuracy = 2,240 / 3,200 = 70%   (test: 336 / 480 = 70%)
= recall(Crack) = recall(Spalling) = recall(Rust stain) = 0
= F1(No defect) = 2 · 0.7 · 1 / (0.7 + 1) ≈ 0.82,   macro-F1 = 0.82 / 4 ≈ 0.21
I would report per-class **precision, recall and F1**, their unweighted mean **macro-F1**, and the **confusion matrix**. Recall of the defect classes matters most: a missed crack is more dangerous than a false alarm that an engineer can check.`,
              ru: `Accuracy определяется самым большим классом:
= always «No defect»:  accuracy = 2,240 / 3,200 = 70%   (test: 336 / 480 = 70%)
= recall(Crack) = recall(Spalling) = recall(Rust stain) = 0
= F1(No defect) = 2 · 0.7 · 1 / (0.7 + 1) ≈ 0.82,   macro-F1 = 0.82 / 4 ≈ 0.21
Я бы смотрел **precision, recall и F1** по каждому классу, их невзвешенное среднее **macro-F1** и **confusion matrix**. Важнее всего recall классов-дефектов: пропущенная трещина опаснее ложной тревоги, которую инженер проверит.`,
            },
          },
          {
            id: "v8-q5-e",
            label: "e",
            points: 3,
            prompt: `Many photos are near-duplicates: the drone took 5–10 shots of the same wall section seconds apart, and you split the images randomly. Test accuracy is 96%, but on a new building it drops to 66%. Give one possible reason and a fix.`,
            rubric: [
              "1.5 pts — a valid reason, explained: data leakage — near-identical shots of the same wall section ended up in both train and test, so the test set measured memorization and 96% was over-optimistic; or domain shift — the new building has a different concrete colour/texture, lighting, drone camera or distance.",
              "1.5 pts — a matching fix: split by group (all photos of one wall section / building in the same part) and test on buildings never seen in training; for domain shift — collect photos from more buildings and conditions, augment brightness/colour/blur, fine-tune on a few labelled photos of the new building.",
            ],
            answer: {
              en: `Most likely **data leakage**: with a random split, almost identical photos of the same wall section ended up in both train and test, so the test set did not contain truly new walls. The model could recognize the wall instead of the defect, and 96% was over-optimistic. On a really new building this advantage disappears (66%); a different concrete colour, light or camera (domain shift) adds to the drop.
Fix: split **by group** — all photos of one wall section, ideally of one building, go to the same part — and test on buildings never seen in training; add photos from more buildings and augment brightness and colour.`,
              ru: `Скорее всего, **утечка данных (data leakage)**: при случайном разбиении почти одинаковые снимки одного участка стены попали и в train, и в test, поэтому в test не было по-настоящему новых стен. Модель могла узнавать саму стену, а не дефект, и 96% — завышенная оценка. На действительно новом здании это преимущество пропадает (66%); другой цвет бетона, свет или камера (domain shift) добавляют к падению.
Как исправить: разбивать **по группам** — все снимки одного участка стены, а лучше одного здания, в одну часть — и тестировать на зданиях, которых не было в обучении; добавить фото с большего числа зданий и аугментировать яркость и цвет.`,
            },
          },
        ],
      },
    ],
  },
];
