#!/usr/bin/env python3
"""
Перекладка «Историй»: спрайты героев и фоны → файлы для сцены в плеере.

  python3 scripts/story-rig.py <id истории> <папка Codex>

В папке Codex (см. ~/.cache/yg-stories/rig-*):
  sprites/<герой>_<поза>.png    — герой целиком на ровном зелёном фоне (хромакей);
  sprites/<…>_o.png, <…>_b.png  — та же картинка с открытым ртом и с закрытыми глазами;
  plates/<фон>.png              — место действия без людей, 16:9;
  rig.json                      — { "glow": ["<герой>"], "sprites": { "<спрайт>": { правки } },
                                    "plates": { "<фон>": { "front": [[x, y], …] } },
                                    "overlays": { "<имя>": { "src": "<png>", "circle": [x, y, r], "black": true } } }:
                                  front — многоугольник переднего плана (стол, кружки) в долях кадра,
                                  он рисуется поверх героев; overlays — круг из картинки (видение),
                                  центр в долях ширины и высоты, радиус в долях высоты.

Что получается:
  public/stories/<id>/rig/<имя>.webp            — спрайт с прозрачностью, обрезанный по герою;
  public/stories/<id>/rig/<имя>_o.webp, _b.webp — заплатки: только рот и только глаза;
  public/stories/<id>/rig/<фон>.webp, _blur.webp, _front.webp;
  src/lib/stories/rigs/<id>.json                — размеры, точка опоры (ступни), где рот, глаза и шея.

Заплатки — разница между спрайтом и его правкой: Codex перерисовывает всю картинку,
поэтому берётся только место, где отличие заметное, в верхней трети героя, с мягким краем.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
GREEN = (5, 249, 3)  # хромакей Codex: медиана края картинки
SPRITE_H = 1536  # спрайт не уменьшается: на крупном плане лицо во весь кадр


def key(rgb: np.ndarray) -> np.ndarray:
    """Альфа по «зелёности» (g − max(r, b)): чистый хромакей — прозрачно, полутона волос — полупрозрачно.

    Зелень, окружённая героем (между рукой и посохом, между прядями), — тоже фон: оливковая
    куртка Дани «зелёна» лишь на 10–30 и остаётся непрозрачной.
    """
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    k = g - np.maximum(r, b)
    alpha = 1 - np.clip((k - 45) / 120, 0, 1)
    # жёлто-зелёный ореол свечения на хромакее (красного много, зелёного ещё больше) — тоже фон;
    # оливковая куртка Дани (красного мало) не задевается
    halo = (r > 150) & (k > 20)
    return np.where(halo, alpha * (1 - np.clip((k - 20) / 60, 0, 1)), alpha)


def despill(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Убрать зелёный ореол у края: у краевых пикселей зелёный не больше max(r, b)."""
    edge = Image.fromarray(((alpha < 0.98) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))
    near = np.asarray(edge) > 0
    out = rgb.copy()
    # полупрозрачный край — смесь героя с зелёным фоном: вычитаем фон, остаётся цвет героя
    a = alpha[..., None]
    semi = (alpha > 0.04) & (alpha < 0.98)
    unmixed = np.clip((rgb - (1 - a) * np.array(GREEN)) / np.maximum(a, 0.04), 0, 255)
    out[semi] = unmixed[semi]
    g = out[..., 1]
    cap = np.maximum(out[..., 0], out[..., 2]) + 6
    out[..., 1] = np.where(near & (g > cap), cap, g)
    # и везде: зелёный отсвет хромакея на свечении и бликах (оливковое «зеленее» лишь на 10–12)
    cap = np.maximum(out[..., 0], out[..., 2]) + 12
    out[..., 1] = np.minimum(out[..., 1], cap)
    return out


def shift_of(a: np.ndarray, b: np.ndarray) -> tuple[int, int]:
    """Сдвиг b относительно a (фазовая корреляция по яркости)."""
    ga, gb = a.mean(-1), b.mean(-1)
    f = np.fft.fft2(ga) * np.conj(np.fft.fft2(gb))
    r = np.fft.ifft2(f / (np.abs(f) + 1e-6)).real
    dy, dx = np.unravel_index(np.argmax(r), r.shape)
    h, w = r.shape
    if dy > h // 2:
        dy -= h
    if dx > w // 2:
        dx -= w
    return int(dy), int(dx)


