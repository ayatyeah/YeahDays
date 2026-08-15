/**
 * POST /api/voice/transcribe — распознавание речи для голосовой страницы
 * СалемАй в PWA (src/components/SalemAiVoice.tsx). Требует сессию: это не
 * общий канал для десктоп-приложения (у того свой, через ASSISTANT_SECRET),
 * а функция внутри самого сайта — доступна только тому, кто уже вошёл.
 *
 * multipart/form-data: поле "audio" — файл, любой формат, что умеет
 * записать MediaRecorder браузера (webm/mp4/ogg — Whisper сам разбирает).
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const apiKey = process.env.OPENAI_API_KEY ?? "";
const client = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!client) {
    return NextResponse.json({ error: "OpenAI не настроен" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  const file = form.get("audio");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "audio required" }, { status: 400 });
  }
  // Голосовая команда — не подкаст: длинный файл почти наверняка ошибка
  // клиента (залипшая запись), а не то, что стоит гнать в Whisper за деньги.
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "Файл слишком большой" }, { status: 413 });
  }

  try {
    const res = await client.audio.transcriptions.create({
      file,
      model: "gpt-4o-mini-transcribe",
      language: "ru",
    });
    return NextResponse.json({ text: res.text.trim() });
  } catch (e) {
    console.error("voice transcribe failed:", e);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
