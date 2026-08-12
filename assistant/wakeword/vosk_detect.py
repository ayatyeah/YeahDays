"""
Детектор кодового слова через Vosk с ОГРАНИЧЕННОЙ грамматикой — вместо
классификатора звука (openWakeWord, заточен под "hey jarvis" и не подходит
для "СалемАй") и вместо открытого словаря Whisper (тот и путал короткое
"Салем" со случайными словами — см. живые логи в voiceLoop.ts). Vosk тут
работает не как обычный распознаватель речи: список из 3-го аргумента
KaldiRecognizer жёстко ограничивает, ЧТО он вообще может услышать — модели
разрешено выбрать только из "салем ай" / "салем" / "[unk]" (специальный
токен-заглушка для "что-то другое"), а не из всего словаря. Отсюда и
надёжность — не нужно нечёткое сравнение по Левенштейну постфактум.

Протокол — тот же, что у detect.py (openWakeWord), чтобы wakeword.ts мог
переиспользовать один и тот же spawn/stdin/stdout код: stdin — сырой int16
моно 16кГц кадрами по FRAME_SAMPLES; stdout — "READY" один раз после
загрузки модели, дальше "WAKE <распознанный текст>" на срабатывание.
"""
import json
import sys
import time

FRAME_SAMPLES = 512  # держать в синхроне с FRAME_LENGTH в src/main/didi/audio.ts
SAMPLE_RATE = 16000
DEBOUNCE_SECONDS = 2.0

# Отдельными строками — и слитно, и раздельно: Whisper-путь показал, что
# распознавание составного слова непредсказуемо (может выйти как одно
# слово, может как два) — то же самое стоит держать в уме и для Vosk,
# хотя грамматика тут работает иначе (список кандидатов, не текст на вход).
#
# "[unk]" один как "мусорная корзина" — плохая идея: с грамматикой ИЗ ДВУХ
# вариантов ("это наша фраза" или "что-то другое") распознаватель на живых
# тестах силой натягивал постороннюю речь на "салем ай" ("Джарвис покажи
# задачи", "Салют как дела" — оба ложно сработали). Добавляем ходовые слова
# из этого же приложения (быстрые команды, обычные обращения) — так у
# "чего-то другого" появляется куда более конкретное место, кроме нашей
# фразы, и ложных срабатываний становится ощутимо меньше.
GRAMMAR = [
    "салем ай",
    "джарвис",
    "погода",
    "время",
    "покажи",
    "задачи",
    "сегодня",
    "привет",
    "салют",
    "как дела",
    "что там",
    "спасибо",
    "стоп",
    "хватит",
    "отставить",
    "открой",
    "закрой",
    "включи",
    "выключи",
    "запомни",
    "гринд",
    "[unk]",
]


def main() -> None:
    import os

    from vosk import KaldiRecognizer, Model, SetLogLevel

    SetLogLevel(-1)  # глушим болтливый лог самого Vosk на stderr — он не про ошибки

    model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vosk-model-ru")
    try:
        model = Model(model_dir)
    except Exception as e:  # модель не нашлась / повреждена / т.п.
        print(f"ERROR {e}", flush=True)
        sys.exit(1)

    rec = KaldiRecognizer(model, SAMPLE_RATE, json.dumps(GRAMMAR, ensure_ascii=False))

    print("READY", flush=True)

    stdin = sys.stdin.buffer
    frame_bytes = FRAME_SAMPLES * 2  # int16 = 2 байта
    last_fire = 0.0

    while True:
        chunk = stdin.read(frame_bytes)
        if len(chunk) < frame_bytes:
            break  # Node закрыл stdin (стоп/выход) — не половинка кадра поверх шума

        final = rec.AcceptWaveform(chunk)
        text = ""
        if final:
            text = json.loads(rec.Result()).get("text", "")
        else:
            text = json.loads(rec.PartialResult()).get("partial", "")

        now = time.monotonic()
        if "салем" in text and (now - last_fire) >= DEBOUNCE_SECONDS:
            last_fire = now
            print(f"WAKE {text}", flush=True)
            rec.Reset()  # сброс внутреннего состояния — не тащим совпадение в следующую фразу


if __name__ == "__main__":
    main()
