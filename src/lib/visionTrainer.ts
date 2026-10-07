/**
 * Тренажёр расчётов к мидтерму по Computer Vision.
 *
 * Расчёты и формы массивов — почти половина баллов мидтерма (Q2, Q3, Q4a–b),
 * и это навык, который тренируется повторением. Здесь — генераторы задач
 * «как на экзамене» с новыми числами на каждый раз, проверка без ИИ и
 * пошаговое решение. Задача воспроизводится по seed: одинаковый seed —
 * одинаковые числа (нужно для тестов и чтобы задача не менялась при
 * перерисовке).
 *
 * Тексты задач — по-английски, как на экзамене; формулы шагов — в разметке
 * конспекта (строки «= …»).
 */

export type TrainerKind = "linear" | "argmax" | "svm" | "softmax" | "conv" | "shape" | "split" | "precision";

export const TRAINER_KINDS: { kind: TrainerKind; title: string; exam: string }[] = [
  { kind: "linear", title: "s = Wx + b", exam: "Q3" },
  { kind: "argmax", title: "Предсказания и accuracy", exam: "Q2" },
  { kind: "svm", title: "SVM loss", exam: "Q3" },
  { kind: "softmax", title: "Softmax и cross-entropy", exam: "Q2–Q3" },
  { kind: "shape", title: "Формы массивов OpenCV", exam: "Q4" },
  { kind: "conv", title: "Размер свёртки и параметры", exam: "L5" },
  { kind: "split", title: "Разбиение датасета", exam: "Q5" },
  { kind: "precision", title: "Precision, recall, F1", exam: "Q2, Q5" },
];

export interface TrainerField {
  id: string;
  label: string;
  /** Число — сравнение с допуском; choice — индекс верного варианта. */
  type: "number" | "choice";
  answer: number;
  tol?: number;
  options?: string[];
  /** Подсказка формата: «2 знака после запятой», «в процентах». */
  hint?: string;
}

export interface TrainerTask {
  kind: TrainerKind;
  seed: number;
  /** Условие в разметке конспекта (таблицы, код строками «= »). */
  prompt: string;
  fields: TrainerField[];
  /** Пошаговое решение в той же разметке. */
  steps: string;
}

