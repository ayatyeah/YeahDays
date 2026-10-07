/**
 * Мини-OpenCV для песочницы «OpenCV в браузере».
 *
 * Почему своё, а не opencv.js: тот тянет ~8 МБ wasm, а студенту нужен десяток
 * функций. Здесь чистый TypeScript без зависимостей, работает прямо на
 * пикселях canvas.
 *
 * Главное требование — вести себя как настоящий cv2, вплоть до округлений:
 * студент должен увидеть те же числа, что потом увидит в Colab. Поэтому:
 *  - цветное изображение хранится в порядке BGR, как отдаёт cv2.imread;
 *  - resize принимает (width, height), а shape отвечает (h, w, c) — та самая
 *    путаница, на которой спотыкаются все, пусть спотыкаются здесь;
 *  - там, где OpenCV считает в фиксированной точке (cvtColor, GaussianBlur,
 *    resize), мы повторяем ту же арифметику, а не «примерно то же во float».
 *
 * Сверено с opencv-python 4.14 и 5.0 на шуме, синтетике и миллионе случайных
 * цветов: cvtColor, GaussianBlur (в т.ч. с sigma), resize (все три режима),
 * medianBlur, threshold/Otsu, equalizeHist и Canny совпадают бит-в-бит.
 */

/** An image like a NumPy array from cv2.imread: height × width × channels, uint8, 3-channel data in **BGR** order. */
export interface Img {
  width: number;
  height: number;
  channels: 1 | 3;
  data: Uint8ClampedArray;
}

export type Interpolation = "nearest" | "area" | "linear";

/**
 * Ошибка в духе cv2.error: текст повторяет условие, которое напечатал бы
 * OpenCV, — студент учится читать настоящие сообщения, а не наши.
 */
export class CvError extends Error {
  readonly func: string;
  constructor(func: string, condition: string, hint: string) {
    super(`OpenCV error in ${func}: ${condition}. ${hint}`);
    this.name = "CvError";
    this.func = func;
  }
}

// ── служебное ─────────────────────────────────────────────────────────────

const DBL_EPSILON = 2.220446049250313e-16;
const FLT_EPSILON = 1.1920928955078125e-7;

/** cvRound: округление к ближайшему, половинки — к чётному (как lrint в C). */
function rint(x: number): number {
  const r = Math.round(x);
  // Math.round тянет .5 вверх; OpenCV — к чётному
  return r - x === 0.5 && (r & 1) !== 0 ? r - 1 : r;
}

function sat8(x: number): number {
  return x < 0 ? 0 : x > 255 ? 255 : x;
}

function newImg(width: number, height: number, channels: 1 | 3): Img {
  return { width, height, channels, data: new Uint8ClampedArray(width * height * channels) };
}

function copyImg(img: Img): Img {
  return { width: img.width, height: img.height, channels: img.channels, data: img.data.slice() };
}

function assertImg(img: Img, func: string): void {
  const ok =
    img &&
    Number.isInteger(img.width) &&
    Number.isInteger(img.height) &&
    img.width > 0 &&
    img.height > 0 &&
    (img.channels === 1 || img.channels === 3) &&
    img.data instanceof Uint8ClampedArray &&
    img.data.length === img.width * img.height * img.channels;
  if (!ok) {
    throw new CvError(func, "!_src.empty()", "Expected a non-empty uint8 image with 1 or 3 channels.");
  }
}

/** Песочница кормит эти функции серым; настоящий cv2 местами принял бы и цвет. */
function requireGray(img: Img, func: string): void {
  assertImg(img, func);
  if (img.channels !== 1) {
    throw new CvError(
      func,
      // так пишет cv2 4.x: Otsu (threshold) и equalizeHist принимают только CV_8UC1
      `(-215:Assertion failed) ${func === "equalizeHist" ? "_src" : "src"}.type() == CV_8UC1 — expected a 1-channel image, got 3 channels`,
      "Convert first: gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).",
    );
  }
}

function requireColor(img: Img, func: string): void {
  assertImg(img, func);
  if (img.channels !== 3) {
    throw new CvError(
      func,
      "Invalid number of channels in input image: 'VScn::contains(scn)' where 'scn' is 1",
      "This conversion needs a 3-channel BGR image.",
    );
  }
}

/** BORDER_REFLECT_101 (он же BORDER_DEFAULT): gfedcb|abcdefgh|gfedcba. */
function reflect101(p: number, len: number): number {
  if (len === 1) return 0;
  // для крошечных картинок отражаться приходится несколько раз — как в borderInterpolate
  while (p < 0 || p >= len) p = p < 0 ? -p : 2 * len - 2 - p;
  return p;
}

function clampIndex(p: number, len: number): number {
  return p < 0 ? 0 : p >= len ? len - 1 : p;
}

// ── canvas ⇄ Img ──────────────────────────────────────────────────────────

