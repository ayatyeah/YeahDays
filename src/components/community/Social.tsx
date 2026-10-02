"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";

/**
 * Экраны сообщества-соцсети: лента, люди, открытые команды, профиль.
 * Команды с их обсуждениями, квестами и комнатами остаются в page.tsx.
 */

export interface PostView {
  id: string; userId: string; name: string; text: string; createdAt: string;
  likes: number; comments: number; liked: boolean; mine: boolean;
}
export interface Person { userId: string; name: string; bio: string; subjects: string[]; followers: number; isFollowing: boolean }
export interface OpenTeam { id: string; name: string; subject: string; about: string; members: number; joined: boolean }
export interface ProfileData {
  userId: string; name: string; bio: string; subjects: string[]; goals: string[]; character: string | null;
  sessions: number | null; badge: string | null; published: boolean;
  followers: number; following: number; postCount: number; isFollowing: boolean; followsMe: boolean; mine: boolean; posts: PostView[];
}

const field = "w-full min-w-0 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-2.5 text-base";
const primary = "min-h-11 rounded-xl bg-[var(--color-intelligence)] px-4 py-2 text-sm font-semibold text-[var(--color-bg)] disabled:opacity-50";
const secondary = "min-h-11 rounded-xl border border-[var(--color-border-strong)] px-3 py-2 text-sm disabled:opacity-50";
const card = "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4";

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

