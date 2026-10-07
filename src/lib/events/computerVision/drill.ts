import { part, qx, tfx, type Lecture } from "../types";

/**
 * Практика в формате мидтерма: те же пять типов вопросов, что в варианте 1
 * и в варианте другой группы (ткани). В конспектах — полные образцовые
 * ответы на оба варианта и по 2–3 новых варианта той же структуры; вопросы
 * тренируют рассуждение, а не один конкретный вариант.
 */
export const drill: Lecture = {
  id: "cv-drill",
  title: { en: "Exam practice — the midterm format", ru: "Практика — формат мидтерма" },
  parts: [
    part(
      "cv-drill-p1",
      { en: "OpenCV basics and bug hunting", ru: "Основы OpenCV и поиск ошибок" },
      {
        en: `## How Question 1 tests OpenCV
Every variant has the same item: three lines of OpenCV with **two planted bugs** — name the line, say **why** it is wrong and write the **corrected code**. The file name and the bugs change from variant to variant, so learn the **rule each call obeys**.
- Some bugs **crash** (an even kernel, a missing argument, the wrong number of channels).
- Others **run silently** and give wrong numbers (RGB instead of BGR, width and height swapped) — say which kind you found.
## What cv2.imread gives you
@diagram cv-image-array
= img = cv2.imread("leaf.jpg")
= img.shape    # (height, width, 3), dtype uint8, values 0..255, order B, G, R
= gray = cv2.imread("leaf.jpg", cv2.IMREAD_GRAYSCALE)
= gray.shape   # (height, width)
- **imread** returns a NumPy array with the channels in **BGR** order, not RGB. **IMREAD_COLOR** is the default; **IMREAD_UNCHANGED** keeps an alpha channel.
- A missing or misspelled file returns **None** — no exception. The crash comes one line later, inside cvtColor or resize, so guard the read:
= if img is None:
=     raise FileNotFoundError("leaf.jpg")
- A grayscale array has **two** numbers in its shape: h, w, c = gray.shape fails, while h, w = img.shape[:2] works for colour and gray.
## The rules behind the planted bugs
| Call | Rule | Typical planted bug | What happens |
|---|---|---|---|
| cv2.imread(path) | BGR, (h, w, 3); None if missing | wrong file name | crash on the next line |
| cv2.cvtColor(img, code) | the code must match the input | COLOR_RGB2GRAY after imread | runs, wrong gray values |
| cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY) | needs 3 channels | image already gray | error |
| cv2.resize(img, (w, h)) | dsize is (WIDTH, HEIGHT) | (h, w) passed | runs, wrong size |
| cv2.GaussianBlur(src, k, sigmaX) | k odd and positive; sigmaX required | (4, 4) or no sigmaX | error |
| cv2.medianBlur(src, k) | k is an odd int > 1 | 4 or (5, 5) | error |
| cv2.threshold(src, t, maxval, type) | type required; returns (ret, dst) | type missing | error |
| THRESH_OTSU flag | single-channel image | Otsu on a colour image | error |
| cv2.equalizeHist(src) | 8-bit, single channel | colour image | error |
| cv2.Canny(img, t1, t2) | output: one channel, 0 or 255 | colour expected afterwards | colour is gone |
## Why RGB2GRAY on imread data is wrong — in numbers
= Gray = 0.299 R + 0.587 G + 0.114 B
= pure red pixel from imread: [B, G, R] = [0, 0, 255]
= COLOR_BGR2GRAY: 0.299*255 + 0.587*0 + 0.114*0 = 76
= COLOR_RGB2GRAY: 0.299*0 + 0.587*0 + 0.114*255 = 29
With the wrong code the red pixel becomes almost three times darker. No error is raised, so this bug is found only by **reading the code**.
## Variant 1, Q1c — model answer
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
= blur = cv2.GaussianBlur(gray, (4, 4), 0)
- **Problem 1 (line 2):** imread returns **BGR**, so the code must be **cv2.COLOR_BGR2GRAY**. COLOR_RGB2GRAY runs without an error but swaps the weights of R and B, so the brightness is wrong.
- **Problem 2 (line 3):** the Gaussian kernel must be **positive and odd**; (4, 4) raises an error. Use (5, 5) or (3, 3); sigmaX = 0 is fine — OpenCV computes sigma from the kernel size.
Corrected code:
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
## Fabric variant — model answer
= img = cv2.imread("fabric.jpg")
= blur = cv2.GaussianBlur(img, (3, 3))
= ret, binary = cv2.threshold(blur, 127, 255)
- **Problem 1 (line 2):** **sigmaX is a required argument** of GaussianBlur, so the call fails. Add it: 0 means «compute it from the kernel size». The kernel (3, 3) itself is fine.
- **Problem 2 (line 3):** **threshold needs a type**, for example cv2.THRESH_BINARY; without it the call fails.
- **Extra remark for full marks:** the image is in colour, so threshold would work on each of the three channels separately; a binary mask needs one channel — read with IMREAD_GRAYSCALE or convert with COLOR_BGR2GRAY.
= img = cv2.imread("fabric.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.GaussianBlur(img, (3, 3), 0)
= ret, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)
Here ret is the threshold that was used (127); with THRESH_OTSU it is the value Otsu found.
## Variant 1, Q4a–b — shapes line by line
@diagram cv-pipeline
= img = cv2.imread("cat.jpg")                    # (H, W, 3), e.g. (1080, 1920, 3)
= img = cv2.resize(img, (224, 224))              # (224, 224, 3)
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)   # (224, 224)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)       # (224, 224)
= edges = cv2.Canny(blur, 100, 200)              # (224, 224), values 0 or 255
- **Q4a:** after resizing, img is **224 × 224 × 3** — height 224, width 224, three colour channels (B, G, R).
- **Q4b:** BGR2GRAY turns **3 channels into 1**: the shape becomes (224, 224), one brightness value 0–255 per pixel. Blur and Canny keep that shape.
## dsize is (width, height)
| Call | Means | img.shape afterwards |
|---|---|---|
| cv2.resize(img, (640, 480)) | 640 wide, 480 high | (480, 640, 3) |
| cv2.resize(img, (480, 640)) | 480 wide, 640 high | (640, 480, 3) |
| cv2.resize(gray, (32, 32)) | 32 × 32, still gray | (32, 32) |
## New variant A — find two problems
= img = cv2.imread("coins.jpg", cv2.IMREAD_GRAYSCALE)
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.medianBlur(gray, 4)
- **Line 2:** img is **already one channel**, shape (h, w); COLOR_BGR2GRAY expects three channels → error. Delete the line (or read the file in colour).
- **Line 3:** medianBlur needs an **odd integer k > 1** → 5 (or 3).
= img = cv2.imread("coins.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.medianBlur(img, 5)
## New variant B — find two problems
= img = cv2.imread("receipt.jpg")
= eq = cv2.equalizeHist(img)
= ret, binary = cv2.threshold(eq, 0, 255)
- **Line 2:** equalizeHist needs an **8-bit single-channel** image → convert to gray first.
- **Line 3:** the **type is missing**. A threshold of 0 shows that the student meant Otsu, which also needs one channel:
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= eq = cv2.equalizeHist(gray)
= ret, binary = cv2.threshold(eq, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
## New variant C — find two problems
The student wants an image **200 pixels wide and 300 pixels high** and shows it with matplotlib:
= img = cv2.imread("flower.jpg")
= small = cv2.resize(img, (300, 200))
= plt.imshow(small)
- **Line 2:** dsize is (width, height); (300, 200) gives 300 wide and 200 high, shape (200, 300, 3). It runs, but the size is wrong → cv2.resize(img, (200, 300)).
- **Line 3:** matplotlib expects **RGB**; a BGR array shows red petals as blue → plt.imshow(cv2.cvtColor(small, cv2.COLOR_BGR2RGB)).
> imread gives BGR and (h, w, 3) or None; resize takes (w, h); a Gaussian kernel is odd and needs sigmaX; threshold needs a type; equalizeHist and Otsu need one channel.
## Check yourself
?? The code img = cv2.imread("plant.png"), blur = cv2.GaussianBlur(img, (6, 6), 0), hsv = cv2.cvtColor(blur, cv2.COLOR_RGB2HSV) has two problems. Identify them and correct the code.
?= The kernel (6, 6) is even and raises an error — use (5, 5): blur = cv2.GaussianBlur(img, (5, 5), 0); imread returns BGR, so the conversion must be cv2.COLOR_BGR2HSV (RGB2HSV runs but mixes up red and blue hues).
?? A 1280 × 720 photo (width × height) is read with cv2.imread, resized with cv2.resize(img, (128, 64)) and converted with cv2.COLOR_BGR2GRAY. Give the shape after each step.
?= (720, 1280, 3) after imread; (64, 128, 3) after resize, because dsize is (width, height); (64, 128) after BGR2GRAY — one channel.`,
        ru: `## Как вопрос 1 проверяет OpenCV
В каждом варианте есть один и тот же пункт: три строки OpenCV с **двумя подложенными ошибками** — назвать строку, объяснить, **почему** она неверна, и написать **исправленный код**. Имя файла и ошибки меняются от варианта к варианту, поэтому учите **правило, которому подчиняется каждый вызов**.
- Одни ошибки **роняют программу** (чётное ядро, пропущенный аргумент, не то число каналов).
- Другие **молча работают** и дают неверные числа (RGB вместо BGR, перепутанные ширина и высота) — скажите, какого рода ошибку вы нашли.
## Что возвращает cv2.imread
@diagram cv-image-array
= img = cv2.imread("leaf.jpg")
= img.shape    # (height, width, 3), dtype uint8, values 0..255, order B, G, R
= gray = cv2.imread("leaf.jpg", cv2.IMREAD_GRAYSCALE)
= gray.shape   # (height, width)
- **imread** возвращает массив NumPy с каналами в порядке **BGR**, а не RGB. **IMREAD_COLOR** — режим по умолчанию; **IMREAD_UNCHANGED** сохраняет альфа-канал.
- Если файла нет или имя написано с ошибкой, возвращается **None** — без исключения. Падение случится строкой ниже, внутри cvtColor или resize, поэтому чтение надо проверять:
= if img is None:
=     raise FileNotFoundError("leaf.jpg")
- У серого массива в shape **два** числа: h, w, c = gray.shape падает, а h, w = img.shape[:2] работает и для цветного, и для серого.
## Правила, на которых строятся ошибки
| Вызов | Правило | Типичная подложенная ошибка | Что происходит |
|---|---|---|---|
| cv2.imread(path) | BGR, (h, w, 3); None, если файла нет | неверное имя файла | падение на следующей строке |
| cv2.cvtColor(img, code) | код должен соответствовать входу | COLOR_RGB2GRAY после imread | работает, серый неверный |
| cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY) | нужны 3 канала | картинка уже серая | ошибка |
| cv2.resize(img, (w, h)) | dsize — это (ШИРИНА, ВЫСОТА) | передано (h, w) | работает, размер неверный |
| cv2.GaussianBlur(src, k, sigmaX) | k нечётное и положительное; sigmaX обязателен | (4, 4) или нет sigmaX | ошибка |
| cv2.medianBlur(src, k) | k — нечётное целое > 1 | 4 или (5, 5) | ошибка |
| cv2.threshold(src, t, maxval, type) | type обязателен; возвращает (ret, dst) | нет type | ошибка |
| флаг THRESH_OTSU | одноканальное изображение | Otsu на цветной картинке | ошибка |
| cv2.equalizeHist(src) | 8 бит, один канал | цветная картинка | ошибка |
| cv2.Canny(img, t1, t2) | выход: один канал, 0 или 255 | дальше ждут цвет | цвета больше нет |
## Почему RGB2GRAY на данных imread — ошибка, в числах
= Gray = 0.299 R + 0.587 G + 0.114 B
= pure red pixel from imread: [B, G, R] = [0, 0, 255]
= COLOR_BGR2GRAY: 0.299*255 + 0.587*0 + 0.114*0 = 76
= COLOR_RGB2GRAY: 0.299*0 + 0.587*0 + 0.114*255 = 29
С неверным кодом красный пиксель становится почти в три раза темнее. Ошибки при этом нет, поэтому такой баг находят только **чтением кода**.
## Вариант 1, Q1c — образцовый ответ
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
= blur = cv2.GaussianBlur(gray, (4, 4), 0)
- **Проблема 1 (строка 2):** imread возвращает **BGR**, поэтому код должен быть **cv2.COLOR_BGR2GRAY**. COLOR_RGB2GRAY работает без ошибки, но меняет местами веса R и B, и яркость получается неверной.
- **Проблема 2 (строка 3):** ядро Гаусса должно быть **положительным и нечётным**; (4, 4) вызывает ошибку. Берите (5, 5) или (3, 3); sigmaX = 0 — нормально: OpenCV вычислит sigma по размеру ядра.
Исправленный код:
= img = cv2.imread("leaf.jpg")
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
## Вариант с тканями — образцовый ответ
= img = cv2.imread("fabric.jpg")
= blur = cv2.GaussianBlur(img, (3, 3))
= ret, binary = cv2.threshold(blur, 127, 255)
- **Проблема 1 (строка 2):** **sigmaX — обязательный аргумент** GaussianBlur, поэтому вызов падает. Добавьте его: 0 значит «вычислить по размеру ядра». Само ядро (3, 3) правильное.
- **Проблема 2 (строка 3):** **threshold нужен type**, например cv2.THRESH_BINARY; без него вызов падает.
- **Замечание для полного балла:** картинка цветная, поэтому threshold обработал бы каждый из трёх каналов отдельно; бинарной маске нужен один канал — читайте с IMREAD_GRAYSCALE или переводите через COLOR_BGR2GRAY.
= img = cv2.imread("fabric.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.GaussianBlur(img, (3, 3), 0)
= ret, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)
Здесь ret — использованный порог (127); с THRESH_OTSU это значение, которое нашёл Otsu.
## Вариант 1, Q4a–b — размеры строка за строкой
@diagram cv-pipeline
= img = cv2.imread("cat.jpg")                    # (H, W, 3), e.g. (1080, 1920, 3)
= img = cv2.resize(img, (224, 224))              # (224, 224, 3)
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)   # (224, 224)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)       # (224, 224)
= edges = cv2.Canny(blur, 100, 200)              # (224, 224), values 0 or 255
- **Q4a:** после resize img имеет размер **224 × 224 × 3** — высота 224, ширина 224, три цветовых канала (B, G, R).
- **Q4b:** BGR2GRAY превращает **3 канала в 1**: shape становится (224, 224), на пиксель — одно значение яркости 0–255. Размытие и Canny этот размер сохраняют.
## dsize — это (ширина, высота)
| Вызов | Что значит | img.shape после |
|---|---|---|
| cv2.resize(img, (640, 480)) | 640 в ширину, 480 в высоту | (480, 640, 3) |
| cv2.resize(img, (480, 640)) | 480 в ширину, 640 в высоту | (640, 480, 3) |
| cv2.resize(gray, (32, 32)) | 32 × 32, по-прежнему серое | (32, 32) |
## Новый вариант A — найдите две ошибки
= img = cv2.imread("coins.jpg", cv2.IMREAD_GRAYSCALE)
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.medianBlur(gray, 4)
- **Строка 2:** img **уже одноканальный**, shape (h, w); COLOR_BGR2GRAY ждёт три канала → ошибка. Удалите строку (или читайте файл в цвете).
- **Строка 3:** medianBlur нужен **нечётный целый k > 1** → 5 (или 3).
= img = cv2.imread("coins.jpg", cv2.IMREAD_GRAYSCALE)
= blur = cv2.medianBlur(img, 5)
## Новый вариант B — найдите две ошибки
= img = cv2.imread("receipt.jpg")
= eq = cv2.equalizeHist(img)
= ret, binary = cv2.threshold(eq, 0, 255)
- **Строка 2:** equalizeHist нужно **8-битное одноканальное** изображение → сначала переведите в серое.
- **Строка 3:** **не указан type**. Порог 0 показывает, что студент имел в виду Otsu, которому тоже нужен один канал:
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= eq = cv2.equalizeHist(gray)
= ret, binary = cv2.threshold(eq, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
## Новый вариант C — найдите две ошибки
Студенту нужна картинка **200 пикселей в ширину и 300 в высоту**, и он показывает её через matplotlib:
= img = cv2.imread("flower.jpg")
= small = cv2.resize(img, (300, 200))
= plt.imshow(small)
- **Строка 2:** dsize — это (ширина, высота); (300, 200) даёт 300 в ширину и 200 в высоту, shape (200, 300, 3). Код работает, но размер неверный → cv2.resize(img, (200, 300)).
- **Строка 3:** matplotlib ждёт **RGB**; BGR-массив покажет красные лепестки синими → plt.imshow(cv2.cvtColor(small, cv2.COLOR_BGR2RGB)).
> imread даёт BGR и (h, w, 3) или None; resize принимает (w, h); ядро Гаусса нечётное и требует sigmaX; threshold нужен type; equalizeHist и Otsu нужен один канал.
## Проверь себя
?? Код img = cv2.imread("plant.png"), blur = cv2.GaussianBlur(img, (6, 6), 0), hsv = cv2.cvtColor(blur, cv2.COLOR_RGB2HSV) содержит две ошибки. Найдите их и исправьте код.
?= Ядро (6, 6) чётное и вызывает ошибку — берите (5, 5): blur = cv2.GaussianBlur(img, (5, 5), 0); imread возвращает BGR, поэтому нужен cv2.COLOR_BGR2HSV (RGB2HSV работает, но путает красные и синие оттенки).
?? Фото 1280 × 720 (ширина × высота) читают через cv2.imread, уменьшают вызовом cv2.resize(img, (128, 64)) и переводят через cv2.COLOR_BGR2GRAY. Укажите shape после каждого шага.
?= (720, 1280, 3) после imread; (64, 128, 3) после resize, потому что dsize — это (ширина, высота); (64, 128) после BGR2GRAY — один канал.`,
      },
      [
        qx("cv2.imread('photo.jpg') loads a colour JPEG that is 640 pixels wide and 480 high. What does it return?", "A uint8 array of shape (480, 640, 3), BGR order", [
          ["A uint8 array of shape (640, 480, 3), BGR order", "Shape lists the height first — (rows, columns, channels) — so 480 comes before 640.", "Shape начинается с высоты — (строки, столбцы, каналы), — поэтому 480 идёт раньше 640."],
          ["A uint8 array of shape (480, 640, 3), RGB order", "OpenCV stores the colour channels as B, G, R, not R, G, B.", "OpenCV хранит цветовые каналы как B, G, R, а не R, G, B."],
          ["A float array of shape (3, 480, 640), values 0–1", "imread gives uint8 values 0–255 with channels last; channels-first floats are the PyTorch tensor layout.", "imread даёт uint8 со значениями 0–255 и каналами в конце; каналы первыми и float — это раскладка тензора PyTorch."],
        ], "imread returns a NumPy array of shape (height, width, 3), dtype uint8, values 0–255, channels in BGR order.", "imread возвращает массив NumPy формы (высота, ширина, 3), dtype uint8, значения 0–255, каналы в порядке BGR."),
        qx("The file is leaf.jpg, but the code calls cv2.imread('Leaf.JPG') on Linux. What happens?", "It returns None, and the next cv2 call crashes", [
          ["It raises FileNotFoundError on that line", "imread does not raise for a missing file; it quietly returns None.", "imread не бросает исключение, если файла нет; он молча возвращает None."],
          ["It returns a black image of shape (0, 0, 3)", "There is no array at all — the result is None, which has no shape.", "Массива нет вовсе — результат None, у которого нет shape."],
          ["It loads leaf.jpg anyway, because file names ignore case", "Linux file names are case-sensitive: Leaf.JPG and leaf.jpg are different files.", "В Linux имена файлов чувствительны к регистру: Leaf.JPG и leaf.jpg — разные файлы."],
        ], "A missing file makes cv2.imread return None without an exception; the error appears later, e.g. in cvtColor, so always check whether img is None.", "Если файла нет, cv2.imread возвращает None без исключения; ошибка всплывает позже, например в cvtColor, поэтому всегда проверяйте, не None ли img."),
        qx("Which line, placed right after img = cv2.imread(path), correctly detects a missing file?", "if img is None: raise FileNotFoundError(path)", [
          ["if img.size == 0: raise FileNotFoundError(path)", "None has no .size attribute, so this check itself crashes with AttributeError.", "У None нет атрибута .size, поэтому сама проверка упадёт с AttributeError."],
          ["Wrap the call in try/except", "imread never raises for a missing file, so the except branch is never reached.", "imread не бросает исключение при отсутствии файла, поэтому ветка except никогда не сработает."],
          ["if img.shape == (0, 0, 3): raise FileNotFoundError(path)", "None has no shape; reading img.shape raises AttributeError instead of the intended check.", "У None нет shape; обращение к img.shape вызовет AttributeError вместо задуманной проверки."],
        ], "imread signals a missing or unreadable file only by returning None, so the guard is an explicit is None test.", "imread сообщает об отсутствующем или нечитаемом файле только тем, что возвращает None, поэтому нужна явная проверка is None."),
        qx("After img = cv2.imread('leaf.jpg'), a student writes cv2.cvtColor(img, cv2.COLOR_RGB2GRAY). What happens?", "It runs, but the R and B weights are swapped", [
          ["It raises an error about the channel order", "OpenCV cannot know the order; it only checks that there are 3 channels, so there is no error.", "OpenCV не знает порядок каналов; он проверяет только, что их 3, поэтому ошибки нет."],
          ["It returns a 3-channel gray image", "Every 2GRAY conversion returns a single channel of shape (h, w).", "Любое преобразование 2GRAY возвращает один канал формы (h, w)."],
          ["Nothing is wrong: both codes give the same gray image", "The weights differ (0.299 for R, 0.114 for B), so swapping R and B changes the gray values.", "Веса разные (0.299 для R, 0.114 для B), поэтому перестановка R и B меняет значения серого."],
        ], "imread gives BGR; COLOR_RGB2GRAY treats the first channel (blue) as red, so it applies 0.299 to blue and 0.114 to red — wrong brightness, but no error.", "imread даёт BGR; COLOR_RGB2GRAY считает первый канал (синий) красным и применяет 0.299 к синему и 0.114 к красному — яркость неверная, но ошибки нет."),
        qx("A pixel from cv2.imread is [B, G, R] = [0, 0, 255]. What value does cv2.COLOR_BGR2GRAY give (rounded)?", "76", [
          ["29", "29 = 0.114 × 255 is what COLOR_RGB2GRAY gives, because it treats the 255 as blue.", "29 = 0.114 × 255 даёт COLOR_RGB2GRAY, потому что считает 255 синим."],
          ["85", "85 is the plain average 255 / 3; OpenCV uses a weighted sum, not the mean.", "85 — простое среднее 255 / 3; OpenCV использует взвешенную сумму, а не среднее."],
          ["150", "150 = 0.587 × 255 would be the gray value of a pure green pixel.", "150 = 0.587 × 255 — серый для чисто зелёного пикселя."],
        ], "The pixel is pure red (R = 255): Gray = 0.299·255 + 0.587·0 + 0.114·0 ≈ 76.", "Пиксель чисто красный (R = 255): Gray = 0.299·255 + 0.587·0 + 0.114·0 ≈ 76."),
        qx("img = cv2.resize(img, (320, 240)) is applied to a 1920 × 1080 photo. What is img.shape afterwards?", "(240, 320, 3)", [
          ["(320, 240, 3)", "dsize is (width, height), but shape lists the height first; (320, 240, 3) would be 240 wide and 320 high.", "dsize — это (ширина, высота), а shape начинается с высоты; (320, 240, 3) — это 240 в ширину и 320 в высоту."],
          ["(240, 320)", "resize keeps the number of channels; a colour image stays 3-channel.", "resize сохраняет число каналов; цветная картинка остаётся трёхканальной."],
          ["(1080, 1920, 3)", "resize returns a new array of the requested size, and it is assigned back to img.", "resize возвращает новый массив нужного размера, и он присваивается обратно в img."],
        ], "dsize = (width 320, height 240); shape = (height, width, channels) = (240, 320, 3).", "dsize = (ширина 320, высота 240); shape = (высота, ширина, каналы) = (240, 320, 3)."),
        qx("A student needs an image 640 pixels wide and 480 pixels high. Which call is correct?", "cv2.resize(img, (640, 480))", [
          ["cv2.resize(img, (480, 640))", "This gives 480 wide and 640 high — a portrait image; it runs, but the size is wrong.", "Так получится 480 в ширину и 640 в высоту — портретная картинка; код работает, но размер неверный."],
          ["cv2.resize(img, (480, 640, 3))", "dsize has exactly two numbers; the channels are never part of it.", "В dsize ровно два числа; каналы туда не входят."],
          ["cv2.resize(img, 640, 480)", "The size must be one tuple; here 640 is taken as dsize and the call fails.", "Размер должен быть одним кортежем; здесь 640 воспринимается как dsize, и вызов падает."],
        ], "cv2.resize takes dsize as (width, height): (640, 480); the result has shape (480, 640, 3).", "cv2.resize принимает dsize как (ширина, высота): (640, 480); результат имеет shape (480, 640, 3)."),
        qx("Why does cv2.GaussianBlur(gray, (4, 4), 0) raise an error?", "4 is even, and kernel sides must be odd", [
          ["sigmaX = 0 is not allowed", "sigmaX = 0 is allowed: OpenCV then computes sigma from the kernel size.", "sigmaX = 0 допустим: OpenCV тогда вычисляет sigma по размеру ядра."],
          ["A gray image cannot be blurred", "GaussianBlur works on 1-channel and 3-channel images alike.", "GaussianBlur одинаково работает с одно- и трёхканальными изображениями."],
          ["The kernel must be at least (7, 7) for a blur", "Small kernels like (3, 3) and (5, 5) are valid; the problem is that 4 is even.", "Малые ядра вроде (3, 3) и (5, 5) допустимы; проблема в том, что 4 — чётное."],
        ], "A Gaussian kernel needs a centre pixel, so its width and height must be positive odd numbers: (3, 3), (5, 5); (4, 4) fails.", "Ядру Гаусса нужен центральный пиксель, поэтому ширина и высота — положительные нечётные числа: (3, 3), (5, 5); (4, 4) падает."),
        qx("Fabric variant: blur = cv2.GaussianBlur(img, (3, 3)). What is wrong with this line?", "sigmaX is missing; add 0 as the third argument", [
          ["(3, 3) is too small; a Gaussian needs (5, 5)", "(3, 3) is a valid odd kernel; the size is not the problem.", "(3, 3) — допустимое нечётное ядро; размер тут ни при чём."],
          ["The image must be gray before blurring", "GaussianBlur works on colour images too; gray matters later, for the threshold.", "GaussianBlur работает и с цветными картинками; серое важно позже, для порога."],
          ["The kernel must be one int: GaussianBlur(img, 3, 0)", "GaussianBlur takes the kernel as a (width, height) tuple; a single int is the medianBlur style.", "GaussianBlur принимает ядро кортежем (ширина, высота); одно целое — это стиль medianBlur."],
        ], "sigmaX is a required argument of cv2.GaussianBlur; the fix is cv2.GaussianBlur(img, (3, 3), 0), where 0 means compute sigma from the kernel size.", "sigmaX — обязательный аргумент cv2.GaussianBlur; исправление — cv2.GaussianBlur(img, (3, 3), 0), где 0 значит «вычислить sigma по размеру ядра»."),
        qx("Fabric variant: ret, binary = cv2.threshold(blur, 127, 255). Which change fixes this line?", "Add a type, e.g. cv2.THRESH_BINARY", [
          ["Swap the values: threshold(blur, 255, 127)", "127 is the threshold and 255 the value for white pixels; this order is right.", "127 — порог, 255 — значение для белых пикселей; этот порядок верный."],
          ["Keep one return value: binary = cv2.threshold(...)", "threshold always returns two values (ret, dst); the left side is already correct.", "threshold всегда возвращает два значения (ret, dst); левая часть уже правильная."],
          ["Add sigmaX = 0 as the fourth argument", "sigmaX belongs to GaussianBlur; the fourth argument of threshold is the type.", "sigmaX относится к GaussianBlur; четвёртый аргумент threshold — это type."],
        ], "cv2.threshold(src, thresh, maxval, type) requires the type: cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY).", "cv2.threshold(src, thresh, maxval, type) требует type: cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)."),
        qx("In ret, mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU), what is ret?", "The threshold value that Otsu computed", [
          ["Always 0, the value passed in", "With THRESH_OTSU the passed threshold is ignored; ret reports the value Otsu found.", "С THRESH_OTSU переданный порог игнорируется; ret сообщает значение, найденное Otsu."],
          ["True if the thresholding succeeded", "ret is a number, not a success flag; a failure raises an error instead.", "ret — число, а не флаг успеха; при сбое возникает ошибка."],
          ["The number of white pixels in mask", "ret is a threshold value; white pixels are counted with cv2.countNonZero(mask).", "ret — значение порога; белые пиксели считают через cv2.countNonZero(mask)."],
        ], "threshold returns (retval, dst); with Otsu, retval is the automatically chosen threshold and dst is the binary image.", "threshold возвращает (retval, dst); с Otsu retval — автоматически выбранный порог, а dst — бинарное изображение."),
        qx("cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU) fails right after img = cv2.imread('a.jpg'). Why?", "Otsu works only on a single-channel image", [
          ["THRESH_BINARY and THRESH_OTSU cannot be added", "Adding the flags is the standard way to ask for a binary threshold chosen by Otsu.", "Сложение флагов — стандартный способ попросить бинарный порог, выбранный Otsu."],
          ["A threshold of 0 is invalid for Otsu", "With Otsu the passed threshold is ignored, so 0 is the usual value.", "С Otsu переданный порог игнорируется, поэтому 0 — обычное значение."],
          ["maxval must be 1 for a binary mask", "maxval 255 is normal: the white pixels get 255.", "maxval 255 — нормально: белые пиксели получают 255."],
        ], "imread returns a 3-channel BGR image, but Otsu needs one channel: convert with cv2.COLOR_BGR2GRAY (or read with IMREAD_GRAYSCALE) first.", "imread возвращает трёхканальное BGR-изображение, а Otsu нужен один канал: сначала переведите через cv2.COLOR_BGR2GRAY (или читайте с IMREAD_GRAYSCALE)."),
        qx("img = cv2.imread('xray.png'), then eq = cv2.equalizeHist(img). What happens?", "An error: it needs one 8-bit channel", [
          ["Each BGR channel is equalized separately", "equalizeHist does not loop over channels; a 3-channel input is rejected.", "equalizeHist не обходит каналы по очереди; трёхканальный вход отклоняется."],
          ["It works but returns a float image", "When it works, equalizeHist returns uint8, the same type as its input.", "Когда работает, equalizeHist возвращает uint8 — тот же тип, что на входе."],
          ["The image is converted to gray automatically", "OpenCV never converts colour spaces implicitly; you must call cvtColor yourself.", "OpenCV никогда не меняет цветовое пространство сам; cvtColor надо вызвать вручную."],
        ], "Even a gray-looking X-ray is read as 3 channels by default. Read it with cv2.IMREAD_GRAYSCALE or convert to gray, then call equalizeHist.", "Даже серый на вид рентген по умолчанию читается в 3 канала. Читайте его с cv2.IMREAD_GRAYSCALE или переведите в серое, а потом вызывайте equalizeHist."),
        qx("img = cv2.imread('coins.jpg', cv2.IMREAD_GRAYSCALE), then cv2.cvtColor(img, cv2.COLOR_BGR2GRAY). What happens?", "An error: the input has only one channel", [
          ["img is returned unchanged", "cvtColor does not skip conversions; BGR2GRAY checks for 3 or 4 channels and fails.", "cvtColor не пропускает преобразование; BGR2GRAY проверяет, что каналов 3 или 4, и падает."],
          ["A 3-channel gray image is returned", "BGR2GRAY always outputs one channel, and here it does not even run.", "BGR2GRAY всегда выдаёт один канал, а здесь он даже не выполнится."],
          ["The pixel values are rescaled to 0–1", "Colour conversions keep the uint8 range 0–255; scaling is a separate step.", "Преобразование цвета сохраняет диапазон uint8 0–255; масштабирование — отдельный шаг."],
        ], "IMREAD_GRAYSCALE already gives shape (h, w); COLOR_BGR2GRAY expects 3 channels, so it raises an error. Delete the cvtColor line.", "IMREAD_GRAYSCALE уже даёт shape (h, w); COLOR_BGR2GRAY ждёт 3 канала, поэтому падает. Строку с cvtColor нужно удалить."),
        qx("Which medianBlur call is valid for removing salt-and-pepper noise from a gray image?", "cv2.medianBlur(gray, 5)", [
          ["cv2.medianBlur(gray, 4)", "The median window needs a centre, so k must be odd; 4 raises an error.", "Окну медианы нужен центр, поэтому k должно быть нечётным; 4 вызывает ошибку."],
          ["cv2.medianBlur(gray, (5, 5))", "medianBlur takes one int, not a (w, h) tuple like GaussianBlur.", "medianBlur принимает одно целое, а не кортеж (w, h), как GaussianBlur."],
          ["cv2.medianBlur(gray, 1)", "k must be greater than 1; a 1 × 1 window does no filtering at all.", "k должно быть больше 1; окно 1 × 1 вообще ничего не фильтрует."],
        ], "cv2.medianBlur(src, k) takes an odd int k > 1, e.g. 3 or 5; the median replaces outlier dots by a typical neighbour value.", "cv2.medianBlur(src, k) принимает нечётное целое k > 1, например 3 или 5; медиана заменяет выбросы-точки типичным значением соседей."),
        qx("edges = cv2.Canny(blur, 100, 200), where blur has shape (224, 224). What is edges?", "A (224, 224) uint8 map with values 0 or 255", [
          ["A (224, 224, 3) colour edge image", "Canny outputs a single-channel edge map; there is no colour in it.", "Canny выдаёт одноканальную карту границ; цвета в ней нет."],
          ["A (222, 222) map, because borders are cut", "Canny keeps the input size; it does not crop the border.", "Canny сохраняет размер входа; края он не обрезает."],
          ["A (224, 224) float map of gradients in 0–1", "After hysteresis the output is binary 0/255, not raw gradient magnitudes.", "После гистерезиса выход бинарный, 0/255, а не сырые величины градиента."],
        ], "Canny returns an edge map of the same height and width, one channel, uint8: 255 on edges, 0 elsewhere.", "Canny возвращает карту границ той же высоты и ширины, один канал, uint8: 255 на границах, 0 в остальных местах."),
        qx("plt.imshow(img) right after cv2.imread shows a red apple as blue. Which line fixes the display?", "plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))", [
          ["plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))", "This removes colour altogether instead of fixing the channel order.", "Так цвет пропадёт совсем, а порядок каналов не исправится."],
          ["plt.imshow(img[::-1])", "img[::-1] flips the rows (upside down); the channels are the last axis.", "img[::-1] переворачивает строки (вверх ногами); каналы — это последняя ось."],
          ["Read the file again with cv2.IMREAD_COLOR", "IMREAD_COLOR is already the default and still returns BGR.", "IMREAD_COLOR и так режим по умолчанию, и он всё равно возвращает BGR."],
        ], "matplotlib expects RGB while OpenCV gives BGR; convert with cv2.COLOR_BGR2RGB before plt.imshow.", "matplotlib ждёт RGB, а OpenCV даёт BGR; перед plt.imshow переведите через cv2.COLOR_BGR2RGB."),
        qx("gray = cv2.imread('a.png', cv2.IMREAD_GRAYSCALE), then h, w, c = gray.shape. What happens?", "ValueError: shape has only two values", [
          ["c becomes 1, as for any gray image", "A gray array has no channel axis at all; its shape is (h, w).", "У серого массива нет оси каналов вовсе; его shape — (h, w)."],
          ["c becomes 0 because there is no channel axis", "Python does not fill missing values with 0; unpacking two values into three names fails.", "Python не подставляет 0 вместо недостающего значения; распаковка двух значений в три имени падает."],
          ["It works: shape has three values", "The gray shape has only two numbers, so there is no third value for c.", "В shape серого изображения только два числа, третьего значения для c нет."],
        ], "A grayscale image has shape (h, w). Use h, w = gray.shape or h, w = img.shape[:2], which works for colour and gray.", "Серое изображение имеет shape (h, w). Пишите h, w = gray.shape или h, w = img.shape[:2] — это работает и для цветного, и для серого."),
        tfx("Using cv2.COLOR_RGB2GRAY on an image returned by cv2.imread raises an error.", false, "It runs without any error: cvtColor only checks the number of channels, not their order. The result is simply wrong, because the R and B weights are swapped.", "Код работает без ошибки: cvtColor проверяет только число каналов, а не их порядок. Результат просто неверный, потому что веса R и B переставлены.", "Choosing True assumes OpenCV knows the channel order; it does not, which is exactly why this bug is silent and must be found by reading the code.", "Ответ True предполагает, что OpenCV знает порядок каналов; он не знает — поэтому этот баг молчит и находится только чтением кода."),
        qx("Variant 1: imread, cvtColor(img, COLOR_RGB2GRAY), GaussianBlur(gray, (4, 4), 0). Which pair of fixes is correct?", "COLOR_BGR2GRAY and an odd kernel such as (5, 5)", [
          ["COLOR_BGR2RGB and an odd kernel such as (5, 5)", "BGR2RGB keeps 3 channels; the code needs a gray image, so the conversion must be BGR2GRAY.", "BGR2RGB оставляет 3 канала; коду нужна серая картинка, поэтому преобразование должно быть BGR2GRAY."],
          ["COLOR_BGR2GRAY and sigmaX changed from 0 to 1", "sigmaX = 0 is valid; the (4, 4) kernel would still fail.", "sigmaX = 0 допустим; ядро (4, 4) всё равно вызовет ошибку."],
          ["Kernel (5, 5) and IMREAD_UNCHANGED in imread", "IMREAD_UNCHANGED keeps an alpha channel; it does not fix the RGB/BGR mix-up.", "IMREAD_UNCHANGED сохраняет альфа-канал; путаницу RGB/BGR он не исправляет."],
        ], "imread gives BGR, so use cv2.COLOR_BGR2GRAY; Gaussian kernels must be odd, so (4, 4) becomes (5, 5) (or (3, 3)).", "imread даёт BGR, поэтому нужен cv2.COLOR_BGR2GRAY; ядро Гаусса должно быть нечётным, поэтому (4, 4) меняем на (5, 5) (или (3, 3))."),
      ],
    ),
    part(
      "cv-drill-p2",
      { en: "Preprocessing decisions", ru: "Решения о предобработке" },
      {
        en: `## How to answer a preprocessing question
For every operation give three things: **what** you apply (the cv2 call or the parameter), **which problem of the scenario** it fixes, and **what it costs**. A bare list «resize, blur, normalize» without reasons earns only part of the points.
| Problem in the scenario | Operation | Why it helps | Cost or risk |
|---|---|---|---|
| different resolutions | resize to a fixed size, e.g. 224 × 224 | the model needs one input shape | detail lost, aspect ratio distorted |
| uneven lighting, low contrast | histogram equalization or CLAHE on brightness | similar contrast under any lamp | amplifies noise in flat areas |
| warm vs cold lamps | white balance / colour normalization | colour then describes the object, not the lamp | can shift true colours |
| sensor grain | Gaussian blur, (3, 3) or (5, 5) | averages random noise | softens fine detail |
| salt-and-pepper dots | median blur, k = 3 or 5 | replaces outliers, keeps edges sharper | can erase tiny real spots |
| JPEG block artifacts | mild Gaussian or median blur | smooths the 8 × 8 block borders | blurs fine texture |
| object small in a big frame | crop to the region of interest | removes background shortcuts | needs a box or a detector |
| class defined by colour | convert BGR to HSV | hue separates colour from brightness | hue is unstable for dark pixels |
| raw values 0–255 | scale to [0, 1] or standardize | stable, faster training | the same step is needed at test time |
| few or uniform images | augmentation: flips, rotations, brightness, crops | more variety, less overfitting | training set only; must stay realistic |
= x = img.astype("float32") / 255.0
= x = (x - mean) / std
= clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
= l_eq = clahe.apply(l_channel)
## Gaussian or median?
| | Gaussian blur | Median blur |
|---|---|---|
| Call | cv2.GaussianBlur(img, (5, 5), 0) | cv2.medianBlur(img, 5) |
| How | weighted average of the window | median of the window |
| Best for | sensor grain (Gaussian noise) | salt-and-pepper dots |
| Edges | softened | stay sharper |
## Variant 1, Q1a — three operations for the leaf images
- **Resize to 224 × 224** with cv2.resize(img, (224, 224)) — the photos have **different resolutions**, and a classifier needs **one fixed input size**.
- **Normalize brightness** — scale pixels to [0, 1] and apply **CLAHE to the L channel of LAB** — the photos have **different lighting**, so the same leaf should give similar numbers under a bright and a dim lamp.
- **Denoise** with a small **Gaussian blur (3, 3)** for sensor grain or a **median blur (k = 3)** for salt-and-pepper dots — the photos **contain noise**; keep the kernel small so the **disease spots survive**.
## Variant 1, Q1b — grayscale for plant disease
- **Advantage:** three times fewer values per pixel → faster training, a smaller model, less sensitivity to the colour of the light.
- **Disadvantage:** **colour is a main symptom** — yellowing, brown and rust spots. In gray, very different colours can get the same brightness:
= healthy green  [B, G, R] = [40, 180, 50]  -> 0.299*50 + 0.587*180 + 0.114*40 = 125
= brown spot     [B, G, R] = [40, 130, 150] -> 0.299*150 + 0.587*130 + 0.114*40 = 126
After grayscale the spot almost disappears into the leaf, so the model loses its strongest cue.
## Variant 1, Q1d — «more preprocessing always improves accuracy»
**Disagree.** Every operation removes information along with the noise; it helps only when what it removes is **irrelevant to the task**.
- Example: a **(15, 15) Gaussian blur** wipes out the small brown spots that **are** the disease → healthy and diseased leaves look alike → accuracy drops.
- Example: **grayscale** in a fruit-ripeness task removes the green/yellow difference that defines the class.
- Rule: add one step at a time and **keep it only if validation accuracy improves**.
## Variant 1, Q4c–d — Canny and colour
- **Why blur first:** Canny is built on the **image gradient (derivatives)**, and derivatives **amplify high-frequency noise**, so every noisy pixel becomes a tiny **false edge**. A Gaussian (5, 5) blur averages the noise away; real edges (large, consistent changes) survive.
- **Hysteresis:** gradient above the high threshold (200) = strong edge; below the low one (100) = discarded; in between = kept only if connected to a strong edge. A ratio of 1:2 to 1:3 is common.
- **Colour-dependent task — edges alone? No.** The Canny output is a **single-channel 0/255 map**: all colour is gone. A red ripe and a green unripe tomato give **the same edges**. Feed the colour image (or HSV colour features), possibly together with the edges.
## Fabric variant — the scenario
Striped, checked and plain fabric; photos of **different sizes**, under **warm and cold lamps**, with **JPEG artifacts**. Here the class is the **pattern**, not the colour.
![Three fabric swatches in a row — striped, checked and plain — each shown twice, once under a warm yellow lamp and once under a cold bluish lamp, so the same cloth looks orange-tinted in one photo and blue-tinted in the other](/events/cv/drill-fabric-lamps.webp)
- **Crop and resize** to one size; cut a central patch rather than shrinking the whole photo, so each stripe stays several pixels wide.
- **Remove the lamp colour:** convert to **grayscale** (the pattern lives in brightness) or white-balance — otherwise the model may learn «warm light = checked».
- **Mild blur** (Gaussian (3, 3) or median 3) against **JPEG blocks**, whose 8 × 8 grid lines can look like a checked pattern.
- **Contrast normalization** (equalizeHist or CLAHE on gray) so pale stripes are as visible as strong ones.
## Fabric variant — «resize every image to 32 × 32»
= 32 * 32 * 3 = 3072 values per image (as in CIFAR-10)
= 224 * 224 * 3 = 150528 values per image, 49 times more
- **Advantage:** few values → fast training, little memory, a small model, and every input has the same shape.
- **Disadvantage:** fine stripes and small checks become **thinner than one pixel** — they vanish or turn into false moiré patterns, so striped can look plain; non-square photos are also **distorted**.
## Fabric variant — «If the training images look fine to a human, no preprocessing is needed»
**Disagree.** A person sees the fabric; the model sees **arrays of numbers**.
- The photos have **different sizes**, but the network needs one input shape — resizing is required however good the photo looks.
- People **correct warm and cold light automatically** (colour constancy); the model does not. If most checked samples were shot under a warm lamp, it learns the lamp, not the pattern.
- JPEG artifacts that a person ignores are real pixel changes for the model, and values 0–255 still need **scaling or standardization** — with the same steps at test time.
## New scenarios — model answers
| Scenario | Key operations | Grayscale? |
|---|---|---|
| traffic signs from a night dashcam | resize, CLAHE on brightness, HSV masks for red and blue | no — red vs blue is the meaning |
| receipts for text reading (OCR) | gray, Gaussian (3, 3), Otsu threshold, crop | yes — text is dark on light |
| chest X-rays from two hospitals | read as gray, CLAHE, resize, standardize each image | already one channel |
- **Traffic signs:** night frames are dark and noisy → CLAHE on the V or L channel lifts contrast; colour **defines** the sign type, so keep it and use HSV to find red and blue regions; resize the crop of the sign to a fixed size.
- **Receipts:** colour carries no information, so grayscale is a pure advantage; a small blur removes paper grain, then Otsu picks the ink/paper threshold automatically: cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU).
- **X-rays:** two machines give different brightness levels → standardize each image (subtract its mean, divide by its std) so the model compares anatomy, not machines; CLAHE reveals low-contrast tissue.
> Every operation removes something: tie it to a problem named in the scenario and make sure it does not remove what defines the class.
## Check yourself
?? A system sorts ripe and unripe bananas from photos taken under different lamps. Propose two preprocessing operations and say whether you would convert to grayscale.
?= Resize to a fixed size and white-balance or colour-normalize (or work in HSV) so that the lamp colour does not imitate ripeness; no grayscale, because ripeness is defined by colour (green vs yellow), which gray would destroy.
?? A student says: Canny edges are always a better input than the raw image, because they remove noise. Do you agree? Explain with one example.
?= No: edges keep only boundaries in one 0/255 channel and drop colour and texture; ripe and unripe tomatoes have the same shape, so their edge maps are the same and the classifier cannot tell them apart.`,
        ru: `## Как отвечать на вопрос о предобработке
Для каждой операции назовите три вещи: **что** вы применяете (вызов cv2 или параметр), **какую проблему сценария** это решает и **чем за это платите**. Голый список «resize, blur, normalize» без причин приносит только часть баллов.
| Проблема в сценарии | Операция | Почему помогает | Цена или риск |
|---|---|---|---|
| разные разрешения | resize к одному размеру, например 224 × 224 | модели нужна одна форма входа | теряются детали, искажаются пропорции |
| неравномерный свет, низкий контраст | выравнивание гистограммы или CLAHE по яркости | похожий контраст под любой лампой | усиливает шум на ровных участках |
| тёплые и холодные лампы | баланс белого / нормализация цвета | цвет описывает объект, а не лампу | может сдвинуть истинные цвета |
| зерно матрицы | размытие Гаусса, (3, 3) или (5, 5) | усредняет случайный шум | смягчает мелкие детали |
| точки «соль и перец» | медианный фильтр, k = 3 или 5 | заменяет выбросы, границы остаются резче | может стереть крошечные настоящие пятна |
| блоки JPEG | лёгкое размытие Гаусса или медианой | сглаживает границы блоков 8 × 8 | размывает мелкую текстуру |
| мелкий объект в большом кадре | обрезка до области интереса | убирает подсказки фона | нужна рамка или детектор |
| класс задаётся цветом | перевод BGR в HSV | тон (hue) отделяет цвет от яркости | тон нестабилен у тёмных пикселей |
| сырые значения 0–255 | масштаб в [0, 1] или стандартизация | стабильное и быстрое обучение | тот же шаг нужен и на тесте |
| мало снимков или они однообразны | аугментация: отражения, повороты, яркость, обрезка | больше разнообразия, меньше переобучения | только обучающий набор; должна оставаться реалистичной |
= x = img.astype("float32") / 255.0
= x = (x - mean) / std
= clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
= l_eq = clahe.apply(l_channel)
## Гаусс или медиана?
| | Размытие Гаусса | Медианный фильтр |
|---|---|---|
| Вызов | cv2.GaussianBlur(img, (5, 5), 0) | cv2.medianBlur(img, 5) |
| Как работает | взвешенное среднее по окну | медиана окна |
| Лучше всего для | зерна матрицы (гауссов шум) | точек «соль и перец» |
| Границы | смягчаются | остаются резче |
## Вариант 1, Q1a — три операции для снимков листьев
- **Resize до 224 × 224** вызовом cv2.resize(img, (224, 224)) — у снимков **разные разрешения**, а классификатору нужен **один фиксированный размер входа**.
- **Нормализация яркости** — масштаб пикселей в [0, 1] и **CLAHE по каналу L в LAB** — снимки сделаны **при разном освещении**, и один и тот же лист должен давать похожие числа и под яркой, и под тусклой лампой.
- **Удаление шума** небольшим **размытием Гаусса (3, 3)** против зерна матрицы или **медианным фильтром (k = 3)** против точек «соль и перец» — на снимках **есть шум**; ядро берите маленьким, чтобы **пятна болезни сохранились**.
## Вариант 1, Q1b — оттенки серого для болезней растений
- **Плюс:** в три раза меньше значений на пиксель → быстрее обучение, меньше модель, меньше влияние цвета освещения.
- **Минус:** **цвет — главный симптом**: пожелтение, бурые и ржавые пятна. В сером совсем разные цвета могут получить одинаковую яркость:
= healthy green  [B, G, R] = [40, 180, 50]  -> 0.299*50 + 0.587*180 + 0.114*40 = 125
= brown spot     [B, G, R] = [40, 130, 150] -> 0.299*150 + 0.587*130 + 0.114*40 = 126
После перевода в серое пятно почти сливается с листом, и модель теряет свой самый сильный признак.
## Вариант 1, Q1d — «больше предобработки всегда повышает точность»
**Не согласен.** Любая операция вместе с шумом убирает и информацию; она помогает, только если убранное **не важно для задачи**.
- Пример: **размытие Гаусса (15, 15)** стирает мелкие бурые пятна, которые **и есть** болезнь → здоровые и больные листья выглядят одинаково → точность падает.
- Пример: **оттенки серого** в задаче о спелости фруктов убирают разницу зелёного и жёлтого, которая и задаёт класс.
- Правило: добавляйте по одному шагу и **оставляйте его, только если точность на валидации растёт**.
## Вариант 1, Q4c–d — Canny и цвет
- **Зачем сначала размывать:** Canny построен на **градиенте изображения (производных)**, а производные **усиливают высокочастотный шум**, поэтому каждый шумный пиксель становится маленькой **ложной границей**. Размытие Гаусса (5, 5) усредняет шум; настоящие границы (большие устойчивые перепады) остаются.
- **Гистерезис:** градиент выше верхнего порога (200) — сильная граница; ниже нижнего (100) — отбрасывается; между ними — остаётся, только если связан с сильной границей. Обычное соотношение порогов — от 1:2 до 1:3.
- **Задача зависит от цвета — подавать только границы? Нет.** Выход Canny — **одноканальная карта 0/255**: цвета в ней нет. Красный спелый и зелёный неспелый помидор дают **одинаковые границы**. Подавайте цветное изображение (или цветовые признаки в HSV), можно вместе с границами.
## Вариант с тканями — сценарий
Ткань в полоску, в клетку и однотонная; снимки **разного размера**, под **тёплыми и холодными лампами**, с **артефактами JPEG**. Здесь класс — это **узор**, а не цвет.
![Три образца ткани в ряд — в полоску, в клетку и однотонная — каждый показан дважды: под тёплой жёлтой лампой и под холодной голубоватой, поэтому одна и та же ткань на одном снимке отдаёт оранжевым, а на другом — синим](/events/cv/drill-fabric-lamps.webp)
- **Обрезка и resize** к одному размеру; вырезайте центральный фрагмент, а не ужимайте весь снимок, чтобы каждая полоска оставалась шириной в несколько пикселей.
- **Убрать цвет лампы:** перевести в **оттенки серого** (узор живёт в яркости) или сделать баланс белого — иначе модель может выучить «тёплый свет = клетка».
- **Лёгкое размытие** (Гаусс (3, 3) или медиана 3) против **блоков JPEG**, чья сетка 8 × 8 может выглядеть как клетка.
- **Нормализация контраста** (equalizeHist или CLAHE на сером), чтобы бледные полоски были видны так же, как яркие.
## Вариант с тканями — «уменьшить каждый снимок до 32 × 32»
= 32 * 32 * 3 = 3072 values per image (as in CIFAR-10)
= 224 * 224 * 3 = 150528 values per image, 49 times more
- **Плюс:** мало значений → быстрое обучение, мало памяти, маленькая модель, и у каждого входа одна и та же форма.
- **Минус:** тонкие полоски и мелкая клетка становятся **тоньше одного пикселя** — они исчезают или превращаются в ложный муар, и полоска может выглядеть однотонной; неквадратные снимки к тому же **искажаются**.
## Вариант с тканями — «Если обучающие снимки хорошо выглядят для человека, предобработка не нужна»
**Не согласен.** Человек видит ткань, а модель — **массивы чисел**.
- Снимки **разного размера**, а сети нужна одна форма входа — resize обязателен, как бы хорошо ни выглядело фото.
- Люди **автоматически поправляют тёплый и холодный свет** (константность цвета), а модель — нет. Если большинство образцов в клетку сняты под тёплой лампой, она выучит лампу, а не узор.
- Артефакты JPEG, которые человек не замечает, для модели — настоящие изменения пикселей, а значения 0–255 всё равно нужно **масштабировать или стандартизировать** — и теми же шагами на тесте.
## Новые сценарии — образцовые ответы
| Сценарий | Ключевые операции | Оттенки серого? |
|---|---|---|
| дорожные знаки с ночного видеорегистратора | resize, CLAHE по яркости, HSV-маски для красного и синего | нет — красный или синий и есть смысл |
| чеки для распознавания текста (OCR) | серое, Гаусс (3, 3), порог Otsu, обрезка | да — тёмный текст на светлом |
| рентген грудной клетки из двух больниц | читать как серое, CLAHE, resize, стандартизация каждого снимка | уже один канал |
- **Дорожные знаки:** ночные кадры тёмные и шумные → CLAHE по каналу V или L поднимает контраст; цвет **задаёт** тип знака, поэтому его сохраняем и через HSV находим красные и синие области; вырезанный знак приводим resize к одному размеру.
- **Чеки:** цвет не несёт информации, поэтому серое — чистый плюс; небольшое размытие убирает зерно бумаги, затем Otsu сам выбирает порог «чернила/бумага»: cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU).
- **Рентген:** два аппарата дают разный уровень яркости → стандартизируйте каждый снимок (вычесть его среднее, разделить на его std), чтобы модель сравнивала анатомию, а не аппараты; CLAHE проявляет малоконтрастные ткани.
> Любая операция что-то убирает: свяжите её с проблемой, названной в сценарии, и убедитесь, что она не убирает то, что задаёт класс.
## Проверь себя
?? Система сортирует спелые и неспелые бананы по снимкам, сделанным под разными лампами. Предложите две операции предобработки и скажите, переводили бы вы снимки в оттенки серого.
?= Resize к фиксированному размеру и баланс белого или нормализация цвета (или работа в HSV), чтобы цвет лампы не изображал спелость; в серое — нет, потому что спелость задаётся цветом (зелёный или жёлтый), а серое его уничтожит.
?? Студент говорит: границы Canny всегда лучше сырого изображения как вход, потому что убирают шум. Согласны? Объясните на одном примере.
?= Нет: границы оставляют только контуры в одном канале 0/255 и выбрасывают цвет и текстуру; у спелого и неспелого помидора одна и та же форма, поэтому карты границ одинаковы и классификатор не сможет их различить.`,
      },
      [
        qx("Leaf photos come in many resolutions. Which operation must come first so that a CNN can take them as one batch?", "Resize all images to one fixed size", [
          ["Convert every image to grayscale with cvtColor", "Grayscale changes the number of channels, not height and width; the sizes would still differ.", "Перевод в серое меняет число каналов, а не высоту и ширину; размеры всё равно будут разными."],
          ["Apply histogram equalization", "Equalization changes contrast, not size.", "Выравнивание гистограммы меняет контраст, а не размер."],
          ["Apply a median blur with k = 5", "Blurring keeps the size of each image unchanged.", "Размытие сохраняет размер каждого снимка."],
        ], "A network has a fixed input shape and a batch needs equal sizes, so resize (e.g. to 224 × 224) comes first.", "У сети фиксированная форма входа, а в батче нужны одинаковые размеры, поэтому сначала resize (например, до 224 × 224)."),
        qx("Old scanned photos have isolated white and black dots. Which filter fits best?", "Median blur, e.g. cv2.medianBlur(img, 3)", [
          ["Gaussian blur with a large (15, 15) kernel", "A big Gaussian smears the dots into gray blobs and blurs everything else too.", "Большой Гаусс размазывает точки в серые пятна и размывает всё остальное."],
          ["Histogram equalization", "Equalization stretches contrast and makes the dots even more visible.", "Выравнивание растягивает контраст и делает точки ещё заметнее."],
          ["Canny edge detection", "Every dot is a sharp change, so Canny would mark each dot as an edge.", "Каждая точка — резкий перепад, поэтому Canny отметит каждую как границу."],
        ], "Salt-and-pepper noise consists of outliers; the median of the window ignores them and keeps edges sharper than averaging does.", "Шум «соль и перец» — это выбросы; медиана окна их игнорирует и сохраняет границы резче, чем усреднение."),
        qx("Low-light phone photos look grainy all over. Which first step is the usual choice?", "A small Gaussian blur, (3, 3) or (5, 5)", [
          ["A median blur with k = 15", "Such a big median window erases fine detail; median is best for isolated dots.", "Такое большое окно медианы стирает мелкие детали; медиана лучше всего для отдельных точек."],
          ["Converting the image to HSV", "HSV only re-expresses the colours; it does not reduce noise.", "HSV лишь иначе записывает цвета; шум он не уменьшает."],
          ["Thresholding with Otsu", "Thresholding turns the photo into black and white, and the grain becomes random specks.", "Порог превращает снимок в чёрно-белый, и зерно станет случайными крапинками."],
        ], "Sensor grain is roughly Gaussian noise spread over all pixels; a small Gaussian blur averages it out while keeping most of the detail.", "Зерно матрицы — примерно гауссов шум по всем пикселям; небольшое размытие Гаусса усредняет его и сохраняет большую часть деталей."),
        qx("Chest X-rays are dark and low in contrast, and the contrast varies across the image. Which operation fits?", "CLAHE (adaptive histogram equalization)", [
          ["Converting BGR to HSV and keeping the V channel", "X-rays have no colour, and V is the same low-contrast brightness.", "У рентгена нет цвета, а V — та же малоконтрастная яркость."],
          ["Resizing to 32 × 32", "Shrinking removes detail and does not fix contrast.", "Уменьшение убирает детали и не исправляет контраст."],
          ["A median blur with k = 5", "A median blur removes dots but does not stretch contrast.", "Медианный фильтр убирает точки, но не растягивает контраст."],
        ], "CLAHE equalizes contrast locally, tile by tile, and clips the histogram, so dark regions gain contrast without boosting noise as much as global equalization.", "CLAHE выравнивает контраст локально, по плиткам, и обрезает гистограмму, поэтому тёмные области получают контраст без такого сильного усиления шума, как при глобальном выравнивании."),
        qx("Fabric photos were taken under warm and cold lamps, but the class is the pattern. What handles the lamp colour?", "Grayscale or white balance", [
          ["A stronger Gaussian blur", "Blur removes fine detail, not a colour cast.", "Размытие убирает мелкие детали, а не цветовой оттенок."],
          ["Resizing to a larger size", "Size does not change the colour of the light.", "Размер не меняет цвет освещения."],
          ["Canny with lower thresholds", "Lower thresholds add weak edges; the lamp colour is a separate problem.", "Более низкие пороги добавляют слабые границы; цвет лампы — отдельная проблема."],
        ], "The pattern lives in brightness; gray or white balance removes the lamp tint, so the model cannot learn warm lamp = checked.", "Узор живёт в яркости; серое или баланс белого убирают оттенок лампы, и модель не выучит «тёплая лампа = клетка»."),
        qx("Variant 1, Q1b: which is a valid disadvantage of grayscale for plant-disease classification?", "Colour symptoms such as yellow or brown spots are lost", [
          ["The images become three times larger in memory", "Gray images are three times smaller: one value per pixel instead of three.", "Серые снимки в три раза меньше: одно значение на пиксель вместо трёх."],
          ["Grayscale images cannot be resized", "cv2.resize works on gray images exactly as on colour ones.", "cv2.resize работает с серыми снимками так же, как с цветными."],
          ["Training becomes slower", "Fewer input values make training faster — that is the advantage.", "Меньше входных значений — обучение быстрее; это как раз плюс."],
        ], "Disease often shows as a colour change, and very different colours can map to nearly the same gray value, so the main cue disappears.", "Болезнь часто видна как изменение цвета, а очень разные цвета могут дать почти одинаковый серый, поэтому главный признак пропадает."),
        qx("Which is a valid advantage of converting images to grayscale?", "Fewer input values, so faster training", [
          ["Colour differences become easier to see", "Gray removes colour, so colour differences become impossible to see.", "Серое убирает цвет, и цветовые различия становится невозможно увидеть."],
          ["It removes all image noise", "Noise stays; gray only merges three channels into one.", "Шум остаётся; серое лишь сливает три канала в один."],
          ["Every image gets the same size", "Gray changes the channels, not height and width; you still need resize.", "Серое меняет каналы, а не высоту и ширину; resize всё равно нужен."],
        ], "One channel instead of three: less memory, fewer first-layer weights, faster training and less sensitivity to the lamp colour.", "Один канал вместо трёх: меньше памяти, меньше весов в первом слое, быстрее обучение и меньше влияние цвета лампы."),
        qx("Fabric variant: every image is resized to 32 × 32. What is the main disadvantage?", "Thin stripes and small checks vanish or alias", [
          ["The model can no longer use batches", "Equal sizes make batching easier, not harder.", "Одинаковый размер упрощает батчи, а не мешает им."],
          ["Training needs much more memory than at full size", "32 × 32 × 3 = 3 072 values per image need far less memory than full size.", "32 × 32 × 3 = 3 072 значения на снимок требуют гораздо меньше памяти, чем полный размер."],
          ["Colour information is removed", "Resizing keeps all three channels; it removes spatial detail.", "Resize сохраняет все три канала; он убирает пространственные детали."],
        ], "At 32 × 32 a fine stripe is narrower than a pixel, so it disappears or turns into moiré, and striped cloth can look plain.", "При 32 × 32 тонкая полоска уже пикселя, поэтому она исчезает или превращается в муар, и ткань в полоску может выглядеть однотонной."),
        qx("Fabric variant: what is a real advantage of resizing every image to 32 × 32?", "Small equal inputs, 3 072 values: fast training", [
          ["Fine stripes become easier to detect", "Shrinking removes fine detail; stripes become harder, not easier, to see.", "Уменьшение убирает мелкие детали; полоски видно хуже, а не лучше."],
          ["JPEG artifacts turn into useful texture features", "Artifacts are noise, not features; shrinking just mixes them in.", "Артефакты — шум, а не признаки; уменьшение просто их перемешивает."],
          ["The warm or cold lamp tint is removed", "Resizing keeps the colours, so the lamp tint stays.", "Resize сохраняет цвета, поэтому оттенок лампы остаётся."],
        ], "32 · 32 · 3 = 3 072 numbers per image, as in CIFAR-10: little memory, a small model, fast training and a fixed input shape.", "32 · 32 · 3 = 3 072 числа на снимок, как в CIFAR-10: мало памяти, маленькая модель, быстрое обучение и фиксированная форма входа."),
        qx("Why is a Gaussian blur usually applied before Canny edge detection?", "Derivatives amplify noise, causing false edges", [
          ["Canny accepts only blurred images", "Canny runs on any 8-bit image; the blur is a quality choice, not a requirement.", "Canny работает с любым 8-битным изображением; размытие — вопрос качества, а не требование."],
          ["The blur makes the image grayscale", "Blur keeps the number of channels; gray needs cvtColor.", "Размытие сохраняет число каналов; для серого нужен cvtColor."],
          ["The blur sharpens the true edges", "Blur slightly softens edges; it helps by removing noise, not by sharpening.", "Размытие слегка смягчает границы; оно помогает, убирая шум, а не повышая резкость."],
        ], "Canny uses the gradient; noise creates large local derivatives, so without smoothing many tiny false edges appear.", "Canny использует градиент; шум даёт большие локальные производные, поэтому без сглаживания появляется много мелких ложных границ."),
        qx("cv2.Canny(blur, 100, 200): a pixel has gradient 150 and touches a strong edge. What happens to it?", "It is kept as part of that edge", [
          ["It is discarded, because 150 < 200", "Between the thresholds a pixel is not discarded automatically; connectivity decides.", "Между порогами пиксель не отбрасывается автоматически; решает связность."],
          ["It becomes a strong edge on its own", "Only gradients above 200 are strong edges by themselves.", "Сильными границами сами по себе считаются только градиенты выше 200."],
          ["It gets the value 150 in the output", "Canny's output is binary: only 0 or 255.", "Выход Canny бинарный: только 0 или 255."],
        ], "Hysteresis: above 200 strong, below 100 discarded, in between kept only if connected to a strong edge — and this pixel is connected.", "Гистерезис: выше 200 — сильная граница, ниже 100 — отброс, между ними — остаётся только при связи с сильной границей, а этот пиксель связан."),
        qx("Variant 1, Q4d: the task depends strongly on object colour. Should edges alone go to the classifier?", "No: an edge map has no colour information", [
          ["Yes: edges contain all the information", "Edges keep only boundaries; colour and texture are discarded.", "Границы сохраняют только контуры; цвет и текстура выбрасываются."],
          ["Yes, if the Canny thresholds are tuned well", "No threshold brings colour back; the output is one 0/255 channel.", "Никакой порог не вернёт цвет; на выходе один канал 0/255."],
          ["No, because edges are three-channel", "Edges are single-channel — that is exactly why colour is missing.", "Границы одноканальные — именно поэтому цвета нет."],
        ], "Canny returns a single-channel 0/255 map; two objects of the same shape and different colour give the same edges. Feed the colour image or colour features.", "Canny возвращает одноканальную карту 0/255; два объекта одной формы и разного цвета дают одинаковые границы. Подавайте цветное изображение или цветовые признаки."),
        qx("Which example best refutes the claim that more preprocessing always improves accuracy?", "A (15, 15) blur erases small disease spots", [
          ["Resizing gives all images one shape", "That is a case where preprocessing helps, so it supports the claim.", "Это случай, когда предобработка помогает, — он поддерживает утверждение."],
          ["Scaling pixels to [0, 1] stabilizes training", "Also an example of preprocessing that helps; it does not refute the claim.", "Тоже пример полезной предобработки; утверждение он не опровергает."],
          ["Median blur removes salt-and-pepper dots", "Again a helpful step; a counterexample must show harm.", "Снова полезный шаг; контрпример должен показывать вред."],
        ], "A counterexample needs a step that destroys task information: a heavy blur removes the very spots that define the disease, so accuracy drops.", "Контрпримеру нужен шаг, который уничтожает нужную информацию: сильное размытие убирает те самые пятна, что задают болезнь, и точность падает."),
        qx("A student says: the images look fine to a human, so no preprocessing is needed. What is the best rebuttal?", "The model sees numbers: sizes, ranges and tints differ", [
          ["Humans and models see images the same way", "That would support the claim; the rebuttal is that they do not.", "Это поддержало бы утверждение; опровержение как раз в том, что видят по-разному."],
          ["Preprocessing is only ever needed for blurry or dark photos", "Sharp photos still differ in size, value range and colour cast.", "Резкие снимки тоже различаются размером, диапазоном значений и оттенком."],
          ["Preprocessing is needed only at test time", "Preprocessing must be the same at training and at test time.", "Предобработка должна быть одинаковой и при обучении, и на тесте."],
        ], "Different sizes, 0–255 values and lamp tints that people ignore are real differences in the numbers the model learns from.", "Разные размеры, значения 0–255 и оттенки ламп, которые люди не замечают, — это настоящие различия в числах, на которых учится модель."),
        qx("Ripe and unripe fruit must be told apart by colour under varying brightness. Which colour space helps most?", "HSV via cv2.COLOR_BGR2HSV", [
          ["Grayscale via cv2.COLOR_BGR2GRAY", "Gray removes colour, which is exactly what defines ripeness here.", "Серое убирает цвет, а он здесь и задаёт спелость."],
          ["RGB via cv2.COLOR_BGR2RGB", "Swapping the channel order does not separate colour from brightness.", "Перестановка каналов не отделяет цвет от яркости."],
          ["A binary image via Otsu", "A binary mask keeps only light vs dark, not hue.", "Бинарная маска хранит только светлое и тёмное, а не тон."],
        ], "HSV puts the colour (hue) in one channel and the brightness (value) in another, so a hue rule keeps working under different lighting.", "HSV кладёт цвет (hue) в один канал, а яркость (value) — в другой, поэтому правило по тону работает при разном освещении."),
        qx("Which line scales an 8-bit image to float values in [0, 1]?", "x = img.astype('float32') / 255.0", [
          ["x = img / 100", "Dividing by 100 gives values up to 2.55, not at most 1.", "Деление на 100 даёт значения до 2.55, а не до 1."],
          ["x = img.astype('float32') * 255.0", "Multiplying gives values up to 65 025 instead of at most 1.", "Умножение даёт значения до 65 025, а не до 1."],
          ["x = cv2.equalizeHist(img) / 2", "Equalization changes contrast, and dividing by 2 gives 0–127.5, not 0–1.", "Выравнивание меняет контраст, а деление на 2 даёт 0–127.5, а не 0–1."],
        ], "Dividing by the maximum 255 maps 0–255 to 0–1; float32 avoids integer arithmetic and is the usual network input type.", "Деление на максимум 255 переводит 0–255 в 0–1; float32 избавляет от целочисленной арифметики и является обычным типом входа сети."),
        qx("When should data augmentation (flips, rotations, brightness) be applied?", "Only to the training images, during training", [
          ["To the test images, to make testing harder", "The test set must stay untouched to measure real performance.", "Тестовый набор должен оставаться нетронутым, чтобы измерять реальное качество."],
          ["To all images before the train/test split", "Augmenting before splitting puts copies of one photo into train and test — leakage.", "Аугментация до разбиения кладёт копии одного снимка и в train, и в test — это утечка."],
          ["Only when training accuracy is low", "Augmentation fights overfitting, i.e. training accuracy far above test accuracy.", "Аугментация борется с переобучением, то есть когда точность на обучении намного выше тестовой."],
        ], "Augmentation creates new, realistic training variants; validation and test images stay original so that they measure real performance.", "Аугментация создаёт новые реалистичные варианты для обучения; валидационные и тестовые снимки остаются исходными, чтобы мерить реальное качество."),
        qx("Waste photos show a small bottle in a large, cluttered room. Which step removes background shortcuts?", "Crop to the object's region of interest", [
          ["Convert to grayscale", "Gray keeps the whole background, only without colour.", "Серое сохраняет весь фон, только без цвета."],
          ["Resize the full frame to 32 × 32 to make it simpler", "The bottle would shrink to a few pixels while the room stays.", "Бутылка сожмётся до нескольких пикселей, а комната останется."],
          ["Apply histogram equalization", "Equalization changes contrast everywhere, background included.", "Выравнивание меняет контраст везде, включая фон."],
        ], "Cropping keeps the object and drops the background, so the model cannot learn the room instead of the waste.", "Обрезка оставляет объект и убирает фон, поэтому модель не выучит комнату вместо мусора."),
        tfx("Global histogram equalization can make noise more visible in dark, flat regions of an image.", true, "Equalization stretches the narrow range of dark values, which also stretches their small random differences — the noise; CLAHE limits this with a clip limit.", "Выравнивание растягивает узкий диапазон тёмных значений, а вместе с ним и их мелкие случайные различия — шум; CLAHE ограничивает это порогом clipLimit.", "Choosing False assumes equalization only improves images; it amplifies whatever variation is present, noise included.", "Ответ False предполагает, что выравнивание только улучшает снимки; оно усиливает любые различия, в том числе шум."),
        tfx("For reading text on receipts, converting to grayscale loses information that the task needs.", false, "Text is dark ink on light paper; the information is in brightness, so grayscale (followed by Otsu) loses nothing useful.", "Текст — тёмные чернила на светлой бумаге; информация в яркости, поэтому серое (а затем Otsu) ничего полезного не теряет.", "Choosing True would be right for colour-defined tasks such as ripeness, but not for dark-on-light text.", "Ответ True был бы верен для задач, где класс задаёт цвет, например спелость, но не для тёмного текста на светлом."),
      ],
    ),
    part(
      "cv-drill-p3",
      { en: "Calculations", ru: "Вычисления" },
      {
        en: `## Variant 1, Q2 — reading a score table
The **predicted class** is the column with the **highest score** in its row (**argmax**). Compare it with the true class, then count.
| Image | Cat | Dog | Bird | Predicted | True | Correct? |
|---|---|---|---|---|---|---|
| A | 2.4 | 0.7 | −0.2 | Cat | Cat | yes |
| B | 0.3 | 1.2 | 1.8 | Bird | Dog | no |
| C | −0.5 | 0.4 | 2.1 | Bird | Bird | yes |
| D | 1.4 | 1.6 | 0.2 | Dog | Dog | yes |
= accuracy = correct / total = 3 / 4 = 0.75 = 75%
- **Q2a:** A → Cat, B → Bird, C → Bird, D → Dog.
- **Q2b:** 3 of the 4 predictions are correct → **75%**.
- **Q2c:** **image B** — its true class is Dog, but Bird has the highest score (1.8 > 1.2).
- **Q2d:** a **score (logit)** is a raw, unbounded number of any sign; only the comparison between classes matters. A **probability** lies in (0, 1), and the probabilities of all classes sum to 1. **Softmax** turns scores into probabilities and never changes the argmax.
- **Q2e:** 95% train vs 62% test = **overfitting**: the model memorized the training images and does not generalize. Fix: more data or **augmentation**, regularization (**L2 weight decay, dropout**), a simpler model, **early stopping**; tune on a validation set, never on the test set.
## New variant — five images, three classes
| Image | Plastic | Paper | Glass | True |
|---|---|---|---|---|
| P | 1.2 | −0.4 | 0.9 | Plastic |
| Q | 0.5 | 2.2 | 2.6 | Paper |
| R | −1.0 | 0.3 | 0.1 | Paper |
| S | 3.1 | 0.0 | 3.4 | Plastic |
| T | 0.2 | −0.7 | 1.5 | Glass |
= predicted: P Plastic, Q Glass, R Paper, S Glass, T Glass
= accuracy = 3 / 5 = 0.6 = 60%
- Misclassified: **Q** (Paper → Glass) and **S** (Plastic → Glass). R is correct although its best score is only 0.3 — only **which** score is the largest matters, not its size or sign.
## Variant 1, Q3 — s = Wx + b by hand
@diagram cv-linear
= W = [[1, 2], [-1, 1], [2, -1]],  x = [2, -1],  b = [0, 1, -1]
= s0 (Cat)  = 1*2 + 2*(-1) + 0       = 2 - 2 + 0  = 0
= s1 (Dog)  = (-1)*2 + 1*(-1) + 1    = -2 - 1 + 1 = -2
= s2 (Bird) = 2*2 + (-1)*(-1) + (-1) = 4 + 1 - 1  = 4
= s = [0, -2, 4]  ->  argmax = 2  ->  Bird
- **Q3a:** each score = **one row of W times x** (a dot product) **plus that class's bias**.
- **Q3b:** the largest score is 4 → class 2, **Bird**.
- **Q3c:** **W** holds the learned weights: row k is the **template of class k** — how strongly each input value votes for that class; geometrically it sets the direction of that class's boundary. **b** is a per-class **offset** that shifts the score whatever the input is, moving the boundary away from the origin.
- **Q3d:** a linear classifier cuts the input space with **hyperplanes** (straight lines in 2D) and keeps **one template per class**. **XOR** (one class in quadrants 1 and 3, the other in 2 and 4), a class inside a ring, or a class with several looks (a horse facing left or right) cannot be separated by one line. Non-linear features or a neural network are needed.
= shapes: W is C x D, x is D, b is C, s is C
= CIFAR-10: W is 10 x 3072  ->  10*3072 + 10 = 30730 parameters
## New variant — the bias decides
= W = [[2, 1], [-1, 3], [1, -2]],  x = [3, -1],  b = [2, 4, 0]
= s0 = 2*3 + 1*(-1) + 2      = 6 - 1 + 2  = 7
= s1 = (-1)*3 + 3*(-1) + 4   = -3 - 3 + 4 = -2
= s2 = 1*3 + (-2)*(-1) + 0   = 3 + 2 + 0  = 5
= s = [7, -2, 5]  ->  class 0
Without b the scores would be [5, −6, 5] — a tie between classes 0 and 2; the bias breaks it.
## Multiclass SVM (hinge) loss — on the Variant 1 table
= L_i = sum over j != y_i of max(0, s_j - s_yi + 1)
= A (true Cat):  max(0, 0.7 - 2.4 + 1) + max(0, -0.2 - 2.4 + 1) = 0 + 0 = 0
= B (true Dog):  max(0, 0.3 - 1.2 + 1) + max(0, 1.8 - 1.2 + 1) = 0.1 + 1.6 = 1.7
= C (true Bird): max(0, -0.5 - 2.1 + 1) + max(0, 0.4 - 2.1 + 1) = 0 + 0 = 0
= D (true Dog):  max(0, 1.4 - 1.6 + 1) + max(0, 0.2 - 1.6 + 1) = 0.8 + 0 = 0.8
= L = (0 + 1.7 + 0 + 0.8) / 4 = 0.625
- D is **classified correctly but still costs 0.8**: Dog wins by only 0.2, less than the **margin of 1**.
- The minimum is 0 and there is no maximum; when all scores are about equal, the loss is about C − 1.
## Softmax and cross-entropy
@diagram cv-softmax
= p_k = exp(s_k) / sum_j exp(s_j),   L_i = -log(p_yi)
= slide: s = [3.2, 5.1, -1.7] (cat, car, frog), true class cat
= exp -> [24.5, 164.0, 0.18],  sum = 188.7
= p = [0.13, 0.87, 0.00],  L = -log(0.13) = 2.04
= image D: s = [1.4, 1.6, 0.2] -> exp [4.06, 4.95, 1.22], sum 10.23
= p = [0.40, 0.48, 0.12],  L = -log(0.48) = 0.73
- The loss is 0 only when the true class gets probability 1; at initialization (all scores about equal) L = −log(1/C) = log C: **log 10 ≈ 2.3**, log 3 ≈ 1.1.
- Softmax keeps the **order** of the scores, so the predicted class does not change.
## Convolution — output size and parameters
= O = (W - K + 2P) / S + 1
= 32x32x3, ten 5x5 filters, S=1, P=0:  (32 - 5 + 0) / 1 + 1 = 28  ->  28x28x10
= the same with P=2:                   (32 - 5 + 4) / 1 + 1 = 32  ->  32x32x10
= 7x7 input, 3x3 filter, S=2:          (7 - 3) / 2 + 1 = 3
= 227x227x3, 11x11 filters, S=4:       (227 - 11) / 4 + 1 = 55
= params = C_out * (C_in * K * K + 1)
= ten 5x5 filters on 3 channels:   10 * (5*5*3 + 1) = 760
= sixteen 3x3 filters on RGB:      16 * (3*3*3 + 1) = 448
- **Max pooling 2 × 2 with stride 2** halves height and width and has **no parameters**: 32 × 32 × 16 → 16 × 16 × 16.
## Reading train and test numbers
| Train | Test | Diagnosis | What to say |
|---|---|---|---|
| 95% | 62% | overfitting, a gap of 33 points | augmentation, L2 / dropout, a simpler model, early stopping |
| 60% | 58% | underfitting | a bigger model, better features, longer training |
| 93% | 90% | generalizes well | keep it; check the per-class results |
| 99% | 99% | suspicious if test has near-duplicates | look for leakage between the splits |
> Prediction = argmax of the scores; accuracy = correct / total; s = Wx + b row by row; softmax turns scores into probabilities but never changes the predicted class.
## Check yourself
?? A three-class classifier has W = [[1, 0], [2, −1], [−1, 2]], x = [1, 3] and b = [1, 0, −2]. Compute s = Wx + b and the predicted class (0, 1 or 2).
?= s0 = 1·1 + 0·3 + 1 = 2, s1 = 2·1 + (−1)·3 + 0 = −1, s2 = (−1)·1 + 2·3 − 2 = 3, so s = [2, −1, 3] and the prediction is class 2, the largest score.
?? For an image of class Dog the scores are Cat 2.0, Dog 1.5, Bird −0.5. Compute the multiclass SVM loss and say whether the image is classified correctly.
?= L = max(0, 2.0 − 1.5 + 1) + max(0, −0.5 − 1.5 + 1) = 1.5 + 0 = 1.5; the highest score belongs to Cat, so the image is misclassified.`,
        ru: `## Вариант 1, Q2 — чтение таблицы оценок
**Предсказанный класс** — столбец с **наибольшей оценкой** в строке (**argmax**). Сравните его с истинным классом, затем посчитайте.
| Снимок | Cat | Dog | Bird | Предсказание | Истина | Верно? |
|---|---|---|---|---|---|---|
| A | 2.4 | 0.7 | −0.2 | Cat | Cat | да |
| B | 0.3 | 1.2 | 1.8 | Bird | Dog | нет |
| C | −0.5 | 0.4 | 2.1 | Bird | Bird | да |
| D | 1.4 | 1.6 | 0.2 | Dog | Dog | да |
= accuracy = correct / total = 3 / 4 = 0.75 = 75%
- **Q2a:** A → Cat, B → Bird, C → Bird, D → Dog.
- **Q2b:** верны 3 предсказания из 4 → **75%**.
- **Q2c:** **снимок B** — его истинный класс Dog, но наибольшая оценка у Bird (1.8 > 1.2).
- **Q2d:** **оценка (score, logit)** — сырое неограниченное число любого знака; важно только сравнение между классами. **Вероятность** лежит в (0, 1), а вероятности всех классов в сумме дают 1. **Softmax** превращает оценки в вероятности и никогда не меняет argmax.
- **Q2e:** 95% на обучении и 62% на тесте = **переобучение**: модель запомнила обучающие снимки и не обобщает. Что делать: больше данных или **аугментация**, регуляризация (**L2 weight decay, dropout**), более простая модель, **early stopping**; подбирать настройки на валидации, никогда — на тесте.
## Новый вариант — пять снимков, три класса
| Снимок | Plastic | Paper | Glass | Истина |
|---|---|---|---|---|
| P | 1.2 | −0.4 | 0.9 | Plastic |
| Q | 0.5 | 2.2 | 2.6 | Paper |
| R | −1.0 | 0.3 | 0.1 | Paper |
| S | 3.1 | 0.0 | 3.4 | Plastic |
| T | 0.2 | −0.7 | 1.5 | Glass |
= predicted: P Plastic, Q Glass, R Paper, S Glass, T Glass
= accuracy = 3 / 5 = 0.6 = 60%
- Ошибки: **Q** (Paper → Glass) и **S** (Plastic → Glass). R классифицирован верно, хотя его лучшая оценка всего 0.3 — важно только, **какая** оценка наибольшая, а не её величина или знак.
## Вариант 1, Q3 — s = Wx + b вручную
@diagram cv-linear
= W = [[1, 2], [-1, 1], [2, -1]],  x = [2, -1],  b = [0, 1, -1]
= s0 (Cat)  = 1*2 + 2*(-1) + 0       = 2 - 2 + 0  = 0
= s1 (Dog)  = (-1)*2 + 1*(-1) + 1    = -2 - 1 + 1 = -2
= s2 (Bird) = 2*2 + (-1)*(-1) + (-1) = 4 + 1 - 1  = 4
= s = [0, -2, 4]  ->  argmax = 2  ->  Bird
- **Q3a:** каждая оценка = **строка W, умноженная на x** (скалярное произведение), **плюс смещение этого класса**.
- **Q3b:** наибольшая оценка 4 → класс 2, **Bird**.
- **Q3c:** **W** хранит выученные веса: строка k — **шаблон класса k**, то есть насколько сильно каждое входное значение «голосует» за этот класс; геометрически строка задаёт направление границы этого класса. **b** — **сдвиг** для каждого класса, который меняет оценку независимо от входа и отодвигает границу от начала координат.
- **Q3d:** линейный классификатор режет пространство входов **гиперплоскостями** (прямыми в 2D) и держит **один шаблон на класс**. **XOR** (один класс в 1-й и 3-й четвертях, другой — во 2-й и 4-й), класс внутри кольца или класс с несколькими обличьями (лошадь мордой влево и вправо) одной прямой не разделить. Нужны нелинейные признаки или нейронная сеть.
= shapes: W is C x D, x is D, b is C, s is C
= CIFAR-10: W is 10 x 3072  ->  10*3072 + 10 = 30730 parameters
## Новый вариант — решает смещение
= W = [[2, 1], [-1, 3], [1, -2]],  x = [3, -1],  b = [2, 4, 0]
= s0 = 2*3 + 1*(-1) + 2      = 6 - 1 + 2  = 7
= s1 = (-1)*3 + 3*(-1) + 4   = -3 - 3 + 4 = -2
= s2 = 1*3 + (-2)*(-1) + 0   = 3 + 2 + 0  = 5
= s = [7, -2, 5]  ->  class 0
Без b оценки были бы [5, −6, 5] — ничья между классами 0 и 2; её разрешает смещение.
## Multiclass SVM (hinge) loss — на таблице варианта 1
= L_i = sum over j != y_i of max(0, s_j - s_yi + 1)
= A (true Cat):  max(0, 0.7 - 2.4 + 1) + max(0, -0.2 - 2.4 + 1) = 0 + 0 = 0
= B (true Dog):  max(0, 0.3 - 1.2 + 1) + max(0, 1.8 - 1.2 + 1) = 0.1 + 1.6 = 1.7
= C (true Bird): max(0, -0.5 - 2.1 + 1) + max(0, 0.4 - 2.1 + 1) = 0 + 0 = 0
= D (true Dog):  max(0, 1.4 - 1.6 + 1) + max(0, 0.2 - 1.6 + 1) = 0.8 + 0 = 0.8
= L = (0 + 1.7 + 0 + 0.8) / 4 = 0.625
- D **классифицирован верно, но всё равно даёт потерю 0.8**: Dog выигрывает всего на 0.2 — меньше **запаса (margin) 1**.
- Минимум 0, максимума нет; когда все оценки примерно равны, потеря примерно C − 1.
## Softmax и cross-entropy
@diagram cv-softmax
= p_k = exp(s_k) / sum_j exp(s_j),   L_i = -log(p_yi)
= slide: s = [3.2, 5.1, -1.7] (cat, car, frog), true class cat
= exp -> [24.5, 164.0, 0.18],  sum = 188.7
= p = [0.13, 0.87, 0.00],  L = -log(0.13) = 2.04
= image D: s = [1.4, 1.6, 0.2] -> exp [4.06, 4.95, 1.22], sum 10.23
= p = [0.40, 0.48, 0.12],  L = -log(0.48) = 0.73
- Потеря равна 0, только когда истинный класс получает вероятность 1; при инициализации (все оценки примерно равны) L = −log(1/C) = log C: **log 10 ≈ 2.3**, log 3 ≈ 1.1.
- Softmax сохраняет **порядок** оценок, поэтому предсказанный класс не меняется.
## Свёртка — размер выхода и число параметров
= O = (W - K + 2P) / S + 1
= 32x32x3, ten 5x5 filters, S=1, P=0:  (32 - 5 + 0) / 1 + 1 = 28  ->  28x28x10
= the same with P=2:                   (32 - 5 + 4) / 1 + 1 = 32  ->  32x32x10
= 7x7 input, 3x3 filter, S=2:          (7 - 3) / 2 + 1 = 3
= 227x227x3, 11x11 filters, S=4:       (227 - 11) / 4 + 1 = 55
= params = C_out * (C_in * K * K + 1)
= ten 5x5 filters on 3 channels:   10 * (5*5*3 + 1) = 760
= sixteen 3x3 filters on RGB:      16 * (3*3*3 + 1) = 448
- **Max pooling 2 × 2 со stride 2** вдвое уменьшает высоту и ширину и **не имеет параметров**: 32 × 32 × 16 → 16 × 16 × 16.
## Как читать цифры обучения и теста
| Обучение | Тест | Диагноз | Что сказать |
|---|---|---|---|
| 95% | 62% | переобучение, разрыв 33 пункта | аугментация, L2 / dropout, модель попроще, early stopping |
| 60% | 58% | недообучение | модель побольше, признаки получше, обучать дольше |
| 93% | 90% | хорошо обобщает | оставить; проверить результаты по классам |
| 99% | 99% | подозрительно, если в тесте почти дубликаты | искать утечку между частями |
> Предсказание = argmax оценок; accuracy = верные / все; s = Wx + b строка за строкой; softmax превращает оценки в вероятности, но никогда не меняет предсказанный класс.
## Проверь себя
?? У классификатора на три класса W = [[1, 0], [2, −1], [−1, 2]], x = [1, 3] и b = [1, 0, −2]. Вычислите s = Wx + b и предсказанный класс (0, 1 или 2).
?= s0 = 1·1 + 0·3 + 1 = 2, s1 = 2·1 + (−1)·3 + 0 = −1, s2 = (−1)·1 + 2·3 − 2 = 3, поэтому s = [2, −1, 3], и предсказан класс 2 — у него наибольшая оценка.
?? Для снимка класса Dog оценки такие: Cat 2.0, Dog 1.5, Bird −0.5. Вычислите multiclass SVM loss и скажите, верно ли классифицирован снимок.
?= L = max(0, 2.0 − 1.5 + 1) + max(0, −0.5 − 1.5 + 1) = 1.5 + 0 = 1.5; наибольшая оценка у Cat, поэтому снимок классифицирован неверно.`,
      },
      [
        qx("Variant 1 table: image B has scores Cat 0.3, Dog 1.2, Bird 1.8. What is the predicted class?", "Bird", [
          ["Dog", "Dog is the true class, but the prediction is the class with the highest score, which is Bird (1.8).", "Dog — истинный класс, но предсказание — это класс с наибольшей оценкой, то есть Bird (1.8)."],
          ["Cat", "Cat has the lowest score here (0.3).", "У Cat здесь наименьшая оценка (0.3)."],
          ["No class: every score is below 2", "There is no minimum score; the argmax is always a prediction.", "Минимальной оценки нет; argmax всегда даёт предсказание."],
        ], "Prediction = argmax: 1.8 (Bird) > 1.2 (Dog) > 0.3 (Cat).", "Предсказание = argmax: 1.8 (Bird) > 1.2 (Dog) > 0.3 (Cat)."),
        qx("Variant 1: predictions A Cat, B Bird, C Bird, D Dog; true classes Cat, Dog, Bird, Dog. What is the accuracy?", "75%", [
          ["25%", "25% is the error rate: 1 wrong out of 4.", "25% — это доля ошибок: 1 неверный из 4."],
          ["50%", "Only image B is wrong, so 3 of 4 are correct, not 2.", "Ошибается только снимок B, поэтому верны 3 из 4, а не 2."],
          ["100%", "Image B is misclassified: Bird is predicted, Dog is true.", "Снимок B классифицирован неверно: предсказан Bird, а истина — Dog."],
        ], "Accuracy = correct / total = 3 / 4 = 75%.", "Accuracy = верные / все = 3 / 4 = 75%."),
        qx("Scores (Plastic, Paper, Glass) for an image of class Paper are 0.5, 2.2, 2.6. What is the outcome?", "Glass is predicted, so it is an error", [
          ["Paper is predicted, since it is the true class", "The prediction ignores the true class; it is the argmax of the scores.", "Предсказание не смотрит на истинный класс; это argmax оценок."],
          ["Paper, because 2.2 is close enough to 2.6", "Only the largest score counts; being close does not matter.", "Считается только наибольшая оценка; близость значения не имеет."],
          ["No prediction until softmax is applied", "Scores are logits, and the argmax works on them directly.", "Оценки — это logits, и argmax работает прямо по ним."],
        ], "argmax(0.5, 2.2, 2.6) = Glass ≠ Paper, so this image counts as an error.", "argmax(0.5, 2.2, 2.6) = Glass ≠ Paper, поэтому этот снимок считается ошибкой."),
        qx("In a test of 5 images, images Q and S are misclassified and the rest are correct. What is the accuracy?", "60%", [
          ["40%", "40% is the error rate: 2 of 5 are wrong.", "40% — это доля ошибок: 2 из 5 неверны."],
          ["75%", "75% would be 3 of 4; here there are 5 images.", "75% было бы при 3 из 4; здесь снимков 5."],
          ["67%", "3 / 5 is 0.6; 67% is 2 / 3, a different fraction.", "3 / 5 = 0.6; 67% — это 2 / 3, другая дробь."],
        ], "Accuracy = 3 correct / 5 total = 0.6 = 60%.", "Accuracy = 3 верных / 5 всего = 0.6 = 60%."),
        qx("W = [[1, 2], [−1, 1], [2, −1]], x = [2, −1], b = [0, 1, −1]. What is s = Wx + b?", "[0, −2, 4]", [
          ["[0, −3, 5]", "This is Wx alone; adding b = [0, 1, −1] gives [0, −2, 4].", "Это только Wx; после прибавления b = [0, 1, −1] получается [0, −2, 4]."],
          ["[4, −2, 0]", "The right numbers in reverse order: s0 belongs to row 1 (Cat), s2 to row 3 (Bird).", "Верные числа в обратном порядке: s0 — это строка 1 (Cat), s2 — строка 3 (Bird)."],
          ["[2, −2, 4]", "s0 = 1·2 + 2·(−1) + 0 = 0; the product 2·(−1) is −2.", "s0 = 1·2 + 2·(−1) + 0 = 0; произведение 2·(−1) равно −2."],
        ], "s0 = 2 − 2 + 0 = 0, s1 = −2 − 1 + 1 = −2, s2 = 4 + 1 − 1 = 4, so s = [0, −2, 4] and the prediction is Bird.", "s0 = 2 − 2 + 0 = 0, s1 = −2 − 1 + 1 = −2, s2 = 4 + 1 − 1 = 4, поэтому s = [0, −2, 4], и предсказан Bird."),
        qx("W = [[2, 1], [−1, 3], [1, −2]], x = [3, −1], b = [2, 4, 0]. Which class has the highest score?", "Class 0: s = [7, −2, 5]", [
          ["Class 2: s = [5, −2, 7]", "s0 = 6 − 1 + 2 = 7 and s2 = 3 + 2 + 0 = 5; the two values were swapped.", "s0 = 6 − 1 + 2 = 7, а s2 = 3 + 2 + 0 = 5; два значения перепутаны."],
          ["A tie of 0 and 2: s = [5, −6, 5]", "This is Wx without b; adding b = [2, 4, 0] breaks the tie.", "Это Wx без b; прибавление b = [2, 4, 0] разрешает ничью."],
          ["Class 2: s = [5, −4, 9]", "This adds the biases to the wrong rows; b0 = 2 goes with row 0 and b2 = 0 with row 2.", "Здесь смещения прибавлены не к тем строкам; b0 = 2 идёт со строкой 0, а b2 = 0 — со строкой 2."],
        ], "s0 = 2·3 + 1·(−1) + 2 = 7, s1 = −3 − 3 + 4 = −2, s2 = 3 + 2 + 0 = 5; the argmax is class 0.", "s0 = 2·3 + 1·(−1) + 2 = 7, s1 = −3 − 3 + 4 = −2, s2 = 3 + 2 + 0 = 5; argmax — класс 0."),
        qx("What does one row of W represent in a linear classifier s = Wx + b?", "The weights (template) of one class", [
          ["One training image kept for comparison", "Keeping training images is kNN; a linear classifier keeps only W and b.", "Хранить обучающие снимки — это kNN; линейный классификатор хранит только W и b."],
          ["The biases of all the classes", "The biases form the vector b, one number per class.", "Смещения образуют вектор b, по одному числу на класс."],
          ["The probability of one class", "A row times x gives a score, not a probability; softmax is a separate step.", "Строка, умноженная на x, даёт оценку, а не вероятность; softmax — отдельный шаг."],
        ], "Row k of W holds the weights that score class k: it acts as a template matched against x by a dot product.", "Строка k матрицы W хранит веса, которые дают оценку класса k: это шаблон, который сравнивается с x скалярным произведением."),
        qx("What does the bias b do in s = Wx + b?", "Shifts each class score, whatever the input", [
          ["Scales each pixel before the multiplication", "Scaling inputs is preprocessing; b is added after Wx.", "Масштабирование входа — это предобработка; b прибавляется после Wx."],
          ["Turns the scores into probabilities", "That is the job of softmax; b is just an added offset.", "Это работа softmax; b — просто прибавляемый сдвиг."],
          ["Stores the true class of each image", "Labels are separate data, not model parameters.", "Метки — отдельные данные, а не параметры модели."],
        ], "b adds one number per class regardless of x; geometrically it moves the decision boundary away from the origin.", "b прибавляет по одному числу на класс независимо от x; геометрически он отодвигает границу решения от начала координат."),
        qx("A linear classifier for CIFAR-10 takes 32 × 32 × 3 images and outputs 10 scores. How many parameters do W and b have?", "30 730", [
          ["30 720", "That counts W (10 × 3 072) only; the 10 biases are missing.", "Это только W (10 × 3 072); не хватает 10 смещений."],
          ["3 072", "3 072 is the length of one input vector, not the parameter count.", "3 072 — длина одного входного вектора, а не число параметров."],
          ["10 250", "10 × 1 024 + 10 would fit a gray 32 × 32 image; CIFAR images have 3 channels.", "10 × 1 024 + 10 подошло бы для серого снимка 32 × 32; у CIFAR 3 канала."],
        ], "W is 10 × 3 072 = 30 720 weights, plus 10 biases → 30 730.", "W — это 10 × 3 072 = 30 720 весов, плюс 10 смещений → 30 730."),
        qx("Why can a single linear classifier not separate XOR-like data?", "Its decision boundary is a straight line", [
          ["It has too few training images", "More XOR points do not help; no single line separates the quadrants.", "Больше точек XOR не помогут; никакая одна прямая не разделит четверти."],
          ["Its scores can be negative", "Negative scores are normal; the limit is the shape of the boundary.", "Отрицательные оценки — норма; ограничение в форме границы."],
          ["It needs a softmax at the end to bend the boundary", "Softmax only rescales the scores; the boundary stays linear.", "Softmax лишь перемасштабирует оценки; граница остаётся линейной."],
        ], "XOR puts one class in quadrants 1 and 3 and the other in 2 and 4; any line leaves points of both classes on one side.", "XOR кладёт один класс в 1-ю и 3-ю четверти, а другой — во 2-ю и 4-ю; любая прямая оставит точки обоих классов по одну сторону."),
        qx("Variant 1 image B (true Dog): Cat 0.3, Dog 1.2, Bird 1.8. What is the multiclass SVM loss with margin 1?", "1.7", [
          ["1.6", "That is only the Bird term; the Cat term max(0, 0.3 − 1.2 + 1) = 0.1 is added to it.", "Это только слагаемое Bird; к нему добавляется слагаемое Cat max(0, 0.3 − 1.2 + 1) = 0.1."],
          ["0.6", "The Bird term is 1.8 − 1.2 + 1 = 1.6, not 0.6 — the margin 1 must be added.", "Слагаемое Bird равно 1.8 − 1.2 + 1 = 1.6, а не 0.6 — нужно прибавить запас 1."],
          ["0", "The loss is 0 only if the true class beats every other class by at least 1; here Bird even wins.", "Потеря равна 0, только если истинный класс обгоняет все остальные хотя бы на 1; здесь Bird даже выигрывает."],
        ], "Sum over the wrong classes: max(0, 0.3 − 1.2 + 1) + max(0, 1.8 − 1.2 + 1) = 0.1 + 1.6 = 1.7.", "Сумма по неверным классам: max(0, 0.3 − 1.2 + 1) + max(0, 1.8 − 1.2 + 1) = 0.1 + 1.6 = 1.7."),
        qx("Variant 1 image D (true Dog): Cat 1.4, Dog 1.6, Bird 0.2. It is classified correctly. What is its SVM loss?", "0.8", [
          ["0", "A correct prediction is not enough: Dog beats Cat by only 0.2, less than the margin 1.", "Верного предсказания мало: Dog обгоняет Cat всего на 0.2 — меньше запаса 1."],
          ["1.2", "Cat gives 1.4 − 1.6 + 1 = 0.8 and Bird gives max(0, −0.4) = 0, so the total is 0.8.", "Cat даёт 1.4 − 1.6 + 1 = 0.8, а Bird — max(0, −0.4) = 0, итого 0.8."],
          ["0.4", "The Bird term is negative, so max turns it into 0; it is not added as 0.4.", "Слагаемое Bird отрицательное, поэтому max превращает его в 0; как 0.4 оно не прибавляется."],
        ], "Sum over the wrong classes: max(0, 1.4 − 1.6 + 1) + max(0, 0.2 − 1.6 + 1) = 0.8 + 0 = 0.8.", "Сумма по неверным классам: max(0, 1.4 − 1.6 + 1) + max(0, 0.2 − 1.6 + 1) = 0.8 + 0 = 0.8."),
        qx("Softmax of the scores [3, 1, 0]: what is the probability of the first class (rounded)?", "0.84", [
          ["0.75", "0.75 = 3 / (3 + 1 + 0) divides the raw scores; softmax exponentiates them first.", "0.75 = 3 / (3 + 1 + 0) — деление сырых оценок; softmax сначала берёт экспоненту."],
          ["0.33", "0.33 = 1 / 3 would be the answer only if all scores were equal.", "0.33 = 1 / 3 было бы ответом, только если бы все оценки были равны."],
          ["20.09", "e³ ≈ 20.09 is the unnormalized value; divide by the sum 23.80.", "e³ ≈ 20.09 — ненормированное значение; его нужно разделить на сумму 23.80."],
        ], "exp → [20.09, 2.72, 1.00], sum 23.80; p0 = 20.09 / 23.80 ≈ 0.84.", "exp → [20.09, 2.72, 1.00], сумма 23.80; p0 = 20.09 / 23.80 ≈ 0.84."),
        qx("After softmax the true class has probability 0.13. What is the cross-entropy loss?", "2.04", [
          ["0.13", "That is the probability itself; the loss is −log(0.13).", "Это сама вероятность; потеря — это −log(0.13)."],
          ["0.87", "0.87 = 1 − 0.13; cross-entropy uses −log, not 1 − p.", "0.87 = 1 − 0.13; cross-entropy использует −log, а не 1 − p."],
          ["−2.04", "There is a minus sign in front of the log, so the loss is positive.", "Перед логарифмом стоит минус, поэтому потеря положительная."],
        ], "L = −ln(0.13) ≈ 2.04 — the cat example from the slides.", "L = −ln(0.13) ≈ 2.04 — пример с кошкой со слайдов."),
        qx("At initialization all scores are almost equal. What softmax cross-entropy loss do you expect with 10 classes?", "About 2.3, that is log 10", [
          ["About 0", "Loss 0 needs probability 1 for the true class; at the start each class gets about 0.1.", "Потеря 0 требует вероятности 1 у истинного класса; в начале каждый класс получает около 0.1."],
          ["About 9, that is C − 1", "C − 1 is the SVM loss with margin 1 at initialization, not cross-entropy.", "C − 1 — это SVM loss с запасом 1 при инициализации, а не cross-entropy."],
          ["About 0.1", "0.1 is the probability of each class; the loss is −log(0.1).", "0.1 — вероятность каждого класса; потеря равна −log(0.1)."],
        ], "Each class gets p ≈ 1/10, so L = −log(1/10) = log 10 ≈ 2.3 — a useful sanity check.", "Каждый класс получает p ≈ 1/10, поэтому L = −log(1/10) = log 10 ≈ 2.3 — полезная проверка на здравый смысл."),
        tfx("Applying softmax to the scores can change which class is predicted.", false, "Softmax is monotonic: a larger score always gives a larger probability, so the argmax stays the same.", "Softmax монотонен: большая оценка всегда даёт большую вероятность, поэтому argmax не меняется.", "Choosing True confuses rescaling with reordering; softmax only rescales the scores into (0, 1) with sum 1.", "Ответ True путает перемасштабирование с перестановкой; softmax лишь переводит оценки в (0, 1) с суммой 1."),
        tfx("A class score of −1.5 is invalid, because scores must lie between 0 and 1.", false, "Scores (logits) are unbounded real numbers of any sign; only probabilities after softmax lie in (0, 1).", "Оценки (logits) — неограниченные вещественные числа любого знака; в (0, 1) лежат только вероятности после softmax.", "Choosing True mixes up scores and probabilities.", "Ответ True путает оценки и вероятности."),
        qx("A 32 × 32 × 3 input goes through ten 5 × 5 filters, stride 1, no padding. What is the output volume?", "28 × 28 × 10", [
          ["32 × 32 × 10", "That needs padding 2; without padding the map shrinks by K − 1 = 4.", "Для этого нужен padding 2; без него карта уменьшается на K − 1 = 4."],
          ["28 × 28 × 3", "The depth equals the number of filters (10), not the number of input channels.", "Глубина равна числу фильтров (10), а не числу входных каналов."],
          ["27 × 27 × 10", "(32 − 5) / 1 + 1 = 28; forgetting the + 1 gives 27.", "(32 − 5) / 1 + 1 = 28; если забыть + 1, получится 27."],
        ], "(32 − 5 + 2·0) / 1 + 1 = 28, and 10 filters give depth 10.", "(32 − 5 + 2·0) / 1 + 1 = 28, а 10 фильтров дают глубину 10."),
        qx("How many learnable parameters does a conv layer with sixteen 3 × 3 filters on an RGB input have?", "448", [
          ["432", "16 × 27 = 432 counts the weights only; each filter also has a bias.", "16 × 27 = 432 — только веса; у каждого фильтра есть ещё смещение."],
          ["160", "16 × (3 × 3 + 1) = 160 forgets the 3 input channels.", "16 × (3 × 3 + 1) = 160 забывает про 3 входных канала."],
          ["144", "16 × 9 = 144 ignores both the channels and the biases.", "16 × 9 = 144 не учитывает ни каналы, ни смещения."],
        ], "Each filter has 3 × 3 × 3 = 27 weights + 1 bias = 28; 16 × 28 = 448.", "У каждого фильтра 3 × 3 × 3 = 27 весов + 1 смещение = 28; 16 × 28 = 448."),
        qx("Train accuracy 95%, test accuracy 62%. What is the likely problem, with a fitting fix?", "Overfitting; add augmentation or L2 / dropout", [
          ["Underfitting; train a bigger model", "Underfitting means both accuracies are low; here training is at 95%.", "Недообучение — это когда обе точности низкие; здесь на обучении 95%."],
          ["The test set is too easy; make it harder", "The test score is the low one; the model fails to generalize.", "Низкая как раз тестовая точность; модель не обобщает."],
          ["Overfitting; tune hyperparameters on the test set", "Tuning on test leaks test data into model choice; use a validation set.", "Подбор на тесте протаскивает тестовые данные в выбор модели; используйте валидацию."],
        ], "A large train–test gap means the model memorized the training data. Fix: more data or augmentation, L2 weight decay, dropout, a simpler model or early stopping.", "Большой разрыв между обучением и тестом значит, что модель запомнила обучающие данные. Что делать: больше данных или аугментация, L2 weight decay, dropout, модель попроще или early stopping."),
      ],
    ),
    part(
      "cv-drill-p4",
      { en: "Design your own CV system", ru: "Спроектируйте свою CV-систему" },
      {
        en: `## Variant 1, Q5 — the waste classifier (2 000 images, 4 classes)
- **Q5a — organize:** one folder per class inside each split, so the folder name is the label; remove duplicates and near-duplicates **before** splitting; note which phone and place each photo came from.
= data/train/plastic/   data/train/paper/   data/train/glass/   data/train/other/
= data/val/plastic/   ...   data/test/other/
- **Q5b — split:** stratified (per class), for example:
= 80/20:     2000 * 0.8 = 1600 train,  2000 * 0.2 = 400 test
= 70/15/15:  2000 * 0.7 = 1400 train,  300 validation,  300 test
- **Q5c — preprocessing:** resize to 224 × 224 (fixed input); scale to [0, 1] and standardize; augmentation (flips, rotations, brightness) on the **training set only**. Keep colour — glass, plastic and paper differ in colour and transparency.
- **Q5d — metric:** **accuracy** if the four classes are balanced; otherwise **per-class precision, recall and F1 (macro-F1)** plus the **confusion matrix**, because accuracy hides a weak class.
- **Q5e — another phone:** **domain shift** — a different sensor, colour processing, resolution, lighting and background give inputs unlike the training data. Fix: photos from many phones and places, brightness/colour/blur augmentation, normalization, and a test on a held-out phone.
![Four pieces of household waste — a clear plastic bottle, a crumpled sheet of paper, a glass jar and a banana peel — each photographed by two different phones: one set warm-toned and slightly blurry on a wooden table, the other cool-toned and sharp on a gray floor](/events/cv/drill-waste-phones.webp)
## Stratified split — counts per class
@diagram cv-data-split
| Class | Images | Train 80% | Test 20% | Train 70% | Val 15% | Test 15% |
|---|---|---|---|---|---|---|
| Plastic | 800 | 640 | 160 | 560 | 120 | 120 |
| Paper | 600 | 480 | 120 | 420 | 90 | 90 |
| Glass | 400 | 320 | 80 | 280 | 60 | 60 |
| Other | 200 | 160 | 40 | 140 | 30 | 30 |
| Total | 2 000 | 1 600 | 400 | 1 400 | 300 | 300 |
- **Stratified** = every split keeps the class shares (40 / 30 / 20 / 10%). A purely random split can leave a small class almost absent from the test set.
- **Train** fits the weights; **validation** chooses hyperparameters (k, learning rate, λ, preprocessing); **test** is used **once**, at the end. Tuning on the test set makes the reported number too optimistic.
- **Leakage:** burst shots of the same object in train and test inflate test accuracy — split by object or by photo session.
## Metrics — when accuracy misleads
= accuracy = correct / total
= precision = TP / (TP + FP),   recall = TP / (TP + FN)
= F1 = 2 * precision * recall / (precision + recall);   macro-F1 = mean of per-class F1
Leaf test set: 950 healthy and 50 diseased leaves. A model that always answers «healthy»:
= accuracy = 950 / 1000 = 95%,   recall(diseased) = 0 / 50 = 0
A real model finds 40 of the 50 diseased leaves and raises 20 false alarms:
= TP = 40, FN = 10, FP = 20, TN = 930
= precision = 40 / 60 = 0.67,   recall = 40 / 50 = 0.80,   F1 = 2 * 0.67 * 0.80 / 1.47 = 0.73
= accuracy = (40 + 930) / 1000 = 97%
Accuracy differs by only 2 points, yet one model finds no sick leaves and the other finds 80% of them — **recall and F1 of the rare class** reveal it.
## Confusion matrix — waste test set (400 images)
Rows = true class, columns = predicted class; the diagonal holds the correct predictions.
| True ↓ / Predicted → | Plastic | Paper | Glass | Other |
|---|---|---|---|---|
| Plastic | 80 | 5 | 12 | 3 |
| Paper | 4 | 88 | 2 | 6 |
| Glass | 15 | 1 | 82 | 2 |
| Other | 6 | 9 | 3 | 82 |
= accuracy = (80 + 88 + 82 + 82) / 400 = 332 / 400 = 83%
= recall(Glass) = 82 / 100 = 0.82,   precision(Glass) = 82 / (12 + 2 + 82 + 3) = 82 / 99 = 0.83
- The biggest errors are **Glass ↔ Plastic** (15 and 12): transparent bottles look alike → more examples of clear plastic and glass, keep colour, use a higher resolution.
## Train ≫ test — what to do
@diagram cv-overfitting
| Symptom | Diagnosis | What to do |
|---|---|---|
| train 95%, test 62% | overfitting | more data, augmentation, L2 / dropout, a simpler model, early stopping |
| train 60%, test 58% | underfitting | a bigger model, better features, longer training |
| test 99% with near-duplicates | leakage | remove duplicates across splits, test again |
| 94% on own phone, 55% on another | domain shift | photos from many phones, colour and blur augmentation, normalization |
## New variant — fabric patterns (1 500 images, 500 per class)
- **Organize:** data/train/striped, data/train/checked, data/train/plain (+ val, test); record the lamp type of every photo and balance warm and cold lamps inside each class.
= 70/15/15 per class: 350 / 75 / 75  ->  total 1050 / 225 / 225
- **Preprocessing:** central crop, resize to 128 × 128 (32 × 32 would erase thin stripes), grayscale or white balance against the lamps, a mild blur against JPEG blocks.
- **Metric:** the classes are balanced → accuracy, plus the confusion matrix (striped vs checked is the likely confusion).
- **Fails under a new lamp:** if warm light came mostly with one pattern, the model learned the lamp → balance lamps per class and augment the colour temperature.
## New variant — leaf disease (1 200 images: 1 000 healthy, 200 diseased)
= stratified 80/20: healthy 800 / 200, diseased 160 / 40  ->  train 960, test 240
- **Metric:** recall and F1 of the **diseased** class plus the confusion matrix; accuracy misleads — always answering «healthy» already scores 200 / 240 = 83%.
- **Fails on another farm:** different soil, light and leaf varieties → domain shift; collect from several farms, crop the leaf, augment brightness and colour.
> Split per class before anything else, tune on validation and test once; choose a metric that sees your weakest class; expect a drop when the camera or the scene changes.
## Check yourself
?? You have 3 000 fruit images: 1 200 apples, 900 bananas, 600 oranges and 300 pears. Propose a stratified 70/15/15 split and give the counts.
?= Split each class 70/15/15: apples 840/180/180, bananas 630/135/135, oranges 420/90/90, pears 210/45/45 → 2 100 train, 450 validation, 450 test, each with the original class shares.
?? Your recycling model scores 97% on your own test set but 60% on photos from a classmate's phone. Give one likely reason and one fix.
?= Domain shift: the other phone's sensor, colour processing, resolution and lighting differ from the training photos, so the features the model relied on change; collect training photos from several phones, augment brightness, colour and blur, normalize inputs, and test on a held-out phone.`,
        ru: `## Вариант 1, Q5 — классификатор мусора (2 000 снимков, 4 класса)
- **Q5a — организация:** по папке на класс внутри каждой части разбиения, чтобы имя папки было меткой; дубликаты и почти-дубликаты удалить **до** разбиения; записать, с какого телефона и в каком месте сделан каждый снимок.
= data/train/plastic/   data/train/paper/   data/train/glass/   data/train/other/
= data/val/plastic/   ...   data/test/other/
- **Q5b — разбиение:** стратифицированное (по классам), например:
= 80/20:     2000 * 0.8 = 1600 train,  2000 * 0.2 = 400 test
= 70/15/15:  2000 * 0.7 = 1400 train,  300 validation,  300 test
- **Q5c — предобработка:** resize до 224 × 224 (фиксированный вход); масштаб в [0, 1] и стандартизация; аугментация (отражения, повороты, яркость) **только на обучающем наборе**. Цвет сохраняем — стекло, пластик и бумага различаются цветом и прозрачностью.
- **Q5d — метрика:** **accuracy**, если четыре класса сбалансированы; иначе **precision, recall и F1 по классам (macro-F1)** плюс **матрица ошибок**, потому что accuracy прячет слабый класс.
- **Q5e — другой телефон:** **сдвиг домена (domain shift)** — другая матрица, обработка цвета, разрешение, освещение и фон дают входы, не похожие на обучающие. Что делать: снимки с разных телефонов и в разных местах, аугментация яркости, цвета и размытия, нормализация и проверка на отложенном телефоне.
![Четыре предмета бытового мусора — прозрачная пластиковая бутылка, скомканный лист бумаги, стеклянная банка и банановая кожура — каждый снят двумя разными телефонами: один набор в тёплых тонах и слегка размыт на деревянном столе, другой — в холодных тонах и резкий на сером полу](/events/cv/drill-waste-phones.webp)
## Стратифицированное разбиение — числа по классам
@diagram cv-data-split
| Класс | Снимков | Train 80% | Test 20% | Train 70% | Val 15% | Test 15% |
|---|---|---|---|---|---|---|
| Plastic | 800 | 640 | 160 | 560 | 120 | 120 |
| Paper | 600 | 480 | 120 | 420 | 90 | 90 |
| Glass | 400 | 320 | 80 | 280 | 60 | 60 |
| Other | 200 | 160 | 40 | 140 | 30 | 30 |
| Всего | 2 000 | 1 600 | 400 | 1 400 | 300 | 300 |
- **Стратифицированное** = каждая часть сохраняет доли классов (40 / 30 / 20 / 10%). Чисто случайное разбиение может почти не оставить маленький класс в тесте.
- **Train** подгоняет веса; **validation** выбирает гиперпараметры (k, learning rate, λ, предобработку); **test** используется **один раз**, в конце. Подбор на тестовом наборе делает итоговую цифру слишком оптимистичной.
- **Утечка (leakage):** серия снимков одного и того же предмета и в train, и в test завышает тестовую точность — разбивайте по предметам или по фотосессиям.
## Метрики — когда accuracy обманывает
= accuracy = correct / total
= precision = TP / (TP + FP),   recall = TP / (TP + FN)
= F1 = 2 * precision * recall / (precision + recall);   macro-F1 = mean of per-class F1
Тестовый набор листьев: 950 здоровых и 50 больных. Модель, которая всегда отвечает «здоров»:
= accuracy = 950 / 1000 = 95%,   recall(diseased) = 0 / 50 = 0
Настоящая модель находит 40 из 50 больных листьев и даёт 20 ложных тревог:
= TP = 40, FN = 10, FP = 20, TN = 930
= precision = 40 / 60 = 0.67,   recall = 40 / 50 = 0.80,   F1 = 2 * 0.67 * 0.80 / 1.47 = 0.73
= accuracy = (40 + 930) / 1000 = 97%
Accuracy различается всего на 2 пункта, но одна модель не находит ни одного больного листа, а другая находит 80% — это видно по **recall и F1 редкого класса**.
## Матрица ошибок — тестовый набор мусора (400 снимков)
Строки — истинный класс, столбцы — предсказанный; на диагонали — верные предсказания.
| Истина ↓ / Предсказание → | Plastic | Paper | Glass | Other |
|---|---|---|---|---|
| Plastic | 80 | 5 | 12 | 3 |
| Paper | 4 | 88 | 2 | 6 |
| Glass | 15 | 1 | 82 | 2 |
| Other | 6 | 9 | 3 | 82 |
= accuracy = (80 + 88 + 82 + 82) / 400 = 332 / 400 = 83%
= recall(Glass) = 82 / 100 = 0.82,   precision(Glass) = 82 / (12 + 2 + 82 + 3) = 82 / 99 = 0.83
- Больше всего ошибок между **Glass ↔ Plastic** (15 и 12): прозрачные бутылки похожи → больше примеров прозрачного пластика и стекла, сохранить цвет, взять разрешение повыше.
## Train ≫ test — что делать
@diagram cv-overfitting
| Симптом | Диагноз | Что делать |
|---|---|---|
| train 95%, test 62% | переобучение | больше данных, аугментация, L2 / dropout, модель попроще, early stopping |
| train 60%, test 58% | недообучение | модель побольше, признаки получше, обучать дольше |
| test 99% при почти-дубликатах | утечка | убрать дубликаты между частями, проверить заново |
| 94% на своём телефоне, 55% на чужом | сдвиг домена | снимки с многих телефонов, аугментация цвета и размытия, нормализация |
## Новый вариант — узоры ткани (1 500 снимков, по 500 на класс)
- **Организация:** data/train/striped, data/train/checked, data/train/plain (+ val, test); записать тип лампы для каждого снимка и уравнять тёплые и холодные лампы внутри каждого класса.
= 70/15/15 per class: 350 / 75 / 75  ->  total 1050 / 225 / 225
- **Предобработка:** центральная обрезка, resize до 128 × 128 (32 × 32 стёр бы тонкие полоски), серое или баланс белого против ламп, лёгкое размытие против блоков JPEG.
- **Метрика:** классы сбалансированы → accuracy плюс матрица ошибок (вероятнее всего, путаться будут полоска и клетка).
- **Не работает под новой лампой:** если тёплый свет приходился в основном на один узор, модель выучила лампу → уравнять лампы по классам и аугментировать цветовую температуру.
## Новый вариант — болезни листьев (1 200 снимков: 1 000 здоровых, 200 больных)
= stratified 80/20: healthy 800 / 200, diseased 160 / 40  ->  train 960, test 240
- **Метрика:** recall и F1 класса **«болен»** плюс матрица ошибок; accuracy обманывает — ответ «всегда здоров» уже даёт 200 / 240 = 83%.
- **Не работает на другой ферме:** другая почва, свет и сорта листьев → сдвиг домена; собрать снимки с нескольких ферм, вырезать лист, аугментировать яркость и цвет.
> Сначала разбейте по классам, подбирайте на валидации, тестируйте один раз; выбирайте метрику, которая видит ваш самый слабый класс; ждите падения, когда меняется камера или сцена.
## Проверь себя
?? У вас 3 000 снимков фруктов: 1 200 яблок, 900 бананов, 600 апельсинов и 300 груш. Предложите стратифицированное разбиение 70/15/15 и посчитайте количества.
?= Разбиваем каждый класс 70/15/15: яблоки 840/180/180, бананы 630/135/135, апельсины 420/90/90, груши 210/45/45 → 2 100 train, 450 validation, 450 test, в каждой части исходные доли классов.
?? Ваша модель сортировки отходов даёт 97% на своём тестовом наборе, но 60% на снимках с телефона одногруппника. Назовите одну вероятную причину и одно решение.
?= Сдвиг домена: у другого телефона другая матрица, обработка цвета, разрешение и освещение, поэтому меняются признаки, на которые опиралась модель; нужно собрать обучающие снимки с нескольких телефонов, аугментировать яркость, цвет и размытие, нормализовать входы и проверить на отложенном телефоне.`,
      },
      [
        qx("Variant 1, Q5a: what is a sound way to organize the 2 000 waste images?", "One folder per class inside train/ and test/", [
          ["One folder per phone that took the photos", "Grouping by phone gives no labels; each folder would mix all classes.", "Группировка по телефонам не даёт меток; в каждой папке были бы все классы вперемешку."],
          ["One folder per day, sorted by file size", "Date and size say nothing about the class; the label must be recoverable.", "Дата и размер ничего не говорят о классе; метку должно быть возможно восстановить."],
          ["A train folder only; test images reused from it", "Test images must be separate, otherwise the score measures memorization.", "Тестовые снимки должны быть отдельными, иначе оценка измеряет запоминание."],
        ], "data/train/plastic, data/train/paper, … and the same for test (and val): the folder name is the label, and the splits never overlap.", "data/train/plastic, data/train/paper, … и то же для test (и val): имя папки — это метка, а части разбиения не пересекаются."),
        qx("2 000 images, 80/20 train/test split. How many images go to each part?", "1 600 train / 400 test", [
          ["1 800 train / 200 test", "That is a 90/10 split, not 80/20.", "Это разбиение 90/10, а не 80/20."],
          ["1 400 train / 600 test", "That is a 70/30 split.", "Это разбиение 70/30."],
          ["1 600 train / 200 test", "1 600 + 200 = 1 800 ≠ 2 000; 20% of 2 000 is 400.", "1 600 + 200 = 1 800 ≠ 2 000; 20% от 2 000 — это 400."],
        ], "2 000 × 0.8 = 1 600 and 2 000 × 0.2 = 400.", "2 000 × 0.8 = 1 600 и 2 000 × 0.2 = 400."),
        qx("2 000 images, 70/15/15 train/validation/test. What are the counts?", "1 400 / 300 / 300", [
          ["1 500 / 250 / 250", "That is 75 / 12.5 / 12.5, not 70/15/15.", "Это 75 / 12,5 / 12,5, а не 70/15/15."],
          ["1 400 / 150 / 150", "15% of 2 000 is 300, and the parts must add up to 2 000.", "15% от 2 000 — это 300, и части должны давать в сумме 2 000."],
          ["1 300 / 350 / 350", "That is 65 / 17.5 / 17.5.", "Это 65 / 17,5 / 17,5."],
        ], "2 000 × 0.7 = 1 400, 2 000 × 0.15 = 300 and 300 again; 1 400 + 300 + 300 = 2 000.", "2 000 × 0.7 = 1 400, 2 000 × 0.15 = 300 и ещё 300; 1 400 + 300 + 300 = 2 000."),
        qx("The Glass class has 400 of the 2 000 images. With a stratified 80/20 split, how many Glass images go to test?", "80", [
          ["400", "That is every Glass image; only 20% of them go to test.", "Это все снимки Glass; в тест идут только 20% из них."],
          ["100", "100 is an equal quarter of the 400 test images; stratification keeps class shares instead.", "100 — это равная четверть от 400 тестовых снимков; стратификация же сохраняет доли классов."],
          ["20", "20% of 400 is 80, not 20.", "20% от 400 — это 80, а не 20."],
        ], "Stratified: each class is split 80/20 on its own, so 400 × 0.2 = 80 Glass images go to test and 320 to train.", "Стратификация: каждый класс делится 80/20 отдельно, поэтому 400 × 0.2 = 80 снимков Glass идут в тест и 320 — в обучение."),
        qx("Why split stratified (per class) rather than purely at random?", "Each split keeps the class proportions", [
          ["It makes the training set larger", "The sizes stay 80/20; only the class shares are controlled.", "Размеры остаются 80/20; контролируются только доли классов."],
          ["It removes the need for a test set", "You still need a test set; stratification only shapes it.", "Тестовый набор всё равно нужен; стратификация лишь задаёт его состав."],
          ["It turns an imbalanced dataset into a balanced one", "It copies the imbalance into every split; balancing needs re-sampling or class weights.", "Она переносит дисбаланс в каждую часть; для балансировки нужны пересэмплирование или веса классов."],
        ], "Stratification keeps the same class shares in train, validation and test, so even a small class is properly represented in the test set.", "Стратификация сохраняет одинаковые доли классов в train, validation и test, поэтому даже маленький класс нормально представлен в тесте."),
        qx("What is the validation set used for?", "Choosing hyperparameters and preprocessing", [
          ["Reporting the final score of the model", "The final score comes from the test set, used once at the end.", "Итоговая оценка берётся с тестового набора, который используют один раз в конце."],
          ["Training the weights W and b", "The weights are fitted on the training set.", "Веса подгоняются на обучающем наборе."],
          ["Producing augmented copies of training images", "Augmentation creates training variants; it is not a data split.", "Аугментация создаёт варианты для обучения; это не часть разбиения."],
        ], "Validation data compares settings such as k, learning rate, λ or preprocessing steps, keeping the test set untouched for the final estimate.", "Валидационные данные сравнивают настройки — k, learning rate, λ или шаги предобработки, — а тестовый набор остаётся нетронутым для итоговой оценки."),
        qx("A student tunes the learning rate until the test accuracy is highest. What is wrong?", "The test score is no longer an honest estimate", [
          ["Nothing: test data is the most realistic choice", "Test data is realistic precisely because it is not used for decisions.", "Тестовые данные реалистичны именно потому, что по ним ничего не решают."],
          ["The learning rate cannot be tuned at all", "It is the most commonly tuned hyperparameter — on validation data.", "Это самый часто подбираемый гиперпараметр — на валидационных данных."],
          ["The training set becomes too small", "Tuning does not change the split sizes; the problem is leaked test information.", "Подбор не меняет размеры частей; проблема — утечка информации из теста."],
        ], "Choosing settings by test results fits the model to the test set; tune on validation and touch the test set once at the end.", "Выбор настроек по результатам теста подгоняет модель под тест; подбирайте на валидации, а тест трогайте один раз в конце."),
        qx("950 healthy and 50 diseased leaves. A model always says healthy. What are its accuracy and its recall for diseased?", "95% accuracy, recall 0", [
          ["50% accuracy, recall 0.5", "It is right on all 950 healthy leaves: 950 / 1 000 = 95%.", "Модель права на всех 950 здоровых листьях: 950 / 1 000 = 95%."],
          ["95% accuracy, recall 0.95", "It finds none of the 50 diseased leaves, so recall = 0 / 50 = 0.", "Она не находит ни одного из 50 больных листьев, поэтому recall = 0 / 50 = 0."],
          ["5% accuracy, recall 1", "Recall 1 would require catching every diseased leaf; it catches none.", "Recall 1 требовал бы найти все больные листья; она не находит ни одного."],
        ], "Accuracy = 950 / 1 000 = 95%, yet recall(diseased) = TP / (TP + FN) = 0 / 50 = 0 — accuracy hides the useless model.", "Accuracy = 950 / 1 000 = 95%, но recall(больные) = TP / (TP + FN) = 0 / 50 = 0 — accuracy прячет бесполезную модель."),
        qx("A detector finds 40 of 50 diseased leaves and raises 20 false alarms. What is its precision?", "0.67", [
          ["0.80", "0.80 = 40 / 50 is the recall: found out of all diseased.", "0.80 = 40 / 50 — это recall: найдено из всех больных."],
          ["0.33", "0.33 = 20 / 60 is the share of false alarms among the alarms.", "0.33 = 20 / 60 — это доля ложных тревог среди всех тревог."],
          ["0.97", "0.97 is the accuracy (40 + 930) / 1 000.", "0.97 — это accuracy (40 + 930) / 1 000."],
        ], "Precision is the share of correct alarms: TP / (TP + FP) = 40 / (40 + 20) = 0.67.", "Precision — доля верных тревог: TP / (TP + FP) = 40 / (40 + 20) = 0.67."),
        qx("The same detector: TP = 40, FN = 10, FP = 20. What is its recall?", "0.80", [
          ["0.67", "0.67 = 40 / 60 is the precision.", "0.67 = 40 / 60 — это precision."],
          ["0.20", "0.20 = 10 / 50 is the miss rate, FN / (TP + FN).", "0.20 = 10 / 50 — доля пропусков, FN / (TP + FN)."],
          ["0.73", "0.73 is the F1 score of this detector.", "0.73 — это F1 этого детектора."],
        ], "Recall is the share of diseased leaves found: TP / (TP + FN) = 40 / 50 = 0.80.", "Recall — доля найденных больных листьев: TP / (TP + FN) = 40 / 50 = 0.80."),
        qx("Precision is 0.67 and recall is 0.80. What is F1?", "0.73", [
          ["0.54", "0.54 ≈ 0.67 × 0.80 is the product; F1 = 2PR / (P + R).", "0.54 ≈ 0.67 × 0.80 — это произведение; F1 = 2PR / (P + R)."],
          ["1.47", "1.47 is the sum P + R, the denominator of F1.", "1.47 — сумма P + R, знаменатель F1."],
          ["0.13", "0.13 is the difference R − P, which has no role in F1.", "0.13 — разность R − P, в F1 она не участвует."],
        ], "F1 = 2 · 0.67 · 0.80 / (0.67 + 0.80) = 1.07 / 1.47 ≈ 0.73 — the harmonic mean of precision and recall.", "F1 = 2 · 0.67 · 0.80 / (0.67 + 0.80) = 1.07 / 1.47 ≈ 0.73 — гармоническое среднее precision и recall."),
        qx("Missing a diseased leaf is far worse than a false alarm. Which number matters most?", "Recall of the diseased class", [
          ["Overall accuracy", "Accuracy is dominated by the many healthy leaves and hides missed disease.", "Accuracy определяется множеством здоровых листьев и прячет пропущенную болезнь."],
          ["Precision of the diseased class", "Precision penalizes false alarms, which are the cheaper error here.", "Precision наказывает за ложные тревоги, а они здесь — более дешёвая ошибка."],
          ["The final training loss", "Training loss says nothing about missed cases on new data.", "Потеря на обучении ничего не говорит о пропусках на новых данных."],
        ], "Recall = TP / (TP + FN) shows how many sick leaves are caught; FN are exactly the costly misses.", "Recall = TP / (TP + FN) показывает, сколько больных листьев поймано; FN — это и есть дорогие пропуски."),
        qx("Of 100 true Glass images, 82 are predicted Glass and 15 Plastic. What is the recall of Glass?", "0.82", [
          ["0.15", "0.15 is the share of Glass mistaken for Plastic.", "0.15 — доля Glass, принятого за Plastic."],
          ["0.83", "0.83 = 82 / 99 is the Glass precision (its column), not recall (its row).", "0.83 = 82 / 99 — это precision Glass (столбец), а не recall (строка)."],
          ["0.97", "82 + 15 = 97 adds an error to the correct count.", "82 + 15 = 97 прибавляет ошибку к верным ответам."],
        ], "Recall uses the row of the true class: 82 / 100 = 0.82.", "Recall считается по строке истинного класса: 82 / 100 = 0.82."),
        qx("What does macro-F1 do with four classes?", "Averages the four per-class F1 scores equally", [
          ["Uses only the F1 of the largest class", "Macro-F1 includes every class, not just the largest.", "Macro-F1 учитывает все классы, а не только самый большой."],
          ["Weights each class F1 by how many images it has", "That is weighted F1; macro gives every class the same weight.", "Это weighted F1; macro даёт каждому классу одинаковый вес."],
          ["Computes F1 from overall accuracy", "F1 is built from precision and recall, not from accuracy.", "F1 строится из precision и recall, а не из accuracy."],
        ], "Macro-F1 = mean of the per-class F1 scores, so a weak small class pulls it down — which is why it suits imbalanced data.", "Macro-F1 = среднее F1 по классам, поэтому слабый маленький класс тянет его вниз — потому он и подходит для несбалансированных данных."),
        qx("Variant 1, Q5e: the model fails on photos from another student's phone. What is the most likely reason?", "Domain shift: other camera, colours, light, background", [
          ["The test set was too large", "The size of the test set does not make a model fail on a new camera.", "Размер тестового набора не заставляет модель ошибаться на новой камере."],
          ["The model underfits the training data", "It performs very well on its own data, so it does not underfit.", "На своих данных она работает очень хорошо, значит, не недообучена."],
          ["The other phone saves images in RGB order", "imread always returns BGR, whatever phone took the photo.", "imread всегда возвращает BGR, каким бы телефоном ни был сделан снимок."],
        ], "A different sensor, colour processing, resolution, lighting and background change the input distribution, and the model relied on cues from the old one.", "Другая матрица, обработка цвета, разрешение, освещение и фон меняют распределение входов, а модель опиралась на признаки прежнего."),
        qx("Which step best reduces the drop on photos from new phones?", "Train on many phones' photos with colour augmentation", [
          ["Train longer on the same photos", "More epochs on the same domain increase overfitting to it.", "Больше эпох на том же домене усиливают переобучение под него."],
          ["Remove the validation set", "Less evaluation data does not change the domain gap.", "Меньше данных для проверки не меняет разрыв доменов."],
          ["Report only the training accuracy", "That hides the problem instead of fixing it.", "Это прячет проблему, а не решает её."],
        ], "Diverse training data from several phones plus brightness, colour and blur augmentation teach the model features that survive a camera change.", "Разнообразные обучающие данные с нескольких телефонов плюс аугментация яркости, цвета и размытия учат модель признакам, которые переживают смену камеры."),
        qx("Burst shots of the same bottle appear in both train and test. What is the effect?", "Test accuracy is inflated by near-duplicates", [
          ["The model underfits the training data", "Duplicates do not weaken the model; they distort the evaluation.", "Дубликаты не ослабляют модель; они искажают оценку."],
          ["Test accuracy becomes too low", "Near-duplicates make the test easier, not harder.", "Почти-дубликаты делают тест легче, а не сложнее."],
          ["Nothing, as long as the split is 80/20", "Proportions do not prevent leakage; one object must stay in one split.", "Пропорции не мешают утечке; один предмет должен оставаться в одной части."],
        ], "This is leakage: the model has effectively seen the test images. Split by object or by session.", "Это утечка: модель фактически уже видела тестовые снимки. Разбивайте по предметам или по сессиям."),
        qx("Train accuracy 60%, test accuracy 58%. What is the likely problem?", "Underfitting: the model is too weak", [
          ["Overfitting: the train–test gap is too large", "A 2-point gap is small; overfitting means train ≫ test.", "Разрыв в 2 пункта мал; переобучение — это train ≫ test."],
          ["Data leakage between the splits", "Leakage inflates test scores, but here both scores are low.", "Утечка завышает тестовую оценку, а здесь обе оценки низкие."],
          ["Domain shift between the phones", "Both splits come from the same data and both are low; the model itself is weak.", "Обе части из одних данных, и обе низкие; слаба сама модель."],
        ], "Both accuracies are low and close: use a bigger model, better features or longer training.", "Обе точности низкие и близкие: нужна модель побольше, признаки получше или более долгое обучение."),
        qx("Digits 0–9 are being classified. Which augmentation is a bad idea?", "Rotating images by 180°", [
          ["Small rotations of ±10°", "Small rotations keep digits readable and add realistic variety.", "Небольшие повороты сохраняют цифры читаемыми и добавляют реалистичное разнообразие."],
          ["Slight brightness changes", "Brightness changes keep the label and mimic different lighting.", "Изменения яркости сохраняют метку и имитируют другое освещение."],
          ["Shifts of a few pixels", "Small shifts keep the digit and its label.", "Небольшие сдвиги сохраняют цифру и её метку."],
        ], "A 6 rotated by 180° looks like a 9: this augmentation changes the label. Augmentations must keep the class.", "Шестёрка, повёрнутая на 180°, выглядит как девятка: такая аугментация меняет метку. Аугментации должны сохранять класс."),
        tfx("A confusion matrix shows which pairs of classes the model mixes up, not only how many errors it makes.", true, "Each off-diagonal cell counts images of one true class predicted as another, e.g. 15 Glass predicted as Plastic.", "Каждая ячейка вне диагонали считает снимки одного истинного класса, предсказанные как другой, например 15 Glass, принятых за Plastic.", "Choosing False reduces the matrix to accuracy; its value is exactly the per-pair breakdown of errors.", "Ответ False сводит матрицу к accuracy; её ценность как раз в разбивке ошибок по парам классов."),
      ],
    ),
    part(
      "cv-drill-p5",
      { en: "Questions from real exam variants", ru: "Вопросы с настоящих вариантов" },
      {
        en: `## Three real papers, one structure
Three real papers are known: the **instructor's sample** (Variant 1), another group's **fabric variant** and **Variant 5** (bird species, from students' photos). They ask the **same five questions in the same order**; only the scenario, the numbers and the planted bugs change (— = not visible on the photo).
| Item | Sample (Variant 1) | Fabric variant | Variant 5 |
|---|---|---|---|
| Q1 scenario | leaves with plant diseases | striped, checked, plain fabric | bird species from trail cameras |
| Q1 trade-off | grayscale: pro and con | resize to 32 × 32 | resize to 32 × 32 |
| Q1 planted bugs | RGB2GRAY; kernel (4, 4) | no sigmaX; no threshold type | img[50, 20]; imwrite of a float image |
| Q1 claim to argue with | more preprocessing always helps | looks fine to a human, so no preprocessing | equalize every dataset |
| Q3c–d | what W and b mean; why not every dataset | — | the same two items |
| Q4 pipeline | resize (224, 224), gray, blur, Canny | — | resize (300, 200), BGR2RGB, resize (150, 100), / 255 |
| Q4 colour item | colour task: edges alone? | — | feather colour: edges? |
| Q5 dataset | waste, 2 000 images, 4 classes | — | clothing, 5 000 images, 4 classes |
## Question types — what the grader wants
| Question type | What the grader wants | Typical mistake |
|---|---|---|
| Q1a three preprocessing steps | each step + the scenario problem it solves | a bare list «resize, blur, normalize» |
| Q1b trade-off (gray, 32 × 32) | one pro and one con tied to the classes | «faster» and «worse», no reason |
| Q1c two bugs in OpenCV code | the line, why it is wrong, the corrected code | one bug only, or no rewritten code |
| Q1d «always / every» claim | disagree + one concrete counterexample | «it depends» with no example |
| Q2 score table | argmax per row, accuracy, the wrong image | reading the true class as the prediction |
| Q3a–b s = Wx + b | every product written out, then argmax | forgetting b or using a column of W |
| Q3c meaning of W and b | W = class templates, b = class offsets | «b is the error of the model» |
| Q3d limits of a linear classifier | straight boundaries + an XOR drawing | «it just needs more data» |
| Q4a shapes | (height, width, channels) after each line | copying dsize (w, h) as the shape |
| Q4b channels | which call changes the channel count | «BGR2RGB: 3 channels → 1» |
| Q4c dividing by 255.0 | why scale + the range 0.0–1.0 | «to make it gray», «range 0–255» |
| Q4d edges for a colour task | no: Canny throws colour away | «edges remove noise, so yes» |
| Q5a–b dataset and split | a folder per class, counts for every split | percentages without counts |
| Q5c–e steps, metric, new phone | each choice tied to this dataset | «accuracy» with no reason |
## Variant 5, Q1a — three operations for trail-camera photos
«A nature reserve classifies bird species from trail-camera photos. Cameras differ in resolution, many photos are taken at dawn or dusk (low light), and night shots are grainy.»
- **Resize to one size**, e.g. cv2.resize(img, (224, 224)) — the cameras **differ in resolution**, and the network needs one input shape.
- **Denoise the grainy night shots:** Gaussian (3, 3) or median 3; non-local means (cv2.fastNlMeansDenoisingColored) keeps more detail. Keep it mild — plumage detail is the signal.
- **Lift dawn and dusk shots:** gamma correction or **CLAHE on the L channel of LAB** (or V of HSV) — brighter, more contrast, **feather colours unchanged**. Denoise first: CLAHE amplifies any grain that is left.
- Bonus: scale to [0, 1]; infrared night shots are effectively gray, so include such shots of every species in training.
= img = cv2.resize(img, (224, 224))
= img = cv2.GaussianBlur(img, (3, 3), 0)
= l, a, b = cv2.split(cv2.cvtColor(img, cv2.COLOR_BGR2LAB))
= l = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(l)
= img = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)
## Variant 5, Q1b — 32 × 32 for bird species
= 32 * 32 * 3 = 3072 values,   224 * 224 * 3 = 150528 values (49 times more)
= a bird 60 px wide in a 1920 px wide frame:  60 * 32 / 1920 = 1 px at 32 x 32
- **Advantage:** a small uniform input — fast training, little memory, a small model, one shape for every camera.
- **Disadvantage:** species differ in **fine details** — plumage pattern, beak shape, eye ring; a distant bird shrinks to a pixel or two, and non-square frames are **distorted**. Fine-grained classes need more pixels, or a crop around the bird first.
## Variant 5, Q1c — two bugs and the corrected code
@diagram cv-image-array
= img = cv2.imread("bird.jpg")
= # read the pixel at x = 50 (column), y = 20 (row)
= pixel = img[50, 20]
= norm = img / 255.0
= cv2.imwrite("bird_norm.jpg", norm)   # save a copy for checking
- **Problem 1 (line 3):** NumPy indexes **img[row, column] = img[y, x]**. img[50, 20] reads x = 20, y = 50 — another pixel, **silently** (or IndexError if the image has fewer than 51 rows). Fix: img[20, 50], which returns [B, G, R].
- **Problem 2 (line 5):** norm is **float64 in [0, 1]**, but a JPEG stores **8-bit** values. imwrite converts without an error, every pixel becomes 0 or 1 out of 255, and the saved copy is **almost black**. Scale back and cast to uint8 (or save img itself).
= img = cv2.imread("bird.jpg")
= pixel = img[20, 50]                # [B, G, R] at x = 50, y = 20
= norm = img / 255.0                 # float64, 0.0..1.0, input for the model
= cv2.imwrite("bird_norm.jpg", (norm * 255).astype("uint8"))
- For full marks, also guard the read with if img is None — imread returns None for a missing file.
## Variant 5, Q1d — «Histogram equalization should be applied to every image dataset»
**Disagree.** Equalization helps when **low contrast** hides the class; it is not a universal step.
- **This very scenario:** night shots are dark and **grainy**; global equalization stretches the dark range and **amplifies the grain**. Denoise first and use **CLAHE**, whose clip limit restrains it.
- **Brightness is the information:** in X-rays brightness is tissue density; in a «day vs night» or ripeness task equalization erases the cue.
- **Colour:** equalizing B, G and R separately **shifts the colours** — fatal when feather colour separates species; equalize only L of LAB or V of HSV.
- On well-exposed photos it adds little — keep a step only if validation accuracy improves. And equalizeHist needs an **8-bit single-channel** image.
## Variant 5, Q3c — what W and b represent
= s = W x + b      W: C x D,   x: D values,   b: C values,   s: C scores
- **W** holds the learned weights. Row k is the **template of class k**: each weight says how strongly one input value (a pixel) pushes the score of class k up or down. Geometrically, the row sets the **direction of the class boundary**.
- **b** is one learned **offset per class**, added whatever the image is — a built-in preference for that class; it **shifts the boundary** away from the origin.
- The answer on the students' photo — «W … how strongly each input feature affects the score; b … adds a class-specific offset» — has the right idea; add the template view to make it complete.
## Variant 5, Q3d — why one linear classifier cannot separate every dataset
= XOR:  (0, 0) -> A   (1, 1) -> A   (0, 1) -> B   (1, 0) -> B
- Each score is a **linear** function of x, so the boundary between two classes is a **straight line** (a hyperplane in more dimensions). In XOR, any line that puts both A points on one side leaves a B point with them.
- Other failures: one class **inside a ring** of another; a class with **several looks** — one template per class cannot cover a horse facing left and one facing right.
- The drawing on the students' photo — A B over B A, labelled XOR — is the expected picture. Fix: non-linear features or a neural network with a non-linearity such as ReLU.
## Variant 5, Q4 — the pipeline line by line
= img = cv2.imread("bird.jpg")                  # (H, W, 3), uint8, BGR
= img = cv2.resize(img, (300, 200))             # (200, 300, 3)
= rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)    # (200, 300, 3), B and R swapped
= small = cv2.resize(rgb, (150, 100))           # (100, 150, 3)
= norm = small / 255.0                          # (100, 150, 3), float64, 0.0..1.0
- **Q4a:** dsize is **(width, height)** and the shape starts with the height: img is **(200, 300, 3)**, small is **(100, 150, 3)**.
- **Q4b:** the channel count **stays 3** and the shape does not change; only the **order of B and R** is swapped, and no value is changed. Channel 0 is now R, so plt.imshow shows true colours (cv2.imshow would now show them swapped).
= img pixel [B, G, R] = [30, 120, 200]   ->   rgb pixel [R, G, B] = [200, 120, 30]
- **The real mistake:** a student wrote «3 channels → 1 channel». That is what **BGR2GRAY** does; BGR2RGB only **reorders** the channels — RGB has three letters and three channels. Read the code after the 2: GRAY means one channel, while RGB, HSV and LAB keep three.
- **Q4c:** dividing by 255.0 puts every input on the **same small scale**, which keeps gradient-based training **stable and faster**; the values become **float64 in [0.0, 1.0]**: 0 → 0.0, 128 → 0.502, 255 → 1.0.
- **Q4d:** **No.** Canny returns a **single-channel 0/255 map**: the colour is gone, and two species of the same shape give the same edges. Keep the colour image (or HSV hue); edges could at most be an extra input.
## Variant 5, Q5a–b — clothing shop, 5 000 images
@diagram cv-data-split
- **Q5a:** a folder per class inside each split, so the folder name is the label; remove duplicates and keep all photos of **one product in one split**, otherwise near-duplicates leak into the test set.
= data/train/shirt/   data/train/trousers/   data/train/dress/   data/train/shoes/
= data/val/shirt/   ...   data/test/shoes/
- **Q5b:** a stratified split, with the counts written out:
= 80/20:     5000 * 0.8 = 4000 train,  5000 * 0.2 = 1000 test
= 70/15/15:  5000 * 0.7 = 3500 train,  750 validation,  750 test
= if balanced (1250 per class), 80/20 gives 1000 train + 250 test per class
- Q5c–e were not visible on the photo; they repeat the sample: two preprocessing steps, a metric with a reason, and domain shift on another phone's photos.
## How variants change
- **Same skeleton:** in all three papers Q1 has a scenario, a trade-off, a bug hunt in a few lines of code and an «always / every» claim; Q4 is a pipeline to trace; Q5 is a system to design.
- **New scenario:** leaves → fabric → birds; waste → clothing. First find what **defines the class** (colour, pattern, fine detail) — every trade-off answer hangs on it.
- **New bugs from the same rule list:** BGR vs RGB, an odd kernel and sigmaX, the threshold type, (w, h) vs (h, w), **img[y, x]**, **uint8 when saving**, None from imread, one channel for equalizeHist and Otsu.
- **New numbers:** other resize sizes, another dataset size — compute the shapes line by line and the split counts part by part.
> Variants change the scenario and the bugs, never the rules: shape is (h, w, c) while dsize is (w, h), a pixel is img[y, x], only 2GRAY changes the channel count, save uint8, and answer every «always» claim with one counterexample.
## Check yourself
?? After img = cv2.resize(img, (300, 200)), a student writes hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV) and says that hsv has one channel. Give the shape of hsv and correct the claim.
?= hsv has shape (200, 300, 3): BGR2HSV keeps three channels (hue, saturation, value) and only re-expresses the colour; only a 2GRAY conversion leaves one channel, (200, 300).
?? Code: img = cv2.imread("owl.jpg"), value = img[120, 40] meant for x = 120, y = 40, then cv2.imwrite("owl_check.jpg", img / 255.0). Identify two problems and correct them.
?= Indexing is img[y, x], so the pixel is img[40, 120]; img / 255.0 is a float image in [0, 1] that imwrite saves almost black — save img itself, or scale back to 0–255 and cast to uint8 first.`,
        ru: `## Три настоящих билета, одна структура
Известны три настоящих билета: **образец преподавателя** (вариант 1), **вариант с тканями** другой группы и **вариант 5** (виды птиц, по фото студентов). В них **те же пять вопросов в том же порядке**; меняются только сценарий, числа и подложенные ошибки (— = на фото не видно).
| Пункт | Образец (вариант 1) | Вариант с тканями | Вариант 5 |
|---|---|---|---|
| Q1 сценарий | листья с болезнями растений | ткань в полоску, в клетку, однотонная | виды птиц с фотоловушек |
| Q1 компромисс | оттенки серого: плюс и минус | resize до 32 × 32 | resize до 32 × 32 |
| Q1 подложенные ошибки | RGB2GRAY; ядро (4, 4) | нет sigmaX; нет type у threshold | img[50, 20]; imwrite для float-картинки |
| Q1 утверждение для спора | больше предобработки всегда лучше | человеку снимки нравятся, значит, предобработка не нужна | выравнивать каждый датасет |
| Q3c–d | что значат W и b; почему не любой датасет | — | те же два пункта |
| Q4 конвейер | resize (224, 224), серое, размытие, Canny | — | resize (300, 200), BGR2RGB, resize (150, 100), / 255 |
| Q4 пункт про цвет | задача по цвету: только границы? | — | цвет перьев: границы? |
| Q5 датасет | мусор, 2 000 снимков, 4 класса | — | одежда, 5 000 снимков, 4 класса |
## Типы вопросов — чего ждёт проверяющий
| Тип вопроса | Чего ждёт проверяющий | Типичная ошибка |
|---|---|---|
| Q1a три шага предобработки | шаг + проблема сценария, которую он решает | голый список «resize, blur, normalize» |
| Q1b компромисс (серое, 32 × 32) | один плюс и один минус, привязанные к классам | «быстрее» и «хуже» без причины |
| Q1c две ошибки в коде OpenCV | строка, почему она неверна, исправленный код | только одна ошибка или код не переписан |
| Q1d утверждение «всегда / каждый» | не согласен + один конкретный контрпример | «смотря как» без примера |
| Q2 таблица оценок | argmax по строке, accuracy, ошибочный снимок | истинный класс принят за предсказание |
| Q3a–b s = Wx + b | каждое произведение расписано, затем argmax | забыто b или взят столбец W |
| Q3c смысл W и b | W — шаблоны классов, b — сдвиги классов | «b — это ошибка модели» |
| Q3d пределы линейного классификатора | прямые границы + рисунок XOR | «просто нужно больше данных» |
| Q4a формы | (высота, ширина, каналы) после каждой строки | dsize (w, h) переписан как shape |
| Q4b каналы | какой вызов меняет число каналов | «BGR2RGB: 3 канала → 1» |
| Q4c деление на 255.0 | зачем масштаб + диапазон 0.0–1.0 | «чтобы стало серым», «диапазон 0–255» |
| Q4d границы для задачи по цвету | нет: Canny выбрасывает цвет | «границы убирают шум, значит, да» |
| Q5a–b датасет и разбиение | папка на класс, числа для каждой части | проценты без чисел |
| Q5c–e шаги, метрика, новый телефон | каждый выбор привязан к этому датасету | «accuracy» без причины |
## Вариант 5, Q1a — три операции для снимков фотоловушек
«Заповедник классифицирует виды птиц по снимкам фотоловушек. Камеры различаются разрешением, многие снимки сделаны на рассвете или в сумерках (мало света), а ночные кадры зернистые.»
- **Resize к одному размеру**, например cv2.resize(img, (224, 224)), — у камер **разное разрешение**, а сети нужна одна форма входа.
- **Убрать шум с зернистых ночных кадров:** Гаусс (3, 3) или медиана 3; non-local means (cv2.fastNlMeansDenoisingColored) сохраняет больше деталей. Делайте это мягко — детали оперения и есть сигнал.
- **Осветлить кадры рассвета и сумерек:** гамма-коррекция или **CLAHE по каналу L в LAB** (или V в HSV) — светлее, контрастнее, а **цвета перьев не меняются**. Шум убирайте раньше: CLAHE усиливает оставшееся зерно.
- Бонус: масштаб в [0, 1]; инфракрасные ночные кадры фактически серые, поэтому включите такие кадры каждого вида в обучение.
= img = cv2.resize(img, (224, 224))
= img = cv2.GaussianBlur(img, (3, 3), 0)
= l, a, b = cv2.split(cv2.cvtColor(img, cv2.COLOR_BGR2LAB))
= l = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(l)
= img = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)
## Вариант 5, Q1b — 32 × 32 для видов птиц
= 32 * 32 * 3 = 3072 values,   224 * 224 * 3 = 150528 values (49 times more)
= a bird 60 px wide in a 1920 px wide frame:  60 * 32 / 1920 = 1 px at 32 x 32
- **Плюс:** маленький одинаковый вход — быстрое обучение, мало памяти, маленькая модель, одна форма для любой камеры.
- **Минус:** виды различаются **мелкими деталями** — узором оперения, формой клюва, кольцом вокруг глаза; далёкая птица сжимается до пикселя-двух, а неквадратные кадры **искажаются**. Тонким классам нужно больше пикселей — или сначала вырезать область с птицей.
## Вариант 5, Q1c — две ошибки и исправленный код
@diagram cv-image-array
= img = cv2.imread("bird.jpg")
= # read the pixel at x = 50 (column), y = 20 (row)
= pixel = img[50, 20]
= norm = img / 255.0
= cv2.imwrite("bird_norm.jpg", norm)   # save a copy for checking
- **Проблема 1 (строка 3):** NumPy индексирует **img[строка, столбец] = img[y, x]**. img[50, 20] читает x = 20, y = 50 — другой пиксель, **молча** (или IndexError, если в картинке меньше 51 строки). Исправление: img[20, 50] — он возвращает [B, G, R].
- **Проблема 2 (строка 5):** norm — это **float64 в [0, 1]**, а JPEG хранит **8-битные** значения. imwrite переводит без ошибки, каждый пиксель становится 0 или 1 из 255, и сохранённая копия **почти чёрная**. Верните масштаб и приведите к uint8 (или сохраните сам img).
= img = cv2.imread("bird.jpg")
= pixel = img[20, 50]                # [B, G, R] at x = 50, y = 20
= norm = img / 255.0                 # float64, 0.0..1.0, input for the model
= cv2.imwrite("bird_norm.jpg", (norm * 255).astype("uint8"))
- Для полного балла проверьте и чтение: if img is None — imread возвращает None, если файла нет.
## Вариант 5, Q1d — «Выравнивание гистограммы нужно применять к любому датасету»
**Не согласен.** Выравнивание помогает, когда класс скрыт **низким контрастом**; универсальным шагом оно не является.
- **Этот же сценарий:** ночные кадры тёмные и **зернистые**; глобальное выравнивание растягивает тёмный диапазон и **усиливает зерно**. Сначала уберите шум и берите **CLAHE** — его clipLimit это сдерживает.
- **Яркость и есть информация:** на рентгене яркость — это плотность ткани; в задаче «день или ночь» или о спелости выравнивание стирает признак.
- **Цвет:** выравнивание B, G и R по отдельности **сдвигает цвета** — губительно, когда виды различаются цветом перьев; выравнивайте только L в LAB или V в HSV.
- На хорошо экспонированных снимках пользы мало — оставляйте шаг, только если растёт точность на валидации. И equalizeHist нужно **8-битное одноканальное** изображение.
## Вариант 5, Q3c — что означают W и b
= s = W x + b      W: C x D,   x: D values,   b: C values,   s: C scores
- **W** хранит выученные веса. Строка k — **шаблон класса k**: каждый вес говорит, насколько сильно одно входное значение (пиксель) поднимает или опускает оценку класса k. Геометрически строка задаёт **направление границы класса**.
- **b** — один выученный **сдвиг на класс**, который добавляется независимо от снимка, — встроенное предпочтение этого класса; он **сдвигает границу** от начала координат.
- Ответ на фото студентов — «W … насколько сильно каждый входной признак влияет на оценку; b … добавляет сдвиг для каждого класса» — по сути верный; добавьте взгляд «строка = шаблон», чтобы он был полным.
## Вариант 5, Q3d — почему один линейный классификатор не разделит любой датасет
= XOR:  (0, 0) -> A   (1, 1) -> A   (0, 1) -> B   (1, 0) -> B
- Каждая оценка — **линейная** функция от x, поэтому граница между двумя классами — **прямая** (гиперплоскость в большем числе измерений). В XOR любая прямая, оставляющая обе точки A по одну сторону, захватывает с ними и точку B.
- Другие провалы: один класс **внутри кольца** другого; класс с **несколькими обликами** — один шаблон на класс не покроет лошадь, смотрящую влево и вправо.
- Рисунок на фото студентов — A B над B A с подписью XOR — именно то, что ждут. Решение: нелинейные признаки или нейросеть с нелинейностью, например ReLU.
## Вариант 5, Q4 — конвейер строка за строкой
= img = cv2.imread("bird.jpg")                  # (H, W, 3), uint8, BGR
= img = cv2.resize(img, (300, 200))             # (200, 300, 3)
= rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)    # (200, 300, 3), B and R swapped
= small = cv2.resize(rgb, (150, 100))           # (100, 150, 3)
= norm = small / 255.0                          # (100, 150, 3), float64, 0.0..1.0
- **Q4a:** dsize — это **(ширина, высота)**, а shape начинается с высоты: img — **(200, 300, 3)**, small — **(100, 150, 3)**.
- **Q4b:** число каналов **остаётся 3**, shape не меняется; меняется только **порядок B и R**, ни одно значение не меняется. Канал 0 теперь R, поэтому plt.imshow показывает настоящие цвета (а cv2.imshow теперь показал бы их перепутанными).
= img pixel [B, G, R] = [30, 120, 200]   ->   rgb pixel [R, G, B] = [200, 120, 30]
- **Настоящая ошибка:** студент написал «3 канала → 1 канал». Так работает **BGR2GRAY**; BGR2RGB лишь **переставляет** каналы — в RGB три буквы и три канала. Читайте код после 2: GRAY — один канал, а RGB, HSV и LAB оставляют три.
- **Q4c:** деление на 255.0 приводит все входы к **одной малой шкале**, и обучение градиентом идёт **стабильнее и быстрее**; значения становятся **float64 в [0.0, 1.0]**: 0 → 0.0, 128 → 0.502, 255 → 1.0.
- **Q4d:** **Нет.** Canny возвращает **одноканальную карту 0/255**: цвета нет, и два вида одной формы дают одинаковые границы. Оставьте цветное изображение (или тон в HSV); границы — разве что дополнительным входом.
## Вариант 5, Q5a–b — магазин одежды, 5 000 снимков
@diagram cv-data-split
- **Q5a:** папка на класс внутри каждой части, чтобы имя папки было меткой; дубликаты удалить, а все снимки **одного товара держать в одной части**, иначе почти-дубликаты утекут в тест.
= data/train/shirt/   data/train/trousers/   data/train/dress/   data/train/shoes/
= data/val/shirt/   ...   data/test/shoes/
- **Q5b:** стратифицированное разбиение с расписанными числами:
= 80/20:     5000 * 0.8 = 4000 train,  5000 * 0.2 = 1000 test
= 70/15/15:  5000 * 0.7 = 3500 train,  750 validation,  750 test
= if balanced (1250 per class), 80/20 gives 1000 train + 250 test per class
- Q5c–e на фото не видны; они повторяют образец: два шага предобработки, метрика с обоснованием и сдвиг домена на снимках с другого телефона.
## Как меняются варианты
- **Тот же скелет:** во всех трёх билетах в Q1 есть сценарий, компромисс, поиск ошибок в нескольких строках кода и утверждение «всегда / каждый»; Q4 — конвейер, который надо проследить; Q5 — система, которую надо спроектировать.
- **Новый сценарий:** листья → ткани → птицы; мусор → одежда. Сначала найдите, что **задаёт класс** (цвет, узор, мелкие детали), — на этом держится любой ответ о компромиссе.
- **Новые ошибки из того же списка правил:** BGR и RGB, нечётное ядро и sigmaX, type у threshold, (w, h) и (h, w), **img[y, x]**, **uint8 при сохранении**, None от imread, один канал для equalizeHist и Otsu.
- **Новые числа:** другие размеры в resize, другой размер датасета — считайте формы строка за строкой, а числа разбиения — по частям.
> Варианты меняют сценарий и ошибки, но не правила: shape — это (h, w, c), а dsize — (w, h), пиксель — img[y, x], число каналов меняет только 2GRAY, сохранять — в uint8, а на любое «всегда» отвечать одним контрпримером.
## Проверь себя
?? После img = cv2.resize(img, (300, 200)) студент пишет hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV) и говорит, что у hsv один канал. Укажите shape у hsv и исправьте утверждение.
?= У hsv shape (200, 300, 3): BGR2HSV сохраняет три канала (тон, насыщенность, яркость) и лишь иначе записывает цвет; один канал, (200, 300), оставляет только преобразование 2GRAY.
?? Код: img = cv2.imread("owl.jpg"), value = img[120, 40] — задуман пиксель x = 120, y = 40, затем cv2.imwrite("owl_check.jpg", img / 255.0). Найдите две ошибки и исправьте их.
?= Индексация — img[y, x], поэтому нужен img[40, 120]; img / 255.0 — float-картинка в [0, 1], которую imwrite сохранит почти чёрной, — сохраните сам img или сначала верните масштаб 0–255 и приведите к uint8.`,
      },
      [
        qx("Code comment: read the pixel at x = 50 (column), y = 20 (row). Which expression reads that pixel?", "img[20, 50]", [
          ["img[50, 20]", "This is the Variant 5 bug: the first index is the row, so it reads x = 20, y = 50.", "Это ошибка из варианта 5: первый индекс — строка, поэтому читается x = 20, y = 50."],
          ["img[50][20]", "Chained indexing is the same as img[50, 20] — still row 50, column 20.", "Цепочка индексов — то же, что img[50, 20]: всё та же строка 50, столбец 20."],
          ["img(50, 20)", "A NumPy array is indexed with square brackets; calling it raises TypeError.", "Массив NumPy индексируют квадратными скобками; вызов как функции даёт TypeError."],
        ], "NumPy indexes img[row, column] = img[y, x], so x = 50, y = 20 is img[20, 50]; for a colour image it returns [B, G, R].", "NumPy индексирует img[строка, столбец] = img[y, x], поэтому x = 50, y = 20 — это img[20, 50]; для цветного изображения возвращается [B, G, R]."),
        qx("norm = img / 255.0, then cv2.imwrite('bird_norm.jpg', norm). What ends up in the file?", "An almost black image, with no error", [
          ["A correct copy of the bird photo", "JPEG stores 8-bit values; 0.0–1.0 become 0 or 1 out of 255, which is nearly black.", "JPEG хранит 8-битные значения; 0.0–1.0 превращаются в 0 или 1 из 255 — почти чёрный цвет."],
          ["Nothing: imwrite raises a dtype error", "imwrite converts the float values to 8 bits silently; no exception is raised.", "imwrite молча переводит float-значения в 8 бит; исключения нет."],
          ["A white image, since 1.0 means the maximum", "1.0 is the maximum only for float images in matplotlib; in an 8-bit file it is 1 of 255.", "1.0 — максимум только для float-картинок в matplotlib; в 8-битном файле это 1 из 255."],
        ], "img / 255.0 is float64 in [0, 1]; imwrite converts it to 8 bits for JPEG, so every pixel becomes 0 or 1 — the saved copy is almost black, and no error warns you.", "img / 255.0 — это float64 в [0, 1]; imwrite переводит его в 8 бит для JPEG, каждый пиксель становится 0 или 1 — сохранённая копия почти чёрная, и никакая ошибка об этом не предупреждает."),
        qx("With path = 'bird_norm.jpg' and norm = img / 255.0, which line saves a correct 8-bit copy?", "cv2.imwrite(path, (norm * 255).astype('uint8'))", [
          ["cv2.imwrite(path, norm.astype('uint8'))", "Casting 0.0–1.0 straight to uint8 gives 0 or 1, so the copy is still black.", "Прямое приведение 0.0–1.0 к uint8 даёт 0 или 1, и копия всё равно чёрная."],
          ["cv2.imwrite(path, np.clip(norm, 0, 255).astype('uint8'))", "Clipping to 0–255 leaves the 0–1 values as they are, so the cast still gives 0 or 1.", "Обрезка до 0–255 оставляет значения 0–1 как есть, поэтому приведение всё равно даёт 0 или 1."],
          ["cv2.imwrite(path, norm / 255.0)", "Dividing again gives values below 0.004 — an even darker file.", "Повторное деление даёт значения меньше 0.004 — файл ещё темнее."],
        ], "Scale back to 0–255 and cast to uint8 before saving — or simply save img, which is already uint8.", "Перед сохранением верните масштаб 0–255 и приведите к uint8 — или просто сохраните img, он и так uint8."),
        qx("Variant 5, Q4b: what happens to the number of channels after cv2.COLOR_BGR2RGB?", "It stays 3; only the B and R order is swapped", [
          ["3 channels become 1 channel", "This is a real student answer, and it describes BGR2GRAY; RGB still has three channels.", "Это настоящий ответ студента, и он описывает BGR2GRAY; в RGB по-прежнему три канала."],
          ["3 channels become 4, an alpha channel is added", "Alpha is added by BGR2BGRA or BGR2RGBA, not by BGR2RGB.", "Альфа-канал добавляют BGR2BGRA или BGR2RGBA, а не BGR2RGB."],
          ["It stays 3, and every value is rescaled", "No value is rescaled; the values only move between channels 0 and 2.", "Ни одно значение не масштабируется; значения лишь переезжают между каналами 0 и 2."],
        ], "BGR2RGB keeps the shape (h, w, 3) and the pixel values; it only swaps the B and R channels, which matplotlib and RGB-trained models need.", "BGR2RGB сохраняет shape (h, w, 3) и значения пикселей; он лишь меняет местами каналы B и R — это нужно для matplotlib и моделей, обученных на RGB."),
        qx("A pixel of img is [30, 120, 200]. What is that pixel in rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)?", "[200, 120, 30]", [
          ["[30, 120, 200]", "The values do not stay in place: channels 0 and 2 are swapped.", "Значения не остаются на месте: каналы 0 и 2 меняются местами."],
          ["[120, 30, 200]", "G stays in the middle; only the first and the last channels swap.", "G остаётся в середине; меняются только первый и последний каналы."],
          ["One gray value, 134", "0.299·200 + 0.587·120 + 0.114·30 ≈ 134 is what BGR2GRAY would give, not BGR2RGB.", "0.299·200 + 0.587·120 + 0.114·30 ≈ 134 дал бы BGR2GRAY, а не BGR2RGB."],
        ], "imread order is B, G, R = 30, 120, 200; BGR2RGB writes R, G, B = 200, 120, 30 — the same colour, the channels in the opposite order.", "Порядок imread — B, G, R = 30, 120, 200; BGR2RGB записывает R, G, B = 200, 120, 30 — тот же цвет, каналы в обратном порядке."),
        qx("img = cv2.resize(img, (300, 200)) on a colour photo. What is img.shape afterwards?", "(200, 300, 3)", [
          ["(300, 200, 3)", "dsize is (width, height), but shape starts with the height, so 200 comes first.", "dsize — это (ширина, высота), а shape начинается с высоты, поэтому 200 идёт первым."],
          ["(200, 300)", "resize keeps all three colour channels.", "resize сохраняет все три цветовых канала."],
          ["(300, 200)", "Both the order and the channel count are wrong here.", "Здесь неверны и порядок, и число каналов."],
        ], "dsize = (width 300, height 200); shape = (height, width, channels) = (200, 300, 3).", "dsize = (ширина 300, высота 200); shape = (высота, ширина, каналы) = (200, 300, 3)."),
        qx("Variant 5: rgb has shape (200, 300, 3), and small = cv2.resize(rgb, (150, 100)). What is small.shape?", "(100, 150, 3)", [
          ["(150, 100, 3)", "That is (width, height, channels); shape lists the height first.", "Это (ширина, высота, каналы); shape начинается с высоты."],
          ["(100, 150, 1)", "BGR2RGB kept three channels, and resize does not change them.", "BGR2RGB сохранил три канала, и resize их не меняет."],
          ["(50, 75, 3)", "resize sets an absolute size; it does not halve the current one again.", "resize задаёт абсолютный размер, а не уменьшает текущий ещё вдвое."],
        ], "dsize (150, 100) means 150 wide and 100 high, so small has shape (100, 150, 3); the channels are still R, G, B.", "dsize (150, 100) — это 150 в ширину и 100 в высоту, поэтому shape у small — (100, 150, 3); каналы по-прежнему R, G, B."),
        qx("norm = small / 255.0, where small is uint8. What are the dtype and the value range of norm?", "float64, values from 0.0 to 1.0", [
          ["uint8, values from 0 to 1", "Division by a float gives float64; a uint8 array could hold only 0 or 1.", "Деление на float даёт float64; массив uint8 мог бы хранить только 0 или 1."],
          ["float64, values from −1.0 to 1.0", "−1 to 1 needs (x − 127.5) / 127.5; dividing 0–255 by 255 gives 0–1.", "Для −1…1 нужно (x − 127.5) / 127.5; деление 0–255 на 255 даёт 0–1."],
          ["float32, values from 0.0 to 255.0", "Dividing by 255 shrinks the range, and NumPy's default float type is float64.", "Деление на 255 сужает диапазон, а float по умолчанию в NumPy — float64."],
        ], "Dividing uint8 by the float 255.0 gives float64 of the same shape; 0 → 0.0 and 255 → 1.0, so the range is [0, 1].", "Деление uint8 на float 255.0 даёт float64 той же формы; 0 → 0.0, 255 → 1.0, поэтому диапазон — [0, 1]."),
        qx("Why does the Variant 5 pipeline divide the pixel values by 255.0?", "A small common scale for stable training", [
          ["To convert the image to grayscale", "Division keeps all three channels; gray needs cvtColor.", "Деление сохраняет все три канала; для серого нужен cvtColor."],
          ["To remove the sensor grain from dark night shots", "Scaling multiplies every value by the same factor, noise included.", "Масштабирование умножает каждое значение на один и тот же множитель, шум тоже."],
          ["To make the array smaller in memory", "float64 takes 8 bytes per value instead of 1, so the array grows.", "float64 занимает 8 байт на значение вместо 1, поэтому массив растёт."],
        ], "Inputs in [0, 1] on one scale keep gradient-based training stable and faster, and every image gets the same range; the same step is needed at test time.", "Входы в [0, 1] на одной шкале делают обучение градиентом стабильнее и быстрее, а у всех снимков одинаковый диапазон; тот же шаг нужен и на тесте."),
        qx("A student says histogram equalization should be applied to every image dataset. Which example refutes it?", "Grainy night shots: it amplifies the grain", [
          ["Dim dawn shots: it lifts their low contrast in dark regions", "That is a case where equalization helps, so it supports the claim.", "Это случай, когда выравнивание помогает, — он поддерживает утверждение."],
          ["Any dataset: it changes the image size", "Equalization keeps the size; it only remaps brightness values.", "Выравнивание сохраняет размер; оно лишь перераспределяет значения яркости."],
          ["Bird photos: it turns colour into gray", "Equalization does not convert colour spaces; it needs one channel as input.", "Выравнивание не меняет цветовое пространство; ему на вход нужен один канал."],
        ], "A counterexample must show harm: in dark, grainy night shots global equalization stretches the dark range together with its noise; CLAHE after denoising is safer.", "Контрпример должен показывать вред: на тёмных зернистых ночных снимках глобальное выравнивание растягивает тёмный диапазон вместе с шумом; безопаснее CLAHE после шумоподавления."),
        qx("A student equalizes the B, G and R channels of each bird photo separately. What is the main risk?", "The hues shift, so feather colours change", [
          ["An error, because equalizeHist needs a colour image", "It is the reverse: equalizeHist takes one 8-bit channel, so per-channel calls run fine.", "Наоборот: equalizeHist принимает один 8-битный канал, поэтому поканальные вызовы работают."],
          ["None; the colours stay exactly the same", "Each channel gets its own mapping, so the ratios between them, the hue, change.", "Каждый канал получает своё отображение, поэтому соотношения между ними — тон — меняются."],
          ["The image becomes grayscale", "Three equalized channels are still three channels.", "Три выровненных канала — по-прежнему три канала."],
        ], "Separate mappings change the balance of B, G and R, so colours drift — harmful when feather colour separates species. Equalize only L of LAB or V of HSV.", "Отдельные отображения меняют баланс B, G и R, и цвета уплывают — вредно, когда виды различаются цветом перьев. Выравнивайте только L в LAB или V в HSV."),
        tfx("Histogram equalization can hurt when brightness itself carries the class, for example tissue density in X-rays.", true, "Equalization spreads the brightness values evenly, so the absolute brightness differences between images — the very cue — are erased.", "Выравнивание равномерно перераспределяет яркость, поэтому абсолютные различия яркости между снимками — тот самый признак — стираются.", "Choosing False treats equalization as always harmless; it is not universal, which is the point of the Variant 5 claim.", "Ответ False считает выравнивание всегда безвредным; оно не универсально — в этом и смысл утверждения из варианта 5."),
        qx("Variant 5: every trail-camera photo is resized to 32 × 32. What is the main disadvantage for bird species?", "Fine plumage and beak details are lost", [
          ["Training becomes slower and needs more memory", "3 072 values per image make training faster and lighter — that is the advantage.", "3 072 значения на снимок делают обучение быстрее и легче — это как раз плюс."],
          ["The colour information is removed", "resize keeps all three channels; it removes spatial detail.", "resize сохраняет все три канала; он убирает пространственные детали."],
          ["Images from different cameras keep different sizes", "After the resize every image is 32 × 32; a uniform size is the advantage.", "После resize каждый снимок 32 × 32; одинаковый размер — это плюс."],
        ], "Species are told apart by small details — plumage pattern, beak shape, eye ring; at 32 × 32 a distant bird is a pixel or two, so these cues vanish.", "Виды различают по мелким деталям — узору оперения, форме клюва, кольцу вокруг глаза; при 32 × 32 далёкая птица занимает пиксель-два, и эти признаки пропадают."),
        qx("Two bird species differ mainly in feather colour. Should the images be converted to Canny edges before classification?", "No: an edge map keeps the shape but drops colour", [
          ["Yes: edges remove noise, so accuracy rises", "Edges remove colour too, and colour is exactly what separates these species.", "Границы убирают и цвет, а именно цвет различает эти виды."],
          ["Yes, if the thresholds are lowered to 50 and 100", "Lower thresholds only add weak edges; no threshold brings colour back.", "Более низкие пороги лишь добавляют слабые границы; никакой порог не вернёт цвет."],
          ["No, because Canny cannot read a colour image", "Canny accepts 8-bit colour or gray input; the problem is its output, not its input.", "Canny принимает 8-битный цветной или серый вход; проблема в его выходе, а не во входе."],
        ], "Canny returns one 0/255 channel: two species with the same shape give the same edges. Keep the colour image (or HSV hue).", "Canny возвращает один канал 0/255: два вида одной формы дают одинаковые границы. Оставьте цветное изображение (или тон в HSV)."),
        qx("Trail cameras: different resolutions, dim dawn and dusk shots, grainy nights. Which three operations fit best?", "Resize to one size, denoise, CLAHE on brightness", [
          ["Grayscale, Canny edges, an Otsu threshold", "These throw away feather colour and texture, the cues that separate species.", "Они выбрасывают цвет и текстуру перьев — признаки, по которым различают виды."],
          ["Resize to 32 × 32, a (15, 15) blur, global equalization", "Each step hurts here: a tiny size, a heavy blur and amplified grain erase fine detail.", "Каждый шаг здесь вредит: крошечный размер, сильное размытие и усиленное зерно стирают мелкие детали."],
          ["Rotation by 180°, colour inversion, a sky crop", "None of these fixes a named problem; inverting colours even destroys the colour cue.", "Ни один не решает названных проблем; инверсия цветов даже уничтожает цветовой признак."],
        ], "Each operation answers a named problem: resize for different resolutions, a mild denoise for grainy nights, CLAHE on L or V for dim dawn and dusk shots.", "Каждая операция отвечает на названную проблему: resize — на разные разрешения, мягкое шумоподавление — на зернистые ночи, CLAHE по L или V — на тёмные кадры рассвета и сумерек."),
        qx("Variant 5, Q5b: 5 000 clothing images are split 80/20. How many go to train and to test?", "4 000 train, 1 000 test", [
          ["4 500 train, 500 test", "That is a 90/10 split: 5 000 · 0.9 = 4 500.", "Это разбиение 90/10: 5 000 · 0.9 = 4 500."],
          ["3 500 train, 1 500 test", "That is 70/30, not 80/20.", "Это 70/30, а не 80/20."],
          ["1 000 train, 4 000 test", "Train and test are swapped; the larger part is for training.", "Train и test перепутаны; большая часть идёт на обучение."],
        ], "5 000 · 0.8 = 4 000 train and 5 000 · 0.2 = 1 000 test, split per class so that every class keeps its share.", "5 000 · 0.8 = 4 000 на обучение и 5 000 · 0.2 = 1 000 на тест, с разбиением по классам, чтобы доли классов сохранились."),
        qx("The same 5 000 images are split 70/15/15 into train, validation and test. What are the counts?", "3 500, 750 and 750", [
          ["3 500, 700 and 800", "15% of 5 000 is 750 for both validation and test.", "15% от 5 000 — это 750 и для validation, и для test."],
          ["3 000, 1 000 and 1 000", "That is 60/20/20, not 70/15/15.", "Это 60/20/20, а не 70/15/15."],
          ["4 000, 500 and 500", "That is 80/10/10, not 70/15/15.", "Это 80/10/10, а не 70/15/15."],
        ], "5 000 · 0.7 = 3 500 train, 5 000 · 0.15 = 750 validation and 750 test; validation is for tuning, test is used once.", "5 000 · 0.7 = 3 500 на обучение, 5 000 · 0.15 = 750 на валидацию и 750 на тест; валидация — для настройки, тест — один раз."),
        qx("In s = Wx + b for a C-class problem, what does row k of W represent?", "A learned template for class k", [
          ["The pixel values of the k-th training image", "x holds an image; W is learned and shared by all images.", "Изображение хранится в x; W выучивается и общая для всех снимков."],
          ["The probability of class k", "Probabilities appear only after softmax; W holds weights.", "Вероятности появляются только после softmax; W хранит веса."],
          ["The bias of class k", "The bias is b_k, a separate number for each class.", "Смещение — это b_k, отдельное число для каждого класса."],
        ], "Row k is multiplied by x to give score k: each weight says how strongly one input value pushes class k up or down — a template of the class.", "Строка k скалярно умножается на x и даёт оценку k: каждый вес говорит, насколько сильно одно входное значение поднимает или опускает класс k, — это шаблон класса."),
        tfx("In s = Wx + b, the bias b_k of class k is added to its score whatever the input image is.", true, "b holds one learned offset per class; it does not depend on x, so it sets a baseline preference for each class and shifts the boundary away from the origin.", "b хранит по одному выученному сдвигу на класс; он не зависит от x, поэтому задаёт исходное предпочтение каждого класса и сдвигает границу от начала координат.", "Choosing False confuses b with W, whose effect depends on the pixel values.", "Ответ False путает b с W, чьё влияние зависит от значений пикселей."),
        qx("Points (0, 0) and (1, 1) are class A; (0, 1) and (1, 0) are class B. Why does one linear classifier fail here?", "No single straight line separates A from B", [
          ["There are too few points to train on", "More XOR points would not help; the layout itself is not linearly separable.", "Больше точек XOR не помогут: сама раскладка линейно не разделима."],
          ["The bias b cannot be negative", "b can be any real number, and changing it only shifts the line.", "b может быть любым вещественным числом, и его изменение лишь сдвигает прямую."],
          ["The points must first be scaled to [0, 1]", "They are already in [0, 1]; scaling never makes XOR separable.", "Они и так в [0, 1]; масштабирование не делает XOR разделимым."],
        ], "A linear classifier draws straight boundaries; any line that keeps both A points on one side leaves a B point with them. Non-linear features or a neural network are needed.", "Линейный классификатор проводит прямые границы; любая прямая, оставляющая обе точки A по одну сторону, захватывает и точку B. Нужны нелинейные признаки или нейросеть."),
      ],
    ),
  ],
};
