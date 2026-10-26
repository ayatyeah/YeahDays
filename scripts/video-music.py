#!/usr/bin/env python3
"""Фоновая музыка для роликов-объяснений: мягкий лоу-фай, написанный кодом.

    python3 scripts/video-music.py [выход.wav]   # по умолчанию ~/.cache/yg-video/music.wav

Своя музыка, а не скачанная: никаких вопросов с правами, когда ролики уходят
в TikTok и Reels. Трек — бесшовная петля 96 с (32 такта, 80 BPM): события у
конца заворачиваются в начало, реверберация и фильтры считаются циклической
свёрткой через БПФ, поэтому ролик можно начинать с любого места трека, а
длинный — крутить по кругу. Случайность с фиксированным зерном: каждый
запуск даёт тот же самый файл.

Гармония — ii–V–I–vi в фа мажоре (Gm9 → C9 → Fmaj9 → Dm9) без корней в
аккордах: электропиано (FM-синтез), тихий пэд, бас, бит со свингом и
мелодия колокольчиком через фразу. Под голосом музыка должна быть фоном,
поэтому мелодия высоко (C5–A5), а аккорды — средний регистр без резких атак.
"""

import os
import sys
import wave

import numpy as np

SR = 44100
BPM = 80
BEAT = 60 / BPM  # 0,75 с
BAR = 4 * BEAT  # 3 с
BARS = 32
N = int(round(BARS * BAR * SR))
rng = np.random.default_rng(2026)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def add(buf, at, sig, pan=0.0):
    """Сложить сигнал в стерео-буфер с момента at (с), заворачивая хвост в начало трека."""
    start = int(round(at * SR)) % N
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    idx = (start + np.arange(len(sig))) % N
    np.add.at(buf[0], idx, sig * left * np.sqrt(2))
    np.add.at(buf[1], idx, sig * right * np.sqrt(2))


def spectral(sig, gain):
    """Фильтр в частотной области (нулевая фаза, циклический — петле не мешает)."""
    spec = np.fft.rfft(sig)
    f = np.fft.rfftfreq(len(sig), 1 / SR)
    return np.fft.irfft(spec * gain(f), len(sig))


def lowpass(f, fc, order=2):
    return 1 / np.sqrt(1 + (f / fc) ** (2 * order))


def highpass(f, fc, order=2):
    return 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order))


def swing(eighth):
    """Время восьмой (в долях): вторая восьмая каждой доли чуть запаздывает."""
    return eighth / 2 + (eighth % 2) * 0.09


def humanize():
    return rng.normal(0, 0.006)


# ───────── инструменты ─────────

def rhodes(midi, dur, vel=1.0):
    """Электропиано: FM, индекс модуляции быстро гаснет — мягкий «звон» в начале и тёплый тон дальше."""
    length = dur + 1.2
    t = np.arange(int(length * SR)) / SR
    f = hz(midi)
    index = 1.6 * np.exp(-t / 0.25) + 0.25
    tone = np.sin(2 * np.pi * f * t + index * np.sin(2 * np.pi * f * t))
    tone += 0.12 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.4)
    env = np.minimum(1, t / 0.006) * np.exp(-t / 1.6)
    release = np.clip((dur + 0.25 - t) / 0.25, 0, 1)  # отпустили клавишу — затухает за четверть секунды
    tremolo = 1 + 0.06 * np.sin(2 * np.pi * 4.2 * t)
    return vel * tone * env * release * tremolo


def pad(midis, dur):
    """Пэд: протяжные синусы с лёгкой расстройкой, медленная атака и спад."""
    t = np.arange(int((dur + 1.0) * SR)) / SR
    out = np.zeros_like(t)
    for m in midis:
        for cents in (-6, 5):
            f = hz(m) * 2 ** (cents / 1200)
            out += np.sin(2 * np.pi * f * t + rng.uniform(0, 2 * np.pi))
    env = np.clip(t / 0.8, 0, 1) * np.clip((dur + 1.0 - t) / 1.0, 0, 1)
    return out * env / (2 * len(midis))