/** Canvas RGBA → BGR Img; альфа отбрасывается, как у cv2.imread(IMREAD_COLOR). */
export function fromRGBA(rgba: Uint8ClampedArray, width: number, height: number): Img {
  const n = width * height;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || rgba.length < n * 4) {
    throw new CvError("imread", "!_img.empty()", `RGBA buffer does not match ${width}×${height}.`);
  }
  const out = new Uint8ClampedArray(n * 3);
  for (let i = 0, j = 0; j < out.length; i += 4, j += 3) {
    out[j] = rgba[i + 2];
    out[j + 1] = rgba[i + 1];
    out[j + 2] = rgba[i];
  }
  return { width, height, channels: 3, data: out };
}

/**
 * Img → RGBA для canvas. По умолчанию 3 канала читаются как BGR (цвета верные).
 * asRGB: true показывает то, что нарисовал бы plt.imshow(bgr_array): R и B
 * меняются местами — классическая «синяя кожа» на первой паре.
 * Одноканальное рисуем серым (plt.imshow без cmap="gray" дал бы viridis).
 */
export function toRGBA(img: Img, opts: { asRGB?: boolean } = {}): Uint8ClampedArray {
  assertImg(img, "imshow");
  const n = img.width * img.height;
  const d = img.data;
  const out = new Uint8ClampedArray(n * 4);
  if (img.channels === 1) {
    for (let i = 0, j = 0; i < n; i++, j += 4) {
      const v = d[i];
      out[j] = v;
      out[j + 1] = v;
      out[j + 2] = v;
      out[j + 3] = 255;
    }
    return out;
  }
  const r = opts.asRGB ? 0 : 2;
  const b = opts.asRGB ? 2 : 0;
  for (let i = 0, j = 0; j < out.length; i += 3, j += 4) {
    out[j] = d[i + r];
    out[j + 1] = d[i + 1];
    out[j + 2] = d[i + b];
    out[j + 3] = 255;
  }
  return out;
}

/** img.shape как в NumPy: (h, w) для серого, (h, w, 3) для цветного. */
export function shape(img: Img): [number, number] | [number, number, number] {
  return img.channels === 1 ? [img.height, img.width] : [img.height, img.width, 3];
}

// ── цвет ──────────────────────────────────────────────────────────────────

// Коэффициенты BT.601 в фиксированной точке 15 бит (RY15/GY15/BY15 из cvtColor).
// С 14-битными или float+round отдельные пиксели расходятся с cv2 на единицу
const RY15 = 9798;
const GY15 = 19235;
const BY15 = 3735;

/** cv2.cvtColor(img, cv2.COLOR_BGR2GRAY): Y = 0.299 R + 0.587 G + 0.114 B. */
export function bgr2gray(img: Img): Img {
  requireColor(img, "cvtColor");
  const n = img.width * img.height;
  const d = img.data;
  const out = newImg(img.width, img.height, 1);
  const o = out.data;
  for (let i = 0, j = 0; i < n; i++, j += 3) {
    o[i] = (d[j] * BY15 + d[j + 1] * GY15 + d[j + 2] * RY15 + 16384) >> 15;
  }
  return out;
}

/** COLOR_BGR2RGB / COLOR_RGB2BGR: это одна и та же перестановка R↔B. */
export function swapRB(img: Img): Img {
  requireColor(img, "cvtColor");
  const d = img.data;
  const out = newImg(img.width, img.height, 3);
  const o = out.data;
  for (let i = 0; i < d.length; i += 3) {
    o[i] = d[i + 2];
    o[i + 1] = d[i + 1];
    o[i + 2] = d[i];
  }
  return out;
}

// Таблицы деления из color_hsv: OpenCV делит не делением, а умножением на
// заранее посчитанное 4096/x — от этого зависят последние единицы H и S
const HSV_SHIFT = 12;
const SDIV = new Int32Array(256);
const HDIV180 = new Int32Array(256);
for (let i = 1; i < 256; i++) {
  SDIV[i] = rint((255 << HSV_SHIFT) / i);
  HDIV180[i] = rint((180 << HSV_SHIFT) / (6 * i));
}

/**
 * cv2.cvtColor(img, cv2.COLOR_BGR2HSV) для uint8: H 0..179 (градусы пополам,
 * чтобы влезть в байт), S и V 0..255.
 */
export function bgr2hsv(img: Img): Img {
  requireColor(img, "cvtColor");
  const d = img.data;
  const out = newImg(img.width, img.height, 3);
  const o = out.data;
  const half = 1 << (HSV_SHIFT - 1);
  for (let i = 0; i < d.length; i += 3) {
    const b = d[i];
    const g = d[i + 1];
    const r = d[i + 2];
    const v = Math.max(b, g, r);
    const diff = v - Math.min(b, g, r);
    // порядок проверок как в OpenCV: при равенстве R побеждает G, G побеждает B
    let h = v === r ? g - b : v === g ? b - r + 2 * diff : r - g + 4 * diff;
    h = (h * HDIV180[diff] + half) >> HSV_SHIFT;
    if (h < 0) h += 180;
    o[i] = h;
    o[i + 1] = (diff * SDIV[v] + half) >> HSV_SHIFT;
    o[i + 2] = v;
  }
  return out;
}

