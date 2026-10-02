/**
 * Фото сообщества: посты и аватары.
 *
 * Хранятся в базе, а не в файловом хранилище: его у проекта нет, диск
 * Railway не переживает деплой, а пережатая картинка весит 100–200 КБ —
 * при нынешнем числе людей это разумная цена за отсутствие ещё одного
 * сервиса. Если фото станет много, меняется только этот файл.
 *
 * Каждая картинка перекодируется на сервере. Это не только про размер:
 * перекодирование выбрасывает метаданные снимка (в том числе координаты
 * места съёмки) и гарантирует, что в базе лежит именно изображение, а не
 * произвольный файл с расширением .jpg.
 */

import sharp, { type OutputInfo } from "sharp";
import { prisma } from "@/lib/db";
import { CommunityError } from "./community";

export type MediaKind = "post" | "avatar";

export const MAX_UPLOAD = 12 * 1024 * 1024;
const DAILY_UPLOADS = 40;
/**
 * Только растровые форматы камер и скриншотов. sharp умеет читать ещё SVG и
 * PDF, но это уже не «фото», а документы со своим разбором — лишняя
 * поверхность для атаки на сервер.
 */
const FORMATS = ["jpeg", "png", "webp", "heif", "gif"];

export async function storeImage(userId: string, input: Buffer, kind: MediaKind) {
  if (input.byteLength === 0) throw new CommunityError("Файл пустой");
  if (input.byteLength > MAX_UPLOAD) throw new CommunityError("Фото больше 12 МБ — выбери поменьше");

  const since = new Date(Date.now() - 86_400_000);
  if ((await prisma.socialMedia.count({ where: { userId, createdAt: { gt: since } } })) >= DAILY_UPLOADS) {
    throw new CommunityError("Слишком много фото за сутки — попробуй завтра");
  }

  let output: { data: Buffer; info: OutputInfo };
  try {
    // limitInputPixels: снимок в 50 Мп — это уже больше любой камеры телефона; всё крупнее похоже на «бомбу» из пикселей.
    const source = sharp(input, { failOn: "none", limitInputPixels: 50_000_000 });
    if (!FORMATS.includes((await source.metadata()).format ?? "")) throw new Error("format");
    const image = source.rotate(); // rotate() без аргумента ставит снимок по EXIF и убирает сам тег
    const sized = kind === "avatar"
      ? image.resize(512, 512, { fit: "cover" })
      : image.resize({ width: 1440, height: 1800, fit: "inside", withoutEnlargement: true });
    output = await sized.webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
  } catch {
    throw new CommunityError("Не получилось прочитать изображение. Подойдёт JPEG, PNG или WebP.");
  }

  // Загруженные, но так и не опубликованные фото — человек передумал или
  // закрыл страницу. Подметаем свои же старые при следующей загрузке.
  // То же с аватарами, которые загрузили, но не поставили.
  const stale = { lt: new Date(Date.now() - 2 * 3_600_000) };
  const current = (await prisma.communityProfile.findUnique({ where: { userId }, select: { avatarId: true } }))?.avatarId;
  await prisma.socialMedia.deleteMany({
    where: { userId, createdAt: stale, OR: [{ kind: "post", postId: null }, { kind: "avatar", ...(current ? { id: { not: current } } : {}) }] },
  });

  const row = await prisma.socialMedia.create({
    data: { userId, kind, mime: "image/webp", width: output.info.width, height: output.info.height, bytes: output.data.byteLength, data: new Uint8Array(output.data) },
    select: { id: true, width: true, height: true },
  });
  return { id: row.id, src: mediaUrl(row.id), width: row.width, height: row.height };
}

export const mediaUrl = (id: string) => `/api/media/${id}`;
