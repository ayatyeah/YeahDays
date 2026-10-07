import type { Text } from "../types";

/**
 * Игра «Найди баг» к мидтерму по Computer Vision: 3–6 строк Python/OpenCV,
 * в которых ровно одна строка неверная. Игрок выбирает строку, затем одну
 * из трёх замен; fixes[0] — верная, две другие правдоподобны, но падают или
 * дают неверный результат. Все остальные строки сниппета корректны.
 *
 * Код — на языке экзамена (английский), объяснения — en и ru. Каждый
 * сниппет, каждая замена и каждое «почему» проверены на настоящем OpenCV
 * (4.14 и 5.0): crash — исходный код бросает исключение; silent — работает
 * без ошибки, но результат измеримо неверный.
 */
export interface BugSnippet {
  id: string;
  /** 3–6 строк кода; cv2, np и plt считаются импортированными. */
  lines: string[];
  /** Индекс единственной неверной строки в `lines`. */
  bug: number;
  /** crash — падает с ошибкой; silent — работает, но результат неверный. */
  kind: "crash" | "silent";
  /** Замены неверной строки: fixes[0] — верная, две другие — ловушки. */
  fixes: [string, string, string];
  /** Почему строка неверна и почему fixes[0] её исправляет. */
  why: Text;
  /** Почему не подходят fixes[1] и fixes[2]. */
  wrongFix: [Text, Text];
  topic:
    | "bgr"
    | "kernel"
    | "sigma"
    | "threshold-type"
    | "otsu-color"
    | "equalize-color"
    | "gray-twice"
    | "median-kernel"
    | "resize-order"
    | "index"
    | "imwrite-float"
    | "imshow-bgr"
    | "none-path"
    | "crop-order"
    | "hsv-bgr"
    | "canny-color"
    | "dtype";
}