def bass(midi, dur):
    t = np.arange(int((dur + 0.15) * SR)) / SR
    f = hz(midi)
    tone = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.1 * np.sin(2 * np.pi * 3 * f * t)
    env = np.minimum(1, t / 0.012) * np.exp(-t / 1.1) * np.clip((dur + 0.15 - t) / 0.15, 0, 1)
    return np.tanh(1.3 * tone * env) * 0.8


def bell(midi, dur):
    """Колокольчик для мелодии: синус и тихая неровная гармоника, долгий спад."""
    t = np.arange(int((dur + 1.5) * SR)) / SR
    f = hz(midi)
    tone = np.sin(2 * np.pi * f * t) + 0.18 * np.sin(2 * np.pi * 2.0 * f * t) * np.exp(-t / 0.3) + 0.06 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t / 0.15)
    env = np.minimum(1, t / 0.01) * np.exp(-t / 0.9) * np.clip((dur + 1.5 - t) / 0.4, 0, 1)
    return tone * env


def kick():
    t = np.arange(int(0.35 * SR)) / SR
    freq = 58 + 80 * np.exp(-t / 0.03)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(phase) * np.exp(-t / 0.09) * np.minimum(1, t / 0.002)


def snare():
    t = np.arange(int(0.3 * SR)) / SR
    noise = spectral(rng.standard_normal(len(t)), lambda f: lowpass(f, 3500) * highpass(f, 900))
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04)
    return (0.7 * noise * np.exp(-t / 0.075) + 0.5 * body) * np.minimum(1, t / 0.002)


def hat():
    t = np.arange(int(0.08 * SR)) / SR
    noise = spectral(rng.standard_normal(len(t)), lambda f: highpass(f, 7000))
    return noise * np.exp(-t / 0.018)


# ───────── партитура ─────────

# Аккорды без корня (rootless voicings): голоса меняются по одной-две ноты.
CHORDS = [
    ("Gm9", 43, [58, 62, 65, 69]),
    ("C9", 48, [58, 62, 64, 69]),
    ("Fmaj9", 41, [57, 60, 64, 67]),
    ("Dm9", 50, [60, 64, 65, 69]),
]

# Ритм электропиано на такт: (доля, длительность в долях, громкость). Два варианта, чтобы не надоедало.
COMP = [
    [(0, 1.4, 0.9), (swing(3), 0.5, 0.55), (2.5, 1.2, 0.7)],
    [(0, 2.2, 0.85), (swing(5), 0.4, 0.5), (3.0, 0.9, 0.6)],
]

# Мелодия: по 4 такта, (доля в такте, нота, длительность в долях).
MOTIF_A = [
    [(0.0, 74, 1.0), (1.0, 77, 0.5), (1.5, 81, 1.0), (3.0, 79, 0.75)],
    [(0.5, 76, 0.5), (1.0, 74, 1.5), (3.0, 72, 1.0)],
    [(0.0, 72, 0.5), (0.5, 76, 0.5), (1.0, 79, 2.0)],
    [(1.5, 77, 0.5), (2.0, 76, 0.5), (2.5, 74, 1.5)],
]
MOTIF_B = [
    [(0.5, 81, 0.5), (1.0, 79, 0.5), (1.5, 77, 1.0), (2.5, 74, 1.0)],
    [(0.0, 76, 1.0), (1.5, 79, 0.5), (2.0, 76, 1.5)],
    [(0.0, 81, 1.5), (2.0, 79, 0.5), (2.5, 76, 1.0)],
    [(0.0, 77, 1.0), (1.0, 76, 0.5), (1.5, 74, 2.0)],
]
# Восемь фраз по 4 такта: где какая мелодия (None — только аккомпанемент).
PHRASES = [None, None, MOTIF_A, MOTIF_B, None, MOTIF_A, MOTIF_B, None]