/** img[:, :, index] — один канал как серое изображение (cv2.split по одному). */
export function channel(img: Img, index: 0 | 1 | 2): Img {
  assertImg(img, "split");
  if (!(index === 0 || index === 1 || index === 2) || index >= img.channels) {
    throw new CvError(
      "split",
      `index ${index} is out of bounds for axis 2 with size ${img.channels}`,
      "Channels are 0 = B, 1 = G, 2 = R for a BGR image.",
    );
  }
  if (img.channels === 1) return copyImg(img);
  const n = img.width * img.height;
  const d = img.data;
  const out = newImg(img.width, img.height, 1);
  const o = out.data;
  for (let i = 0, j = index; i < n; i++, j += 3) o[i] = d[j];
  return out;
}

// ── resize ────────────────────────────────────────────────────────────────

/**
 * cv2.resize(img, (width, height), interpolation=...). Внимание: размер
 * задаётся (ширина, высота), а shape результата — (высота, ширина, c).
 * По умолчанию INTER_LINEAR, как в OpenCV.
 */
export function resize(img: Img, width: number, height: number, interpolation: Interpolation = "linear"): Img {
  assertImg(img, "resize");
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new CvError(
      "resize",
      "!dsize.empty()",
      `dsize must be a pair of positive integers (width, height), got (${width}, ${height}).`,
    );
  }
  const sw = img.width;
  const sh = img.height;
  if (sw === width && sh === height) return copyImg(img);
  // inv_scale = dst/src и scale = 1/inv_scale — именно в таком порядке, как в
  // hal::resize: от этого зависят пограничные floor
  const invX = width / sw;
  const invY = height / sh;
  if (interpolation === "nearest") return resizeNearest(img, width, height, invX, invY);
  const scaleX = 1 / invX;
  const scaleY = 1 / invY;
  if (interpolation === "area" && scaleX >= 1 && scaleY >= 1) {
    const ix = rint(scaleX);
    const iy = rint(scaleY);
    const fast = Math.abs(scaleX - ix) < DBL_EPSILON && Math.abs(scaleY - iy) < DBL_EPSILON;
    return fast ? resizeAreaFast(img, width, height, ix, iy) : resizeArea(img, width, height, scaleX, scaleY);
  }
  // INTER_AREA при увеличении в OpenCV — это билинейная интерполяция с особыми весами
  return resizeLinear(img, width, height, scaleX, scaleY, invX, invY, interpolation === "area");
}

function resizeNearest(img: Img, dw: number, dh: number, invX: number, invY: number): Img {
  const { width: sw, height: sh, channels: cn, data: s } = img;
  const out = newImg(dw, dh, cn);
  const o = out.data;
  const ifx = 1 / invX;
  const ify = 1 / invY;
  const xofs = new Int32Array(dw);
  for (let x = 0; x < dw; x++) xofs[x] = Math.min(Math.floor(x * ifx), sw - 1) * cn;
  for (let y = 0, k = 0; y < dh; y++) {
    const row = Math.min(Math.floor(y * ify), sh - 1) * sw * cn;
    for (let x = 0; x < dw; x++) {
      const p = row + xofs[x];
      for (let c = 0; c < cn; c++) o[k++] = s[p + c];
    }
  }
  return out;
}

// Веса билинейной интерполяции — 11-битная фиксированная точка (INTER_RESIZE_COEF_BITS)
const RESIZE_COEF = 2048;