def patch(base: np.ndarray, alpha: np.ndarray, variant: np.ndarray, top: int, bottom: int, name: str):
    """Где правка отличается от спрайта — прямоугольник и заплатка с мягкой альфой.

    Codex при правке чуть перерисовывает всю картинку (шум по контурам волос и одежды),
    а настоящая правка — яркое пятно: рот или пара глаз. Берётся самое сильное пятно
    в верхней трети героя и всё рядом с ним, что не слабее 40 % его силы.
    """
    dy, dx = shift_of(base, variant)
    if abs(dy) > 12 or abs(dx) > 12:
        dy, dx = 0, 0
    v = np.roll(variant, (dy, dx), axis=(0, 1))
    d = np.abs(base - v).sum(-1)
    db = np.asarray(Image.fromarray(np.clip(d / 2, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(8))).astype(float)
    inside = np.asarray(Image.fromarray(((alpha > 0.5) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(7))) > 0
    region = np.zeros_like(inside)
    region[top:bottom] = True
    db = np.where(region & inside, db, 0)
    peak = db.max()
    if peak < 8:
        print(f"  {name}: правка не найдена")
        return None
    py, px = np.unravel_index(np.argmax(db), db.shape)
    yy, xx = np.mgrid[0 : db.shape[0], 0 : db.shape[1]]
    near = np.hypot(yy - py, xx - px) < 0.11 * db.shape[1]
    m = (db > 0.4 * peak) & near
    ys, xs = np.nonzero(m)
    y0, y1 = max(0, ys.min() - 14), min(m.shape[0], ys.max() + 15)
    x0, x1 = max(0, xs.min() - 14), min(m.shape[1], xs.max() + 15)
    soft = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(5))
    a = np.asarray(soft).astype(float) / 255 * alpha
    rgba = np.dstack([v, a * 255])[y0:y1, x0:x1]
    print(f"  {name}: {x1 - x0}×{y1 - y0} px у ({px}, {py}), сила {peak:.0f}" + (f", сдвиг правки {dx},{dy}" if dx or dy else ""))
    return {"x": int(x0), "y": int(y0), "w": int(x1 - x0), "h": int(y1 - y0)}, rgba, (int(px), int(py))


def save_webp(arr: np.ndarray, path: Path, quality=86):
    mode = "RGBA" if arr.shape[-1] == 4 else "RGB"
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), mode).save(path, "WEBP", quality=quality, method=6)