def render():
    keys = np.zeros((2, N))
    pads = np.zeros((2, N))
    low = np.zeros((2, N))
    drums = np.zeros((2, N))
    melody = np.zeros((2, N))
    for b in range(BARS):
        at = b * BAR
        name, root, voicing = CHORDS[b % 4]
        phrase = b // 4
        for beat, dur, vel in COMP[(b + phrase) % 2]:
            for k, m in enumerate(voicing):
                # Аккорд «раскатывается» снизу вверх на пару миллисекунд — живее, чем удар всеми пальцами.
                add(keys, at + beat * BEAT + k * 0.007 + humanize(), rhodes(m, dur * BEAT, vel * rng.uniform(0.85, 1.0)), pan=-0.15 + 0.1 * k)
        add(pads, at, pad([m + 12 for m in voicing[1:]], BAR), pan=0.0)
        # Бас: корень на раз, на «три» — корень или квинта.
        add(low, at + humanize(), bass(root, 1.6 * BEAT))
        add(low, at + 2.5 * BEAT + humanize(), bass(root + (7 if b % 2 else 0), 1.2 * BEAT), pan=0.0)
        # Бит: бочка на раз и «три-и», мягкий малый на два и четыре, хэт — восьмые со свингом.
        # Бочка тихая: на телефоне низ всё равно не слышен, а громкая бочка задавала бы весь уровень трека.
        add(drums, at + humanize(), kick() * 0.4)
        add(drums, at + 2.5 * BEAT + humanize(), kick() * 0.3)
        if b % 4 == 3:
            add(drums, at + swing(7) * BEAT + humanize(), kick() * 0.2)
        for beat in (1, 3):
            add(drums, at + beat * BEAT + 0.012 + humanize(), snare() * rng.uniform(0.75, 0.9), pan=0.05)
        for e in range(8):
            accent = 0.9 if e % 2 == 0 else 0.55
            add(drums, at + swing(e) * BEAT + humanize(), hat() * 3.5 * accent * rng.uniform(0.8, 1.0), pan=-0.3)
        motif = PHRASES[phrase]
        if motif:
            for beat, m, dur in motif[b % 4]:
                add(melody, at + beat * BEAT + humanize(), bell(m, dur * BEAT) * rng.uniform(0.8, 1.0), pan=0.25)

    # Реверберация: затухающий шум 2,4 с, свой для каждого канала — ширина стерео.
    def impulse(seed):
        r = np.random.default_rng(seed)
        t = np.arange(int(2.4 * SR)) / SR
        ir = r.standard_normal(len(t)) * np.exp(-t / 0.55)
        ir[: int(0.012 * SR)] = 0  # предзадержка
        ir = spectral(np.pad(ir, (0, N - len(ir))), lambda f: lowpass(f, 5000))
        return ir / np.sqrt(np.sum(ir ** 2))

    send = 0.5 * keys + 0.6 * pads + 0.8 * melody + 0.25 * drums
    wet = np.stack([np.fft.irfft(np.fft.rfft(send[c]) * np.fft.rfft(impulse(11 + c)), N) for c in (0, 1)])

    mix = 0.5 * keys + 0.2 * pads + 0.3 * low + 0.34 * drums + 0.24 * melody + 0.22 * wet
    # Лоу-фай: срезать верх и самый низ (телефон его всё равно не сыграет), слегка «пережать» лентой.
    mix = np.stack([spectral(mix[c], lambda f: lowpass(f, 6500) * highpass(f, 60)) for c in (0, 1)])
    mix = np.tanh(1.4 * mix / np.max(np.abs(mix))) / np.tanh(1.4)
    return mix / np.max(np.abs(mix)) * 0.89  # пик −1 дБ


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/.cache/yg-video/music.wav")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    mix = render()
    pcm = (np.clip(mix.T, -1, 1) * 32767).astype("<i2")
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"{out}: {N / SR:.0f} с, {BARS} тактов, {BPM} BPM")


if __name__ == "__main__":
    main()