function resizeLinear(
  img: Img,
  dw: number,
  dh: number,
  scaleX: number,
  scaleY: number,
  invX: number,
  invY: number,
  areaMode: boolean,
): Img {
  const { width: sw, height: sh, channels: cn, data: s } = img;
  const f32 = Math.fround;

  // По x: соседи и веса. Координаты считаются во float32, как в OpenCV
  const x0 = new Int32Array(dw);
  const x1 = new Int32Array(dw);
  const a0 = new Int32Array(dw);
  const a1 = new Int32Array(dw);
  for (let dx = 0; dx < dw; dx++) {
    let sx: number;
    let fx: number;
    if (!areaMode) {
      fx = f32((dx + 0.5) * scaleX - 0.5);
      sx = Math.floor(fx);
      fx = f32(fx - sx);
    } else {
      sx = Math.floor(dx * scaleX);
      fx = f32(dx + 1 - (sx + 1) * invX);
      fx = fx <= 0 ? 0 : f32(fx - Math.floor(fx));
    }
    if (sx < 0) {
      sx = 0;
      fx = 0;
    }
    if (sx >= sw - 1) {
      // за правым краем OpenCV берёт один пиксель с весом 1
      x0[dx] = x1[dx] = (sw - 1) * cn;
      a0[dx] = RESIZE_COEF;
      a1[dx] = 0;
    } else {
      x0[dx] = sx * cn;
      x1[dx] = (sx + 1) * cn;
      a0[dx] = rint(f32(1 - fx) * RESIZE_COEF);
      a1[dx] = rint(fx * RESIZE_COEF);
    }
  }

  // По y веса не обрезаются, обрезаются только номера строк (clip в resizeGeneric)
  const y0 = new Int32Array(dh);
  const y1 = new Int32Array(dh);
  const b0 = new Int32Array(dh);
  const b1 = new Int32Array(dh);
  for (let dy = 0; dy < dh; dy++) {
    let sy: number;
    let fy: number;
    if (!areaMode) {
      fy = f32((dy + 0.5) * scaleY - 0.5);
      sy = Math.floor(fy);
      fy = f32(fy - sy);
    } else {
      sy = Math.floor(dy * scaleY);
      fy = f32(dy + 1 - (sy + 1) * invY);
      fy = fy <= 0 ? 0 : f32(fy - Math.floor(fy));
    }
    y0[dy] = clampIndex(sy, sh);
    y1[dy] = clampIndex(sy + 1, sh);
    b0[dy] = rint(f32(1 - fy) * RESIZE_COEF);
    b1[dy] = rint(fy * RESIZE_COEF);
  }

  const rowLen = dw * cn;
  const bufs = [new Int32Array(rowLen), new Int32Array(rowLen)];
  const cached = [-1, -1];
  const hrow = (slot: number, sy: number): void => {
    const buf = bufs[slot];
    const base = sy * sw * cn;
    for (let dx = 0, k = 0; dx < dw; dx++) {
      const p0 = base + x0[dx];
      const p1 = base + x1[dx];
      const w0 = a0[dx];
      const w1 = a1[dx];
      for (let c = 0; c < cn; c++) buf[k++] = s[p0 + c] * w0 + s[p1 + c] * w1;
    }
    cached[slot] = sy;
  };

  const out = newImg(dw, dh, cn);
  const o = out.data;
  for (let dy = 0; dy < dh; dy++) {
    const r0 = y0[dy];
    const r1 = y1[dy];
    // кэш на две строки: соседние dy почти всегда берут те же исходные строки
    let i0 = cached[0] === r0 ? 0 : cached[1] === r0 ? 1 : -1;
    if (i0 < 0) {
      i0 = cached[0] === r1 ? 1 : 0;
      hrow(i0, r0);
    }
    let i1 = cached[0] === r1 ? 0 : cached[1] === r1 ? 1 : -1;
    if (i1 < 0) {
      i1 = 1 - i0;
      hrow(i1, r1);
    }
    const S0 = bufs[i0];
    const S1 = bufs[i1];
    const w0 = b0[dy];
    const w1 = b1[dy];
    const base = dy * rowLen;
    for (let k = 0; k < rowLen; k++) {
      // дословно VResizeLinear<uchar>: сдвиги стоят ровно там же, что и в OpenCV
      o[base + k] = (((w0 * (S0[k] >> 4)) >> 16) + ((w1 * (S1[k] >> 4)) >> 16) + 2) >> 2;
    }
  }
  return out;
}

/** INTER_AREA с целым коэффициентом: среднее по блоку iy × ix. */
function resizeAreaFast(img: Img, dw: number, dh: number, ix: number, iy: number): Img {
  const { width: sw, channels: cn, data: s } = img;
  const out = newImg(dw, dh, cn);
  const o = out.data;
  const stride = sw * cn;
  if (ix === 2 && iy === 2) {
    // спецслучай OpenCV для 2×2: (a+b+c+d+2)>>2, половинки вверх
    for (let dy = 0, k = 0; dy < dh; dy++) {
      const r0 = 2 * dy * stride;
      const r1 = r0 + stride;
      for (let dx = 0; dx < dw; dx++) {
        const p = 2 * dx * cn;
        for (let c = 0; c < cn; c++, k++) {
          o[k] = (s[r0 + p + c] + s[r0 + p + cn + c] + s[r1 + p + c] + s[r1 + p + cn + c] + 2) >> 2;
        }
      }
    }
    return out;
  }
  // общий случай: сумма * (1.f/area) во float32, затем cvRound (половинки к чётному)
  const scale = Math.fround(1 / (ix * iy));
  for (let dy = 0, k = 0; dy < dh; dy++) {
    const sy0 = dy * iy;
    for (let dx = 0; dx < dw; dx++) {
      const sx0 = dx * ix * cn;
      for (let c = 0; c < cn; c++, k++) {
        let sum = 0;
        for (let yy = 0; yy < iy; yy++) {
          const p = (sy0 + yy) * stride + sx0 + c;
          for (let xx = 0; xx < ix; xx++) sum += s[p + xx * cn];
        }
        o[k] = sat8(rint(Math.fround(sum * scale)));
      }
    }
  }
  return out;
}

interface AreaTab {
  di: Int32Array;
  si: Int32Array;
  alpha: Float32Array;
  n: number;
}

