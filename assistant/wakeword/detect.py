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
import time

FRAME_SAMPLES = 512  # держать в синхроне с FRAME_LENGTH в src/main/didi/audio.ts
THRESHOLD = 0.5
# Одно произнесённое "Джарвис" растянуто на несколько кадров по 32мс — счёт
# выше порога держится не один кадр, а несколько подряд, так что без
# анти-дребезга одно слово даёт НЕСКОЛЬКО "WAKE" в лог и, что хуже, столько
# же попыток захвата команды одна поверх другой (первая ловит секунды
# тишины между собственным приветствием и второй попыткой, вторая обрывает
# первую на середине). debounce_time — родной механизм openWakeWord для
# этого именно; секундный ручной кулдаун — подстраховка поверх него.
DEBOUNCE_SECONDS = 2.0

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
    last_fire = 0.0
    while True:
        chunk = stdin.read(frame_bytes)
        if len(chunk) < frame_bytes:
            break  # Node закрыл stdin (стоп/выход) — не половинка кадра поверх шума
        audio = np.frombuffer(chunk, dtype=np.int16)
        scores = model.predict(
            audio,
            threshold={"hey_jarvis": THRESHOLD},
            debounce_time=DEBOUNCE_SECONDS,
        )
        score = float(scores.get("hey_jarvis", 0.0))
        now = time.monotonic()
        if score >= THRESHOLD and (now - last_fire) >= DEBOUNCE_SECONDS:
            last_fire = now
            print(f"WAKE {score:.3f}", flush=True)

if __name__ == "__main__":
    main()