/** «5 мин», «3 ч», «2 дн» — как в любой ленте; старше недели — дата. */
function ago(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} ч`;
  if (minutes < 60 * 24 * 7) return `${Math.floor(minutes / 1440)} дн`;
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden
      data-no-i18n
      className="flex shrink-0 items-center justify-center rounded-full bg-[var(--color-intelligence)]/20 font-bold text-[var(--color-intelligence)]"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {(name.trim()[0] ?? "?").toUpperCase()}
    </span>
  );
}

function RichText({ text }: { text: string }) {
  return (
    <p data-no-i18n className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
      {text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} className="underline text-[var(--color-intelligence)]" href={part} target="_blank" rel="noopener noreferrer nofollow">{part}</a>
        ) : part,
      )}
    </p>
  );
}

/* ────────────────────────  Пост  ──────────────────────── */

export function PostCard({ post: initial, canAct, onProfile, onRemoved, onNeedProfile }: {
  post: PostView;
  /** false — у зрителя нет своего профиля: читать можно, действовать нельзя. */
  canAct: boolean;
  onProfile: (id: string) => void;
  onRemoved: (id: string) => void;
  onNeedProfile: () => void;
}) {
  const [post, setPost] = useState(initial);
  const [comments, setComments] = useState<PostView[] | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reporting, setReporting] = useState(false);

  const guard = () => {
    if (!canAct) onNeedProfile();
    return canAct;
  };

  async function toggleLike() {
    if (!guard() || busy) return;
    // Сердечко переключается сразу: ждать ответа сервера ради лайка — как
    // раз то, из-за чего интерфейс кажется медленным. При ошибке откатываем.
    const next = { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) };
    setPost(next);
    try {
      await api("", { action: post.liked ? "unlike" : "like", postId: post.id });
    } catch (e) {
      setPost(post);
      setError((e as Error).message);
    }
  }

  async function loadComments() {
    try {
      const data = await api("?post=" + encodeURIComponent(post.id));
      setComments(data.comments);
      setPost((p) => ({ ...p, comments: data.comments.length, likes: data.post.likes, liked: data.post.liked }));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function comment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!guard()) return;
    const form = event.currentTarget;
    const text = String(new FormData(form).get("text") ?? "");
    setBusy(true);
    setError("");
    try {
      await api("", { action: "comment", postId: post.id, text });
      form.reset();
      await loadComments();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(id === post.id ? "Удалить пост вместе с комментариями?" : "Удалить комментарий?")) return;
    try {
      await api("", { action: "deleteSocial", postId: id });
      if (id === post.id) onRemoved(id);
      else await loadComments();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function report(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!guard()) return;
    try {
      await api("", { action: "reportSocial", postId: post.id, reason: String(new FormData(event.currentTarget).get("reason") ?? "") });
      setReporting(false);
      setError("Жалоба отправлена — её рассмотрит владелец сервиса.");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <article className={cn(card, "space-y-3")}>
      <header className="flex items-center gap-3">
        <button onClick={() => onProfile(post.userId)} aria-label={`Профиль: ${post.name}`}><Avatar name={post.name} /></button>
        <div className="min-w-0 flex-1">
          <button data-no-i18n className="block max-w-full truncate text-left font-semibold" onClick={() => onProfile(post.userId)}>{post.name}</button>
          <time className="block text-xs text-[var(--color-fg-dim)]" dateTime={post.createdAt}>{ago(post.createdAt)}</time>
        </div>
        {post.mine
          ? <button className="text-xs underline text-[var(--color-fg-dim)]" onClick={() => void remove(post.id)}>Удалить</button>
          : <button className="text-xs underline text-[var(--color-fg-dim)]" onClick={() => setReporting((v) => !v)}>Пожаловаться</button>}
      </header>

      <RichText text={post.text} />

      <div className="flex items-center gap-2">
        <button
          className={cn("flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm", post.liked ? "text-[var(--color-strength)]" : "text-[var(--color-fg-dim)]")}
          aria-pressed={post.liked}
          aria-label={post.liked ? "Убрать лайк" : "Нравится"}
          onClick={() => void toggleLike()}
        >
          <span aria-hidden className="text-lg leading-none">{post.liked ? "♥" : "♡"}</span>
          <span className="tabular-nums">{post.likes}</span>
        </button>
        <button
          className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm text-[var(--color-fg-dim)]"
          aria-expanded={open}
          onClick={() => { setOpen((v) => !v); if (!open && comments === null) void loadComments(); }}
        >
          <span aria-hidden className="text-lg leading-none">💬</span>
          <span className="tabular-nums">{post.comments}</span>
          <span>{open ? "Скрыть" : "Комментарии"}</span>
        </button>
      </div>

      {reporting && (
        <form className="grid gap-2" onSubmit={report}>
          <input name="reason" aria-label="Причина жалобы" className={field} required maxLength={500} placeholder="Что нарушает правила?" />
          <button className={secondary}>Отправить жалобу</button>
        </form>
      )}
      {error && <p role="status" className="text-sm text-[var(--color-fg-dim)]">{error}</p>}

      {open && (
        <div className="space-y-3 border-l-2 border-[var(--color-border-strong)] pl-3">
          {comments === null && <p className="text-sm text-[var(--color-fg-dim)]">Загружаем…</p>}
          {comments?.map((c) => (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <button data-no-i18n className="font-semibold" onClick={() => onProfile(c.userId)}>{c.name}</button>
                <span className="text-[var(--color-fg-dim)]">{ago(c.createdAt)}</span>
                {c.mine && <button className="underline text-[var(--color-fg-dim)]" onClick={() => void remove(c.id)}>Удалить</button>}
              </div>
              <RichText text={c.text} />
            </div>
          ))}
          {comments?.length === 0 && <p className="text-sm text-[var(--color-fg-dim)]">Комментариев пока нет.</p>}
          <form className="flex gap-2" onSubmit={comment}>
            <input name="text" aria-label="Комментарий" className={field} maxLength={1000} required placeholder="Написать комментарий…" />
            <button className={cn(secondary, "shrink-0")} disabled={busy}>Отправить</button>
          </form>
        </div>
      )}
    </article>
  );
}

/* ────────────────────────  Лента  ──────────────────────── */

export function Feed({ published, hasFollowing, onProfile, onNeedProfile }: {
  published: boolean;
  /** true — человек на кого-то подписан: тогда открываем «Подписки», иначе пустая лента оттолкнёт. */
  hasFollowing: boolean;
  onProfile: (id: string) => void;
  onNeedProfile: () => void;
}) {
  const [scope, setScope] = useState<"following" | "all">(hasFollowing ? "following" : "all");
  const [posts, setPosts] = useState<PostView[] | null>(null);
  const [more, setMore] = useState(false);
  const [busy, setBusy] = useState(false);
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

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setError("");
    try {
      await api("", { action: "socialPost", text: String(new FormData(form).get("text") ?? "") });
      form.reset();
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {published && (
        <form className={cn(card, "grid gap-3")} onSubmit={publish}>
          <textarea name="text" aria-label="Новый пост" required maxLength={2000} rows={3} className={field} placeholder="Что сегодня понял, сделал или чем хочешь поделиться?" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-fg-dim)]">Пост увидят все вошедшие пользователи.</p>
            <button className={cn(primary, "shrink-0")} disabled={busy}>Опубликовать</button>
          </div>
        </form>
      )}

      <div className="flex gap-2" role="group" aria-label="Какую ленту показывать">
        {([["following", "Подписки"], ["all", "Все"]] as const).map(([id, label]) => (
          <button key={id} className={scope === id ? primary : secondary} aria-pressed={scope === id} onClick={() => setScope(id)}>{label}</button>
        ))}
      </div>

      {error && <p role="alert" className={cn(card, "text-sm text-[var(--color-strength)]")}>{error}</p>}
      {posts === null && !error && <p role="status" className="text-sm text-[var(--color-fg-dim)]">Загружаем ленту…</p>}
      {posts?.length === 0 && (
        <p className={cn(card, "text-sm")}>
          {scope === "following"
            ? "Здесь появятся посты тех, на кого ты подпишешься. Загляни во вкладку «Люди» или открой ленту «Все»."
            : "В сообществе пока нет постов. Напиши первый — его увидят все."}
        </p>
      )}
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} canAct={published} onProfile={onProfile} onNeedProfile={onNeedProfile} onRemoved={(id) => setPosts((list) => list?.filter((p) => p.id !== id) ?? list)} />
      ))}
      {more && posts && posts.length > 0 && (
        <button className={cn(secondary, "w-full")} onClick={() => void load(posts[posts.length - 1].createdAt)}>Показать ещё</button>
      )}
    </div>
  );
}

/* ────────────────────────  Люди  ──────────────────────── */

export function FollowButton({ person, canAct, onNeedProfile, onChange }: { person: { userId: string; isFollowing: boolean }; canAct: boolean; onNeedProfile: () => void; onChange?: (following: boolean) => void }) {
  const [following, setFollowing] = useState(person.isFollowing);
  const [busy, setBusy] = useState(false);
  useEffect(() => setFollowing(person.isFollowing), [person.isFollowing]);

  async function toggle() {
    if (!canAct) { onNeedProfile(); return; }
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

  return <button className={cn(following ? secondary : primary, "shrink-0")} disabled={busy} aria-pressed={following} onClick={() => void toggle()}>{following ? "Вы подписаны" : "Подписаться"}</button>;
}

export function PersonRow({ person, canAct, onProfile, onNeedProfile }: { person: Person; canAct: boolean; onProfile: (id: string) => void; onNeedProfile: () => void }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <button onClick={() => onProfile(person.userId)} aria-label={`Профиль: ${person.name}`}><Avatar name={person.name} /></button>
      <button className="min-w-0 flex-1 text-left" onClick={() => onProfile(person.userId)}>
        <span data-no-i18n className="block truncate font-semibold">{person.name}</span>
        <span data-no-i18n className="block truncate text-xs text-[var(--color-fg-dim)]">{person.subjects.join(" · ") || person.bio || " "}</span>
      </button>
      <FollowButton person={person} canAct={canAct} onNeedProfile={onNeedProfile} />
    </div>
  );
}

export function People({ published, onProfile, onNeedProfile }: { published: boolean; onProfile: (id: string) => void; onNeedProfile: () => void }) {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<Person[] | null>(null);
  const [error, setError] = useState("");

  // Ищем с небольшой задержкой: запрос на каждую букву — лишняя нагрузка.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      api("?people=" + encodeURIComponent(query))
        .then((data) => { if (!cancelled) { setPeople(data.people); setError(""); } })
        .catch((e) => { if (!cancelled) setError((e as Error).message); });
    }, query ? 300 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query]);

  return (
    <section className={cn(card, "space-y-2")}>
      <h2 className="text-lg font-semibold">Найти людей</h2>
      <input type="search" aria-label="Поиск людей по имени" className={field} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Имя одногруппника или друга" maxLength={60} />
      {error && <p role="alert" className="text-sm text-[var(--color-strength)]">{error}</p>}
      {people === null && !error && <p className="text-sm text-[var(--color-fg-dim)]">Загружаем…</p>}
      {people?.length === 0 && <p className="text-sm text-[var(--color-fg-dim)]">{query ? "Никого не нашли. В поиске только те, кто создал профиль в сообществе." : "Пока никто не создал профиль. Будь первым и позови одногруппников."}</p>}
      {!query && !!people?.length && <p className="text-xs text-[var(--color-fg-dim)]">Кого читают чаще всего</p>}
      <div className="divide-y divide-[var(--color-border)]">
        {people?.map((p) => <PersonRow key={p.userId} person={p} canAct={published} onProfile={onProfile} onNeedProfile={onNeedProfile} />)}
      </div>
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
    <section className={cn(card, "space-y-3")}>
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

export function ProfileView({ id, canAct, onProfile, onNeedProfile, onBlock }: {
  id: string;
  canAct: boolean;
  onProfile: (id: string) => void;
  onNeedProfile: () => void;
  onBlock: (id: string) => void;
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");
  const [list, setList] = useState<{ kind: "followers" | "following"; people: Person[] | null } | null>(null);

  const load = useCallback(() => {
    setError("");
    api("?profile=" + encodeURIComponent(id)).then(setProfile).catch((e) => setError((e as Error).message));
  }, [id]);
  useEffect(() => { setProfile(null); setList(null); load(); }, [load]);

  function openList(kind: "followers" | "following") {
    setList({ kind, people: null });
    api(`?${kind}=${encodeURIComponent(id)}`).then((data) => setList({ kind, people: data.people })).catch((e) => setError((e as Error).message));
  }

  if (error) return <p role="status" className="text-sm">{error}</p>;
  if (!profile) return <p role="status" className="text-sm text-[var(--color-fg-dim)]">Открываем профиль…</p>;

  if (list) {
    return (
      <div className="space-y-2">
        <button className="text-sm underline" onClick={() => setList(null)}>← Назад к профилю</button>
        <h3 className="font-semibold">{list.kind === "followers" ? "Подписчики" : "Подписки"}</h3>
        {list.people === null && <p className="text-sm text-[var(--color-fg-dim)]">Загружаем…</p>}
        {list.people?.length === 0 && <p className="text-sm text-[var(--color-fg-dim)]">Пока никого.</p>}
        <div className="divide-y divide-[var(--color-border)]">
          {list.people?.map((p) => <PersonRow key={p.userId} person={p} canAct={canAct} onProfile={onProfile} onNeedProfile={onNeedProfile} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-4">
        {profile.character
          ? <img src={profile.character} alt="Персонаж" className="h-20 w-20 shrink-0 rounded-2xl bg-[var(--color-surface-2)] object-contain" />
          : <Avatar name={profile.name} size={72} />}
        <div className="min-w-0 flex-1">
          <h2 data-no-i18n className="break-words text-xl font-bold">{profile.name}</h2>
          {profile.followsMe && !profile.mine && <p className="text-xs text-[var(--color-fg-dim)]">Читает тебя</p>}
          {profile.badge && <p className="text-xs text-[var(--color-intelligence)]">✦ {profile.badge}</p>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-[var(--color-surface-2)] p-2"><p className="text-lg font-bold tabular-nums">{profile.postCount}</p><p className="text-xs text-[var(--color-fg-dim)]">постов</p></div>
        <button className="rounded-xl bg-[var(--color-surface-2)] p-2" onClick={() => openList("followers")}><p className="text-lg font-bold tabular-nums">{profile.followers}</p><p className="text-xs text-[var(--color-fg-dim)]">подписчиков</p></button>
        <button className="rounded-xl bg-[var(--color-surface-2)] p-2" onClick={() => openList("following")}><p className="text-lg font-bold tabular-nums">{profile.following}</p><p className="text-xs text-[var(--color-fg-dim)]">подписок</p></button>
      </div>

      {!profile.mine && (
        <div className="flex flex-wrap gap-2">
          <FollowButton person={profile} canAct={canAct} onNeedProfile={onNeedProfile} onChange={(f) => setProfile((p) => p && { ...p, isFollowing: f, followers: p.followers + (f ? 1 : -1) })} />
          <button className={secondary} onClick={() => { if (confirm("Скрыть публикации этого человека и удалить дружбу и подписки?")) onBlock(profile.userId); }}>Блокировать</button>
        </div>
      )}
      {profile.mine && !profile.published && <p className="rounded-xl bg-[var(--color-surface-2)] p-3 text-sm">Профиль не опубликован: сейчас его видишь только ты.</p>}

      {profile.bio && <p data-no-i18n className="whitespace-pre-wrap break-words text-[15px]">{profile.bio}</p>}
      {!!profile.subjects.length && <p className="text-sm"><span className="text-[var(--color-fg-dim)]">Предметы: </span><span data-no-i18n>{profile.subjects.join(" · ")}</span></p>}
      {!!profile.goals.length && (
        <div className="text-sm">
          <p className="text-[var(--color-fg-dim)]">Цели</p>
          <ul data-no-i18n className="list-inside list-disc">{profile.goals.map((g) => <li key={g}>{g}</li>)}</ul>
        </div>
      )}
      {profile.sessions !== null && <p className="text-sm">Завершено совместных занятий: {profile.sessions}</p>}

      <h3 className="pt-2 font-semibold">Посты</h3>
      {profile.posts.length === 0 && <p className="text-sm text-[var(--color-fg-dim)]">Постов пока нет.</p>}
      {profile.posts.map((post) => (
        <PostCard key={post.id} post={post} canAct={canAct} onProfile={onProfile} onNeedProfile={onNeedProfile} onRemoved={(removed) => setProfile((p) => p && { ...p, posts: p.posts.filter((x) => x.id !== removed), postCount: p.postCount - 1 })} />
      ))}
    </div>
  );
}

/** Приглашение создать профиль — одно нажатие вместо анкеты. */
export function CreateProfile({ name, onCreated }: { name: string; onCreated: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="rounded-2xl border border-[var(--color-intelligence)]/40 bg-[var(--color-intelligence)]/10 p-4">
      <h2 className="text-lg font-semibold">Создай профиль в сообществе</h2>
      <p className="mt-1 text-sm">Читать ленту можно и так. Чтобы подписываться, писать посты и ставить лайки, нужен профиль: другие вошедшие пользователи увидят твоё имя — <strong data-no-i18n>{name}</strong>. План, задачи и переписка с ИИ остаются приватными.</p>
      {error && <p role="alert" className="mt-2 text-sm text-[var(--color-strength)]">{error}</p>}
      <button
        className={cn(primary, "mt-3")}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try { await api("", { action: "quickProfile" }); onCreated(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
        }}
      >
        Создать профиль
      </button>
    </section>
  );
}