/** computeResizeAreaTab: какие исходные пиксели и с какой долей попадают в каждый выходной. */
function areaTab(ssize: number, dsize: number, scale: number): AreaTab {
  const cap = ssize * 2 + dsize * 2;
  const di = new Int32Array(cap);
  const si = new Int32Array(cap);
  const alpha = new Float32Array(cap);
  let k = 0;
  for (let dx = 0; dx < dsize; dx++) {
    const fsx1 = dx * scale;
    const fsx2 = fsx1 + scale;
    const cellWidth = Math.min(scale, ssize - fsx1);
    let sx1 = Math.ceil(fsx1);
    const sx2 = Math.min(Math.floor(fsx2), ssize - 1);
    sx1 = Math.min(sx1, sx2);
    if (sx1 - fsx1 > 1e-3) {
      di[k] = dx;
      si[k] = sx1 - 1;
      alpha[k++] = (sx1 - fsx1) / cellWidth;
    }
    for (let sx = sx1; sx < sx2; sx++) {
      di[k] = dx;
      si[k] = sx;
      alpha[k++] = 1 / cellWidth;
    }
    if (fsx2 - sx2 > 1e-3) {
      di[k] = dx;
      si[k] = sx2;
      alpha[k++] = Math.min(Math.min(fsx2 - sx2, 1), cellWidth) / cellWidth;
    }
  }
  return { di, si, alpha, n: k };
}

/** INTER_AREA с дробным коэффициентом: взвешенное среднее, суммы во float32 как в OpenCV. */
function resizeArea(img: Img, dw: number, dh: number, scaleX: number, scaleY: number): Img {
  const { width: sw, height: sh, channels: cn, data: s } = img;
  const f32 = Math.fround;
  const xt = areaTab(sw, dw, scaleX);
  const yt = areaTab(sh, dh, scaleY);
  const rowLen = dw * cn;
  const buf = new Float32Array(rowLen);
  const sum = new Float32Array(rowLen);
  const out = newImg(dw, dh, cn);
  const o = out.data;
  const flush = (dy: number): void => {
    const base = dy * rowLen;
    for (let k = 0; k < rowLen; k++) o[base + k] = sat8(rint(sum[k]));
  };
  let prevDy = yt.di[0];
  for (let j = 0; j < yt.n; j++) {
    const beta = yt.alpha[j];
    const dy = yt.di[j];
    const srow = yt.si[j] * sw * cn;
    buf.fill(0);
    for (let k = 0; k < xt.n; k++) {
      const dxn = xt.di[k] * cn;
      const sxn = srow + xt.si[k] * cn;
      const a = xt.alpha[k];
      // Float32Array сам округляет запись — получаем ровно float-арифметику C
      for (let c = 0; c < cn; c++) buf[dxn + c] += f32(s[sxn + c] * a);
    }
    if (dy !== prevDy) {
      flush(prevDy);
      for (let k = 0; k < rowLen; k++) sum[k] = beta * buf[k];
      prevDy = dy;
    } else {
      for (let k = 0; k < rowLen; k++) sum[k] += f32(beta * buf[k]);
    }
  }
  flush(prevDy);
  return out;
}

// ── сглаживание ───────────────────────────────────────────────────────────

/**
 * Ядро Гаусса в духе getGaussianKernelBitExact. Для sigma ≤ 0 и ksize ≤ 9
 * OpenCV берёт готовые таблицы (биномиальные 1-2-1, 1-4-6-4-1, ...), иначе —
 * формулу; центр добирается до ровно 1, поэтому сумма всегда точная.
 */
function gaussianWeights(n: number, sigma: number): number[] {
  if (sigma <= 0) {
    const table: Record<number, number[]> = {
      1: [1],
      3: [0.25, 0.5, 0.25],
      5: [0.0625, 0.25, 0.375, 0.25, 0.0625],
      7: [0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125],
      9: [4, 13, 30, 51, 60, 51, 30, 13, 4].map((v) => v / 256),
    };
    if (table[n]) return table[n].slice();
  }
  // sigma = 0.3*((ksize-1)*0.5 - 1) + 0.8, записанная как 0.15*n + 0.35
  const sigmaX = sigma > 0 ? sigma : n * 0.15 + 0.35;
  const scale2X = -0.125 / (sigmaX * sigmaX); // x ниже идёт с шагом 2, отсюда 0.125
  const half = (n - 1) >> 1;
  const values: number[] = [];
  let sum = 0;
  for (let i = 0, x = 1 - n; i < half; i++, x += 2) {
    const t = Math.exp(x * x * scale2X);
    values.push(t);
    sum += t;
  }
  sum = sum * 2 + 1 + (n % 2 === 0 ? 1 : 0);
  const mul = 1 / sum;
  const result = new Array<number>(n);
  let side = 0;
  for (let i = 0; i < half; i++) {
    const t = values[i] * mul;
    result[i] = t;
    result[n - 1 - i] = t;
    side += t;
  }
  result[half] = 1 - side * 2;
  if (n % 2 === 0) result[half + 1] = result[half];
  return result;
}