/* ───────────── случайные числа по seed ───────────── */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type R = () => number;
const int = (r: R, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
const pick = <T,>(r: R, list: readonly T[]) => list[Math.floor(r() * list.length)];
const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
/** Минус как на бумаге: «−3», а не «-3». */
const n = (v: number, d?: number) => {
  const s = d === undefined ? String(v) : v.toFixed(d);
  return s.startsWith("-") ? `−${s.slice(1)}` : s;
};
const paren = (v: number, d?: number) => (v < 0 ? `(${n(v, d)})` : n(v, d));

const CLASS_SETS = [
  ["Cat", "Dog", "Bird"],
  ["Deer", "Fox", "Boar"],
  ["Plastic", "Paper", "Glass"],
  ["Striped", "Checked", "Plain"],
  ["Free", "Occupied", "Blocked"],
  ["Ripe", "Unripe", "Overripe"],
  ["Owl", "Pheasant", "Magpie"],
] as const;

/* ───────────── генераторы ───────────── */

function linear(r: R, seed: number): TrainerTask {
  const classes = pick(r, CLASS_SETS);
  const d = r() < 0.5 ? 2 : 3;
  for (;;) {
    const W = classes.map(() => Array.from({ length: d }, () => int(r, -3, 3)));
    const x = Array.from({ length: d }, () => int(r, -3, 3));
    const b = classes.map(() => int(r, -2, 2));
    const s = W.map((row, i) => row.reduce((acc, w, j) => acc + w * x[j], 0) + b[i]);
    const top = Math.max(...s);
    if (s.filter((v) => v === top).length > 1 || x.every((v) => v === 0)) continue;
    const pred = s.indexOf(top);
    const head = `| Class | ${Array.from({ length: d }, (_, j) => `W col ${j + 1}`).join(" | ")} | b |`;
    const prompt = [
      `A ${classes.length}-class linear classifier computes s = Wx + b.`,
      head,
      `|${"---|".repeat(d + 2)}`,
      ...classes.map((c, i) => `| ${c} | ${W[i].map((v) => n(v)).join(" | ")} | ${n(b[i])} |`),
      `= x = [${x.map((v) => n(v)).join(", ")}]`,
      "Compute every score and the predicted class.",
    ].join("\n");
    const steps = [
      ...classes.map((c, i) => `= s_${c} = ${W[i].map((w, j) => `${n(w)}·${paren(x[j])}`).join(" + ")} + ${paren(b[i])} = ${n(s[i])}`),
      `= argmax([${s.map((v) => n(v)).join(", ")}]) = ${pred} → ${classes[pred]}`,
      "Bias is added after Wx; forgetting it is the most common way to lose points.",
    ].join("\n");
    return {
      kind: "linear",
      seed,
      prompt,
      steps,
      fields: [
        ...classes.map((c, i) => ({ id: `s${i}`, label: `s_${c}`, type: "number" as const, answer: s[i], tol: 0 })),
        { id: "pred", label: "Predicted class", type: "choice", answer: pred, options: [...classes] },
      ],
    };
  }
}

function argmax(r: R, seed: number): TrainerTask {
  const classes = pick(r, CLASS_SETS);
  const count = r() < 0.5 ? 4 : 5;
  const names = "ABCDE".slice(0, count).split("");
  const rows: { s: number[]; truth: number; pred: number }[] = [];
  const wrongTarget = int(r, 1, 2);
  let wrong = 0;
  for (let i = 0; i < count; i++) {
    for (;;) {
      const s = classes.map(() => round(int(r, -10, 30) / 10, 1));
      const top = Math.max(...s);
      const sorted = [...s].sort((a, b) => b - a);
      if (s.filter((v) => v === top).length > 1 || sorted[0] - sorted[1] < 0.1) continue;
      const pred = s.indexOf(top);
      const needWrong = wrong < wrongTarget && (count - i <= wrongTarget - wrong || r() < 0.4);
      const truth = needWrong ? (pred + int(r, 1, 2)) % classes.length : pred;
      if (truth !== pred) wrong++;
      rows.push({ s, truth, pred });
      break;
    }
  }
  const correct = rows.filter((row) => row.pred === row.truth).length;
  const acc = round((correct / count) * 100, 1);
  const prompt = [
    "A classifier produces the following scores:",
    `| Image | ${classes.join(" | ")} | True class |`,
    `|${"---|".repeat(classes.length + 2)}`,
    ...rows.map((row, i) => `| ${names[i]} | ${row.s.map((v) => n(v, 1)).join(" | ")} | ${classes[row.truth]} |`),
    "Write the predicted class for every image and the accuracy in percent.",
  ].join("\n");
  const steps = [
    ...rows.map((row, i) => `= ${names[i]}: max(${row.s.map((v) => n(v, 1)).join(", ")}) → ${classes[row.pred]} ${row.pred === row.truth ? "✓" : `✗ (true: ${classes[row.truth]})`}`),
    `= accuracy = ${correct} / ${count} = ${n(acc)}%`,
    "The prediction is the class with the highest score — not the true class and not the largest absolute value.",
  ].join("\n");
  return {
    kind: "argmax",
    seed,
    prompt,
    steps,
    fields: [
      ...rows.map((row, i) => ({ id: `p${i}`, label: `Image ${names[i]}`, type: "choice" as const, answer: row.pred, options: [...classes] })),
      { id: "acc", label: "Accuracy, %", type: "number", answer: acc, tol: 0.5 },
    ],
  };
}

function svm(r: R, seed: number): TrainerTask {
  const classes = pick(r, CLASS_SETS);
  const s = classes.map(() => round(int(r, -30, 50) / 10, 1));
  const y = int(r, 0, 2);
  const others = classes.map((_, j) => j).filter((j) => j !== y);
  const terms = others.map((j) => round(Math.max(0, s[j] - s[y] + 1), 2));
  const loss = round(terms.reduce((a, b) => a + b, 0), 2);
  const prompt = [
    "Scores of a linear classifier for one image:",
    `| ${classes.join(" | ")} |`,
    `|${"---|".repeat(classes.length)}`,
    `| ${s.map((v) => n(v, 1)).join(" | ")} |`,
    `The true class is ${classes[y]}. Compute the multiclass SVM (hinge) loss with margin 1.`,
    "= L = Σ over j ≠ y of max(0, s_j − s_y + 1)",
  ].join("\n");
  const steps = [
    ...others.map((j, k) => `= ${classes[j]}: max(0, ${n(s[j], 1)} − ${paren(s[y], 1)} + 1) = ${n(terms[k], 2)}`),
    `= L = ${terms.map((t) => n(t, 2)).join(" + ")} = ${n(loss, 2)}`,
    "Only the wrong classes are summed; the true class never compares with itself.",
  ].join("\n");
  return {
    kind: "svm",
    seed,
    prompt,
    steps,
    fields: [
      ...others.map((j, k) => ({ id: `t${k}`, label: `Term for ${classes[j]}`, type: "number" as const, answer: terms[k], tol: 0.01 })),
      { id: "loss", label: "Loss L", type: "number", answer: loss, tol: 0.01 },
    ],
  };
}

function softmax(r: R, seed: number): TrainerTask {
  const classes = pick(r, CLASS_SETS);
  const s = classes.map(() => int(r, -2, 4));
  const y = int(r, 0, 2);
  const e = s.map((v) => Math.exp(v));
  const sum = e.reduce((a, b) => a + b, 0);
  const p = e.map((v) => v / sum);
  const loss = -Math.log(p[y]);
  const prompt = [
    "Scores (logits) for one image:",
    `| ${classes.join(" | ")} |`,
    `|${"---|".repeat(classes.length)}`,
    `| ${s.map((v) => n(v)).join(" | ")} |`,
    `The true class is ${classes[y]}. Compute its softmax probability and the cross-entropy loss −ln p (natural log).`,
  ].join("\n");
  const steps = [
    `= exp: ${classes.map((c, i) => `e^${paren(s[i])} = ${n(e[i], 2)}`).join(", ")}`,
    `= sum = ${n(sum, 2)}`,
    `= p_${classes[y]} = ${n(e[y], 2)} / ${n(sum, 2)} = ${n(p[y], 2)}`,
    `= L = −ln(${n(p[y], 3)}) = ${n(loss, 2)}`,
    "Softmax keeps the order of the scores, so the argmax does not change; the loss is 0 only when p → 1.",
  ].join("\n");
  return {
    kind: "softmax",
    seed,
    prompt,
    steps,
    fields: [
      { id: "p", label: `p_${classes[y]}`, type: "number", answer: round(p[y], 2), tol: 0.011, hint: "2 знака после запятой" },
      { id: "loss", label: "Loss −ln p", type: "number", answer: round(loss, 2), tol: 0.021, hint: "2 знака после запятой" },
    ],
  };
}

function conv(r: R, seed: number): TrainerTask {
  for (;;) {
    const W = pick(r, [28, 32, 64, 96, 128, 224, 227]);
    const F = pick(r, [1, 3, 3, 5, 5, 7, 11]);
    const P = pick(r, [0, 0, 1, 1, 2, 3]);
    const S = pick(r, [1, 1, 2, 2, 4]);
    if ((W - F + 2 * P) % S !== 0 || W - F + 2 * P <= 0) continue;
    const C = pick(r, [1, 3, 3, 16, 32, 64]);
    const K = pick(r, [6, 10, 16, 32, 64, 96]);
    const out = (W - F + 2 * P) / S + 1;
    const params = K * (F * F * C + 1);
    const prompt = [
      `An input of size ${W} × ${W} × ${C} goes through a convolution layer with ${K} filters of size ${F} × ${F}, stride ${S} and padding ${P}.`,
      "= out = (W − F + 2P) / S + 1",
      "Compute the spatial output size and the number of learnable parameters (weights + biases).",
    ].join("\n");
    const steps = [
      `= out = (${W} − ${F} + 2·${P}) / ${S} + 1 = ${W - F + 2 * P} / ${S} + 1 = ${out}`,
      `= output volume: ${out} × ${out} × ${K}`,
      `= params = K × (F·F·C + 1) = ${K} × (${F}·${F}·${C} + 1) = ${K} × ${F * F * C + 1} = ${params}`,
      "Each filter spans the full input depth C and has one bias.",
    ].join("\n");
    return {
      kind: "conv",
      seed,
      prompt,
      steps,
      fields: [
        { id: "out", label: "Output size", type: "number", answer: out, tol: 0 },
        { id: "params", label: "Parameters", type: "number", answer: params, tol: 0 },
      ],
    };
  }
}

function shapeTask(r: R, seed: number): TrainerTask {
  const [W, H] = pick(r, [[1920, 1080], [1280, 720], [800, 600], [640, 480], [1080, 1920], [1024, 768], [2560, 1440]] as const);
  const file = pick(r, ["cat.jpg", "leaf.jpg", "bird.jpg", "fabric.jpg", "parking.jpg", "receipt.jpg"]);
  const gray0 = r() < 0.2;
  const lines = [gray0 ? `img = cv2.imread("${file}", cv2.IMREAD_GRAYSCALE)` : `img = cv2.imread("${file}")`];
  const notes = [`imread: ${gray0 ? `(${H}, ${W})` : `(${H}, ${W}, 3)`} — rows = height ${H}, columns = width ${W}`];
  let h: number = H, w: number = W, c: 1 | 3 = gray0 ? 1 : 3;
  let v = "img";
  const shape = () => (c === 3 ? `(${h}, ${w}, 3)` : `(${h}, ${w})`);
  // 2–3 шага: resize обязателен (там главная ловушка), остальное — по случаю
  const [rw, rh] = pick(r, [[224, 224], [300, 200], [640, 360], [128, 64], [96, 128], [320, 180], [256, 128], [150, 100]] as const);
  lines.push(`img = cv2.resize(img, (${rw}, ${rh}))`);
  w = rw; h = rh;
  notes.push(`resize(img, (${rw}, ${rh})): dsize is (width, height) → ${shape()}`);
  if (c === 3) {
    const conv2 = pick(r, ["gray", "rgb", "hsv", "gray"] as const);
    if (conv2 === "gray") { lines.push(`gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)`); v = "gray"; c = 1; notes.push(`BGR2GRAY: 3 channels → 1, 2-D array ${shape()}`); }
    if (conv2 === "rgb") { lines.push(`rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)`); v = "rgb"; notes.push(`BGR2RGB: still 3 channels, only B and R swap → ${shape()}`); }
    if (conv2 === "hsv") { lines.push(`hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)`); v = "hsv"; notes.push(`BGR2HSV: still 3 channels (H, S, V) → ${shape()}`); }
  }
  if (r() < 0.6) {
    const y1 = int(r, 0, Math.max(0, h - 40)), x1 = int(r, 0, Math.max(0, w - 40));
    const ch = int(r, 10, Math.min(80, h - y1)), cw = int(r, 10, Math.min(120, w - x1));
    lines.push(`crop = ${v}[${y1}:${y1 + ch}, ${x1}:${x1 + cw}]`);
    v = "crop"; h = ch; w = cw;
    notes.push(`slice [rows, columns] = [${y1}:${y1 + ch}, ${x1}:${x1 + cw}] → ${ch} rows × ${cw} columns → ${shape()}`);
  } else if (c === 1 && r() < 0.6) {
    lines.push(`edges = cv2.Canny(cv2.GaussianBlur(${v}, (5, 5), 0), 100, 200)`);
    v = "edges";
    notes.push(`GaussianBlur and Canny keep the size; Canny gives one channel of 0/255 → ${shape()}`);
  } else {
    lines.push(`norm = ${v} / 255.0`);
    v = "norm";
    notes.push(`/ 255.0 keeps the shape, only the dtype becomes float64 → ${shape()}`);
  }
  const prompt = [
    `A photo is ${W} pixels wide and ${H} pixels high. Consider:`,
    ...lines.map((l) => `= ${l}`),
    `Give the shape of ${v} after the last line.`,
  ].join("\n");
  const steps = notes.map((s) => `- ${s}`).concat(`= ${v}.shape = ${shape()}`).join("\n");
  return {
    kind: "shape",
    seed,
    prompt,
    steps,
    fields: [
      { id: "h", label: "Rows (height)", type: "number", answer: h, tol: 0 },
      { id: "w", label: "Columns (width)", type: "number", answer: w, tol: 0 },
      { id: "c", label: "Shape", type: "choice", answer: c === 3 ? 1 : 0, options: ["(h, w) — 2-D, one channel", "(h, w, 3) — three channels"] },
    ],
  };
}

function split(r: R, seed: number): TrainerTask {
  const N = pick(r, [1200, 1500, 2000, 2400, 2800, 3000, 4000, 5000, 6000]);
  const scheme = pick(r, [[80, 20], [70, 30], [70, 15, 15], [80, 10, 10], [60, 20, 20]] as const);
  const parts = scheme.map((pct) => Math.round((N * pct) / 100));
  const names = scheme.length === 2 ? ["train", "test"] : ["train", "validation", "test"];
  // доля класса такая, чтобы в тесте вышло целое число картинок
  let classShare = pick(r, [10, 15, 20, 25, 40]);
  while ((N * classShare * scheme[scheme.length - 1]) % 10000 !== 0) classShare = pick(r, [10, 20, 25, 40, 50]);
  const classTest = (N * classShare * scheme[scheme.length - 1]) / 10000;
  const prompt = [
    `You collected ${N.toLocaleString("en-US")} images. ${classShare}% of them belong to the class Glass.`,
    `Split the dataset ${scheme.join("/")} (${names.join("/")}), stratified by class.`,
    "Give the number of images in every part and the number of Glass images in the test set.",
  ].join("\n");
  const steps = [
    ...names.map((nm, i) => `= ${nm} = ${N} × ${scheme[i]}% = ${parts[i]}`),
    `= Glass in test = ${N} × ${classShare}% × ${scheme[scheme.length - 1]}% = ${classTest}`,
    "Stratified: every class keeps the same proportion in every part.",
  ].join("\n");
  return {
    kind: "split",
    seed,
    prompt,
    steps,
    fields: [
      ...names.map((nm, i) => ({ id: nm, label: nm[0].toUpperCase() + nm.slice(1), type: "number" as const, answer: parts[i], tol: 0 })),
      { id: "glass", label: "Glass in test", type: "number", answer: classTest, tol: 0 },
    ],
  };
}

function precision(r: R, seed: number): TrainerTask {
  const cls = pick(r, ["Plastic", "Fox", "Ripe", "Free", "Crack", "Owl"]);
  for (;;) {
    const actual = int(r, 20, 120);
    const tp = int(r, Math.ceil(actual * 0.4), actual);
    const fp = int(r, 0, 60);
    if (tp + fp === 0) continue;
    const predicted = tp + fp;
    const P = tp / predicted;
    const Rc = tp / actual;
    const F1 = (2 * P * Rc) / (P + Rc);
    const prompt = [
      `On the test set the model predicted ${cls} for ${predicted} images; ${tp} of them really are ${cls}.`,
      `There are ${actual} ${cls} images in the test set in total.`,
      `Compute precision, recall and F1 for ${cls}.`,
    ].join("\n");
    const steps = [
      `= TP = ${tp}, FP = ${predicted} − ${tp} = ${fp}, FN = ${actual} − ${tp} = ${actual - tp}`,
      `= precision = TP / (TP + FP) = ${tp} / ${predicted} = ${n(P * 100, 1)}%`,
      `= recall = TP / (TP + FN) = ${tp} / ${actual} = ${n(Rc * 100, 1)}%`,
      `= F1 = 2·P·R / (P + R) = ${n(F1, 2)}`,
      "Precision: how many of the predicted ones are right. Recall: how many of the real ones were found.",
    ].join("\n");
    return {
      kind: "precision",
      seed,
      prompt,
      steps,
      fields: [
        { id: "p", label: "Precision, %", type: "number", answer: round(P * 100, 1), tol: 0.6 },
        { id: "r", label: "Recall, %", type: "number", answer: round(Rc * 100, 1), tol: 0.6 },
        { id: "f1", label: "F1 (0–1)", type: "number", answer: round(F1, 2), tol: 0.011, hint: "2 знака после запятой" },
      ],
    };
  }
}

const GENERATORS: Record<TrainerKind, (r: R, seed: number) => TrainerTask> = { linear, argmax, svm, softmax, conv, shape: shapeTask, split, precision };

export function generate(kind: TrainerKind, seed: number): TrainerTask {
  return GENERATORS[kind](rng(seed), seed);
}

/** Число, как его пишут люди: «0,13», «75%», «−2», «1 600». */
export function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[\s%]/g, "").replace(/[−–]/g, "-").replace(",", ".");
  if (!cleaned || !/^-?\d*\.?\d+$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function checkField(field: TrainerField, raw: string): boolean {
  if (field.type === "choice") return raw === String(field.answer);
  const v = parseNumber(raw);
  return v !== null && Math.abs(v - field.answer) <= (field.tol ?? 0) + 1e-9;
}
