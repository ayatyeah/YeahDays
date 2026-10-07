"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { bgr2gray, bgr2hsv, canny, channel, CvError, equalizeHist, fromRGBA, gaussianBlur, medianBlur, otsu, resize, shape, threshold, toRGBA, type Img } from "@/lib/imageOps";
import { useTutorDetail } from "@/lib/tutorFocus";

/**
 * Песочница «OpenCV в браузере»: картинка проходит конвейер resize → цвет →
 * размытие → порог/края/выравнивание, и на каждом шаге видно результат,
 * shape и код на Python. Ошибки — как у настоящего cv2 (Otsu на цветной,
 * чётное ядро). Фото обрабатывается здесь же, в браузере, и никуда не уходит.
 */

const SAMPLES = [
  { src: "/events/cv/l3-cat-car-frog.webp", name: "Кошка, машина, лягушка" },
  { src: "/events/cv/drill-fabric-lamps.webp", name: "Ткань и лампы" },
];
const MAX_SIDE = 480;

type Color = "bgr" | "rgb-mistake" | "gray" | "h" | "s" | "v";
type Blur = "none" | "gaussian" | "median";
type Final = "none" | "threshold" | "otsu" | "canny" | "equalize";

interface Pipeline {
  scale: number;
  color: Color;
  blur: Blur;
  k: number;
  sigma: number;
  final: Final;
  t: number;
  low: number;
  high: number;
}

const START: Pipeline = { scale: 100, color: "gray", blur: "gaussian", k: 5, sigma: 0, final: "otsu", t: 127, low: 50, high: 150 };

const shapeText = (img: Img) => `(${shape(img).join(", ")})`;

interface Run {
  out: Img | null;
  code: string[];
  error: string;
  note: string;
  /** Показать картинку как RGB — то, что делает plt.imshow с массивом BGR. */
  asRGB: boolean;
}

function run(src: Img, p: Pipeline): Run {
  const code: string[] = [`img = cv2.imread("photo.jpg")            # ${shapeText(src)}, BGR`];
  let img = src;
  let asRGB = false;
  let note = "";
  try {
    if (p.scale !== 100) {
      const w = Math.max(1, Math.round((src.width * p.scale) / 100));
      const h = Math.max(1, Math.round((src.height * p.scale) / 100));
      img = resize(img, w, h, p.scale < 100 ? "area" : "linear");
      code.push(`img = cv2.resize(img, (${w}, ${h}))       # (width, height) → shape ${shapeText(img)}`);
    }
    let name = "img";
    if (p.color === "rgb-mistake") {
      asRGB = true;
      code.push(`plt.imshow(img)   # bug: BGR array shown as RGB — blue and red swapped`);
    } else if (p.color === "gray") {
      img = bgr2gray(img);
      name = "gray";
      code.push(`gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)   # ${shapeText(img)}`);
    } else if (p.color === "h" || p.color === "s" || p.color === "v") {
      const hsv = bgr2hsv(img);
      const idx = p.color === "h" ? 0 : p.color === "s" ? 1 : 2;
      img = channel(hsv, idx);
      name = p.color;
      code.push(`hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)   # H in OpenCV: 0…179`);
      code.push(`${name} = hsv[:, :, ${idx}]                     # ${shapeText(img)}`);
    }

    if (p.blur === "gaussian") {
      code.push(`blur = cv2.GaussianBlur(${name}, (${p.k}, ${p.k}), ${p.sigma})`);
      img = gaussianBlur(img, p.k, p.sigma);
      name = "blur";
    } else if (p.blur === "median") {
      code.push(`blur = cv2.medianBlur(${name}, ${p.k})`);
      // ksize 1 настоящий cv2 просто копирует картинку
      if (p.k !== 1) img = medianBlur(img, p.k);
      name = "blur";
    }

    if (p.final === "threshold") {
      code.push(`_, out = cv2.threshold(${name}, ${p.t}, 255, cv2.THRESH_BINARY)   # > ${p.t} → 255`);
      if (img.channels === 1) img = threshold(img, p.t);
      else {
        // настоящий cv2.threshold с THRESH_BINARY работает и по каналам цветной
        const out = { ...img, data: img.data.map((v) => (v > p.t ? 255 : 0)) };
        img = out;
        note = "Порог на цветной картинке cv2 применяет к каждому каналу отдельно — отсюда цветные пятна. Обычно сначала переводят в серое.";
      }
    } else if (p.final === "otsu") {
      code.push(`T, out = cv2.threshold(${name}, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)`);
      const T = otsu(img);
      img = threshold(img, T);
      code[code.length - 1] += `   # T = ${T}`;
    } else if (p.final === "canny") {
      code.push(`edges = cv2.Canny(${name}, ${p.low}, ${p.high})`);
      if (img.channels === 3) {
        img = canny(bgr2gray(img), p.low, p.high);
        note = "cv2.Canny принимает и цветное (берёт сильнейший канал), но здесь, как обычно на практике, края ищем по серому.";
      } else img = canny(img, p.low, p.high);
    } else if (p.final === "equalize") {
      code.push(`out = cv2.equalizeHist(${name})`);
      img = equalizeHist(img);
    }
    code.push(`print(${p.final === "none" ? name : p.final === "canny" ? "edges" : "out"}.shape)   # ${shapeText(img)}`);
    return { out: img, code, error: "", note, asRGB };
  } catch (e) {
    return { out: null, code, error: e instanceof CvError ? `cv2.error: ${e.message}` : "Не получилось обработать картинку", note: "", asRGB: false };
  }
}