/**
 * То же ядро в 8-битной фиксированной точке (вес k означает k/256), как его
 * берёт GaussianBlur для uint8. Округляется не каждый вес, а накопленная
 * сумма — ошибка не копится, и сумма ядра ровно 256. Сверено с cv2 4.14/5.0:
 * для (5, sigma=1) это [14, 62, 104, 62, 14], а не «наивные» [14, 63, 102, ...].
 */
function gaussianWeightsQ8(n: number, sigma: number): Int32Array {
  const k = gaussianWeights(n, sigma);
  const half = (n - 1) >> 1;
  const q = new Int32Array(n);
  let cum = 0;
  let prev = 0;
  for (let i = 0; i < half; i++) {
    cum += k[i];
    const Q = rint(cum * 256);
    q[i] = q[n - 1 - i] = Q - prev;
    prev = Q;
  }
  q[half] = 256 - 2 * prev;
  return q;
}

function checkGaussianKsize(ksize: number): void {
  if (!Number.isInteger(ksize) || ksize <= 0 || ksize % 2 !== 1) {
    throw new CvError(
      "GaussianBlur",
      "(-215:Assertion failed) ksize.width > 0 && ksize.width % 2 == 1 && ksize.height > 0 && ksize.height % 2 == 1",
      `ksize must be odd and positive (1, 3, 5, 7, ...), got ${ksize}.`,
    );
  }
}

/** cv2.getGaussianKernel(ksize, sigma): веса ядра (float64), сумма ровно 1. */
export function getGaussianKernel(ksize: number, sigma = 0): number[] {
  checkGaussianKsize(ksize);
  return gaussianWeights(ksize, sigma > 0 ? sigma : 0);
}

/**
 * cv2.GaussianBlur(img, (ksize, ksize), sigma). sigma 0 → OpenCV сам считает
 * 0.3*((ksize-1)*0.5 - 1) + 0.8. Граница BORDER_REFLECT_101.
 * Для uint8 OpenCV считает в фиксированной точке (веса кратны 1/256) — так и мы.
 */
export function gaussianBlur(img: Img, ksize: number, sigma = 0): Img {
  assertImg(img, "GaussianBlur");
  checkGaussianKsize(ksize);
  const k = gaussianWeightsQ8(ksize, sigma > 0 ? sigma : 0);
  // если по оси всего один пиксель, OpenCV сводит ядро по ней к 1
  const one = Int32Array.of(256);
  return sepFilterQ8(img, img.width === 1 ? one : k, img.height === 1 ? one : k);
}

/**
 * Разделимый фильтр с весами в 1/256 (сумма каждого ядра — 256). Горизонталь
 * накапливается точно в целых, вертикаль — с одним округлением в конце:
 * (Σ + 2^15) >> 16, как в GaussianBlurFixedPoint.
 */
function sepFilterQ8(img: Img, kx: Int32Array, ky: Int32Array): Img {
  const { width: w, height: h, channels: cn, data: s } = img;
  const rx = (kx.length - 1) >> 1;
  const ry = (ky.length - 1) >> 1;
  const rowLen = w * cn;
  const tmp = new Int32Array(w * h * cn);

  // строка с отражёнными краями, чтобы внутренний цикл обходился без проверок
  const padW = w + 2 * rx;
  const xmap = new Int32Array(padW);
  for (let i = 0; i < padW; i++) xmap[i] = reflect101(i - rx, w) * cn;
  const pad = new Int32Array(padW * cn);
  for (let y = 0; y < h; y++) {
    const off = y * rowLen;
    for (let i = 0, q = 0; i < padW; i++) {
      const p = off + xmap[i];
      for (let c = 0; c < cn; c++) pad[q++] = s[p + c];
    }
    for (let kk = 0; kk < kx.length; kk++) {
      const wk = kx[kk];
      if (wk === 0) continue;
      const shift = kk * cn;
      for (let t = 0; t < rowLen; t++) tmp[off + t] += wk * pad[t + shift];
    }
  }

  const ymap = new Int32Array(h + 2 * ry);
  for (let i = 0; i < ymap.length; i++) ymap[i] = reflect101(i - ry, h) * rowLen;
  const out = newImg(w, h, cn);
  const o = out.data;
  const acc = new Int32Array(rowLen);
  for (let y = 0; y < h; y++) {
    acc.fill(32768);
    for (let kk = 0; kk < ky.length; kk++) {
      const wk = ky[kk];
      if (wk === 0) continue;
      const base = ymap[y + kk];
      for (let t = 0; t < rowLen; t++) acc[t] += wk * tmp[base + t];
    }
    const off = y * rowLen;
    for (let t = 0; t < rowLen; t++) o[off + t] = acc[t] >> 16;
  }
  return out;
}

/**
 * cv2.medianBlur(img, ksize): медиана окна ksize × ksize, граница
 * BORDER_REPLICATE (так делает OpenCV внутри). Скользящая гистограмма
 * (алгоритм Хуанга) — O(ksize) на пиксель, большие окна не тормозят.
 */
