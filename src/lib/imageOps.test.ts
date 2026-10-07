import { describe, it, expect } from "vitest";
import {
  type Img,
  fromRGBA,
  toRGBA,
  shape,
  resize,
  bgr2gray,
  swapRB,
  bgr2hsv,
  channel,
  getGaussianKernel,
  gaussianBlur,
  medianBlur,
  threshold,
  otsu,
  equalizeHist,
  canny,
} from "./imageOps";

// ── фабрики тестовых картинок ──

function gray(w: number, h: number, f: (x: number, y: number) => number): Img {
  const data = new Uint8ClampedArray(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) data[y * w + x] = f(x, y);
  return { width: w, height: h, channels: 1, data };
}

function color(w: number, h: number, f: (x: number, y: number) => [number, number, number]): Img {
  const data = new Uint8ClampedArray(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) data.set(f(x, y), (y * w + x) * 3);
  }
  return { width: w, height: h, channels: 3, data };
}

/** Один BGR-пиксель — удобно проверять цветовые формулы. */
function pixel(b: number, g: number, r: number): Img {
  return { width: 1, height: 1, channels: 3, data: new Uint8ClampedArray([b, g, r]) };
}

/** Детерминированный шум: тесты не должны мигать от запуска к запуску. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function countNonZero(img: Img): number {
  let n = 0;
  for (const v of img.data) if (v) n++;
  return n;
}

describe("форма и каналы как в NumPy", () => {
  const img = color(40, 30, (x, y) => [x, y, 0]);

  it("shape цветного — (h, w, 3), серого — (h, w)", () => {
    expect(shape(img)).toEqual([30, 40, 3]);
    expect(shape(bgr2gray(img))).toEqual([30, 40]);
    expect(shape(channel(img, 1))).toEqual([30, 40]);
  });

  it("resize принимает (width, height), а shape отвечает (height, width, c)", () => {
    // та самая ловушка: cv2.resize(img, (20, 10)).shape == (10, 20, 3)
    expect(shape(resize(img, 20, 10))).toEqual([10, 20, 3]);
    expect(shape(resize(bgr2gray(img), 20, 10, "area"))).toEqual([10, 20]);
    expect(shape(resize(img, 100, 7, "nearest"))).toEqual([7, 100, 3]);
  });

  it("linear-resize даёт ровно те числа, что cv2", () => {
    // cv2.resize(np.array([[0, 255]], np.uint8), (4, 1)) → [[0, 64, 191, 255]]
    const out = resize(gray(2, 1, (x) => (x ? 255 : 0)), 4, 1);
    expect(Array.from(out.data)).toEqual([0, 64, 191, 255]);
  });

  it("nearest при увеличении в 2 раза повторяет пиксели", () => {
    const out = resize(gray(2, 1, (x) => (x ? 200 : 10)), 4, 2, "nearest");
    expect(Array.from(out.data)).toEqual([10, 10, 200, 200, 10, 10, 200, 200]);
  });

  it("area при уменьшении в 2 раза усредняет блоки 2×2", () => {
    const src = gray(4, 2, (x, y) => [[0, 10, 100, 101], [20, 30, 102, 103]][y][x]);
    expect(Array.from(resize(src, 2, 1, "area").data)).toEqual([15, 102]);
  });

  it("пустой или дробный размер — ошибка, как !dsize.empty()", () => {
    expect(() => resize(img, 0, 10)).toThrow(/dsize/);
    expect(() => resize(img, 10.5, 10)).toThrow(/dsize/);
  });
});

describe("порядок каналов BGR", () => {
  it("чисто красный RGBA-пиксель становится data [0, 0, 255]", () => {
    const img = fromRGBA(new Uint8ClampedArray([255, 0, 0, 255]), 1, 1);
    expect(img.channels).toBe(3);
    expect(Array.from(img.data)).toEqual([0, 0, 255]);
  });

  it("альфа отбрасывается, а toRGBA по умолчанию возвращает исходные цвета", () => {
    const rgba = new Uint8ClampedArray([10, 20, 30, 0, 200, 100, 50, 128]);
    const img = fromRGBA(rgba, 2, 1);
    expect(Array.from(img.data)).toEqual([30, 20, 10, 50, 100, 200]);
    expect(Array.from(toRGBA(img))).toEqual([10, 20, 30, 255, 200, 100, 50, 255]);
  });

  it("asRGB показывает то, что нарисовал бы plt.imshow: R и B меняются местами", () => {
    const red = fromRGBA(new Uint8ClampedArray([255, 0, 0, 255]), 1, 1);
    expect(Array.from(toRGBA(red, { asRGB: true }))).toEqual([0, 0, 255, 255]); // красный стал синим
  });

  it("одноканальное рисуется серым", () => {
    expect(Array.from(toRGBA(gray(1, 1, () => 77)))).toEqual([77, 77, 77, 255]);
  });

  it("swapRB дважды — тождество; channel(2) — это красный", () => {
    const img = color(5, 4, (x, y) => [x * 10, y * 20, 200 + x]);
    const once = swapRB(img);
    expect(Array.from(once.data.slice(0, 3))).toEqual([200, 0, 0]);
    expect(Array.from(swapRB(once).data)).toEqual(Array.from(img.data));
    expect(Array.from(channel(img, 2).data.slice(0, 5))).toEqual([200, 201, 202, 203, 204]);
  });

  it("цветовые преобразования требуют 3 канала, channel — существующий индекс", () => {
    const g = gray(2, 2, () => 0);
    expect(() => swapRB(g)).toThrow(/channels/);
    expect(() => bgr2gray(g)).toThrow(/channels/);
    expect(() => bgr2hsv(g)).toThrow(/channels/);
    expect(() => channel(g, 1)).toThrow(/out of bounds/);
  });
});

describe("cvtColor", () => {
  it("серый: красный 76, зелёный 150, синий 29 — как у cv2", () => {
    expect(bgr2gray(pixel(0, 0, 255)).data[0]).toBe(76);
    expect(bgr2gray(pixel(0, 255, 0)).data[0]).toBe(150);
    expect(bgr2gray(pixel(255, 0, 0)).data[0]).toBe(29);
    expect(bgr2gray(pixel(255, 255, 255)).data[0]).toBe(255);
  });

  it("HSV в 8-битных диапазонах OpenCV: H 0..179", () => {
    expect(Array.from(bgr2hsv(pixel(0, 0, 255)).data)).toEqual([0, 255, 255]); // красный
    expect(Array.from(bgr2hsv(pixel(0, 255, 0)).data)).toEqual([60, 255, 255]); // зелёный
    expect(Array.from(bgr2hsv(pixel(255, 0, 0)).data)).toEqual([120, 255, 255]); // синий
    expect(Array.from(bgr2hsv(pixel(128, 128, 128)).data)).toEqual([0, 0, 128]); // серый: без оттенка
  });

  it("оттенок не выходит за 179 даже у «почти красного» с синевой", () => {
    const hsv = bgr2hsv(color(256, 1, (x) => [x, 0, 255]));
    for (let i = 0; i < hsv.data.length; i += 3) expect(hsv.data[i]).toBeLessThanOrEqual(179);
  });
});

describe("GaussianBlur", () => {
  it("ядро нормировано: сумма 1, симметрично", () => {
    for (const [k, s] of [[1, 0], [3, 0], [5, 0], [7, 0], [9, 0], [15, 0], [5, 1], [7, 1.5], [31, 5]]) {
      const kern = getGaussianKernel(k, s);
      expect(kern).toHaveLength(k);
      expect(kern.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
      expect(kern).toEqual([...kern].reverse());
    }
    // для ksize 5 и sigma 0 OpenCV берёт биномиальное 1-4-6-4-1
    expect(getGaussianKernel(5).map((v) => v * 16)).toEqual([1, 4, 6, 4, 1]);
  });

  it("постоянная картинка остаётся постоянной (1 и 3 канала, у краёв тоже)", () => {
    for (const ksize of [3, 5, 7, 15]) {
      for (const sigma of [0, 2.5]) {
        const g = gaussianBlur(gray(13, 9, () => 137), ksize, sigma);
        expect(g.data.every((v) => v === 137)).toBe(true);
        const c = gaussianBlur(color(13, 9, () => [10, 128, 250]), ksize, sigma);
        expect(Array.from(new Set(c.data))).toEqual([10, 128, 250]);
      }
    }
  });

  it("точечный импульс превращается в само ядро 3×3", () => {
    const out = gaussianBlur(gray(5, 5, (x, y) => (x === 2 && y === 2 ? 255 : 0)), 3);
    const center = [1, 2, 3].map((y) => [1, 2, 3].map((x) => out.data[y * 5 + x]));
    // 255 × [1 2 1]ᵀ[1 2 1] / 16
    expect(center).toEqual([
      [16, 32, 16],
      [32, 64, 32],
      [16, 32, 16],
    ]);
  });

  it("каналы цветного размываются независимо", () => {
    const r = rng(7);
    const img = color(17, 11, () => [r() * 256, r() * 256, r() * 256]);
    const blurred = gaussianBlur(img, 5);
    for (const c of [0, 1, 2] as const) {
      expect(Array.from(channel(blurred, c).data)).toEqual(Array.from(gaussianBlur(channel(img, c), 5).data));
    }
  });

  it("чётный, нулевой и отрицательный ksize — ошибка с понятным текстом", () => {
    const img = gray(8, 8, () => 0);
    expect(() => gaussianBlur(img, 4)).toThrow(/ksize\.width % 2 == 1/);
    expect(() => gaussianBlur(img, 0)).toThrow(/odd and positive/);
    expect(() => gaussianBlur(img, -3)).toThrow(/ksize/);
  });

  it("крошечные картинки не ломают отражение границ", () => {
    expect(gaussianBlur(gray(1, 1, () => 99), 7).data[0]).toBe(99);
    expect(shape(gaussianBlur(color(2, 3, () => [1, 2, 3]), 31, 5))).toEqual([3, 2, 3]);
  });
});

describe("medianBlur", () => {
  it("убирает шум «соль-перец», не размывая фон", () => {
    const noisy = gray(20, 20, (x, y) => ((x * 7 + y * 3) % 23 === 0 ? (x % 2 ? 255 : 0) : 100));
    expect(countNonZero(threshold(noisy, 100))).toBeGreaterThan(0);
    const clean = medianBlur(noisy, 3);
    expect(clean.data.every((v) => v === 100)).toBe(true);
  });

  it("ksize должен быть нечётным и больше 1", () => {
    const img = gray(8, 8, () => 0);
    expect(() => medianBlur(img, 4)).toThrow(/ksize/);
    expect(() => medianBlur(img, 1)).toThrow(/greater than 1/);
  });
});

describe("threshold и Otsu", () => {
  // два «холма»: тёмный фон около 50 и светлый объект около 200
  const r = rng(42);
  const bimodal = gray(64, 64, (x) => (x < 32 ? 50 : 200) + Math.round((r() - 0.5) * 30));

  it("Otsu находит порог между холмами", () => {
    const t = otsu(bimodal);
    // холмы 35..65 и 185..215; по всему зазору дисперсия одинакова, и OpenCV
    // берёт первый максимум — верх тёмного холма (THRESH_BINARY — строго «>»)
    expect(t).toBeGreaterThanOrEqual(65);
    expect(t).toBeLessThan(185);
    const bin = threshold(bimodal, t);
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) expect(bin.data[y * 64 + x]).toBe(x < 32 ? 0 : 255);
    }
  });

  it("THRESH_BINARY — строго больше порога; maxval задаёт цвет", () => {
    const img = gray(3, 1, (x) => [100, 101, 255][x]);
    expect(Array.from(threshold(img, 100).data)).toEqual([0, 255, 255]);
    expect(Array.from(threshold(img, 100, 1).data)).toEqual([0, 1, 1]);
  });

  it("на цветном — ошибка с подсказкой про cvtColor", () => {
    const c = color(2, 2, () => [0, 0, 0]);
    expect(() => threshold(c, 10)).toThrow(/COLOR_BGR2GRAY/);
    expect(() => otsu(c)).toThrow(/1-channel/);
  });
});

describe("equalizeHist", () => {
  it("растягивает узкую гистограмму на весь диапазон, сохраняя порядок", () => {
    const narrow = gray(32, 32, (x, y) => 100 + ((x + y * 32) % 21)); // только 100..120
    const eq = equalizeHist(narrow);
    expect(Math.min(...eq.data)).toBe(0);
    expect(Math.max(...eq.data)).toBe(255);
    const lut = new Map<number, number>();
    narrow.data.forEach((v, i) => lut.set(v, eq.data[i]));
    const levels = [...lut.keys()].sort((a, b) => a - b).map((v) => lut.get(v)!);
    for (let i = 1; i < levels.length; i++) expect(levels[i]).toBeGreaterThan(levels[i - 1]);
  });

  it("однотонная картинка не меняется; цветная — ошибка", () => {
    expect(equalizeHist(gray(4, 4, () => 77)).data.every((v) => v === 77)).toBe(true);
    expect(() => equalizeHist(color(2, 2, () => [0, 0, 0]))).toThrow(/1-channel/);
  });
});

describe("Canny", () => {
  // квадрат 16×16 (x, y ∈ 8..23) на чёрном фоне
  const W = 32;
  const square = gray(W, W, (x, y) => (x >= 8 && x < 24 && y >= 8 && y < 24 ? 200 : 0));
  const edges = canny(square, 50, 150);
  const at = (img: Img, x: number, y: number) => img.data[y * img.width + x];

  it("на выходе только 0 и 255, по одному каналу", () => {
    expect(edges.channels).toBe(1);
    expect(edges.data.every((v) => v === 0 || v === 255)).toBe(true);
  });

  it("контур квадрата замкнут: заливка изнутри не вытекает наружу", () => {
    const seen = new Uint8Array(W * W);
    const stack = [16 * W + 16];
    seen[stack[0]] = 1;
    let escaped = false;
    while (stack.length) {
      const p = stack.pop()!;
      const x = p % W;
      const y = (p / W) | 0;
      if (x === 0 || y === 0 || x === W - 1 || y === W - 1) escaped = true;
      // 4-связная заливка: через диагональный стык 8-связной линии не пролезть
      for (const q of [p - 1, p + 1, p - W, p + W]) {
        if (!seen[q] && !edges.data[q]) {
          seen[q] = 1;
          stack.push(q);
        }
      }
    }
    expect(escaped).toBe(false);
  });

  it("линия толщиной в один пиксель и ровно по периметру", () => {
    for (let y = 0; y < W - 1; y++) {
      for (let x = 0; x < W - 1; x++) {
        const block = at(edges, x, y) && at(edges, x + 1, y) && at(edges, x, y + 1) && at(edges, x + 1, y + 1);
        expect(block).toBeFalsy();
      }
    }
    // 4 × 16 − 4 угла: столько же, сколько пикселей у границы квадрата
    expect(countNonZero(edges)).toBe(60);
  });

  it("ни одного края внутри и снаружи — только у границы", () => {
    for (let y = 0; y < W; y++) {
      for (let x = 0; x < W; x++) {
        if (!at(edges, x, y)) continue;
        let touchesBoundary = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (at(square, x + dx, y + dy) !== at(square, x, y)) touchesBoundary = true;
          }
        }
        expect(touchesBoundary).toBe(true);
      }
    }
    // как у OpenCV: верхний край ложится снаружи квадрата (y=7), нижний — внутри (y=23)
    expect(at(edges, 15, 7)).toBe(255);
    expect(at(edges, 15, 23)).toBe(255);
    expect(at(edges, 15, 24)).toBe(0);
  });

  it("размытие перед Canny гасит шумовые края", () => {
    const r = rng(1);
    const noisy = gray(64, 64, (x, y) => {
      const base = x >= 16 && x < 48 && y >= 16 && y < 48 ? 170 : 60;
      return base + (r() - 0.5) * 90;
    });
    const raw = countNonZero(canny(noisy, 50, 150));
    const smooth = countNonZero(canny(gaussianBlur(noisy, 5), 50, 150));
    expect(smooth).toBeGreaterThan(0);
    expect(smooth).toBeLessThan(raw);
  });

  it("перепутанные пороги меняются местами, цветное — ошибка", () => {
    expect(Array.from(canny(square, 150, 50).data)).toEqual(Array.from(edges.data));
    expect(() => canny(color(4, 4, () => [0, 0, 0]), 50, 150)).toThrow(/1-channel/);
  });
});

describe("скорость", () => {
  it("640×480: GaussianBlur(7) + Canny заметно быстрее 150 мс", () => {
    const r = rng(3);
    const img = gray(640, 480, (x, y) => ((x >> 5) + (y >> 5)) % 2 ? 180 : 60 + r() * 40);
    const t0 = performance.now();
    const edges = canny(gaussianBlur(img, 7), 50, 150);
    const ms = performance.now() - t0;
    expect(countNonZero(edges)).toBeGreaterThan(0);
    // холодный прогон, вместе с JIT; на ноутбуке ~20 мс, граница с большим запасом
    expect(ms).toBeLessThan(150);
  });
});