export const BUGS: BugSnippet[] = [
  {
    id: "b01",
    topic: "bgr",
    kind: "silent",
    lines: [
      "img = cv2.imread('leaf.jpg')",
      "gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)",
      "blur = cv2.GaussianBlur(gray, (5, 5), 0)",
    ],
    bug: 1,
    fixes: [
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "gray = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)",
      "gray = img[:, :, 0]",
    ],
    why: {
      en: "cv2.imread returns the channels in B, G, R order, so COLOR_RGB2GRAY swaps the weights of red and blue: it runs, but the gray values are wrong. COLOR_BGR2GRAY matches the imread data and computes Gray = 0.299 R + 0.587 G + 0.114 B.",
      ru: "cv2.imread отдаёт каналы в порядке B, G, R, а COLOR_RGB2GRAY меняет местами веса красного и синего: код работает, но яркость неверная. COLOR_BGR2GRAY соответствует данным imread и считает Gray = 0.299 R + 0.587 G + 0.114 B.",
    },
    wrongFix: [
      {
        en: "RGB2BGR only swaps two channels and keeps all three, so the result is still a colour image, not gray.",
        ru: "RGB2BGR только переставляет два канала и оставляет все три — это по-прежнему цветная картинка, а не серая.",
      },
      {
        en: "img[:, :, 0] is just the blue channel, not a weighted mix of all three.",
        ru: "img[:, :, 0] — это только синий канал, а не взвешенная смесь всех трёх.",
      },
    ],
  },
  {
    id: "b02",
    topic: "kernel",
    kind: "crash",
    lines: [
      "img = cv2.imread('fabric.jpg', cv2.IMREAD_GRAYSCALE)",
      "blur = cv2.GaussianBlur(img, (4, 4), 0)",
      "edges = cv2.Canny(blur, 50, 150)",
    ],
    bug: 1,
    fixes: [
      "blur = cv2.GaussianBlur(img, (5, 5), 0)",
      "blur = cv2.GaussianBlur(img, (6, 6), 0)",
      "blur = cv2.GaussianBlur(img, (4, 4), 1.5)",
    ],
    why: {
      en: "A Gaussian kernel must be positive and odd so that it has a centre pixel; (4, 4) fails the assertion and the program stops. (5, 5) is odd, and sigmaX = 0 lets OpenCV compute sigma from the kernel size.",
      ru: "Ядро Гаусса должно быть положительным и нечётным, чтобы у него был центральный пиксель; (4, 4) не проходит проверку, и программа падает. (5, 5) — нечётное, а sigmaX = 0 значит, что OpenCV вычислит sigma по размеру ядра.",
    },
    wrongFix: [
      {
        en: "(6, 6) is still even and raises the same error.",
        ru: "(6, 6) тоже чётное и вызывает ту же ошибку.",
      },
      {
        en: "A sigma does not help: the kernel size itself is still even and is rejected.",
        ru: "sigma не спасает: чётным остаётся сам размер ядра, и его отклоняют.",
      },
    ],
  },
  {
    id: "b03",
    topic: "imwrite-float",
    kind: "silent",
    lines: [
      "img = cv2.imread('lynx.jpg')",
      "small = cv2.resize(img, (128, 128))",
      "norm = small / 255.0              # input for the model, 0.0..1.0",
      "cv2.imwrite('lynx_check.jpg', norm)",
    ],
    bug: 3,
    fixes: [
      "cv2.imwrite('lynx_check.jpg', (norm * 255).astype('uint8'))",
      "cv2.imwrite('lynx_check.jpg', norm.astype('uint8'))",
      "cv2.imwrite('lynx_check.png', norm)",
    ],
    why: {
      en: "norm is float64 in [0, 1], but a JPEG stores 8-bit values 0..255: imwrite converts without an error, every pixel becomes 0 or 1 and the saved copy is almost black. Scaling back by 255 and casting to uint8 restores the normal range.",
      ru: "norm — это float64 в диапазоне [0, 1], а JPEG хранит 8-битные значения 0..255: imwrite конвертирует без ошибки, каждый пиксель становится 0 или 1, и копия получается почти чёрной. Умножение на 255 и приведение к uint8 возвращает нормальный диапазон.",
    },
    wrongFix: [
      {
        en: "Casting [0, 1] floats straight to uint8 truncates them to 0 (1 only for pure white), so the file is black again.",
        ru: "Прямое приведение чисел из [0, 1] к uint8 обрезает их до 0 (1 — только у чисто белых), и файл снова чёрный.",
      },
      {
        en: "The format is not the problem: imwrite again turns the float64 values into 8-bit 0 or 1, and the PNG stays black.",
        ru: "Дело не в формате: imwrite снова превращает значения float64 в 8-битные 0 или 1, и PNG остаётся чёрным.",
      },
    ],
  },
  {
    id: "b04",
    topic: "none-path",
    kind: "crash",
    lines: [
      "# the scan is saved as receipt_03.jpg",
      "img = cv2.imread('reciept_03.jpg')",
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "ret, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
    ],
    bug: 1,
    fixes: [
      "img = cv2.imread('receipt_03.jpg')",
      "img = cv2.imread('reciept_03.jpg', cv2.IMREAD_GRAYSCALE)",
      "img = cv2.imread('receipt_03')",
    ],
    why: {
      en: "The file name is misspelled (reciept instead of receipt), and cv2.imread does not raise for a missing file: it returns None, so the crash only appears one line later, inside cvtColor (!_src.empty()). Reading the real file name fixes the cause, not the symptom.",
      ru: "Имя файла написано с ошибкой (reciept вместо receipt), а cv2.imread не бросает исключение для отсутствующего файла: он возвращает None, и падение видно только строкой ниже, в cvtColor (!_src.empty()). Правильное имя файла устраняет причину, а не симптом.",
    },
    wrongFix: [
      {
        en: "The read flag does not matter: the misspelled file still does not exist, so img is None again.",
        ru: "Флаг чтения ни при чём: файла с опечаткой всё равно нет, и img снова None.",
      },
      {
        en: "The extension is part of the file name: receipt_03 without .jpg is a different, missing file.",
        ru: "Расширение — часть имени файла: receipt_03 без .jpg — другой, несуществующий файл.",
      },
    ],
  },
  {
    id: "b05",
    topic: "resize-order",
    kind: "silent",
    lines: [
      "img = cv2.imread('flower.jpg')",
      "# target: 200 px wide, 300 px high",
      "small = cv2.resize(img, (300, 200))",
      "rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)",
    ],
    bug: 2,
    fixes: [
      "small = cv2.resize(img, (200, 300))",
      "small = cv2.resize(img, (300, 200, 3))",
      "small = cv2.resize(img, (300, 200)).reshape(300, 200, 3)",
    ],
    why: {
      en: "dsize in cv2.resize is (width, height), so (300, 200) makes an image 300 wide and 200 high, shape (200, 300, 3): it runs, but the size is wrong. (200, 300) gives 200 wide and 300 high, shape (300, 200, 3).",
      ru: "dsize в cv2.resize — это (ширина, высота), поэтому (300, 200) даёт картинку 300 в ширину и 200 в высоту, shape (200, 300, 3): код работает, но размер неверный. (200, 300) даёт 200 в ширину и 300 в высоту, shape (300, 200, 3).",
    },
    wrongFix: [
      {
        en: "dsize takes only two numbers, width and height; a third value is a bad argument and raises an error.",
        ru: "dsize принимает только два числа — ширину и высоту; третье значение — неверный аргумент, и вызов падает.",
      },
      {
        en: "reshape gives the right shape but only re-cuts the 300-wide rows into 200-wide ones, so the picture turns into scrambled stripes.",
        ru: "reshape даёт нужный shape, но лишь перенарезает строки шириной 300 на строки шириной 200 — картинка превращается в перемешанные полосы.",
      },
    ],
  },
  {
    id: "b06",
    topic: "threshold-type",
    kind: "crash",
    lines: [
      "img = cv2.imread('receipt.jpg')",
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "ret, binary = cv2.threshold(gray, 150, 255)",
      "white = cv2.countNonZero(binary)",
    ],
    bug: 2,
    fixes: [
      "ret, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)",
      "binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)",
      "ret, binary = cv2.threshold(gray, 150, cv2.THRESH_BINARY)",
    ],
    why: {
      en: "cv2.threshold needs four arguments — the image, the threshold, maxval and the type; without the type the call fails. With cv2.THRESH_BINARY, pixels above 150 become 255 and the rest 0.",
      ru: "cv2.threshold требует четыре аргумента — изображение, порог, maxval и тип; без типа вызов падает. С cv2.THRESH_BINARY пиксели ярче 150 становятся 255, остальные — 0.",
    },
    wrongFix: [
      {
        en: "threshold returns a pair (ret, binary); assigned to one name, binary is a tuple and countNonZero fails.",
        ru: "threshold возвращает пару (ret, binary); если присвоить её одной переменной, binary — кортеж, и countNonZero падает.",
      },
      {
        en: "The type took the place of maxval: there are still only three arguments, and the type is still missing.",
        ru: "Тип встал на место maxval: аргументов по-прежнему три, и типа всё так же нет.",
      },
    ],
  },
  {
    id: "b07",
    topic: "index",
    kind: "silent",
    lines: [
      "img = cv2.imread('beetle.jpg')",
      "# colour of the pixel at x = 70 (column), y = 25 (row)",
      "pixel = img[70, 25]",
      "b, g, r = pixel",
    ],
    bug: 2,
    fixes: ["pixel = img[25, 70]", "pixel = img[70][25]", "pixel = img[25, 70, 0]"],
    why: {
      en: "NumPy indexes an image as img[row, column] = img[y, x], so img[70, 25] reads x = 25, y = 70 — a different pixel, without any error. img[25, 70] is the pixel at x = 70, y = 25 and returns [B, G, R].",
      ru: "NumPy индексирует картинку как img[строка, столбец] = img[y, x], поэтому img[70, 25] читает x = 25, y = 70 — другой пиксель, и без ошибки. img[25, 70] — это пиксель x = 70, y = 25, он возвращает [B, G, R].",
    },
    wrongFix: [
      {
        en: "img[70][25] is the same as img[70, 25]: row 70, column 25 — the coordinates are still swapped.",
        ru: "img[70][25] — то же самое, что img[70, 25]: строка 70, столбец 25, координаты всё так же перепутаны.",
      },
      {
        en: "The extra 0 picks only the blue value, a single number, so b, g, r = pixel cannot unpack it.",
        ru: "Лишний 0 берёт только синее значение — одно число, и b, g, r = pixel не может его распаковать.",
      },
    ],
  },
  {
    id: "b08",
    topic: "otsu-color",
    kind: "crash",
    lines: [
      "img = cv2.imread('pills.jpg')",
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "blur = cv2.GaussianBlur(gray, (5, 5), 0)",
      "ret, mask = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
    ],
    bug: 3,
    fixes: [
      "ret, mask = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
      "ret, mask = cv2.threshold(img, 0, 255, cv2.THRESH_OTSU)",
      "ret, mask = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)",
    ],
    why: {
      en: "Otsu builds one histogram and picks one threshold, so it works only on a single-channel 8-bit image; the 3-channel img raises an error. blur, the smoothed gray image, is exactly what Otsu needs.",
      ru: "Otsu строит одну гистограмму и выбирает один порог, поэтому работает только с одноканальным 8-битным изображением; трёхканальный img вызывает ошибку. blur — сглаженная серая картинка — ровно то, что нужно Otsu.",
    },
    wrongFix: [
      {
        en: "Dropping THRESH_BINARY changes nothing: Otsu still gets three channels and fails.",
        ru: "Если убрать THRESH_BINARY, ничего не изменится: Otsu всё так же получает три канала и падает.",
      },
      {
        en: "It runs, but a fixed 127 on a colour image thresholds B, G and R separately and returns a 3-channel image, not one binary mask.",
        ru: "Код работает, но фиксированный порог 127 на цветной картинке порогует B, G и R по отдельности и даёт трёхканальную картинку, а не одну бинарную маску.",
      },
    ],
  },
  {
    id: "b09",
    topic: "imshow-bgr",
    kind: "silent",
    lines: [
      "img = cv2.imread('sunset.jpg')",
      "blur = cv2.GaussianBlur(img, (5, 5), 0)",
      "plt.imshow(blur)",
      "plt.title('Blurred sunset')",
    ],
    bug: 2,
    fixes: [
      "plt.imshow(cv2.cvtColor(blur, cv2.COLOR_BGR2RGB))",
      "plt.imshow(blur, cmap='rgb')",
      "plt.imshow(blur / 255.0)",
    ],
    why: {
      en: "OpenCV arrays are BGR, while matplotlib reads channel 0 as red, so the orange sky is shown blue — no error. COLOR_BGR2RGB puts the channels in the order matplotlib expects.",
      ru: "Массивы OpenCV хранятся в BGR, а matplotlib считает канал 0 красным, поэтому оранжевое небо показывается синим — без ошибки. COLOR_BGR2RGB ставит каналы в порядок, который ждёт matplotlib.",
    },
    wrongFix: [
      {
        en: "There is no colormap called rgb, so matplotlib raises an error — and a colormap is ignored for a 3-channel image anyway.",
        ru: "Цветовой карты rgb не существует, и matplotlib выдаёт ошибку, — да и для трёхканальной картинки cmap всё равно игнорируется.",
      },
      {
        en: "Dividing by 255 only rescales the values to [0, 1]; the channels stay in B, G, R order, so the colours are still swapped.",
        ru: "Деление на 255 только переводит значения в [0, 1]; каналы остаются в порядке B, G, R, и цвета всё так же перепутаны.",
      },
    ],
  },
  {
    id: "b10",
    topic: "equalize-color",
    kind: "crash",
    lines: [
      "img = cv2.imread('dark_room.jpg')",
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "eq = cv2.equalizeHist(img)",
      "cv2.imwrite('dark_room_eq.png', eq)",
    ],
    bug: 2,
    fixes: [
      "eq = cv2.equalizeHist(gray)",
      "eq = cv2.equalizeHist(img[:, :, 0])",
      "eq = cv2.equalizeHist(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))",
    ],
    why: {
      en: "cv2.equalizeHist accepts only an 8-bit single-channel image (CV_8UC1); img has three channels, so the call fails. gray, made on the line above, is the input it needs.",
      ru: "cv2.equalizeHist принимает только 8-битное одноканальное изображение (CV_8UC1); у img три канала, поэтому вызов падает. Нужный вход — gray, созданный строкой выше.",
    },
    wrongFix: [
      {
        en: "It runs, but it equalizes only the blue channel, not the brightness of the room.",
        ru: "Код работает, но выравнивает только синий канал, а не яркость комнаты.",
      },
      {
        en: "BGR2RGB keeps three channels, so equalizeHist fails exactly as before.",
        ru: "BGR2RGB оставляет три канала, и equalizeHist падает так же, как раньше.",
      },
    ],
  },
  {
    id: "b11",
    topic: "hsv-bgr",
    kind: "silent",
    lines: [
      "img = cv2.imread('tomatoes.jpg')",
      "hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)",
      "# ripe tomatoes are red: hue 0..10",
      "mask = cv2.inRange(hsv, (0, 100, 80), (10, 255, 255))",
    ],
    bug: 1,
    fixes: [
      "hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)",
      "hsv = cv2.cvtColor(img, cv2.COLOR_HSV2BGR)",
      "hsv = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)",
    ],
    why: {
      en: "imread data is BGR, so COLOR_RGB2HSV reads blue as red: red tomatoes get a blue hue near 120 and drop out of the mask, while blue objects get in — no error. COLOR_BGR2HSV matches the data, and red gets a hue near 0.",
      ru: "Данные imread — в BGR, поэтому COLOR_RGB2HSV принимает синий за красный: красные помидоры получают синий оттенок около 120 и выпадают из маски, а синие предметы попадают в неё — без ошибки. COLOR_BGR2HSV соответствует данным, и у красного оттенок около 0.",
    },
    wrongFix: [
      {
        en: "HSV2BGR converts in the opposite direction: it treats the B, G, R values as if they were H, S, V, so the result is meaningless.",
        ru: "HSV2BGR переводит в обратную сторону: значения B, G, R считаются значениями H, S, V, и результат бессмысленный.",
      },
      {
        en: "BGR2RGB only reorders the channels; the array is still red, green and blue, not hue, saturation and value.",
        ru: "BGR2RGB только переставляет каналы; в массиве всё так же красный, зелёный и синий, а не оттенок, насыщенность и яркость.",
      },
    ],
  },
  {
    id: "b12",
    topic: "sigma",
    kind: "crash",
    lines: [
      "img = cv2.imread('denim.jpg', cv2.IMREAD_GRAYSCALE)",
      "blur = cv2.GaussianBlur(img, (3, 3))",
      "ret, binary = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)",
    ],
    bug: 1,
    fixes: [
      "blur = cv2.GaussianBlur(img, (3, 3), 0)",
      "blur = cv2.GaussianBlur(img, (3, 3), sigmaY=0)",
      "blur = cv2.GaussianBlur(img, (3, 3), (0, 0))",
    ],
    why: {
      en: "sigmaX is a required argument of cv2.GaussianBlur, so the call with only the kernel fails; the kernel (3, 3) itself is fine. sigmaX = 0 tells OpenCV to compute sigma from the kernel size.",
      ru: "sigmaX — обязательный аргумент cv2.GaussianBlur, поэтому вызов с одним только ядром падает; само ядро (3, 3) правильное. sigmaX = 0 говорит OpenCV вычислить sigma по размеру ядра.",
    },
    wrongFix: [
      {
        en: "sigmaY is optional; passing it does not replace the required sigmaX, so the call still fails.",
        ru: "sigmaY необязателен; он не заменяет обязательный sigmaX, и вызов всё так же падает.",
      },
      {
        en: "sigmaX is one number, not a pair like the kernel size; a tuple is a bad argument.",
        ru: "sigmaX — одно число, а не пара, как размер ядра; кортеж — неверный аргумент.",
      },
    ],
  },
  {
    id: "b13",
    topic: "dtype",
    kind: "silent",
    lines: [
      "gray = cv2.imread('basement.jpg', cv2.IMREAD_GRAYSCALE)",
      "# brighten by 80; values above 255 must stay 255",
      "bright = gray + 80",
      "cv2.imwrite('basement_bright.png', bright)",
    ],
    bug: 2,
    fixes: [
      "bright = cv2.add(gray, 80)",
      "bright = np.uint8(gray + 80)",
      "bright = np.clip(gray + 80, 0, 255)",
    ],
    why: {
      en: "gray is uint8, and NumPy addition wraps around: 200 + 80 = 280 is stored as 24, so the brightest lamps turn almost black — no error. cv2.add saturates instead: 200 + 80 gives 255.",
      ru: "gray имеет тип uint8, и сложение в NumPy идёт по кругу: 200 + 80 = 280 сохраняется как 24, и самые яркие лампы становятся почти чёрными — без ошибки. cv2.add насыщает: 200 + 80 даёт 255.",
    },
    wrongFix: [
      {
        en: "gray + 80 has already wrapped around before np.uint8 is applied, so the lamps stay dark.",
        ru: "gray + 80 уже переполнилось до вызова np.uint8, и лампы остаются тёмными.",
      },
      {
        en: "The sum is still uint8 and has already wrapped, so there is nothing above 255 left to clip.",
        ru: "Сумма по-прежнему uint8 и уже переполнилась, поэтому обрезать выше 255 нечего.",
      },
    ],
  },
  {
    id: "b14",
    topic: "gray-twice",
    kind: "crash",
    lines: [
      "img = cv2.imread('chest_xray.png', cv2.IMREAD_GRAYSCALE)",
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "eq = cv2.equalizeHist(gray)",
    ],
    bug: 1,
    fixes: [
      "gray = img",
      "gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)",
      "gray = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)",
    ],
    why: {
      en: "IMREAD_GRAYSCALE already returns one channel, shape (h, w), while COLOR_BGR2GRAY expects three channels, so cvtColor fails. The image is already gray — just use it.",
      ru: "IMREAD_GRAYSCALE уже возвращает один канал, shape (h, w), а COLOR_BGR2GRAY ждёт три канала, поэтому cvtColor падает. Картинка уже серая — её можно использовать как есть.",
    },
    wrongFix: [
      {
        en: "RGB2GRAY also expects three channels, so it fails the same way.",
        ru: "RGB2GRAY тоже ждёт три канала и падает так же.",
      },
      {
        en: "GRAY2BGR makes three channels, and then equalizeHist fails because it needs one.",
        ru: "GRAY2BGR делает три канала, и тогда падает equalizeHist, которому нужен один.",
      },
    ],
  },
  {
    id: "b15",
    topic: "crop-order",
    kind: "silent",
    lines: [
      "img = cv2.imread('license_plate.jpg')",
      "# plate: x from 120 to 280, y from 60 to 110",
      "plate = img[120:280, 60:110]",
      "gray = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY)",
    ],
    bug: 2,
    fixes: ["plate = img[60:110, 120:280]", "plate = img[120:280][60:110]", "plate = img[60:110][120:280]"],
    why: {
      en: "A NumPy crop is img[y1:y2, x1:x2] — rows first, then columns — so img[120:280, 60:110] cuts a tall strip of 160 rows and 50 columns from the wrong place, without an error. img[60:110, 120:280] gives the plate: 50 rows, 160 columns.",
      ru: "Вырезка в NumPy — img[y1:y2, x1:x2]: сначала строки, потом столбцы, поэтому img[120:280, 60:110] без ошибки вырезает высокую полосу из 160 строк и 50 столбцов не из того места. img[60:110, 120:280] даёт номер: 50 строк, 160 столбцов.",
    },
    wrongFix: [
      {
        en: "Chained [ ][ ] slices rows twice: the second slice takes rows again, not columns, so the plate is never cut out.",
        ru: "Цепочка [ ][ ] дважды режет строки: второй срез снова берёт строки, а не столбцы, и номер так и не вырезан.",
      },
      {
        en: "Chained slicing cuts rows twice: 50 rows are kept, rows 120..280 of them do not exist, the crop is empty and cvtColor fails.",
        ru: "Цепочка срезов дважды режет строки: остаётся 50 строк, строк 120..280 среди них нет, вырезка пустая, и cvtColor падает.",
      },
    ],
  },
  {
    id: "b16",
    topic: "median-kernel",
    kind: "crash",
    lines: [
      "img = cv2.imread('old_photo.png', cv2.IMREAD_GRAYSCALE)",
      "# remove the salt-and-pepper dots",
      "clean = cv2.medianBlur(img, 4)",
      "eq = cv2.equalizeHist(clean)",
    ],
    bug: 2,
    fixes: [
      "clean = cv2.medianBlur(img, 5)",
      "clean = cv2.medianBlur(img, (5, 5))",
      "clean = cv2.medianBlur(img, 1)",
    ],
    why: {
      en: "medianBlur needs an odd integer aperture greater than 1, so that the window has a centre; 4 fails the check. 5 is odd and removes isolated black and white dots.",
      ru: "medianBlur нужен нечётный целый размер окна больше 1, чтобы у окна был центр; 4 не проходит проверку. 5 — нечётное и убирает одиночные чёрные и белые точки.",
    },
    wrongFix: [
      {
        en: "Unlike GaussianBlur, medianBlur takes one integer, not a (w, h) pair; the tuple is a bad argument.",
        ru: "В отличие от GaussianBlur, medianBlur принимает одно целое число, а не пару (w, h); кортеж — неверный аргумент.",
      },
      {
        en: "A 1 × 1 median is the pixel itself: it runs, but no dot is removed.",
        ru: "Медиана окна 1 × 1 — это сам пиксель: код работает, но ни одна точка не убрана.",
      },
    ],
  },
  {
    id: "b17",
    topic: "canny-color",
    kind: "silent",
    lines: [
      "img = cv2.imread('road.jpg')",
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "edges = cv2.Canny(gray, 80, 160)",
      "# paint the edges red on top of the photo",
      "overlay = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)",
      "overlay[edges > 0] = (0, 0, 255)",
    ],
    bug: 4,
    fixes: [
      "overlay = img.copy()",
      "overlay = edges.copy()",
      "overlay = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)",
    ],
    why: {
      en: "Canny returns one channel of 0 and 255 — the photo is gone — so converting edges back to BGR gives only white lines on black, and the red edges land on a black background. A copy of img keeps the colour photo underneath.",
      ru: "Canny возвращает один канал из 0 и 255 — фотографии в нём уже нет, — поэтому перевод edges обратно в BGR даёт лишь белые линии на чёрном, и красные края рисуются на чёрном фоне. Копия img сохраняет под ними цветное фото.",
    },
    wrongFix: [
      {
        en: "edges has one channel, so assigning a 3-value colour to its pixels raises an error.",
        ru: "У edges один канал, поэтому присвоить его пикселям цвет из трёх значений нельзя — ошибка.",
      },
      {
        en: "It runs, but the background is the gray image copied into three equal channels — the colour of the photo is lost.",
        ru: "Код работает, но фон — серая картинка, скопированная в три одинаковых канала: цвет фото потерян.",
      },
    ],
  },
  {
    id: "b18",
    topic: "bgr",
    kind: "silent",
    lines: [
      "img = cv2.imread('tomato.jpg')",
      "r, g, b = cv2.split(img)",
      "# ripe if the red channel is clearly above the green one",
      "ripe = r.mean() > g.mean() + 30",
    ],
    bug: 1,
    fixes: [
      "b, g, r = cv2.split(img)",
      "r, g, b = cv2.split(cv2.cvtColor(img, cv2.COLOR_BGR2HSV))",
      "r, g, b = img[0], img[1], img[2]",
    ],
    why: {
      en: "cv2.split returns the channels in the stored order B, G, R, so the name r is given to the blue channel and the ripeness test compares blue with green — silently. b, g, r = cv2.split(img) names them correctly.",
      ru: "cv2.split возвращает каналы в порядке хранения B, G, R, поэтому имя r получает синий канал, и проверка спелости сравнивает синий с зелёным — без ошибки. b, g, r = cv2.split(img) называет каналы правильно.",
    },
    wrongFix: [
      {
        en: "After BGR2HSV the three channels are hue, saturation and value, not red, green and blue.",
        ru: "После BGR2HSV три канала — это оттенок, насыщенность и яркость, а не красный, зелёный и синий.",
      },
      {
        en: "img[0], img[1] and img[2] are the first three rows of the image, not its channels.",
        ru: "img[0], img[1] и img[2] — первые три строки картинки, а не её каналы.",
      },
    ],
  },
  {
    id: "b19",
    topic: "resize-order",
    kind: "silent",
    lines: [
      "img = cv2.imread('parking_cam2.jpg')",
      "h, w = img.shape[:2]",
      "# half the width and half the height",
      "half = cv2.resize(img, (h // 2, w // 2))",
      "gray = cv2.cvtColor(half, cv2.COLOR_BGR2GRAY)",
    ],
    bug: 3,
    fixes: [
      "half = cv2.resize(img, (w // 2, h // 2))",
      "half = cv2.resize(img, (w / 2, h / 2))",
      "half = cv2.resize(img, (h, w), fx=0.5, fy=0.5)",
    ],
    why: {
      en: "img.shape is (height, width, channels), but dsize is (width, height); (h // 2, w // 2) swaps them and stretches the frame to the wrong proportions without an error. (w // 2, h // 2) gives exactly half of each side.",
      ru: "img.shape — это (высота, ширина, каналы), а dsize — (ширина, высота); (h // 2, w // 2) меняет их местами и без ошибки растягивает кадр до неверных пропорций. (w // 2, h // 2) даёт ровно половину каждой стороны.",
    },
    wrongFix: [
      {
        en: "w / 2 is a float, and dsize must be whole numbers, so resize raises a bad-argument error.",
        ru: "w / 2 — дробное число, а dsize должен состоять из целых, поэтому resize выдаёт ошибку аргумента.",
      },
      {
        en: "When dsize is not zero, fx and fy are ignored, so the result is the full (h, w) size with the sides still swapped.",
        ru: "Если dsize не нулевой, fx и fy игнорируются, и результат — полный размер (h, w) с теми же перепутанными сторонами.",
      },
    ],
  },
  {
    id: "b20",
    topic: "none-path",
    kind: "crash",
    lines: [
      "img = cv2.imread('hand_xray.png', cv2.IMREAD_GRAYSCALE)",
      "if img == None:",
      "    raise FileNotFoundError('hand_xray.png')",
      "eq = cv2.equalizeHist(img)",
    ],
    bug: 1,
    fixes: ["if img is None:", "if not img:", "if img.size == 0:"],
    why: {
      en: "When the file is read, img is a NumPy array, and img == None compares every pixel, giving an array with no single truth value, so the if raises ValueError on a good image. img is None is True only when imread failed.",
      ru: "Если файл прочитан, img — массив NumPy, и img == None сравнивает каждый пиксель, получая массив без единого значения истинности, поэтому if падает с ValueError на нормальной картинке. img is None истинно только тогда, когда imread не смог прочитать файл.",
    },
    wrongFix: [
      {
        en: "not img also asks for the truth value of a whole array and raises the same ValueError.",
        ru: "not img тоже спрашивает истинность целого массива и падает с той же ValueError.",
      },
      {
        en: "imread never returns an empty array: for a missing file img is None, which has no .size, so the guard itself crashes with AttributeError.",
        ru: "imread никогда не возвращает пустой массив: для отсутствующего файла img равен None, у которого нет .size, и сама проверка падает с AttributeError.",
      },
    ],
  },
  {
    id: "b21",
    topic: "threshold-type",
    kind: "silent",
    lines: [
      "gray = cv2.imread('scan_page.png', cv2.IMREAD_GRAYSCALE)",
      "# dark ink on white paper; the ink must become white (255) for findContours",
      "ret, ink = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
      "contours, hierarchy = cv2.findContours(ink, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)",
    ],
    bug: 2,
    fixes: [
      "ret, ink = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)",
      "ret, ink = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV)",
      "ret, ink = cv2.threshold(gray, 255, 0, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
    ],
    why: {
      en: "THRESH_BINARY makes pixels above the threshold white, so the bright paper becomes 255 and the dark ink 0; findContours then traces the page instead of the letters — no error. THRESH_BINARY_INV turns the ink white, and Otsu still picks the threshold.",
      ru: "THRESH_BINARY делает белыми пиксели ярче порога, поэтому светлая бумага становится 255, а тёмные чернила — 0; findContours обводит страницу, а не буквы, — без ошибки. THRESH_BINARY_INV делает чернила белыми, а порог по-прежнему выбирает Otsu.",
    },
    wrongFix: [
      {
        en: "Without THRESH_OTSU the threshold is the literal 0, so only pixels equal to 0 turn white — almost no ink.",
        ru: "Без THRESH_OTSU порог — буквально 0, и белыми становятся только пиксели, равные 0, — почти никаких чернил.",
      },
      {
        en: "With maxval 0 every pixel above the threshold is set to 0 as well, so the whole mask is black.",
        ru: "При maxval = 0 пиксели выше порога тоже получают 0, и вся маска чёрная.",
      },
    ],
  },
  {
    id: "b22",
    topic: "kernel",
    kind: "crash",
    lines: [
      "img = cv2.imread('xray.png', cv2.IMREAD_GRAYSCALE)",
      "eq = cv2.equalizeHist(img)",
      "smooth = cv2.GaussianBlur(eq, 7, 0)",
    ],
    bug: 2,
    fixes: [
      "smooth = cv2.GaussianBlur(eq, (7, 7), 0)",
      "smooth = cv2.GaussianBlur(eq, 7, 1.5)",
      "smooth = cv2.GaussianBlur(eq, (7, 7))",
    ],
    why: {
      en: "The kernel size of GaussianBlur is a (width, height) pair, and a single 7 is a bad argument. (7, 7) is positive and odd, and sigmaX = 0 is computed from it.",
      ru: "Размер ядра GaussianBlur — пара (ширина, высота), и одно число 7 — неверный аргумент. (7, 7) — положительное и нечётное, а sigmaX = 0 вычисляется по нему.",
    },
    wrongFix: [
      {
        en: "The kernel is still a single number; changing sigma does not turn it into a pair.",
        ru: "Ядро по-прежнему одно число; изменение sigma не делает его парой.",
      },
      {
        en: "The kernel is now correct, but sigmaX was dropped, and it is a required argument.",
        ru: "Ядро теперь правильное, но пропал sigmaX, а он обязательный.",
      },
    ],
  },
  {
    id: "b23",
    topic: "imwrite-float",
    kind: "silent",
    lines: [
      "img = cv2.imread('tunnel.jpg', cv2.IMREAD_GRAYSCALE)",
      "bright = (img / 255.0) ** 0.5     # gamma 0.5, values 0.0..1.0",
      "level = bright.mean()             # brightness feature in [0, 1]",
      "cv2.imwrite('tunnel_bright.png', bright)",
    ],
    bug: 3,
    fixes: [
      "cv2.imwrite('tunnel_bright.png', (bright * 255).astype(np.uint8))",
      "cv2.imwrite('tunnel_bright.png', bright.astype(np.uint8))",
      "cv2.imwrite('tunnel_bright.jpg', bright)",
    ],
    why: {
      en: "bright holds floats in [0, 1], but an 8-bit file stores 0..255: imwrite saves each value as 0 or 1 and the brightened tunnel comes out black — no error. Multiplying by 255 and casting to uint8 saves the real picture.",
      ru: "В bright лежат дробные числа из [0, 1], а 8-битный файл хранит 0..255: imwrite записывает каждое значение как 0 или 1, и осветлённый туннель получается чёрным — без ошибки. Умножение на 255 и приведение к uint8 сохраняет настоящую картинку.",
    },
    wrongFix: [
      {
        en: "Without the factor 255, uint8 truncates every value below 1.0 to 0 — the file is black again.",
        ru: "Без множителя 255 приведение к uint8 обрезает каждое значение меньше 1.0 до 0 — файл снова чёрный.",
      },
      {
        en: "JPEG is also 8-bit, so the float values again become 0 or 1.",
        ru: "JPEG тоже 8-битный, и дробные значения снова становятся 0 или 1.",
      },
    ],
  },
  {
    id: "b24",
    topic: "index",
    kind: "crash",
    lines: [
      "img = cv2.imread('tile.png', cv2.IMREAD_GRAYSCALE)",
      "h, w = img.shape                  # (90, 120)",
      "# brightness of the bottom-right corner pixel",
      "corner = img[h, w]",
    ],
    bug: 3,
    fixes: ["corner = img[h - 1, w - 1]", "corner = img[w - 1, h - 1]", "corner = img[h - 1][w]"],
    why: {
      en: "Indices run from 0 to h - 1 and from 0 to w - 1, so img[h, w] is one step outside the image and raises IndexError. img[h - 1, w - 1] is the last row and the last column.",
      ru: "Индексы идут от 0 до h - 1 и от 0 до w - 1, поэтому img[h, w] на шаг выходит за картинку и вызывает IndexError. img[h - 1, w - 1] — последняя строка и последний столбец.",
    },
    wrongFix: [
      {
        en: "The order is img[y, x]: w - 1 = 119 used as a row number lies far below the last row 89, so it fails.",
        ru: "Порядок — img[y, x]: w - 1 = 119 в роли номера строки лежит далеко ниже последней строки 89, и чтение падает.",
      },
      {
        en: "The row is now right, but column w is still one past the last column.",
        ru: "Строка теперь правильная, но столбец w всё так же на один дальше последнего.",
      },
    ],
  },
  {
    id: "b25",
    topic: "hsv-bgr",
    kind: "silent",
    lines: [
      "img = cv2.imread('vine_leaf.jpg')",
      "hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)",
      "# healthy green: hue from 100 to 140 degrees",
      "green = cv2.inRange(hsv, (100, 60, 60), (140, 255, 255))",
      "ratio = cv2.countNonZero(green) / green.size",
    ],
    bug: 3,
    fixes: [
      "green = cv2.inRange(hsv, (50, 60, 60), (70, 255, 255))",
      "green = cv2.inRange(hsv, (200, 60, 60), (280, 255, 255))",
      "green = cv2.inRange(hsv, (0.28, 0.24, 0.24), (0.39, 1.0, 1.0))",
    ],
    why: {
      en: "In 8-bit OpenCV, hue is stored as degrees / 2 in 0..179, so 100..140 here means 200–280 degrees — blue, not green — and the mask stays almost empty without an error. Halving the degrees gives 50..70, the green range.",
      ru: "В 8-битном OpenCV оттенок хранится как градусы / 2 в диапазоне 0..179, поэтому 100..140 здесь означает 200–280 градусов — синий, а не зелёный, и маска без ошибки остаётся почти пустой. Если поделить градусы пополам, получится 50..70 — зелёный диапазон.",
    },
    wrongFix: [
      {
        en: "Hue is halved, not doubled: values above 179 never occur, so nothing is selected.",
        ru: "Оттенок делят пополам, а не удваивают: значений больше 179 не бывает, и ничего не выбирается.",
      },
      {
        en: "8-bit HSV in OpenCV is not scaled to 0..1: H is 0..179 and S, V are 0..255, so these bounds select nothing green.",
        ru: "8-битный HSV в OpenCV не масштабирован в 0..1: H — 0..179, S и V — 0..255, поэтому такие границы не выбирают ничего зелёного.",
      },
    ],
  },
  {
    id: "b26",
    topic: "dtype",
    kind: "silent",
    lines: [
      "prev = cv2.imread('parking_cam2_0800.jpg', cv2.IMREAD_GRAYSCALE)",
      "curr = cv2.imread('parking_cam2_0805.jpg', cv2.IMREAD_GRAYSCALE)",
      "diff = curr - prev",
      "ret, moved = cv2.threshold(diff, 40, 255, cv2.THRESH_BINARY)",
    ],
    bug: 2,
    fixes: ["diff = cv2.absdiff(curr, prev)", "diff = cv2.subtract(curr, prev)", "diff = abs(curr - prev)"],
    why: {
      en: "curr and prev are uint8, so a pixel that got 3 levels darker gives 253 instead of -3 and is flagged as motion — no error. cv2.absdiff computes |curr - prev| without wrapping around.",
      ru: "curr и prev имеют тип uint8, поэтому пиксель, потемневший на 3 уровня, даёт 253 вместо -3 и отмечается как движение — без ошибки. cv2.absdiff считает |curr - prev| без переполнения.",
    },
    wrongFix: [
      {
        en: "cv2.subtract saturates negative results to 0, so a dark car arriving on a bright spot is missed.",
        ru: "cv2.subtract обрезает отрицательные результаты до 0, и тёмная машина, заехавшая на светлое место, пропускается.",
      },
      {
        en: "The subtraction has already wrapped around in uint8, so abs gets 253, not 3, and changes nothing.",
        ru: "Вычитание в uint8 уже переполнилось: abs получает 253, а не 3, и ничего не меняет.",
      },
    ],
  },
  {
    id: "b27",
    topic: "otsu-color",
    kind: "crash",
    lines: [
      "img = cv2.imread('fruit_tray.jpg')",
      "hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)",
      "# colourful fruit on a gray tray: Otsu on the saturation channel",
      "ret, mask = cv2.threshold(hsv, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
    ],
    bug: 3,
    fixes: [
      "ret, mask = cv2.threshold(hsv[:, :, 1], 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
      "ret, mask = cv2.threshold(hsv[:, :, 0], 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
      "ret, mask = cv2.threshold(hsv, 0, 255, cv2.THRESH_BINARY)",
    ],
    why: {
      en: "hsv still has three channels, and Otsu works only on a single-channel 8-bit image, so the call fails. hsv[:, :, 1] is the saturation channel: high on the fruit, near 0 on the gray tray.",
      ru: "У hsv по-прежнему три канала, а Otsu работает только с одноканальным 8-битным изображением, поэтому вызов падает. hsv[:, :, 1] — канал насыщенности: высокий на фруктах и около 0 на сером подносе.",
    },
    wrongFix: [
      {
        en: "Channel 0 is hue, which says which colour a pixel is, not how colourful it is, so red fruit (hue near 0) is not separated from the tray.",
        ru: "Канал 0 — оттенок: он говорит, какой это цвет, а не насколько он насыщен, поэтому красные фрукты (оттенок около 0) не отделяются от подноса.",
      },
      {
        en: "Without Otsu it runs, but the fixed threshold 0 is applied to H, S and V separately and gives a 3-channel image, not a mask.",
        ru: "Без Otsu код работает, но фиксированный порог 0 применяется к H, S и V по отдельности и даёт трёхканальную картинку, а не маску.",
      },
    ],
  },
  {
    id: "b28",
    topic: "sigma",
    kind: "crash",
    lines: [
      "img = cv2.imread('moon.png', cv2.IMREAD_GRAYSCALE)",
      "# unsharp mask: blur with sigma = 2, then subtract part of the blur",
      "blur = cv2.GaussianBlur(img, (0, 0), sigma=2)",
      "sharp = cv2.addWeighted(img, 1.5, blur, -0.5, 0)",
    ],
    bug: 2,
    fixes: [
      "blur = cv2.GaussianBlur(img, (0, 0), sigmaX=2)",
      "blur = cv2.GaussianBlur(img, (0, 0), sigmaY=2)",
      "blur = cv2.GaussianBlur(img, (0, 0), 0)",
    ],
    why: {
      en: "GaussianBlur has no argument called sigma — the parameter is sigmaX — so the call fails. With ksize (0, 0) and sigmaX = 2, OpenCV computes the kernel size from sigma.",
      ru: "У GaussianBlur нет аргумента sigma — параметр называется sigmaX, — поэтому вызов падает. При ksize (0, 0) и sigmaX = 2 OpenCV вычисляет размер ядра по sigma.",
    },
    wrongFix: [
      {
        en: "sigmaY only sets the vertical sigma and does not replace the required sigmaX, so the call still fails.",
        ru: "sigmaY задаёт только вертикальную sigma и не заменяет обязательный sigmaX, поэтому вызов всё так же падает.",
      },
      {
        en: "With a (0, 0) kernel and sigmaX = 0 there is nothing to compute the size from, so OpenCV rejects the kernel.",
        ru: "При ядре (0, 0) и sigmaX = 0 размер не из чего вычислить, и OpenCV отклоняет ядро.",
      },
    ],
  },
  {
    id: "b29",
    topic: "imshow-bgr",
    kind: "silent",
    lines: [
      "img = cv2.imread('parrot.jpg')",
      "# zoom into the head: rows 40..120, columns 60..160",
      "head = img[40:120, 60:160]",
      "big = cv2.resize(head, (300, 240))",
      "plt.imshow(big)",
    ],
    bug: 4,
    fixes: [
      "plt.imshow(cv2.cvtColor(big, cv2.COLOR_BGR2RGB))",
      "plt.imshow(big, cmap='gray')",
      "plt.imshow(cv2.cvtColor(big, cv2.COLOR_BGR2HSV))",
    ],
    why: {
      en: "big is still a BGR array from OpenCV, but matplotlib reads channel 0 as red, so the red feathers are shown blue — no error. COLOR_BGR2RGB reorders the channels for matplotlib.",
      ru: "big — по-прежнему массив BGR из OpenCV, а matplotlib считает канал 0 красным, поэтому красные перья показываются синими — без ошибки. COLOR_BGR2RGB переставляет каналы для matplotlib.",
    },
    wrongFix: [
      {
        en: "cmap is ignored for a 3-channel image, so the colours are still swapped.",
        ru: "Для трёхканальной картинки cmap игнорируется, и цвета всё так же перепутаны.",
      },
      {
        en: "HSV values are hue, saturation and value, so matplotlib draws them as meaningless false colours.",
        ru: "Значения HSV — это оттенок, насыщенность и яркость, и matplotlib рисует их бессмысленными ложными цветами.",
      },
    ],
  },
  {
    id: "b30",
    topic: "equalize-color",
    kind: "crash",
    lines: [
      "img = cv2.imread('night_street.jpg')",
      "hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)",
      "h, s, v = cv2.split(hsv)",
      "v = cv2.equalizeHist(hsv)",
      "out = cv2.cvtColor(cv2.merge((h, s, v)), cv2.COLOR_HSV2BGR)",
    ],
    bug: 3,
    fixes: ["v = cv2.equalizeHist(v)", "h = cv2.equalizeHist(h)", "v = cv2.equalizeHist(s)"],
    why: {
      en: "equalizeHist needs one 8-bit channel, and hsv has three, so the call fails. Equalizing only v brightens the street while hue and saturation — the colours — stay the same.",
      ru: "equalizeHist нужен один 8-битный канал, а у hsv их три, поэтому вызов падает. Если выравнивать только v, улица становится светлее, а оттенок и насыщенность — то есть цвета — не меняются.",
    },
    wrongFix: [
      {
        en: "Equalizing hue stretches the colour wheel, so the colours shift while the brightness stays dark.",
        ru: "Выравнивание оттенка растягивает цветовой круг: цвета сдвигаются, а яркость остаётся тёмной.",
      },
      {
        en: "This replaces the brightness with the equalized saturation, so the picture no longer matches the scene.",
        ru: "Так яркость заменяется выровненной насыщенностью, и картинка перестаёт соответствовать сцене.",
      },
    ],
  },
  {
    id: "b31",
    topic: "crop-order",
    kind: "crash",
    lines: [
      "img = cv2.imread('cctv_frame.jpg')       # 320 wide, 240 high",
      "x, y, w, h = 250, 40, 60, 150            # door box: x, y, width, height",
      "door = img[x:x + w, y:y + h]",
      "gray = cv2.cvtColor(door, cv2.COLOR_BGR2GRAY)",
    ],
    bug: 2,
    fixes: ["door = img[y:y + h, x:x + w]", "door = img[y:y + w, x:x + h]", "door = img[y:h, x:w]"],
    why: {
      en: "Rows come first: img[x:x + w, ...] asks for rows 250..310 of a frame only 240 rows high, so the crop is empty and cvtColor fails. img[y:y + h, x:x + w] cuts h rows starting at y and w columns starting at x.",
      ru: "Сначала идут строки: img[x:x + w, ...] просит строки 250..310 у кадра высотой всего 240 строк, вырезка пустая, и cvtColor падает. img[y:y + h, x:x + w] вырезает h строк от y и w столбцов от x.",
    },
    wrongFix: [
      {
        en: "The axes are right, but width and height are swapped: rows need h and columns need w, so the box has the wrong shape.",
        ru: "Оси правильные, но ширина и высота перепутаны: строкам нужен h, столбцам — w, и рамка получается не той формы.",
      },
      {
        en: "w and h are sizes, not end coordinates: x:w is 250:60, an empty range, so the crop is empty again.",
        ru: "w и h — размеры, а не конечные координаты: x:w — это 250:60, пустой диапазон, и вырезка снова пустая.",
      },
    ],
  },
  {
    id: "b32",
    topic: "gray-twice",
    kind: "crash",
    lines: [
      "img = cv2.imread('road_lane.jpg')",
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "blur = cv2.medianBlur(gray, 5)",
      "edges = cv2.Canny(cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY), 80, 160)",
    ],
    bug: 3,
    fixes: [
      "edges = cv2.Canny(blur, 80, 160)",
      "edges = cv2.Canny(cv2.cvtColor(blur, cv2.COLOR_RGB2GRAY), 80, 160)",
      "edges = cv2.Canny(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 80, 160)",
    ],
    why: {
      en: "blur comes from gray, so it already has one channel, and a second COLOR_BGR2GRAY fails because it needs three. Canny can take blur directly.",
      ru: "blur получен из gray, поэтому в нём уже один канал, и второй COLOR_BGR2GRAY падает: ему нужно три. Canny может взять blur напрямую.",
    },
    wrongFix: [
      {
        en: "RGB2GRAY also expects three channels and fails the same way.",
        ru: "RGB2GRAY тоже ждёт три канала и падает так же.",
      },
      {
        en: "It runs, but Canny gets the unfiltered gray image: the median blur is skipped and the noise dots turn into edges.",
        ru: "Код работает, но Canny получает нефильтрованную серую картинку: медианный фильтр пропущен, и точки шума превращаются в края.",
      },
    ],
  },
  {
    id: "b33",
    topic: "bgr",
    kind: "silent",
    lines: [
      "img = cv2.imread('bird.jpg')",
      "small = cv2.resize(img, (150, 100))",
      "rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)",
      "plt.imshow(rgb)",
      "cv2.imwrite('bird_small.jpg', rgb)",
    ],
    bug: 4,
    fixes: [
      "cv2.imwrite('bird_small.jpg', small)",
      "cv2.imwrite('bird_small.png', rgb)",
      "cv2.imwrite('bird_small.jpg', cv2.cvtColor(small, cv2.COLOR_BGR2RGB))",
    ],
    why: {
      en: "cv2.imwrite expects B, G, R order, like the rest of OpenCV, so saving the RGB array swaps red and blue in the file — no error. small is still BGR and is saved with its true colours.",
      ru: "cv2.imwrite, как и весь OpenCV, ждёт порядок B, G, R, поэтому сохранение массива RGB меняет местами красный и синий в файле — без ошибки. small по-прежнему в BGR и сохраняется с настоящими цветами.",
    },
    wrongFix: [
      {
        en: "The file format does not reorder channels: the PNG gets the same swapped colours.",
        ru: "Формат файла не переставляет каналы: PNG получит те же перепутанные цвета.",
      },
      {
        en: "This converts small to RGB once more, so the saved array is RGB again and the colours are still swapped.",
        ru: "Это снова переводит small в RGB: сохраняется опять массив RGB, и цвета всё так же перепутаны.",
      },
    ],
  },
  {
    id: "b34",
    topic: "median-kernel",
    kind: "crash",
    lines: [
      "img = cv2.imread('sensor_frame.png')",
      "blur = cv2.medianBlur(img, (3, 3))",
      "gray = cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY)",
    ],
    bug: 1,
    fixes: ["blur = cv2.medianBlur(img, 3)", "blur = cv2.medianBlur(img, 2)", "blur = cv2.medianBlur(img, [3, 3])"],
    why: {
      en: "medianBlur takes the aperture as one odd integer, not a (w, h) tuple like GaussianBlur, so the tuple is a bad argument. medianBlur(img, 3) uses a 3 × 3 window.",
      ru: "medianBlur принимает размер окна одним нечётным целым числом, а не кортежем (w, h), как GaussianBlur, поэтому кортеж — неверный аргумент. medianBlur(img, 3) берёт окно 3 × 3.",
    },
    wrongFix: [
      {
        en: "2 is an integer but even, so the window has no centre and the assertion fails.",
        ru: "2 — целое, но чётное: у окна нет центра, и проверка не проходит.",
      },
      {
        en: "A list is still a pair of numbers, not one integer, so it is rejected like the tuple.",
        ru: "Список — всё та же пара чисел, а не одно целое, и его отклоняют так же, как кортеж.",
      },
    ],
  },
  {
    id: "b35",
    topic: "canny-color",
    kind: "crash",
    lines: [
      "img = cv2.imread('fruit_stall.jpg')",
      "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
      "edges = cv2.Canny(gray, 100, 200)",
      "# the average hue of the fruit is a colour feature",
      "hsv = cv2.cvtColor(edges, cv2.COLOR_BGR2HSV)",
      "mean_hue = hsv[:, :, 0].mean()",
    ],
    bug: 4,
    fixes: [
      "hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)",
      "hsv = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)",
      "hsv = cv2.cvtColor(cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR), cv2.COLOR_BGR2HSV)",
    ],
    why: {
      en: "Canny returns a single-channel map of 0 and 255 — the colour is gone — so BGR2HSV, which needs three channels, fails. The hue must come from the colour image img.",
      ru: "Canny возвращает одноканальную карту из 0 и 255 — цвета в ней уже нет, — поэтому BGR2HSV, которому нужно три канала, падает. Оттенок нужно брать из цветной картинки img.",
    },
    wrongFix: [
      {
        en: "GRAY2BGR only copies the edge map into three channels, so channel 0 holds edges, not hue.",
        ru: "GRAY2BGR только копирует карту краёв в три канала, и в канале 0 лежат края, а не оттенок.",
      },
      {
        en: "It runs, but the copied edge map is black and white, so every hue is 0 — the colour cannot be restored.",
        ru: "Код работает, но скопированная карта краёв чёрно-белая, и оттенок везде 0 — цвет не восстановить.",
      },
    ],
  },
  {
    id: "b36",
    topic: "resize-order",
    kind: "silent",
    lines: [
      "img = cv2.imread('passport.jpg')",
      "w, h = img.shape[:2]",
      "# thumbnail: a quarter of the width and a quarter of the height",
      "thumb = cv2.resize(img, (w // 4, h // 4))",
      "cv2.imwrite('passport_thumb.jpg', thumb)",
    ],
    bug: 1,
    fixes: ["h, w = img.shape[:2]", "w, h = img.shape[1:]", "h, w, c = img.shape[:2]"],
    why: {
      en: "img.shape starts with the height, (h, w, 3), so w, h = img.shape[:2] puts the height into w and the thumbnail gets swapped sides — no error. h, w = img.shape[:2] names them correctly, and then dsize (w // 4, h // 4) is right.",
      ru: "img.shape начинается с высоты, (h, w, 3), поэтому w, h = img.shape[:2] кладёт высоту в w, и у миниатюры стороны перепутаны — без ошибки. h, w = img.shape[:2] называет их правильно, и тогда dsize (w // 4, h // 4) верный.",
    },
    wrongFix: [
      {
        en: "img.shape[1:] is (width, channels), so h becomes 3 and the thumbnail height 3 // 4 = 0 — resize fails.",
        ru: "img.shape[1:] — это (ширина, каналы), поэтому h становится 3, высота миниатюры 3 // 4 = 0, и resize падает.",
      },
      {
        en: "img.shape[:2] holds only two numbers, so unpacking it into three names raises ValueError.",
        ru: "В img.shape[:2] только два числа, и распаковка в три имени вызывает ValueError.",
      },
    ],
  },
  {
    id: "b37",
    topic: "none-path",
    kind: "crash",
    lines: [
      "img = cv2.imread('data/cat_01.jpg')      # the folder holds cat_01.png, cat_02.png, ...",
      "img = cv2.resize(img, (224, 224))",
      "x = img / 255.0",
    ],
    bug: 0,
    fixes: [
      "img = cv2.imread('data/cat_01.png')",
      "img = cv2.imread('data/cat_01.jpg', cv2.IMREAD_UNCHANGED)",
      "img = cv2.imread('cat_01.png')",
    ],
    why: {
      en: "The files are PNGs, so data/cat_01.jpg does not exist; imread returns None without an error, and resize on the next line fails (!ssize.empty()). Reading data/cat_01.png fixes the cause.",
      ru: "Файлы в папке — PNG, поэтому data/cat_01.jpg не существует; imread без ошибки возвращает None, и resize строкой ниже падает (!ssize.empty()). Чтение data/cat_01.png устраняет причину.",
    },
    wrongFix: [
      {
        en: "A read flag cannot find a file that is not there: img is still None.",
        ru: "Флаг чтения не найдёт файл, которого нет: img всё так же None.",
      },
      {
        en: "Without the data/ folder the path points to the working directory, where there is no such file.",
        ru: "Без папки data/ путь указывает в рабочую папку, а там такого файла нет.",
      },
    ],
  },
  {
    id: "b38",
    topic: "threshold-type",
    kind: "crash",
    lines: [
      "gray = cv2.imread('coins.jpg', cv2.IMREAD_GRAYSCALE)",
      "blur = cv2.GaussianBlur(gray, (5, 5), 0)",
      "# let Otsu choose the threshold",
      "ret, mask = cv2.threshold(blur, 0, 255)",
    ],
    bug: 3,
    fixes: [
      "ret, mask = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)",
      "ret, mask = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY)",
      "ret, mask = cv2.threshold(blur, cv2.THRESH_OTSU, 255)",
    ],
    why: {
      en: "The type argument is missing, so cv2.threshold fails; a threshold of 0 only makes sense together with the THRESH_OTSU flag. THRESH_BINARY + THRESH_OTSU lets Otsu pick the threshold and returns it in ret.",
      ru: "Не указан тип, поэтому cv2.threshold падает; порог 0 имеет смысл только вместе с флагом THRESH_OTSU. THRESH_BINARY + THRESH_OTSU позволяет Otsu выбрать порог и возвращает его в ret.",
    },
    wrongFix: [
      {
        en: "It runs, but without Otsu the threshold really is 0, so nearly every pixel becomes white.",
        ru: "Код работает, но без Otsu порог действительно 0, и почти все пиксели становятся белыми.",
      },
      {
        en: "THRESH_OTSU is a type flag, not a threshold value; in the threshold position it does not help — the type is still missing.",
        ru: "THRESH_OTSU — флаг типа, а не значение порога; на месте порога он не помогает — типа всё так же нет.",
      },
    ],
  },
  {
    id: "b39",
    topic: "hsv-bgr",
    kind: "crash",
    lines: [
      "img = cv2.imread('traffic_light.jpg', cv2.IMREAD_GRAYSCALE)",
      "small = cv2.resize(img, (320, 240))",
      "hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)",
      "red = cv2.inRange(hsv, (0, 120, 120), (10, 255, 255))",
    ],
    bug: 0,
    fixes: [
      "img = cv2.imread('traffic_light.jpg')",
      "img = cv2.imread('traffic_light.jpg', 0)",
      "img = cv2.cvtColor(cv2.imread('traffic_light.jpg', cv2.IMREAD_GRAYSCALE), cv2.COLOR_GRAY2BGR)",
    ],
    why: {
      en: "The photo is read as grayscale, one channel, so BGR2HSV, which needs three channels, fails — and the colour of the lamp is lost already at reading. Reading in colour (IMREAD_COLOR, the default) keeps B, G, R for the HSV mask.",
      ru: "Фото читается в оттенках серого — один канал, поэтому BGR2HSV, которому нужно три канала, падает, а цвет сигнала теряется уже при чтении. Чтение в цвете (IMREAD_COLOR, по умолчанию) сохраняет B, G, R для маски в HSV.",
    },
    wrongFix: [
      {
        en: "The flag 0 is IMREAD_GRAYSCALE, not the default, so the image is gray again.",
        ru: "Флаг 0 — это IMREAD_GRAYSCALE, а не значение по умолчанию, и картинка снова серая.",
      },
      {
        en: "GRAY2BGR makes three equal channels, so HSV runs, but the saturation is 0 everywhere and the red lamp is never found.",
        ru: "GRAY2BGR делает три одинаковых канала: HSV работает, но насыщенность везде 0, и красный сигнал не находится.",
      },
    ],
  },
  {
    id: "b40",
    topic: "dtype",
    kind: "crash",
    lines: [
      "img = cv2.imread('bridge.jpg', cv2.IMREAD_GRAYSCALE)",
      "norm = img / 255.0                # input for the CNN branch, 0.0..1.0",
      "blur = cv2.GaussianBlur(img, (5, 5), 0)",
      "edges = cv2.Canny(norm, 50, 150)",
    ],
    bug: 3,
    fixes: [
      "edges = cv2.Canny(blur, 50, 150)",
      "edges = cv2.Canny(norm, 0.2, 0.6)",
      "edges = cv2.Canny(norm.astype('uint8'), 50, 150)",
    ],
    why: {
      en: "Canny accepts only 8-bit images, and norm is float64, so the call fails. blur is uint8 and already smoothed — exactly the input Canny expects.",
      ru: "Canny принимает только 8-битные изображения, а norm имеет тип float64, поэтому вызов падает. blur — uint8 и уже сглажен: именно такой вход ждёт Canny.",
    },
    wrongFix: [
      {
        en: "Smaller thresholds do not change the type: the input is still float64 and is rejected.",
        ru: "Меньшие пороги не меняют тип: вход всё так же float64, и его отклоняют.",
      },
      {
        en: "It runs, but casting [0, 1] floats to uint8 leaves only 0 and 1, so there are no gradients and no edges.",
        ru: "Код работает, но приведение чисел из [0, 1] к uint8 оставляет только 0 и 1 — нет перепадов, нет и краёв.",
      },
    ],
  },
];
