import type { Text } from "../types";

/** Авторские упражнения по массивам изображений и API из Lecture 1. */
export interface BugSnippet {
  id: string;
  sourcePart: string;
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
    "id": "lecture-code-1",
    "sourcePart": "cv-l1-p1",
    "topic": "bgr",
    "kind": "silent",
    "lines": [
      "image = np.zeros((24, 40, 3), dtype=np.uint8)",
      "image[:, :, 2] = 255",
      "blue = image[:, :, 2]"
    ],
    "bug": 2,
    "fixes": [
      "blue = image[:, :, 0]",
      "blue = image[:, :, 1]",
      "blue = image[0, :, :]"
    ],
    "why": {
      "en": "The array uses BGR order. Blue is channel 0; channel 2 is red.",
      "ru": "В BGR синий канал имеет индекс 0, зелёный — 1, красный — 2."
    },
    "wrongFix": [
      {
        "en": "Channel 1 is green.",
        "ru": "Канал 1 — зелёный."
      },
      {
        "en": "This selects the first row, not a colour channel.",
        "ru": "Это первая строка изображения, а не цветовой канал."
      }
    ]
  },
  {
    "id": "lecture-code-2",
    "sourcePart": "cv-l1-p1",
    "topic": "index",
    "kind": "silent",
    "lines": [
      "image = np.zeros((24, 40, 3), dtype=np.uint8)",
      "# Count pixels, excluding colour channels",
      "pixels = image.size"
    ],
    "bug": 2,
    "fixes": [
      "pixels = image.shape[0] * image.shape[1]",
      "pixels = image.shape[0] + image.shape[1]",
      "pixels = image.shape[2]"
    ],
    "why": {
      "en": "Pixel count is height times width. size also counts each colour channel.",
      "ru": "Количество пикселей — высота × ширина. size считает ещё и каждый цветовой канал."
    },
    "wrongFix": [
      {
        "en": "Adding the dimensions does not count the grid cells.",
        "ru": "Сумма размеров не равна числу ячеек сетки."
      },
      {
        "en": "The last dimension counts colour channels only.",
        "ru": "Последняя размерность — только количество цветовых каналов."
      }
    ]
  },
  {
    "id": "lecture-code-3",
    "sourcePart": "cv-l1-p1",
    "topic": "index",
    "kind": "silent",
    "lines": [
      "image = np.arange(960, dtype=np.uint16).reshape(24, 40)",
      "# Read column x=7, row y=3",
      "pixel = image[7, 3]"
    ],
    "bug": 2,
    "fixes": [
      "pixel = image[3, 7]",
      "pixel = image[3, :]",
      "pixel = image[:, 7]"
    ],
    "why": {
      "en": "An image is indexed by row then column: image[y, x].",
      "ru": "Индексация идёт по строке и столбцу: image[y, x]. Здесь y=3, x=7."
    },
    "wrongFix": [
      {
        "en": "This returns a complete row.",
        "ru": "Это целая строка, а не один пиксель."
      },
      {
        "en": "This returns a complete column.",
        "ru": "Это целый столбец, а не один пиксель."
      }
    ]
  },
  {
    "id": "lecture-code-4",
    "sourcePart": "cv-l1-p1",
    "topic": "none-path",
    "kind": "silent",
    "lines": [
      "image = cv2.imread('missing_24.png')",
      "# Report whether loading succeeded",
      "loaded = image is not False"
    ],
    "bug": 2,
    "fixes": [
      "loaded = image is not None",
      "loaded = image is True",
      "loaded = image is None"
    ],
    "why": {
      "en": "imread returns None when loading fails. Comparing to False does not detect None.",
      "ru": "При неудачном чтении imread возвращает None. Проверка is not False ошибочно сообщит об успехе."
    },
    "wrongFix": [
      {
        "en": "An image array is not the singleton True.",
        "ru": "Массив изображения не является объектом True."
      },
      {
        "en": "This is true on failure, reversing the requested result.",
        "ru": "Эта проверка истинна при ошибке, а требуется успешная загрузка."
      }
    ]
  },
  {
    "id": "lecture-code-5",
    "sourcePart": "cv-l1-p1",
    "topic": "index",
    "kind": "silent",
    "lines": [
      "image = np.zeros((24, 40, 3), dtype=np.uint8)",
      "# Report image height",
      "height = image.shape[1]"
    ],
    "bug": 2,
    "fixes": [
      "height = image.shape[0]",
      "height = image.shape[2]",
      "height = image.size"
    ],
    "why": {
      "en": "Height is the first dimension of an image array.",
      "ru": "Высота — первая размерность shape[0]. Затем идут ширина и количество каналов."
    },
    "wrongFix": [
      {
        "en": "The third dimension is the number of channels.",
        "ru": "Третья размерность — количество каналов."
      },
      {
        "en": "size counts all scalar elements, not rows.",
        "ru": "size считает все элементы массива, а не строки."
      }
    ]
  },
  {
    "id": "lecture-code-6",
    "sourcePart": "cv-l1-p1",
    "topic": "bgr",
    "kind": "silent",
    "lines": [
      "image = np.zeros((36, 60, 3), dtype=np.uint8)",
      "image[:, :, 2] = 255",
      "blue = image[:, :, 2]"
    ],
    "bug": 2,
    "fixes": [
      "blue = image[:, :, 0]",
      "blue = image[:, :, 1]",
      "blue = image[0, :, :]"
    ],
    "why": {
      "en": "The array uses BGR order. Blue is channel 0; channel 2 is red.",
      "ru": "В BGR синий канал имеет индекс 0, зелёный — 1, красный — 2."
    },
    "wrongFix": [
      {
        "en": "Channel 1 is green.",
        "ru": "Канал 1 — зелёный."
      },
      {
        "en": "This selects the first row, not a colour channel.",
        "ru": "Это первая строка изображения, а не цветовой канал."
      }
    ]
  },
  {
    "id": "lecture-code-7",
    "sourcePart": "cv-l1-p1",
    "topic": "index",
    "kind": "silent",
    "lines": [
      "image = np.zeros((36, 60, 3), dtype=np.uint8)",
      "# Count pixels, excluding colour channels",
      "pixels = image.size"
    ],
    "bug": 2,
    "fixes": [
      "pixels = image.shape[0] * image.shape[1]",
      "pixels = image.shape[0] + image.shape[1]",
      "pixels = image.shape[2]"
    ],
    "why": {
      "en": "Pixel count is height times width. size also counts each colour channel.",
      "ru": "Количество пикселей — высота × ширина. size считает ещё и каждый цветовой канал."
    },
    "wrongFix": [
      {
        "en": "Adding the dimensions does not count the grid cells.",
        "ru": "Сумма размеров не равна числу ячеек сетки."
      },
      {
        "en": "The last dimension counts colour channels only.",
        "ru": "Последняя размерность — только количество цветовых каналов."
      }
    ]
  },
  {
    "id": "lecture-code-8",
    "sourcePart": "cv-l1-p1",
    "topic": "index",
    "kind": "silent",
    "lines": [
      "image = np.arange(2160, dtype=np.uint16).reshape(36, 60)",
      "# Read column x=7, row y=3",
      "pixel = image[7, 3]"
    ],
    "bug": 2,
    "fixes": [
      "pixel = image[3, 7]",
      "pixel = image[3, :]",
      "pixel = image[:, 7]"
    ],
    "why": {
      "en": "An image is indexed by row then column: image[y, x].",
      "ru": "Индексация идёт по строке и столбцу: image[y, x]. Здесь y=3, x=7."
    },
    "wrongFix": [
      {
        "en": "This returns a complete row.",
        "ru": "Это целая строка, а не один пиксель."
      },
      {
        "en": "This returns a complete column.",
        "ru": "Это целый столбец, а не один пиксель."
      }
    ]
  },
  {
    "id": "lecture-code-9",
    "sourcePart": "cv-l1-p1",
    "topic": "none-path",
    "kind": "silent",
    "lines": [
      "image = cv2.imread('missing_36.png')",
      "# Report whether loading succeeded",
      "loaded = image is not False"
    ],
    "bug": 2,
    "fixes": [
      "loaded = image is not None",
      "loaded = image is True",
      "loaded = image is None"
    ],
    "why": {
      "en": "imread returns None when loading fails. Comparing to False does not detect None.",
      "ru": "При неудачном чтении imread возвращает None. Проверка is not False ошибочно сообщит об успехе."
    },
    "wrongFix": [
      {
        "en": "An image array is not the singleton True.",
        "ru": "Массив изображения не является объектом True."
      },
      {
        "en": "This is true on failure, reversing the requested result.",
        "ru": "Эта проверка истинна при ошибке, а требуется успешная загрузка."
      }
    ]
  },
  {
    "id": "lecture-code-10",
    "sourcePart": "cv-l1-p1",
    "topic": "index",
    "kind": "silent",
    "lines": [
      "image = np.zeros((36, 60, 3), dtype=np.uint8)",
      "# Report image height",
      "height = image.shape[1]"
    ],
    "bug": 2,
    "fixes": [
      "height = image.shape[0]",
      "height = image.shape[2]",
      "height = image.size"
    ],
    "why": {
      "en": "Height is the first dimension of an image array.",
      "ru": "Высота — первая размерность shape[0]. Затем идут ширина и количество каналов."
    },
    "wrongFix": [
      {
        "en": "The third dimension is the number of channels.",
        "ru": "Третья размерность — количество каналов."
      },
      {
        "en": "size counts all scalar elements, not rows.",
        "ru": "size считает все элементы массива, а не строки."
      }
    ]
  }
];
