"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Экраны сообщества-соцсети: лента с фото, «Интересное», активность,
 * профиль с сеткой постов. Команды с их обсуждениями, квестами и комнатами
 * остаются в page.tsx.
 *
 * Профиль человека — это его аккаунт YeahGrind: имя, персонаж, уровень и
 * серия приходят с сервера сами, отдельной анкеты нет.
 */

export interface PersonBase { userId: string; name: string; avatar: string; character: boolean; level: number; streak: number }
export interface Media { src: string; width: number; height: number }
export interface PostView extends PersonBase {
  id: string; text: string; createdAt: string; media: Media[];
  likes: number; comments: number; liked: boolean; mine: boolean;
}
export interface Person extends PersonBase { bio: string; subjects: string[]; followers: number; isFollowing: boolean }
export interface OpenTeam { id: string; name: string; subject: string; about: string; members: number; joined: boolean }
export interface ProfileData extends PersonBase {
  figure: string; xp: number; bio: string; subjects: string[]; goals: string[]; hidden: boolean;
  followers: number; following: number; postCount: number; isFollowing: boolean; followsMe: boolean; mine: boolean; posts: PostView[];
}
export interface Notice extends PersonBase { kind: "follow" | "like" | "comment"; at: string; postId: string | null; excerpt: string; image: string | null; comment: string; fresh: boolean }

/** Что нужно экранам от оболочки: можно ли действовать и куда вести. */
export interface Ctx {
  /** false — политика ещё не принята или человек скрыт: читать можно, действовать нельзя. */
  canAct: boolean;
  onProfile: (id: string) => void;
  onPost: (id: string) => void;
  /** Показать, почему действие недоступно. */
  onBlocked: () => void;
}

const field = "w-full min-w-0 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-2.5 text-base";
const primary = "min-h-11 rounded-xl bg-[var(--color-intelligence)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] disabled:opacity-50";
const secondary = "min-h-11 rounded-xl border border-[var(--color-border-strong)] px-3 py-2 text-sm disabled:opacity-50";
const card = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]";

export async function api(query = "", body?: Record<string, unknown>) {
  const res = await fetch("/api/community" + query, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Не удалось загрузить данные");
  return data;
}

/**
 * Подготовить фото к отправке: уменьшить и перекодировать в JPEG.
 *
 * Снимок с телефона весит 3–8 МБ и часто в HEIC, который сервер не читает.
 * Браузер умеет открыть свой же формат, поэтому перекодируем здесь: на
 * мобильной сети уходит 300 КБ вместо пяти мегабайт. Если не вышло —
 * отправляем как есть, сервер попробует сам.
 */
async function prepare(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/jpeg", 0.88));
  } catch {
    return file;
  }
}

