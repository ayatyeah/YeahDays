"""
Локальный детектор кодового слова для ДиДи — единственная причина, по
которой это Python, а не Node: openWakeWord (обученная классификация
"hey jarvis") существует только как Python-библиотека, нормального
JS/WASM-порта нет. Node (src/main/didi/wakeword.ts) держит этот процесс
запущенным всё время работы голосового цикла и кормит его сырыми кадрами
с микрофона — сюда попадает КАЖДЫЙ кадр, но никуда за пределы этого
процесса (в отличие от Whisper-пути) он не уходит: OpenAI видит только то,
что записано ПОСЛЕ срабатывания "WAKE".

Протокол максимально простой (без JSON/длины-префикса): stdin — сырой
поток int16 моно 16кГц кадрами по FRAME_SAMPLES сэмплов (должно совпадать
с FRAME_LENGTH в audio.ts); stdout — "READY" один раз после загрузки
модели, дальше "WAKE <score>" на каждое срабатывание выше порога.
"""
import sys

FRAME_SAMPLES = 512  # держать в синхроне с FRAME_LENGTH в src/main/didi/audio.ts
THRESHOLD = 0.5

def main() -> None:
    import numpy as np
    from openwakeword.model import Model

    try:
        model = Model(wakeword_models=["hey_jarvis"], inference_framework="onnx")
    except Exception as e:  # модель не скачалась / onnxruntime сломан / т.п.
        print(f"ERROR {e}", flush=True)
        sys.exit(1)

    print("READY", flush=True)

    stdin = sys.stdin.buffer
    frame_bytes = FRAME_SAMPLES * 2  # int16 = 2 байта
    while True:
        chunk = stdin.read(frame_bytes)
        if len(chunk) < frame_bytes:
            break  # Node закрыл stdin (стоп/выход) — не половинка кадра поверх шума
        audio = np.frombuffer(chunk, dtype=np.int16)
        scores = model.predict(audio)
        score = float(scores.get("hey_jarvis", 0.0))
        if score >= THRESHOLD:
            print(f"WAKE {score:.3f}", flush=True)

if __name__ == "__main__":
    main()