export function medianBlur(img: Img, ksize: number): Img {
  assertImg(img, "medianBlur");
  if (!Number.isInteger(ksize) || ksize <= 1 || ksize % 2 !== 1) {
    throw new CvError(
      "medianBlur",
      "(-215:Assertion failed) (ksize % 2 == 1) && ksize > 1",
      `ksize must be odd and greater than 1 (3, 5, 7, ...), got ${ksize}.`,
    );
  }
  const { width: w, height: h, channels: cn, data: s } = img;
  const r = ksize >> 1;
  const target = (ksize * ksize - 1) >> 1; // индекс медианы в отсортированном окне
  const rowLen = w * cn;
  const xmap = new Int32Array(w + 2 * r);
  for (let i = 0; i < xmap.length; i++) xmap[i] = clampIndex(i - r, w) * cn;
  const ymap = new Int32Array(h + 2 * r);
  for (let i = 0; i < ymap.length; i++) ymap[i] = clampIndex(i - r, h) * rowLen;

  const out = newImg(w, h, cn);
  const o = out.data;
  const hist = new Int32Array(256);
  for (let c = 0; c < cn; c++) {
    for (let y = 0; y < h; y++) {
      hist.fill(0);
      for (let i = 0; i < ksize; i++) {
        const row = ymap[y + i] + c;
        for (let j = 0; j < ksize; j++) hist[s[row + xmap[j]]]++;
      }
      // med — текущая медиана, lt — сколько значений окна строго меньше неё
      let med = 0;
      let lt = 0;
      while (lt + hist[med] <= target) lt += hist[med++];
      o[y * rowLen + c] = med;
      for (let x = 1; x < w; x++) {
        const colOut = xmap[x - 1] + c;
        const colIn = xmap[x + ksize - 1] + c;
        for (let i = 0; i < ksize; i++) {
          const row = ymap[y + i];
          const vo = s[row + colOut];
          hist[vo]--;
          if (vo < med) lt--;
          const vi = s[row + colIn];
          hist[vi]++;
          if (vi < med) lt++;
        }
        while (lt > target) lt -= hist[--med];
        while (lt + hist[med] <= target) lt += hist[med++];
        o[y * rowLen + x * cn + c] = med;
      }
    }
  }
  return out;
}

// ── пороги и гистограммы ──────────────────────────────────────────────────

/**
 * cv2.threshold(gray, thresh, maxval, cv2.THRESH_BINARY)[1]:
 * пиксель > thresh → maxval, иначе 0. Строго больше — частый вопрос на паре.
 */
export function threshold(img: Img, thresh: number, maxval = 255): Img {
  requireGray(img, "threshold");
  // для uint8 OpenCV сам приводит порог к floor, а maxval — к ближайшему целому
  const t = Math.floor(thresh);
  const mv = sat8(rint(maxval));
  const lut = new Uint8Array(256);
  for (let v = 0; v < 256; v++) lut[v] = v > t ? mv : 0;
  const out = newImg(img.width, img.height, 1);
  const o = out.data;
  const d = img.data;
  for (let i = 0; i < d.length; i++) o[i] = lut[d[i]];
  return out;
}

function histogram(img: Img): Int32Array {
  const hist = new Int32Array(256);
  const d = img.data;
  for (let i = 0; i < d.length; i++) hist[d[i]]++;
  return hist;
}

/**
 * Порог Оцу — то, что cv2.threshold(gray, 0, 255, THRESH_BINARY + THRESH_OTSU)
 * возвращает первым значением. Максимизирует межклассовую дисперсию.
 */
export function otsu(img: Img): number {
  requireGray(img, "threshold");
  const hist = histogram(img);
  // дословно getThreshVal_Otsu_8u, включая его порядок операций в double
  const scale = 1 / img.data.length;
  let mu = 0;
  for (let i = 0; i < 256; i++) mu += i * hist[i];
  mu *= scale;
  let mu1 = 0;
  let q1 = 0;
  let maxSigma = 0;
  let maxVal = 0;
  for (let i = 0; i < 256; i++) {
    const p = hist[i] * scale;
    mu1 *= q1;
    q1 += p;
    const q2 = 1 - q1;
    if (Math.min(q1, q2) < FLT_EPSILON || Math.max(q1, q2) > 1 - FLT_EPSILON) continue;
    mu1 = (mu1 + i * p) / q1;
    const mu2 = (mu - q1 * mu1) / q2;
    const sigma = q1 * q2 * (mu1 - mu2) * (mu1 - mu2);
    if (sigma > maxSigma) {
      maxSigma = sigma;
      maxVal = i;
    }
  }
  return maxVal;
}

/**
 * cv2.equalizeHist(gray): растягивает накопленную гистограмму на 0..255.
 * Самый тёмный встреченный уровень всегда становится 0.
 */