export async function uploadImage(file: File, kind: "post" | "avatar"): Promise<Media & { id: string }> {
  const blob = await prepare(file);
  const res = await fetch(`/api/media?kind=${kind}`, { method: "POST", body: blob, headers: { "Content-Type": blob.type || "application/octet-stream" } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Не удалось загрузить фото");
  return data;
}

const ICONS = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M18 14.3c2.1.7 3.5 2.6 3.5 5.7" /></>,
  heart: <path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11Z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
  comment: <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.1A8.5 8.5 0 1 1 21 11.5Z" />,
  send: <><path d="M21 3 10.5 13.5" /><path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" /></>,
  more: <><circle cx="5" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="19" cy="12" r="1.4" fill="currentColor" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m4 17 5-5 4 4 3-3 4 4" /></>,
  grid: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></>,
  rows: <><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /></>,
  layers: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M4 15V6a2 2 0 0 1 2-2h9" /></>,
} as const;

/** Свои контурные значки: одной толщины и одного размера, в отличие от символов шрифта. */
export function Icon({ name, size = 24, filled = false, className }: { name: keyof typeof ICONS; size?: number; filled?: boolean; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {ICONS[name]}
    </svg>
  );
}

/** «5 мин», «3 ч», «2 дн» — как в любой ленте; старше недели — дата. */
function ago(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} ч`;
  if (minutes < 60 * 24 * 7) return `${Math.floor(minutes / 1440)} дн`;
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

/**
 * Аватар. Свой снимок показывается как есть; если его нет — персонаж
 * аккаунта, приближенный к лицу: картинка персонажа в полный рост, и в
 * кружке иначе была бы видна фигурка размером с муравья.
 */
export function Avatar({ person, size = 40, ring = false }: { person: { name: string; avatar: string; character: boolean }; size?: number; ring?: boolean }) {
  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden rounded-full bg-[var(--color-surface-2)]", ring && "ring-2 ring-[var(--color-intelligence)] ring-offset-2 ring-offset-[var(--color-bg)]")}
      style={{ width: size, height: size }}
    >
      {person.character
        ? <img src={person.avatar} alt="" className="absolute left-1/2 top-[4%] w-[250%] max-w-none -translate-x-1/2" />
        : <img src={person.avatar} alt="" className="h-full w-full object-cover" />}
    </span>
  );
}

function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <span data-no-i18n className={cn("whitespace-pre-wrap break-words", className)}>
      {text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} className="underline text-[var(--color-intelligence)]" href={part} target="_blank" rel="noopener noreferrer nofollow">{part}</a>
        ) : part,
      )}
    </span>
  );
}

/* ────────────────────────  Карусель фото  ──────────────────────── */

function Carousel({ media, onDoubleTap }: { media: Media[]; onDoubleTap?: () => void }) {
  const [index, setIndex] = useState(0);
  const lastTap = useRef(0);
  // Кадр как в Instagram: от портретного 4:5 до широкого 1,91:1 — слишком
  // длинное фото не должно занимать два экрана, слишком узкое — щель.
  const first = media[0];
  const ratio = Math.min(1.91, Math.max(0.8, first.width / first.height));

  return (
    <div className="relative">
      <div
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ aspectRatio: String(ratio) }}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        onClick={() => {
          // Двойной тап — лайк. onDoubleClick на телефонах срабатывает не везде, считаем сами.
          const now = Date.now();
          if (now - lastTap.current < 320) onDoubleTap?.();
          lastTap.current = now;
        }}
      >
        {media.map((m, i) => (
          <img key={m.src} src={m.src} alt={`Фото ${i + 1} из ${media.length}`} loading="lazy" className="h-full w-full shrink-0 snap-center bg-[var(--color-surface-2)] object-cover" />
        ))}
      </div>
      {media.length > 1 && (
        <>
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white tabular-nums">{index + 1}/{media.length}</span>
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden>
            {media.map((m, i) => <span key={m.src} className={cn("h-1.5 w-1.5 rounded-full", i === index ? "bg-white" : "bg-white/40")} />)}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────  Пост  ──────────────────────── */

export function PostCard({ post: initial, ctx, onRemoved, expanded = false }: {
  post: PostView;
  ctx: Ctx;
  onRemoved: (id: string) => void;
  /** true — пост открыт отдельно: комментарии показаны сразу. */
  expanded?: boolean;
}) {
  const [post, setPost] = useState(initial);
  const [comments, setComments] = useState<PostView[] | null>(null);
  const [open, setOpen] = useState(expanded);
  const [menu, setMenu] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [burst, setBurst] = useState(false);

  const guard = () => {
    if (!ctx.canAct) ctx.onBlocked();
    return ctx.canAct;
  };

  async function setLike(liked: boolean) {
    if (!guard() || post.liked === liked) return;
    // Сердечко переключается сразу: ждать ответа сервера ради лайка — как раз
    // то, из-за чего интерфейс кажется медленным. При ошибке откатываем.
    const previous = post;
    setPost({ ...post, liked, likes: post.likes + (liked ? 1 : -1) });
    try {
      await api("", { action: liked ? "like" : "unlike", postId: post.id });
    } catch (e) {
      setPost(previous);
      setNote((e as Error).message);
    }
  }

  function doubleTap() {
    setBurst(true);
    setTimeout(() => setBurst(false), 700);
    void setLike(true);
  }

  const loadComments = useCallback(async () => {
    try {
      const data = await api("?post=" + encodeURIComponent(initial.id));
      setComments(data.comments);
      setPost((p) => ({ ...p, comments: data.comments.length, likes: data.post.likes, liked: data.post.liked }));
    } catch (e) {
      setNote((e as Error).message);
    }
  }, [initial.id]);
  useEffect(() => { if (expanded) void loadComments(); }, [expanded, loadComments]);

  async function comment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!guard()) return;
    const form = event.currentTarget;
    setBusy(true);
    setNote("");
    try {
      await api("", { action: "comment", postId: post.id, text: String(new FormData(form).get("text") ?? "") });
      form.reset();
      setOpen(true);
      await loadComments();
    } catch (e) {
      setNote((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(id === post.id ? "Удалить пост вместе с фото и комментариями?" : "Удалить комментарий?")) return;
    try {
      await api("", { action: "deleteSocial", postId: id });
      if (id === post.id) onRemoved(id);
      else await loadComments();
    } catch (e) {
      setNote((e as Error).message);
    }
  }

  async function report(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!guard()) return;
    try {
      await api("", { action: "reportSocial", postId: post.id, reason: String(new FormData(event.currentTarget).get("reason") ?? "") });
      setReporting(false);
      setNote("Жалоба отправлена — её рассмотрит владелец сервиса.");
    } catch (e) {
      setNote((e as Error).message);
    }
  }

  async function share() {
    const url = `${location.origin}/community?post=${post.id}`;
    setMenu(false);
    try {
      if (navigator.share) await navigator.share({ url, title: "YeahGrind" });
      else { await navigator.clipboard.writeText(url); setNote("Ссылка на пост скопирована."); }
    } catch {
      /* человек закрыл окно «Поделиться» — это не ошибка */
    }
  }

  return (
    <article className={cn(card, "overflow-hidden")}>
      <header className="flex items-center gap-3 px-3 py-2.5">
        <button onClick={() => ctx.onProfile(post.userId)} aria-label={`Профиль: ${post.name}`}><Avatar person={post} size={36} /></button>
        <div className="min-w-0 flex-1">
          <button data-no-i18n className="block max-w-full truncate text-left text-sm font-semibold" onClick={() => ctx.onProfile(post.userId)}>{post.name}</button>
          <span className="block text-xs text-[var(--color-fg-dim)]">уровень {post.level}{post.streak > 0 && ` · серия ${post.streak}`}</span>
        </div>
        <div className="relative">
          <button className="flex h-11 w-9 items-center justify-center text-[var(--color-fg-dim)]" aria-label="Действия с постом" aria-expanded={menu} onClick={() => setMenu((v) => !v)}><Icon name="more" /></button>
          {menu && (
            <div className="absolute right-0 top-10 z-10 w-52 overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-sm shadow-lg">
              <button className="block w-full px-4 py-3 text-left" onClick={() => void share()}>Поделиться ссылкой</button>
              {post.mine
                ? <button className="block w-full px-4 py-3 text-left text-[var(--color-strength)]" onClick={() => { setMenu(false); void remove(post.id); }}>Удалить пост</button>
                : <button className="block w-full px-4 py-3 text-left" onClick={() => { setMenu(false); setReporting(true); }}>Пожаловаться</button>}
            </div>
          )}
        </div>
      </header>

      {post.media.length > 0 ? (
        <div className="relative">
          <Carousel media={post.media} onDoubleTap={doubleTap} />
          {burst && <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white drop-shadow-lg animate-[ping_0.7s_ease-out_1]"><Icon name="heart" size={96} filled /></span>}
        </div>
      ) : (
        // Пост без фото — крупный текст на цветной плашке, чтобы лента не превращалась в стену мелких абзацев.
        <div className="mx-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-sky-500/10 px-4 py-6 text-[17px] leading-snug" onDoubleClick={doubleTap}>
          <RichText text={post.text} />
        </div>
      )}

      <div className="flex items-center gap-1 px-1.5 pt-1">
        <button
          className={cn("flex h-11 w-11 items-center justify-center transition-transform active:scale-90", post.liked ? "text-[var(--color-strength)]" : "text-[var(--color-fg)]")}
          aria-pressed={post.liked}
          aria-label={post.liked ? "Убрать лайк" : "Нравится"}
          onClick={() => void setLike(!post.liked)}
        >
          <Icon name="heart" size={26} filled={post.liked} />
        </button>
        <button className="flex h-11 w-11 items-center justify-center" aria-label="Комментарии" aria-expanded={open} onClick={() => { setOpen((v) => !v); if (!open && comments === null) void loadComments(); }}>
          <Icon name="comment" size={25} />
        </button>
        <button className="flex h-11 w-11 items-center justify-center" aria-label="Поделиться" onClick={() => void share()}><Icon name="send" size={24} /></button>
      </div>

      <div className="space-y-1.5 px-3 pb-3 text-sm">
        {post.likes > 0 && <p className="font-semibold">Нравится: <span className="tabular-nums">{post.likes}</span></p>}
        {post.media.length > 0 && post.text && (
          <p><button data-no-i18n className="mr-1.5 font-semibold" onClick={() => ctx.onProfile(post.userId)}>{post.name}</button><RichText text={post.text} /></p>
        )}
        {!open && post.comments > 0 && (
          <button className="block text-[var(--color-fg-dim)]" onClick={() => { setOpen(true); if (comments === null) void loadComments(); }}>Смотреть комментарии (<span className="tabular-nums">{post.comments}</span>)</button>
        )}
        <time className="block text-xs text-[var(--color-fg-dim)]" dateTime={post.createdAt}>{ago(post.createdAt)}</time>

        {reporting && (
          <form className="grid gap-2 pt-1" onSubmit={report}>
            <input name="reason" aria-label="Причина жалобы" className={field} required maxLength={500} placeholder="Что нарушает правила?" />
            <div className="flex gap-2"><button className={secondary}>Отправить жалобу</button><button type="button" className="px-2 text-sm underline" onClick={() => setReporting(false)}>Отмена</button></div>
          </form>
        )}
        {note && <p role="status" className="text-[var(--color-fg-dim)]">{note}</p>}

        {open && (
          <div className="space-y-2.5 pt-1">
            {comments === null && <p className="text-[var(--color-fg-dim)]">Загружаем…</p>}
            {comments?.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <button onClick={() => ctx.onProfile(c.userId)} aria-label={`Профиль: ${c.name}`}><Avatar person={c} size={28} /></button>
                <div className="min-w-0 flex-1">
                  <p><button data-no-i18n className="mr-1.5 font-semibold" onClick={() => ctx.onProfile(c.userId)}>{c.name}</button><RichText text={c.text} /></p>
                  <p className="text-xs text-[var(--color-fg-dim)]">{ago(c.createdAt)}{c.mine && <button className="ml-3 underline" onClick={() => void remove(c.id)}>Удалить</button>}</p>
                </div>
              </div>
            ))}
            {comments?.length === 0 && <p className="text-[var(--color-fg-dim)]">Комментариев пока нет — будь первым.</p>}
          </div>
        )}

        <form className="flex items-center gap-2 pt-1" onSubmit={comment}>
          <input name="text" aria-label="Комментарий" className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-[var(--color-fg-dim)]" maxLength={1000} required placeholder="Добавить комментарий…" />
          <button className="shrink-0 text-sm font-semibold text-[var(--color-intelligence)] disabled:opacity-50" disabled={busy}>Отправить</button>
        </form>
      </div>
    </article>
  );
}

/** Пост, открытый отдельно — по ссылке, из сетки или из «Активности». */
export function PostDetail({ id, ctx, onRemoved }: { id: string; ctx: Ctx; onRemoved: () => void }) {
  const [post, setPost] = useState<PostView | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setPost(null);
    setError("");
    api("?post=" + encodeURIComponent(id)).then((d) => setPost(d.post)).catch((e) => setError((e as Error).message));
  }, [id]);
  if (error) return <p role="status" className="text-sm">{error}</p>;
  if (!post) return <p role="status" className="text-sm text-[var(--color-fg-dim)]">Открываем пост…</p>;
  return <PostCard post={post} ctx={ctx} onRemoved={onRemoved} expanded />;
}

/* ────────────────────────  Новый пост  ──────────────────────── */

export function Composer({ me, onPublished }: { me: PersonBase; onPublished: () => void }) {
  const [photos, setPhotos] = useState<(Media & { id: string })[]>([]);
  const [uploading, setUploading] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const room = 4 - photos.length;
    const list = [...files].slice(0, room);
    if (files.length > room) setError("К посту можно прикрепить до 4 фото — лишние не добавлены.");
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const media = await uploadImage(file, "post");
        setPhotos((p) => [...p, media]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (input.current) input.current.value = "";
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = String(new FormData(form).get("text") ?? "").trim();
    if (!text && !photos.length) { setError("Добавь фото или напиши пару слов."); return; }
    setBusy(true);
    setError("");
    try {
      await api("", { action: "socialPost", text, mediaIds: photos.map((p) => p.id) });
      form.reset();
      setPhotos([]);
      onPublished();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={cn(card, "space-y-3 p-3")} onSubmit={publish}>
      <div className="flex gap-3">
        <Avatar person={me} size={40} />
        <textarea name="text" aria-label="Новый пост" maxLength={2000} rows={2} className="min-w-0 flex-1 resize-none bg-transparent py-2 text-base outline-none placeholder:text-[var(--color-fg-dim)]" placeholder="Что нового? Покажи, чем занят." />
      </div>

      {(photos.length > 0 || uploading > 0) && (
        <div className="grid grid-cols-4 gap-2">
          {photos.map((p) => (
            <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl bg-[var(--color-surface-2)]">
              <img src={p.src} alt="Прикреплённое фото" className="h-full w-full object-cover" />
              <button type="button" aria-label="Убрать фото" className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white" onClick={() => setPhotos((list) => list.filter((x) => x.id !== p.id))}>×</button>
            </div>
          ))}
          {Array.from({ length: uploading }, (_, i) => <div key={i} role="status" aria-label="Загружаем фото" className="aspect-square animate-pulse rounded-xl bg-[var(--color-surface-2)]" />)}
        </div>
      )}

      {error && <p role="alert" className="text-sm text-[var(--color-strength)]">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <input ref={input} type="file" accept="image/*" multiple className="hidden" aria-label="Выбрать фото" onChange={(e) => void pick(e.target.files)} />
        <button type="button" className={cn(secondary, "flex items-center gap-2")} disabled={photos.length >= 4 || uploading > 0} onClick={() => input.current?.click()}>
          <Icon name="image" size={20} />Фото{photos.length > 0 && ` · ${photos.length}/4`}
        </button>
        <button className={cn(primary, "shrink-0")} disabled={busy || uploading > 0}>{busy ? "Публикуем…" : "Опубликовать"}</button>
      </div>
    </form>
  );
}

/* ────────────────────────  Лента  ──────────────────────── */

export function Feed({ me, hasFollowing, ctx }: { me: PersonBase; hasFollowing: boolean; ctx: Ctx }) {
  // Человек ни на кого не подписан — «Подписки» были бы пустыми и оттолкнули бы; открываем общую ленту.
  const [scope, setScope] = useState<"following" | "all">(hasFollowing ? "following" : "all");
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");
  const request = useRef(0);

  const load = useCallback(async (before?: string) => {
    const n = ++request.current;
    try {
      const data = await api(`?feed=${scope}${before ? `&before=${encodeURIComponent(before)}` : ""}`);
      if (n !== request.current) return; // пока грузили, переключили вкладку
      setPosts((prev) => (before && prev ? [...prev, ...data.posts] : data.posts));
      setMore(data.more);
      setError("");
    } catch (e) {
      if (n === request.current) setError((e as Error).message);
    }
  }, [scope]);

  useEffect(() => {
    setPosts(null);
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      {ctx.canAct && <Composer me={me} onPublished={() => void load()} />}

      <div className="flex gap-2" role="group" aria-label="Какую ленту показывать">
        {([["following", "Подписки"], ["all", "Все"]] as const).map(([id, label]) => (
          <button key={id} className={scope === id ? primary : secondary} aria-pressed={scope === id} onClick={() => setScope(id)}>{label}</button>
        ))}
      </div>

      {error && <p role="alert" className={cn(card, "p-4 text-sm text-[var(--color-strength)]")}>{error}</p>}
      {posts === null && !error && <p role="status" className="text-sm text-[var(--color-fg-dim)]">Загружаем ленту…</p>}
      {posts?.length === 0 && (
        <p className={cn(card, "p-4 text-sm")}>
          {scope === "following"
            ? "Здесь появятся посты тех, на кого ты подпишешься. Ниже — кого почитать."
            : "В сообществе пока нет постов. Опубликуй первый — его увидят все."}
        </p>
      )}
      {(posts?.length === 0 || !hasFollowing) && <Suggestions ctx={ctx} />}
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} ctx={ctx} onRemoved={(id) => setPosts((list) => list?.filter((p) => p.id !== id) ?? list)} />
      ))}
      {more && posts && posts.length > 0 && (
        <button className={cn(secondary, "w-full")} onClick={() => void load(posts[posts.length - 1].createdAt)}>Показать ещё</button>
      )}
    </div>
  );
}

/* ────────────────────────  Люди  ──────────────────────── */

export function FollowButton({ person, ctx, onChange, compact = false }: { person: { userId: string; isFollowing: boolean }; ctx: Ctx; onChange?: (following: boolean) => void; compact?: boolean }) {
  const [following, setFollowing] = useState(person.isFollowing);
  const [busy, setBusy] = useState(false);
  useEffect(() => setFollowing(person.isFollowing), [person.isFollowing]);

  async function toggle() {
    if (!ctx.canAct) { ctx.onBlocked(); return; }
    setBusy(true);
    try {
      await api("", { action: following ? "unfollow" : "follow", userId: person.userId });
      setFollowing(!following);
      onChange?.(!following);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className={cn(following ? secondary : primary, "shrink-0", compact && "min-h-9 px-3 py-1")} disabled={busy} aria-pressed={following} onClick={() => void toggle()}>
      {following ? "Вы подписаны" : "Подписаться"}
    </button>
  );
}

export function PersonRow({ person, ctx }: { person: Person; ctx: Ctx }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <button onClick={() => ctx.onProfile(person.userId)} aria-label={`Профиль: ${person.name}`}><Avatar person={person} size={44} /></button>
      <button className="min-w-0 flex-1 text-left" onClick={() => ctx.onProfile(person.userId)}>
        <span data-no-i18n className="block truncate font-semibold">{person.name}</span>
        <span className="block truncate text-xs text-[var(--color-fg-dim)]">уровень {person.level}{person.subjects.length > 0 && <span data-no-i18n> · {person.subjects.join(" · ")}</span>}</span>
      </button>
      <FollowButton person={person} ctx={ctx} compact />
    </div>
  );
}

/** «Кого почитать» — горизонтальная полка, как рекомендации в Instagram. */
function Suggestions({ ctx }: { ctx: Ctx }) {
  const [people, setPeople] = useState<Person[] | null>(null);
  useEffect(() => { api("?suggestions=1").then((d) => setPeople(d.people)).catch(() => setPeople([])); }, []);
  if (!people?.length) return null;
  return (
    <section className={cn(card, "p-3")}>
      <h2 className="px-1 text-sm font-semibold">Кого почитать</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {people.map((p) => (
          <div key={p.userId} className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] p-3 text-center">
            <button onClick={() => ctx.onProfile(p.userId)} aria-label={`Профиль: ${p.name}`}><Avatar person={p} size={64} /></button>
            <button data-no-i18n className="w-full truncate text-sm font-semibold" onClick={() => ctx.onProfile(p.userId)}>{p.name}</button>
            <span className="text-xs text-[var(--color-fg-dim)]">уровень {p.level}</span>
            <FollowButton person={p} ctx={ctx} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────  Сетка постов  ──────────────────────── */

export function PostGrid({ posts, onOpen }: { posts: PostView[]; onOpen: (id: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-0.5 overflow-hidden rounded-xl">
      {posts.map((p) => (
        <button key={p.id} className="relative aspect-square overflow-hidden bg-[var(--color-surface-2)]" aria-label={`Открыть пост: ${p.name}`} onClick={() => onOpen(p.id)}>
          {p.media[0]
            ? <img src={p.media[0].src} alt="" loading="lazy" className="h-full w-full object-cover" />
            : <span data-no-i18n className="flex h-full w-full items-center bg-gradient-to-br from-violet-500/25 to-sky-500/10 p-2 text-left text-[11px] leading-tight"><span className="line-clamp-5 break-words">{p.text}</span></span>}
          {p.media.length > 1 && <span className="absolute right-1.5 top-1.5 text-white drop-shadow"><Icon name="layers" size={16} /></span>}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────  Поиск и «Интересное»  ──────────────────────── */

export function Explore({ ctx }: { ctx: Ctx }) {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<Person[] | null>(null);
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");

  // Ищем с небольшой задержкой: запрос на каждую букву — лишняя нагрузка.
  useEffect(() => {
    if (!query) { setPeople(null); return; }
    let cancelled = false;
    const timer = setTimeout(() => {
      api("?people=" + encodeURIComponent(query))
        .then((data) => { if (!cancelled) { setPeople(data.people); setError(""); } })
        .catch((e) => { if (!cancelled) setError((e as Error).message); });
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  const loadPosts = useCallback((before?: string) => {
    api(`?feed=explore${before ? `&before=${encodeURIComponent(before)}` : ""}`)
      .then((d) => { setPosts((prev) => (before && prev ? [...prev, ...d.posts] : d.posts)); setMore(d.more); })
      .catch((e) => setError((e as Error).message));
  }, []);
  useEffect(() => loadPosts(), [loadPosts]);

  return (
    <div className="space-y-4">
      <input type="search" aria-label="Поиск людей по имени" className={field} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Найти человека по имени" maxLength={60} />
      {error && <p role="alert" className="text-sm text-[var(--color-strength)]">{error}</p>}

      {query ? (
        <section className={cn(card, "px-3 py-1")}>
          {people === null && <p className="py-3 text-sm text-[var(--color-fg-dim)]">Ищем…</p>}
          {people?.length === 0 && <p className="py-3 text-sm text-[var(--color-fg-dim)]">Никого не нашли. В поиске — все, кто принял политику и не скрыл себя.</p>}
          <div className="divide-y divide-[var(--color-border)]">
            {people?.map((p) => <PersonRow key={p.userId} person={p} ctx={ctx} />)}
          </div>
        </section>
      ) : (
        <>
          <Suggestions ctx={ctx} />
          <h2 className="text-sm font-semibold">Интересное</h2>
          {posts === null && !error && <p className="text-sm text-[var(--color-fg-dim)]">Загружаем…</p>}
          {posts?.length === 0 && <p className={cn(card, "p-4 text-sm")}>Фото пока никто не выкладывал. Опубликуй первое во вкладке «Лента».</p>}
          {!!posts?.length && <PostGrid posts={posts} onOpen={ctx.onPost} />}
          {more && posts && <button className={cn(secondary, "w-full")} onClick={() => loadPosts(posts[posts.length - 1].createdAt)}>Показать ещё</button>}
        </>
      )}
    </div>
  );
}

/* ────────────────────────  Активность  ──────────────────────── */

export function Activity({ ctx, onSeen }: { ctx: Ctx; onSeen: () => void }) {
  const [items, setItems] = useState<Notice[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api("?notices=1")
      .then((d) => {
        setItems(d.notices);
        // Открыл вкладку — значит увидел: точка на вкладке гаснет.
        if (d.notices.some((n: Notice) => n.fresh)) void api("", { action: "seenNotices" }).then(onSeen).catch(() => {});
      })
      .catch((e) => setError((e as Error).message));
    // onSeen меняется на каждый рендер оболочки, а грузить нужно один раз.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <p role="alert" className="text-sm text-[var(--color-strength)]">{error}</p>;
  if (!items) return <p role="status" className="text-sm text-[var(--color-fg-dim)]">Загружаем…</p>;
  if (!items.length) return <p className={cn(card, "p-4 text-sm")}>Здесь появится, кто подписался на тебя, лайкнул или прокомментировал твой пост.</p>;

  return (
    <section className={cn(card, "divide-y divide-[var(--color-border)] px-3")}>
      {items.map((n, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5">
          <button onClick={() => ctx.onProfile(n.userId)} aria-label={`Профиль: ${n.name}`}><Avatar person={n} size={40} /></button>
          <button className="min-w-0 flex-1 text-left text-sm" onClick={() => (n.postId ? ctx.onPost(n.postId) : ctx.onProfile(n.userId))}>
            <span data-no-i18n className="font-semibold">{n.name}</span>{" "}
            {n.kind === "follow" && "подписался(ась) на тебя"}
            {n.kind === "like" && "оценил(а) твой пост"}
            {n.kind === "comment" && <>прокомментировал(а): <span data-no-i18n>{n.comment}</span></>}
            <span className="block text-xs text-[var(--color-fg-dim)]">{ago(n.at)}{n.fresh && <span className="ml-2 font-semibold text-[var(--color-intelligence)]">новое</span>}</span>
          </button>
          {n.image
            ? <button onClick={() => n.postId && ctx.onPost(n.postId)} aria-label="Открыть пост"><img src={n.image} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" /></button>
            : n.kind === "follow" && <button className="text-xs underline" onClick={() => ctx.onProfile(n.userId)}>профиль</button>}
        </div>
      ))}
    </section>
  );
}

/* ────────────────────────  Открытые команды  ──────────────────────── */

export function TeamsDiscover({ onOpen, onJoined }: { onOpen: (teamId: string) => void; onJoined: (teamId: string) => void }) {
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<OpenTeam[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      api("?discover=" + encodeURIComponent(query))
        .then((data) => { if (!cancelled) { setTeams(data.teams); setError(""); } })
        .catch((e) => { if (!cancelled) setError((e as Error).message); });
    }, query ? 300 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  async function join(id: string) {
    setBusy(id);
    try {
      await api("", { action: "joinOpen", teamId: id });
      onJoined(id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  return (
    <section className={cn(card, "space-y-3 p-4")}>
      <h2 className="text-lg font-semibold">Открытые команды</h2>
      <p className="text-sm text-[var(--color-fg-dim)]">В них можно вступить без приглашения. После вступления участники увидят твоё имя.</p>
      <input type="search" aria-label="Поиск команд" className={field} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Название или предмет" maxLength={60} />
      {error && <p role="alert" className="text-sm text-[var(--color-strength)]">{error}</p>}
      {teams === null && !error && <p className="text-sm text-[var(--color-fg-dim)]">Загружаем…</p>}
      {teams?.length === 0 && <p className="text-sm text-[var(--color-fg-dim)]">{query ? "Таких открытых команд нет." : "Открытых команд пока нет. Создай свою и открой её в настройках команды."}</p>}
      {teams?.map((t) => (
        <div key={t.id} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-3">
          <div className="min-w-0 flex-1">
            <p data-no-i18n className="truncate font-semibold">{t.name}</p>
            <p className="truncate text-xs text-[var(--color-fg-dim)]"><span data-no-i18n>{t.subject}</span> · {t.members} участников</p>
            {t.about && <p data-no-i18n className="mt-1 break-words text-sm">{t.about}</p>}
          </div>
          {t.joined
            ? <button className={cn(secondary, "shrink-0")} onClick={() => onOpen(t.id)}>Открыть</button>
            : <button className={cn(primary, "shrink-0")} disabled={busy === t.id} onClick={() => void join(t.id)}>Вступить</button>}
        </div>
      ))}
    </section>
  );
}

/* ────────────────────────  Профиль  ──────────────────────── */

export function ProfileView({ id, ctx, onBlock, onChanged }: {
  id: string;
  ctx: Ctx;
  onBlock: (id: string) => void;
  /** Свой профиль изменился (аватар, видимость) — оболочке нужно перечитать сводку. */
  onChanged?: () => void;
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");
  const [list, setList] = useState<{ kind: "followers" | "following"; people: Person[] | null } | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setError("");
    api("?profile=" + encodeURIComponent(id)).then(setProfile).catch((e) => setError((e as Error).message));
  }, [id]);
  useEffect(() => { setProfile(null); setList(null); load(); }, [load]);

  function openList(kind: "followers" | "following") {
    setList({ kind, people: null });
    api(`?${kind}=${encodeURIComponent(id)}`).then((data) => setList({ kind, people: data.people })).catch((e) => setError((e as Error).message));
  }

  async function changeAvatar(files: FileList | null) {
    if (!files?.[0]) return;
    setBusy(true);
    setError("");
    try {
      const media = await uploadImage(files[0], "avatar");
      await api("", { action: "setAvatar", mediaId: media.id });
      load();
      onChanged?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (file.current) file.current.value = "";
    }
  }

  async function act(body: Record<string, unknown>) {
    setBusy(true);
    try {
      await api("", body);
      load();
      onChanged?.();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !profile) return <p role="status" className="text-sm">{error}</p>;
  if (!profile) return <p role="status" className="text-sm text-[var(--color-fg-dim)]">Открываем профиль…</p>;

  if (list) {
    return (
      <div className="space-y-2">
        <button className="text-sm underline" onClick={() => setList(null)}>← Назад к профилю</button>
        <h3 className="font-semibold">{list.kind === "followers" ? "Подписчики" : "Подписки"}</h3>
        {list.people === null && <p className="text-sm text-[var(--color-fg-dim)]">Загружаем…</p>}
        {list.people?.length === 0 && <p className="text-sm text-[var(--color-fg-dim)]">Пока никого.</p>}
        <div className="divide-y divide-[var(--color-border)]">
          {list.people?.map((p) => <PersonRow key={p.userId} person={p} ctx={ctx} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-5">
        <Avatar person={profile} size={84} ring />
        <div className="grid flex-1 grid-cols-3 gap-1 text-center">
          <div><p className="text-lg font-bold tabular-nums">{profile.postCount}</p><p className="text-xs text-[var(--color-fg-dim)]">посты</p></div>
          <button onClick={() => openList("followers")}><p className="text-lg font-bold tabular-nums">{profile.followers}</p><p className="text-xs text-[var(--color-fg-dim)]">подписчики</p></button>
          <button onClick={() => openList("following")}><p className="text-lg font-bold tabular-nums">{profile.following}</p><p className="text-xs text-[var(--color-fg-dim)]">подписки</p></button>
        </div>
      </header>

      <div className="flex gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h2 data-no-i18n className="break-words text-lg font-bold">{profile.name}</h2>
          <p className="flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-1">уровень {profile.level}</span>
            <span className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-1">серия {profile.streak}</span>
            <span className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-1">{profile.xp} XP</span>
          </p>
          {profile.followsMe && !profile.mine && <p className="text-xs text-[var(--color-fg-dim)]">Читает тебя</p>}
          {profile.bio && <p data-no-i18n className="whitespace-pre-wrap break-words pt-1 text-sm">{profile.bio}</p>}
          {!!profile.subjects.length && <p data-no-i18n className="text-sm text-[var(--color-intelligence)]">{profile.subjects.join(" · ")}</p>}
          {!!profile.goals.length && <ul data-no-i18n className="list-inside list-disc text-sm">{profile.goals.map((g) => <li key={g}>{g}</li>)}</ul>}
        </div>
        {/* Персонаж целиком — то, как человек выглядит в самом приложении. */}
        <img src={profile.figure} alt="Персонаж" className="h-28 w-16 shrink-0 object-contain" />
      </div>

      {profile.mine ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <input ref={file} type="file" accept="image/*" className="hidden" aria-label="Выбрать фото профиля" onChange={(e) => void changeAvatar(e.target.files)} />
            <button className={secondary} disabled={busy || !ctx.canAct} onClick={() => file.current?.click()}>{busy ? "Сохраняем…" : "Сменить фото"}</button>
            {!profile.character && <button className={secondary} disabled={busy} onClick={() => void act({ action: "setAvatar", mediaId: null })}>Вернуть персонажа</button>}
            <button className={secondary} disabled={busy} onClick={() => void act({ action: "visibility", hidden: !profile.hidden })}>{profile.hidden ? "Показать меня в сообществе" : "Скрыть меня из сообщества"}</button>
          </div>
          {profile.hidden && <p className="rounded-xl bg-[var(--color-surface-2)] p-3 text-sm">Ты скрыт: тебя нет в поиске и ленте, твои посты видишь только ты. Читать ленту можно, писать и подписываться — нет.</p>}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <FollowButton person={profile} ctx={ctx} onChange={(f) => setProfile((p) => p && { ...p, isFollowing: f, followers: p.followers + (f ? 1 : -1) })} />
          <button className={secondary} onClick={() => { if (confirm("Скрыть публикации этого человека и удалить дружбу и подписки?")) onBlock(profile.userId); }}>Блокировать</button>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-[var(--color-strength)]">{error}</p>}

      <div className="flex border-b border-[var(--color-border)]" role="group" aria-label="Вид постов">
        {([["grid", "Сетка", "grid"], ["list", "Лента", "rows"]] as const).map(([key, label, icon]) => (
          <button key={key} aria-pressed={layout === key} className={cn("flex flex-1 items-center justify-center gap-2 py-2.5 text-sm", layout === key ? "border-b-2 border-[var(--color-fg)] font-semibold" : "text-[var(--color-fg-dim)]")} onClick={() => setLayout(key)}><Icon name={icon} size={18} />{label}</button>
        ))}
      </div>
      {profile.posts.length === 0 && <p className="text-sm text-[var(--color-fg-dim)]">{profile.mine ? "Постов пока нет. Опубликуй первый во вкладке «Лента»." : "Постов пока нет."}</p>}
      {layout === "grid"
        ? profile.posts.length > 0 && <PostGrid posts={profile.posts} onOpen={ctx.onPost} />
        : profile.posts.map((post) => (
          <PostCard key={post.id} post={post} ctx={ctx} onRemoved={(removed) => setProfile((p) => p && { ...p, posts: p.posts.filter((x) => x.id !== removed), postCount: p.postCount - 1 })} />
        ))}
    </div>
  );
}

/** Политика ещё не принята — одна кнопка открывает сообщество целиком. */
export function PolicyGate() {
  return (
    <section className="rounded-2xl border border-[var(--color-intelligence)]/40 bg-[var(--color-intelligence)]/10 p-4">
      <h2 className="text-lg font-semibold">Осталось одно нажатие</h2>
      <p className="mt-1 text-sm">Отдельный профиль создавать не нужно: в сообществе ты под своим аккаунтом YeahGrind — с именем, персонажем и уровнем. Прими обновлённую политику, и можно будет публиковать фото, подписываться и ставить лайки. Пока — только чтение.</p>
      <Link href="/personalization" className={cn(primary, "mt-3 inline-flex items-center")}>Принять политику</Link>
    </section>
  );
}