function histogram(img: Img) {
  const bins = new Array(64).fill(0);
  const d = img.data;
  const step = img.channels;
  for (let i = 0; i < d.length; i += step) bins[d[i] >> 2]++;
  const max = Math.max(...bins) || 1;
  return bins.map((b) => b / max);
}

export default function OpenCVSandbox({ onExit }: { onExit: () => void }) {
  const [src, setSrc] = useState<Img | null>(null);
  const [name, setName] = useState(SAMPLES[0].name);
  const [p, setP] = useState<Pipeline>(START);
  const [original, setOriginal] = useState(false);
  const [loadError, setLoadError] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const file = useRef<HTMLInputElement>(null);

  async function load(url: string, label: string, revoke = false) {
    setLoadError("");
    try {
      const image = new Image();
      image.decoding = "async";
      image.src = url;
      await image.decode();
      const k = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
      const w = Math.max(1, Math.round(image.naturalWidth * k));
      const h = Math.max(1, Math.round(image.naturalHeight * k));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("canvas");
      ctx.drawImage(image, 0, 0, w, h);
      setSrc(fromRGBA(ctx.getImageData(0, 0, w, h).data, w, h));
      setName(label);
    } catch {
      setLoadError("Не удалось открыть картинку — попробуй другую (JPG, PNG, WebP).");
    } finally {
      if (revoke) URL.revokeObjectURL(url);
    }
  }

  useEffect(() => {
    void load(SAMPLES[0].src, SAMPLES[0].name);
  }, []);

  const result = useMemo(() => (src ? run(src, p) : null), [src, p]);
  const shown = original ? src : result?.out ?? null;
  const hist = useMemo(() => (result?.out ? histogram(result.out) : null), [result]);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !shown) return;
    c.width = shown.width;
    c.height = shown.height;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const rgba = toRGBA(shown, { asRGB: !original && !!result?.asRGB });
    ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), shown.width, shown.height), 0, 0);
  }, [shown, original, result?.asRGB]);

  useTutorDetail(result ? { sandbox: [...result.code, result.error, result.note].filter(Boolean).join("\n") } : null);

  const set = <K extends keyof Pipeline>(key: K, value: Pipeline[K]) => setP((v) => ({ ...v, [key]: value }));
  const chip = (active: boolean) =>
    cn("rounded-full border px-3 py-1.5 text-sm transition", active ? "border-violet-400 bg-violet-500/15 font-semibold" : "border-[var(--color-border)] hover:border-[var(--color-fg-dim)]");

  return (
    <div className="space-y-5 pb-10">
      <header className="space-y-2">
        <button className="text-sm underline" onClick={onExit}>← К маршруту</button>
        <h1 className="text-2xl font-bold">Песочница OpenCV</h1>
        <p className="text-sm text-[var(--color-muted)]">Крути ползунки и смотри, что делает каждая операция: результат, shape и код на Python. Фото обрабатывается прямо в браузере и никуда не отправляется.</p>
      </header>

      <section className="space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button key={s.src} className={chip(name === s.name)} onClick={() => void load(s.src, s.name)}>{s.name}</button>
          ))}
          <button className={chip(!SAMPLES.some((s) => s.name === name))} onClick={() => file.current?.click()}>Своё фото…</button>
          <input
            ref={file}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Загрузить своё фото"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void load(URL.createObjectURL(f), "Своё фото", true);
              e.target.value = "";
            }}
          />
        </div>
        {loadError && <p role="alert" className="text-sm text-red-400">{loadError}</p>}

        <div className="relative overflow-hidden rounded-2xl bg-[var(--color-bg)]">
          {result?.error && !original ? (
            <div role="alert" className="flex min-h-48 items-center justify-center p-5">
              <pre lang="en" className="whitespace-pre-wrap break-words font-mono text-[13px] text-red-300">{result.error}</pre>
            </div>
          ) : (
            <canvas ref={canvas} aria-label="Результат обработки" className="mx-auto block h-auto max-h-[55vh] w-auto max-w-full [image-rendering:auto]" />
          )}
          {src && (
            <button
              className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white"
              onPointerDown={() => setOriginal(true)}
              onPointerUp={() => setOriginal(false)}
              onPointerLeave={() => setOriginal(false)}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") setOriginal(true); }}
              onKeyUp={() => setOriginal(false)}
            >
              {original ? "Оригинал" : "Держи — оригинал"}
            </button>
          )}
        </div>
        {result?.note && <p className="text-sm text-amber-300">{result.note}</p>}
        {hist && !result?.error && (
          <div aria-hidden className="flex h-10 items-end gap-px rounded-xl bg-[var(--color-bg)] px-2 pt-1">
            {hist.map((v, i) => <span key={i} className="flex-1 rounded-t-sm bg-violet-400/70" style={{ height: `${Math.max(2, v * 100)}%` }} />)}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <Step n={1} title="Размер · cv2.resize">
          <label className="flex items-center gap-3 text-sm">
            <input type="range" min={10} max={100} step={5} value={p.scale} onChange={(e) => set("scale", Number(e.target.value))} className="flex-1" aria-label="Масштаб" />
            <span className="w-12 text-right tabular-nums">{p.scale}%</span>
          </label>
        </Step>

        <Step n={2} title="Цвет · cv2.cvtColor">
          <div className="flex flex-wrap gap-2">
            {([["bgr", "BGR как есть"], ["rgb-mistake", "Ошибка: BGR как RGB"], ["gray", "Серое"], ["h", "HSV: H"], ["s", "HSV: S"], ["v", "HSV: V"]] as [Color, string][]).map(([v, label]) => (
              <button key={v} className={chip(p.color === v)} onClick={() => set("color", v)}>{label}</button>
            ))}
          </div>
        </Step>

        <Step n={3} title="Размытие">
          <div className="flex flex-wrap gap-2">
            {([["none", "Нет"], ["gaussian", "GaussianBlur"], ["median", "medianBlur"]] as [Blur, string][]).map(([v, label]) => (
              <button key={v} className={chip(p.blur === v)} onClick={() => set("blur", v)}>{label}</button>
            ))}
          </div>
          {p.blur !== "none" && (
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-center gap-3">
                <span className="w-16 shrink-0">ksize</span>
                <input type="range" min={1} max={p.blur === "median" ? 11 : 15} step={1} value={p.k} onChange={(e) => set("k", Number(e.target.value))} className="flex-1" aria-label="Размер ядра" />
                <span className={cn("w-8 text-right tabular-nums", p.k % 2 === 0 && "text-red-400")}>{p.k}</span>
              </label>
              {p.blur === "gaussian" && (
                <label className="flex items-center gap-3">
                  <span className="w-16 shrink-0">sigmaX</span>
                  <input type="range" min={0} max={8} step={0.5} value={p.sigma} onChange={(e) => set("sigma", Number(e.target.value))} className="flex-1" aria-label="sigmaX" />
                  <span className="w-8 text-right tabular-nums">{p.sigma}</span>
                </label>
              )}
              <p className="text-xs text-[var(--color-muted)]">Поставь чётное ядро — увидишь ту же ошибку, что в Colab. sigmaX = 0 — OpenCV сам считает его по размеру ядра.</p>
            </div>
          )}
        </Step>

        <Step n={4} title="Результат">
          <div className="flex flex-wrap gap-2">
            {([["none", "Нет"], ["threshold", "threshold"], ["otsu", "Otsu"], ["canny", "Canny"], ["equalize", "equalizeHist"]] as [Final, string][]).map(([v, label]) => (
              <button key={v} className={chip(p.final === v)} onClick={() => set("final", v)}>{label}</button>
            ))}
          </div>
          {p.final === "threshold" && (
            <label className="mt-3 flex items-center gap-3 text-sm">
              <span className="w-16 shrink-0">thresh</span>
              <input type="range" min={0} max={255} value={p.t} onChange={(e) => set("t", Number(e.target.value))} className="flex-1" aria-label="Порог" />
              <span className="w-8 text-right tabular-nums">{p.t}</span>
            </label>
          )}
          {p.final === "canny" && (
            <div className="mt-3 space-y-2 text-sm">
              <label className="flex items-center gap-3">
                <span className="w-16 shrink-0">low</span>
                <input type="range" min={0} max={300} step={5} value={p.low} onChange={(e) => set("low", Number(e.target.value))} className="flex-1" aria-label="Нижний порог" />
                <span className="w-8 text-right tabular-nums">{p.low}</span>
              </label>
              <label className="flex items-center gap-3">
                <span className="w-16 shrink-0">high</span>
                <input type="range" min={0} max={400} step={5} value={p.high} onChange={(e) => set("high", Number(e.target.value))} className="flex-1" aria-label="Верхний порог" />
                <span className="w-8 text-right tabular-nums">{p.high}</span>
              </label>
            </div>
          )}
          {(p.final === "otsu" || p.final === "equalize") && (p.color === "bgr" || p.color === "rgb-mistake") && (
            <p className="mt-2 text-xs text-[var(--color-muted)]">Otsu и equalizeHist работают только с одним каналом — на цветной будет ошибка, как в настоящем OpenCV.</p>
          )}
        </Step>
        <Button variant="ghost" size="sm" onClick={() => setP(START)}>Сбросить настройки</Button>
      </section>

      {result && (
        <section className="space-y-2 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="font-semibold">Код на Python</h2>
          <pre lang="en" className="overflow-x-auto whitespace-pre rounded-2xl bg-[var(--color-bg)] px-4 py-3 font-mono text-[12.5px] leading-relaxed">
            {["import cv2", ...result.code].join("\n")}
          </pre>
        </section>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-xs">{n}</span>
        {title}
      </p>
      {children}
    </div>
  );
}