def main():
    story, src = sys.argv[1], Path(sys.argv[2]).expanduser()
    out = ROOT / "public" / "stories" / story / "rig"
    out.mkdir(parents=True, exist_ok=True)
    cfg = json.loads((src / "rig.json").read_text()) if (src / "rig.json").exists() else {}
    manifest = {"sprites": {}, "plates": {}}

    for png in sorted((src / "plates").glob("*.png")):
        name = png.stem
        im = Image.open(png).convert("RGB")
        im.save(out / f"{name}.webp", "WEBP", quality=84, method=6)
        im.filter(ImageFilter.GaussianBlur(im.width / 260)).save(out / f"{name}_blur.webp", "WEBP", quality=70, method=6)
        info = {"w": im.width, "h": im.height}
        poly = cfg.get("plates", {}).get(name, {}).get("front")
        if poly:
            m = Image.new("L", im.size, 0)
            ImageDraw.Draw(m).polygon([(x * im.width, y * im.height) for x, y in poly], fill=255)
            m = m.filter(ImageFilter.GaussianBlur(1.5))
            box = m.getbbox()
            front = im.convert("RGBA")
            front.putalpha(m)
            front.crop(box).save(out / f"{name}_front.webp", "WEBP", quality=84, method=6)
            info["front"] = {"x": box[0], "y": box[1], "w": box[2] - box[0], "h": box[3] - box[1]}
        manifest["plates"][name] = info
        print(f"фон {name}")

    for name, o in cfg.get("overlays", {}).items():
        im = Image.open(src / o["src"]).convert("RGB")
        cx, cy, r = o["circle"][0] * im.width, o["circle"][1] * im.height, o["circle"][2] * im.height
        box = (round(cx - r), round(cy - r), round(cx + r), round(cy + r))
        crop = np.asarray(im.crop(box)).astype(float)
        n = crop.shape[0]
        yy, xx = np.mgrid[0:n, 0:crop.shape[1]]
        d = np.hypot(xx - crop.shape[1] / 2, yy - n / 2) / (n / 2)
        a = np.clip((1 - d) / 0.08, 0, 1)
        if o.get("black"):
            # на чёрном фоне: снаружи круга остаётся только светлое (искры, шестерёнки)
            a = np.maximum(a, np.clip(crop.max(-1) / 90, 0, 1))
        save_webp(np.dstack([crop, a * 255]), out / f"{name}.webp")
        print(f"видение {name}")

    for png in sorted((src / "sprites").glob("*.png")):
        name = png.stem
        if name.endswith(("_o", "_b", "_t")):
            continue
        rgb = np.asarray(Image.open(png).convert("RGB")).astype(float)
        alpha = key(rgb)
        rows = np.nonzero((alpha > 0.5).sum(1) > 2)[0]
        cols = np.nonzero((alpha > 0.5).sum(0) > 2)[0]
        top, bottom = rows.min(), rows.max()
        left, right = cols.min(), cols.max()
        height = bottom - top
        head = (top, int(top + height * 0.3))
        print(f"спрайт {name}")
        parts = {}
        for suffix, label in (("_o", "mouth"), ("_b", "blink")):
            p = src / "sprites" / f"{name}{suffix}.png"
            if p.exists():
                var = np.asarray(Image.open(p).convert("RGB").resize((rgb.shape[1], rgb.shape[0]))).astype(float)
                got = patch(rgb, alpha, var, head[0], head[1], label)
                if got:
                    parts[label] = got
        clean = despill(rgb, alpha)
        # обрезка по герою с запасом и уменьшение
        m = 8
        y0, y1 = max(0, top - m), min(rgb.shape[0], bottom + m)
        x0, x1 = max(0, left - m), min(rgb.shape[1], right + m)
        s = min(1.0, SPRITE_H / (y1 - y0))
        rgba = np.dstack([clean, alpha * 255])[y0:y1, x0:x1]
        im = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA")
        W, H = round(im.width * s), round(im.height * s)
        im.resize((W, H), Image.LANCZOS).save(out / f"{name}.webp", "WEBP", quality=86, method=6)
        # ступни: середина нижних строк силуэта
        foot_rows = alpha[bottom - max(4, height // 40) : bottom + 1] > 0.5
        fx = np.nonzero(foot_rows.any(0))[0]
        info = {"w": W, "h": H, "foot": [round(((fx.min() + fx.max()) / 2 - x0) * s), round((bottom - y0) * s)]}
        for label, (box, arr, _) in parts.items():
            pim = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")
            pw, ph = max(1, round(pim.width * s)), max(1, round(pim.height * s))
            pim.resize((pw, ph), Image.LANCZOS).save(out / f"{name}_{label[0]}.webp", "WEBP", quality=88, method=6)
            info[label] = {"x": round((box["x"] - x0) * s), "y": round((box["y"] - y0) * s), "w": pw, "h": ph}
        # шея — точка поворота головы (в пикселях исходника): от глаз через рот и дальше
        # на треть расстояния; без рта — на 11 % роста ниже глаз
        eyes = mouth = None
        if "blink" in parts:
            b = parts["blink"][0]
            eyes = np.array([b["x"] + b["w"] / 2, b["y"] + b["h"] / 2])
        if "mouth" in parts:
            mouth = np.array(parts["mouth"][2], dtype=float)
        if eyes is not None and mouth is not None:
            neck = mouth + (mouth - eyes) * 1.3
        elif eyes is not None:
            neck = eyes + [0, 0.11 * height]
        elif mouth is not None:
            neck = mouth + [0, 0.06 * height]
        else:
            neck = np.array([(left + right) / 2, top + 0.14 * height])
        info["neck"] = [round((neck[0] - x0) * s), round((neck[1] - y0) * s)]
        # макушка: верхняя точка силуэта над шеей (поднятые руки и посох в стороне не в счёт)
        band = alpha[:, max(0, int(neck[0] - 0.07 * rgb.shape[1])) : int(neck[0] + 0.07 * rgb.shape[1])] > 0.5
        hrows = np.nonzero(band.sum(1) > 2)[0]
        if len(hrows):
            info["top"] = round((hrows.min() - y0) * s)
        # свечение (навершие посоха) — только у героев из rig.json "glow": самые яркие тёплые пиксели в верхней половине
        if any(name.startswith(g) for g in cfg.get("glow", [])):
            warm = (rgb[..., 0] > 235) & (rgb[..., 1] > 190) & (alpha > 0.5)
            warm[top + height // 2 :] = False
            if warm.sum() > 150:
                wy, wx = np.nonzero(warm)
                info["glow"] = [round((np.median(wx) - x0) * s), round((np.median(wy) - y0) * s)]
        info.update(cfg.get("sprites", {}).get(name, {}))
        manifest["sprites"][name] = info

    dst = ROOT / "src" / "lib" / "stories" / "rigs" / f"{story}.json"
    dst.parent.mkdir(parents=True, exist_ok=True)
    old = json.loads(dst.read_text()) if dst.exists() else {"sprites": {}, "plates": {}}
    old = {"sprites": {**old["sprites"], **manifest["sprites"]}, "plates": manifest["plates"] or old["plates"]}
    dst.write_text(json.dumps(old, ensure_ascii=False, indent=1) + "\n")
    print(f"→ {dst.relative_to(ROOT)}: спрайтов {len(old['sprites'])}, фонов {len(old['plates'])}")


if __name__ == "__main__":
    main()