export function equalizeHist(img: Img): Img {
  requireGray(img, "equalizeHist");
  const hist = histogram(img);
  const total = img.data.length;
  const out = newImg(img.width, img.height, 1);
  let i = 0;
  while (hist[i] === 0) i++;
  if (hist[i] === total) {
    // однотонная картинка: OpenCV просто заливает тем же значением
    out.data.fill(i);
    return out;
  }
  const lut = new Uint8Array(256);
  // scale во float32, как в OpenCV, — иначе изредка «уезжает» единица
  const scale = Math.fround(255 / (total - hist[i]));
  let sum = 0;
  for (lut[i++] = 0; i < 256; i++) {
    sum += hist[i];
    lut[i] = sat8(rint(Math.fround(sum * scale)));
  }
  const d = img.data;
  const o = out.data;
  for (let k = 0; k < d.length; k++) o[k] = lut[d[k]];
  return out;
}

// ── Canny ─────────────────────────────────────────────────────────────────

/** tan(22.5°) в 15-битной фиксированной точке — граница «горизонталь/диагональ». */
const TG22 = 13573;

/**
 * cv2.Canny(gray, low, high) с параметрами по умолчанию: Sobel 3×3
 * (BORDER_REPLICATE), модуль градиента L1 = |gx| + |gy| (L2gradient=False),
 * подавление немаксимумов в 4 направлениях, двойной порог и гистерезис по
 * 8 соседям. Результат — 0/255.
 *
 * Настоящий cv2.Canny принимает и цветное (берёт максимум по каналам), но в
 * песочнице мы подаём серое — так понятнее, что именно ищется.
 */
export function canny(img: Img, low: number, high: number): Img {
  requireGray(img, "Canny");
  if (low > high) [low, high] = [high, low]; // OpenCV тоже молча меняет местами
  const lo = Math.floor(low);
  const hi = Math.floor(high);
  const { width: w, height: h, data: s } = img;
  const W = w + 2;
  const size = W * (h + 2);

  // 1) Исходник с повторённой рамкой — Sobel без проверок границ
  const src = new Int32Array(size);
  for (let y = -1; y <= h; y++) {
    const sy = clampIndex(y, h) * w;
    const row = (y + 1) * W;
    for (let x = -1; x <= w; x++) src[row + x + 1] = s[sy + clampIndex(x, w)];
  }

  // 2) Градиенты и модуль; рамка mag остаётся нулевой, как в OpenCV
  const gx = new Int32Array(size);
  const gy = new Int32Array(size);
  const mag = new Int32Array(size);
  for (let y = 1; y <= h; y++) {
    for (let x = 1, p = y * W + 1; x <= w; x++, p++) {
      const a = src[p - W - 1];
      const b = src[p - W];
      const c = src[p - W + 1];
      const d = src[p - 1];
      const f = src[p + 1];
      const g = src[p + W - 1];
      const k = src[p + W];
      const i = src[p + W + 1];
      const dx = c + 2 * f + i - (a + 2 * d + g);
      const dy = g + 2 * k + i - (a + 2 * b + c);
      gx[p] = dx;
      gy[p] = dy;
      mag[p] = (dx < 0 ? -dx : dx) + (dy < 0 ? -dy : dy);
    }
  }

  // 3) Немаксимумы: 1 — не край, 0 — слабый кандидат, 2 — сильный край.
  // Асимметрия «> с одной стороны, >= с другой» — из OpenCV: из двух равных
  // соседей ровно один остаётся краем, линия выходит толщиной в пиксель
  const map = new Uint8Array(size).fill(1);
  const stack = new Int32Array(w * h);
  let sp = 0;
  for (let y = 1; y <= h; y++) {
    for (let x = 1, p = y * W + 1; x <= w; x++, p++) {
      const m = mag[p];
      if (m <= lo) continue;
      const xs = gx[p];
      const ys = gy[p];
      const ax = xs < 0 ? -xs : xs;
      const ay = (ys < 0 ? -ys : ys) << 15;
      const tg22x = ax * TG22;
      let keep: boolean;
      if (ay < tg22x) {
        keep = m > mag[p - 1] && m >= mag[p + 1];
      } else if (ay > tg22x + (ax << 16)) {
        keep = m > mag[p - W] && m >= mag[p + W];
      } else {
        const sgn = (xs ^ ys) < 0 ? -1 : 1;
        keep = m > mag[p - W - sgn] && m > mag[p + W + sgn];
      }
      if (!keep) continue;
      if (m > hi) {
        map[p] = 2;
        stack[sp++] = p;
      } else {
        map[p] = 0;
      }
    }
  }

  // 4) Гистерезис: от сильных краёв расползаемся по слабым кандидатам
  const nb = [-W - 1, -W, -W + 1, -1, 1, W - 1, W, W + 1];
  while (sp > 0) {
    const p = stack[--sp];
    for (let k = 0; k < 8; k++) {
      const q = p + nb[k];
      if (map[q] === 0) {
        map[q] = 2;
        stack[sp++] = q;
      }
    }
  }

  const out = newImg(w, h, 1);
  const o = out.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0, p = (y + 1) * W + 1, q = y * w; x < w; x++, p++, q++) o[q] = map[p] === 2 ? 255 : 0;
  }
  return out;
}
