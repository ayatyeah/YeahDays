# YeahGrind — техническая справка для интеграции

Этот документ описывает продукт YeahGrind настолько полно, насколько нужно
другой системе (ИИ-агенту, скрипту, сервису), чтобы читать и писать данные
пользователя через существующий API — без доступа к исходному коду.

Технологии: Next.js 16 (App Router) + TypeScript, Postgres через Prisma,
Auth.js v5 (NextAuth) для входа, Zustand + localStorage для клиентского
состояния, кастомный service worker для офлайна и push-уведомлений.
Хостинг — Railway. Репозиторий разворачивается как обычный веб-сервис,
никакого отдельного бэкенд-процесса нет — вся логика в Next.js route
handlers (`src/app/api/**`).

---

## 1. Что такое YeahGrind

Трекер привычек, но не список задач: раз в день пользователь получает
"колоду" из нескольких карточек-действий (из пула в 159 штук, размеченных
по категориям/сложности/энергии), берёт одну свайпом и закрывает её —
только после этого доступна следующая. Параллельно есть обычный список
задач с часами и повторами (аналог планировщика дня), челленджи
("делай N раз в день, X дней подряд") и цели с дедлайном. Прогресс
выражается в XP, уровне, пяти "статах" персонажа и стрике дней подряд.

---

## 2. Идентификация пользователя

Три независимых способа обращаться к API, не путать между собой:

1. **Анонимное устройство** — `yd-uid`, UUID, который клиент сам генерирует
   и хранит в `localStorage` (см. `src/lib/userId.ts`). Passed как `userId`
   в теле/query большинства эндпоинтов, когда нет сессии. **Не является
   секретом с точки зрения сервера** — см. раздел 9 про то, что это
   значит для интеграций.
2. **Настоящий аккаунт** — Auth.js v5, `session: { strategy: "jwt" }`.
   Провайдеры: Google OAuth (`allowDangerousEmailAccountLinking: true`,
   но самостоятельная регистрация через Google запрещена — см. ниже) и
   Credentials (email/username + bcrypt-пароль). `session.user.id` —
   строка (cuid). Бан пользователя (`User.banned`) проверяется в
   `jwt()`-колбэке на КАЖДЫЙ вызов `auth()` — уже выданный JWT теряет силу
   сразу после бана, без ожидания истечения токена.
3. **Scoped-ключ внешнего сервиса** — `POST /api/integrations/*` и
   `POST /api/keys/redeem` защищены отдельным ключом на сервис (таблица
   `ApiKey`, `Authorization: Bearer <key>`). Валидного ключа
   НЕДОСТАТОЧНО, чтобы действовать от имени произвольного `userId` —
   сервис может писать только тем пользователям, что явно прошли обмен
   одноразового пейринг-кода (`ApiKeyUser`, см. раздел 6). Ключ можно
   отозвать (`revokedAt`) независимо от остальных интеграций. Код для
   обмена появляется двумя путями: пользователь генерирует его сам в
   профиле (`PairingCodeCard`) и вставляет вручную — или сервис ведёт
   браузер пользователя через `GET /oauth/authorize` (реальный вход в
   YeahGrind + экран согласия, код прилетает редиректом). Второй путь —
   это и есть «Войти через YeahGrind»: не SSO в смысле общего логина
   (сессии YeahGrind и StudyLoop остаются независимыми), а полноценный
   authorization-code редирект поверх той же модели ключей.

Есть ещё `CRON_SECRET` (только для `/api/push/send`, дёргается внешним
cron) и `OWNER_EMAIL` (единственный админ-аккаунт, доступ к `/api/owner/*`
по email в сессии, не по секрету).

---

## 3. Доменная модель

### 3.1 Статы персонажа (`StatKey`, ровно 5)

| key | label | что качает |
|---|---|---|
| `strength` | Сила | Спорт, сон, питание, тело |
| `intelligence` | Интеллект | Учёба, чтение, навыки |
| `wealth` | Капитал | Деньги, карьера, проекты |
| `stability` | Стабильность | Рутина, порядок, спокойствие |
| `health` | Здоровье | Сон, питание, восстановление |

### 3.2 Категории действий (`CategoryKey`, 9 штук)

`fitness→strength`, `health→health`, `learning→intelligence`,
`creativity→intelligence`, `money→wealth`, `career→wealth`,
`discipline→stability`, `mindfulness→stability`, `social→stability` —
каждая категория качает ровно один стат (маппинг `CATEGORIES` в
`src/lib/domain.ts`).

### 3.3 Действие (`Action`)

```ts
interface Action {
  id: string;
  title: string;
  why: string;                 // короткое объяснение пользы
  category: CategoryKey;
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: number;             // минут, ожидаемо
  energy: "low" | "medium" | "high";
  timePreference: "morning" | "afternoon" | "evening" | "any";
  impact: 1 | 2 | 3 | 4 | 5;
  tags?: ("outdoor"|"home"|"desk"|"nogear"|"quiet"|"quickwin"
        |"deepwork"|"withpeople"|"warm"|"cold")[];
  progression?: { id: string; step: number }; // "лестница": 10→20→35→50 отжиманий
  custom?: boolean;             // добавлено самим пользователем
}
```

Встроенный пул — 159 таких объектов, 12 из них объединены в "лестницы"
(progression), отдаётся публично `GET /api/actions` (см. раздел 6).

XP за выполнение действия: **`8 + difficulty*5 + impact*4 + round(min(duration,90)/10)`**
(`xpForAction()`, `src/lib/domain.ts`).

### 3.4 Уровень

`xpForLevel(level) = round(60*(level-1) + 40*(level-1)^2)` — то есть
уровни требуют 0, 100, 280, 540, 880, 1300... суммарного XP.
`levelForXp(totalXp)` — обратная функция (наибольший уровень, порог
которого уже пройден). Тиры персонажа: 1 (ур.1+, "Новичок"), 2 (ур.8+,
"Собранный"), 3 (ур.20+, "Сильный"), 4 (ур.40+, "Легенда").

### 3.5 План на сегодня (`PlannedTask`) — "колода"

```ts
interface PlannedTask {
  id: string;
  actionId: string;
  snapshot: Action;      // копия действия на момент взятия (не ссылка)
  xp: number;             // xpForAction(snapshot) на момент взятия
  date: string;            // YYYY-MM-DD, локальная дата устройства
  completed: boolean;
  acceptedAt: number;      // ms
  completedAt: number | null;
  durationMs?: number;     // реально потраченное время (замер приложения)
}
```

Правило продукта: пока на сегодня есть незакрытая запись (`completed:false`),
новая карточка из колоды не предлагается — один активный пункт за раз.

### 3.6 Задачи календаря (`Todo`) — обычный тудушник, отдельно от колоды

```ts
interface Todo {
  id: string; title: string; note?: string;
  date: string;              // день создания (для повторов) или единственный день
  hour?: number; minute?: number; duration?: number;
  priority: "low" | "normal" | "high";
  subtasks: { id: string; title: string; done: boolean }[];
  repeat?: { kind: "daily"|"weekdays"|"weekends"|"weekly"; weekday?: number };
  done: boolean;             // для разовых
  doneDays: string[];        // для повторяющихся — какие даты закрыты
  createdAt: number; completedAt: number | null;
}
```

XP за задачу календаря = `TODO_PRIORITY_XP[priority]` (`low:8, normal:14,
high:22`, `src/lib/todoCategory.ts`), стат определяется угадыванием по
ключевым словам в заголовке (`categorizeTodo()`), не хранится отдельным
полем.

### 3.7 Челленджи (`Challenge`)

Обязательство "делай X каждый день N дней подряд", с порогами жёлтого и
зелёного дня, опционально разбитое на подходы по времени суток:

```ts
interface Challenge {
  id: string; title: string; unit: string; stat: StatKey;
  yellow: number; green: number;              // пороги за день
  sets?: { slot: "morning"|"afternoon"|"evening"; reps: number }[];
  days: number; startDate: string;             // YYYY-MM-DD
  log: Record<string /* YYYY-MM-DD */, number>;
}
```

### 3.8 Цели (`Quest`) и стрик

`Quest { id, title, stat: StatKey, target: number, deadline: string,
createdAt }` — "N действий по стату до даты", прогресс считается по XP,
закрытым в этом стате с момента создания цели.

Стрик — число дней подряд, где было что-то закрыто (в колоде или
задачах), включая дни, "спасённые" заморозкой. Две заморозки в месяц
(`FREEZES_PER_MONTH = 2`), тратятся автоматически, только если день
реально был активным до этого.

### 3.9 Полная форма состояния пользователя (`SyncData`)

Это ровно то, что лежит в `UserState.data` (Postgres, JSON) и синхронизируется
между устройствами. Всё состояние — один плоский объект:

| поле | тип | смысл |
|---|---|---|
| `name` | `string` | имя, введённое при онбординге |
| `createdAt` | `number` | ms, когда аккаунт/устройство завели |
| `plan` | `PlannedTask[]` | вся история колоды, не только сегодня |
| `customActions` | `Action[]` | действия, добавленные пользователем вручную |
| `goals` | `Record<StatKey, number>` | приоритеты статов, 0..1, для движка рекомендаций |
| `moods` | `Record<string, {energy, minutes}>` | чек-ин по дням (`YYYY-MM-DD`) |
| `history` | `HistorySignals` | сигналы для движка (см. раздел 7) |
| `seenLevel` | `number` | до какого уровня уже показан салют |
| `lastCheckIn` | `string \| null` | дата последнего чек-ина |
| `onboarded` | `boolean` | прошёл ли онбординг |
| `seenGuide` | `boolean` | видел ли гайд "Как это устроено" |
| `seenFeatures` | `string[]` | id фич из списка "Что нового" |
| `lastCelebratedDay` | `string \| null` | | 
| `updatedAt` | `number` | ms, часы last-write-wins синхронизации — бампается на КАЖДУЮ мутацию |
| `freezes` | `{ left: number; days: string[]; refilled: string }` | заморозки стрика |
| `quests` | `Quest[]` | |
| `retros` | `Record<string, {score, note?}>` | вечерняя рефлексия по дням |
| `reminderHour` | `number` | |
| `dailyGoal` | `number` | сколько действий в день считается "норма" (по умолчанию 2) |
| `excludedCategories` | `CategoryKey[]` | скрытые направления |
| `useOwnActionsOnly` | `boolean` | использовать только свои действия, не встроенный пул |
| `challenges` | `Challenge[]` | |
| `energyProfile` | `Record<"morning"\|"afternoon"\|"evening", EnergyLevel>` | профиль энергии по времени суток |
| `disabledActions` | `string[]` | id скрытых отдельных действий из пула |
| `schedule` | `Record<string, Record<string,string>>` | легаси почасовые заметки (день → час → текст) |
| `todos` | `Todo[]` | |
| `notify` | `NotifyPrefs` | `{ daily, tasks, todos, quietFrom, quietTo }` |

`updatedAt` — это ЕДИНСТВЕННОЕ поле, по которому сервер решает конфликты
между устройствами (last-write-wins, без merge на уровне полей). Любой
внешний клиент, который пишет в `/api/state`, обязан прислать
`data.updatedAt` больше текущего серверного значения, иначе запись
тихо не применится (сервер вернёт актуальный серверный снимок вместо
ошибки).

---

## 4. Хранение (Prisma/Postgres, ключевые модели)

| модель | назначение | ключевые поля |
|---|---|---|
| `User` | аккаунт | `id, email?, username?, passwordHash?, banned` |
| `UserState` | 1 строка на пользователя — весь `SyncData` целиком | `userId (PK), data: Json, clientAt` |
| `Event` | сырые события для движка рекомендаций | `userId, actionId, type: accept\|reject\|complete\|skip, category?, xp?, at` |
| `PushSubscription` | Web Push подписка устройства | `userId, endpoint (unique), p256dh, auth, tzOffset, enabled` |
| `ScheduledNotification` | очередь точечных пушей | `userId, key (unique per user), fireAt, title, body, kind, sentAt?` |
| `Assistant*` | **не используются** — остались от удалённого голосового ассистента; таблицы не дропнуты, чтобы не терять данные | — |
| `ApiKey` | ключ стороннего сервиса | `service, hash (bcrypt, unique), redirectUris (для /oauth/authorize), revokedAt?, lastUsedAt?` |
| `ApiKeyUser` | allowlist ключа — реально привязанные userId | `apiKeyId, userId (composite PK)` |
| `PairingCode` | одноразовый код привязки, TTL 10 мин | `code (PK), userId, apiKeyId? (кем выпущен через /oauth/authorize; null — самостоятельный), expiresAt, consumedAt?` |
| `Account`/`Session` | стандартные таблицы Auth.js | — |

`UserState.data` не типизирован на уровне БД — это просто JSON-снимок
`SyncData` из раздела 3.9. Любая интеграция, читающая состояние напрямую
из БД (а не через API), обязана сама валидировать форму.

---

## 5. Синхронизация между устройствами

`StateSync.tsx`: после каждой локальной мутации — debounce 1.5 сек,
затем `PUT /api/state`. Пока вкладка видима — `pull()` каждые 5 сек
(`GET /api/state`). Конфликты — last-write-wins по `updatedAt`, ЗА
ИСКЛЮЧЕНИЕМ случая "новое пустое устройство встречает старый аккаунт с
реальным прогрессом" — тогда аккаунт с прогрессом побеждает, даже если
формально не новее (`hasProgress()` эвристика: есть ли выполненные
задачи/todos/челленджи/цели).

---

## 6. API — полный реестр

Формат ниже: `МЕТОД путь` — auth — что делает.

### Синхронизация и события

- **`GET/PUT /api/state`** — сессия ИЛИ `userId` без проверки владения —
  чтение/запись всего `SyncData` целиком (раздел 3.9). `PUT` тело:
  `{ userId, data }`, где `data.updatedAt` обязателен и используется для
  LWW.
- **`POST /api/link`** — только сессия — переносит анонимное устройство
  (`{ deviceId }`) на аккаунт после входа, удаляет анонимного `User`.
- **`POST /api/events`** — сессия или `userId` — пишет поведенческие
  события (`accept|reject|complete|skip`) в таблицу `Event`, топливо для
  движка рекомендаций. Тело: `{ userId, type, actionId, at?, category?, xp? }`
  либо `{ userId, events: [...] }` пачкой.
- **`GET /api/actions`** — без auth, кэшируется 5 мин — отдаёт весь
  встроенный пул: `{ actions: Action[], categories, stats, version }`.
- **`POST /api/recommendations`** — сессия или `userId` в теле — считает
  и возвращает подборку действий под текущее состояние (раздел 7). Если
  `userId` есть, сервер игнорирует присланную клиентом историю и читает
  её из БД (`Event` + `UserState.todos`) — авторитетный источник.

### Аккаунт

- **`GET /api/actions`** см. выше.
- **`GET/DELETE /api/account`** — только сессия — экспорт всех данных
  пользователя одним JSON-файлом / полное удаление аккаунта каскадом.
- **`POST /api/account/password`** — только сессия — сменить/задать пароль.
- **`GET /api/account/providers`** — только сессия — `{ hasPassword, hasGoogle }`.
- **`POST /api/auth/register`** — без auth, лимит 5/час на IP — регистрация
  email+пароль. Вход через Google САМОСТОЯТЕЛЬНО (без предварительной
  регистрации) запрещён — `signIn`-колбэк требует существующего `User` с
  таким email.
- **`POST /api/auth/forgot-password`** — без auth, лимит 5/час — заявка на
  ручной сброс (владелец разбирает в `/admin`, автоматики нет).
- **`/api/auth/[...nextauth]`** — стандартные Auth.js эндпоинты
  (signin/callback/session/csrf).

### Push-уведомления

- **`POST/DELETE /api/push/subscribe`** — сессия или `userId` —
  зарегистрировать/удалить устройство для Web Push. Тело POST:
  `{ userId?, subscription: {endpoint, keys:{p256dh,auth}}, tzOffset?, morningHour? }`.
- **`GET/DELETE /api/push/devices`** — только сессия — список/удаление
  СВОИХ устройств.
- **`POST /api/push/schedule`** — сессия или `userId` — diff-апдейт
  очереди точечных напоминаний: `{ userId?, upsert: [{key,at,title,body?,
  url?,kind?,taskId?}], cancel: string[] }`.
- **`POST /api/push/send`** — `CRON_SECRET` — массовая рассылка
  утро/вечер по расписанию, дёргается внешним cron раз в час.
- **`POST /api/push/dispatch`** — `CRON_SECRET` — минутный крон: отправляет
  всё, что созрело в `ScheduledNotification`, и ДОСЧИТЫВАЕТ расписание
  сама (по снимку состояния в БД) для пользователей, у которых вкладка
  ни разу не открывалась — так push работает проактивно, не только как
  реакция на действия в браузере.

### Внешние интеграции (scoped `ApiKey`, раздел 9)

Единственный путь для стороннего сервиса, работающего от лица
нескольких пользователей. Ключ выдаётся
скриптом `scripts/create-api-key.mjs <service> [redirect_uri...]` (сырой
ключ печатается один раз, дальше хранится только bcrypt-хэш; `client_id`
для OAuth-варианта ниже — это просто `ApiKey.id`, печатается тем же
скриптом).

Код обмена (`PairingCode`) появляется одним из двух путей — дальше всё
идёт через один и тот же `POST /api/keys/redeem`:

- **`POST /api/keys/pair`** — сессия ИЛИ `userId` (пользователь генерирует
  код ДЛЯ СЕБЯ, в своём профиле YeahGrind, `PairingCodeCard`). Тело
  `{ userId? }` → `{ code, expiresAt }`. Код — 8 символов, живёт 10 минут,
  одноразовый; новый код гасит старый непогашенный САМОСТОЯТЕЛЬНЫЙ код
  того же пользователя (не трогает код, ожидающий обмена через OAuth ниже).
  Обменять такой код может ЛЮБОЙ валидный `ApiKey` — сервис на этом шаге
  ещё не известен YeahGrind.
- **`GET /oauth/authorize?client_id=&redirect_uri=&state=`** — «Войти через
  YeahGrind»: сервис ведёт браузер пользователя сюда напрямую. Без сессии
  человека перекинет на `/login?callbackUrl=...` и вернёт назад (гейтит
  `src/proxy.ts`, страница не в его `PUBLIC_PATHS`). `redirect_uri`
  сверяется буквально с `ApiKey.redirectUris` ДО показа чего-либо —
  несовпадение не редиректит никуда (защита от open redirect), просто
  показывает страницу с ошибкой. Дальше — экран согласия (какой сервис,
  на какой аккаунт), кнопки «Разрешить»/«Отмена» — обычные HTML-формы,
  POST на `POST /api/oauth/approve`, тот отвечает `303`-редиректом на
  `redirect_uri?code=...&state=...` (или `?error=access_denied&state=...`
  при отказе/невалидном запросе). Код, выпущенный так, привязан к
  конкретному `apiKeyId` — обменять его сможет только тот сервис, для
  которого он выпущен (см. следующий пункт).
- **`POST /api/keys/redeem`** — сервисный `ApiKey`. Тело `{ code }` →
  `{ ok, userId }`. Обменивает код на `userId` РОВНО ОДИН РАЗ и запоминает
  пару (ключ, userId) в `ApiKeyUser` — с этого момента ключ может
  действовать от имени этого `userId` в `/api/integrations/*`. Повторный
  обмен уже использованного/просроченного кода → 400. Если код был выпущен
  через `/oauth/authorize` (`PairingCode.apiKeyId` заполнен) — обменять его
  чужим ключом (не тем, для которого выпущен) → 403.
- **`POST /api/integrations/add-todo`** — сервисный `ApiKey` +
  `userId` должен быть в `ApiKeyUser` этого ключа (иначе 403). Тело
  `{ userId, title, date, hour?, duration?, priority? }` → `{ ok, id }`.
- **`POST /api/integrations/complete-action`** — та же авторизация. Тело
  `{ userId, source, activityType: "reading"|"writing"|"quiz"|"notes",
  title, minutes, date? }` → `{ ok, xp, totalXp, level }`. В отличие от
  `POST /api/events` (раздел 6, "Синхронизация и события") ЭТО реально
  двигает XP/уровень/стрик — дописывает закрытую запись в
  `UserState.data.plan` (`selectTotalXp`/`selectStats` читают только
  `plan`+`todos`, `Event` они не видят). XP считается `xpForAction()` по
  фиксированным `difficulty/impact` на `activityType`
  (`src/lib/externalActions.ts`, `ACTIVITY_PRESET`) и РЕАЛЬНЫМ `minutes` от
  вызывающего, не по константе.
- **`GET /api/integrations/stats?userId=&stat=`** — та же авторизация.
  Ответ `{ stat, xp, level, streak }` — сводка по одному стату, для
  отображения прогресса внутри стороннего сервиса.

### Прочее

- **`GET /api/share`** — без auth — рендерит PNG-карточку прогресса для
  шеринга по query-параметрам, в БД не ходит.
- **`/api/owner/*`** — только `OWNER_EMAIL` в сессии — админ-консоль
  (список пользователей, бан, устройства, заявки на сброс пароля).
  Не для внешних интеграций.

---

## 7. Движок рекомендаций (`src/lib/recommendation.ts`)

Каждое действие получает `score = Σ(weight_i * subscore_i) * progressionFit`:

| подскор | вес | что учитывает |
|---|---|---|
| `goalMatch` | 0.30 | приоритет стата (`goals`) + насколько стат отстаёт от лидирующего + impact действия |
| `timeMatch` | 0.20 | подходит ли под текущий слот дня + укладывается ли в `mood.minutes` (по ЛИЧНЫМ замерам длительности, если есть) |
| `difficultyMatch` | 0.25 | энергия действия vs `mood.energy`; целевая сложность = `energy+1` со сдвигом `adaptiveShift` |
| `userHistory` | 0.15 | личная история accept/reject/complete по этому действию + по категории |
| `freshness` | 0.10 | штраф за повтор недавно показанного (антиспам) |

`adaptiveShift(history)` — если пользователь закрывает ≥80% взятого,
планка сложности растёт (+0.6), если ≤40% — падает (-0.6); нужно
минимум 5 взятых действий, иначе 0. `progressionFit` — множитель 0..1,
не даёт предлагать более высокую ступень "лестницы", пока не пройдена
предыдущая (мастерство = 3 закрытия ступени).

`HistorySignals` (то, что читает движок): `accepted/rejected/completed`
(счётчики по actionId), `lastSeen` (ms), `statXp` (по 5 статам),
`categoryCompletion` (taken/done по 9 категориям), `durations` (реальные
замеры длительности по actionId, массивы чисел в минутах).

---

## 8. Переменные окружения (сервер)

| переменная | за что отвечает |
|---|---|
| `DATABASE_URL` | Postgres (Prisma) |
| `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL` | Auth.js, читаются по конвенции |
| `CRON_SECRET` | Bearer для `/api/push/send` и `/api/push/dispatch` |
| `OWNER_EMAIL` | единственный email с доступом к `/api/owner/*` |
| `VAPID_PRIVATE_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_CONTACT` | Web Push подпись |
| `NEXT_PUBLIC_ENGINE` | `local` (движок в браузере) vs `remote` (через API) |
| `NEXT_PUBLIC_BUILD_ID` | версия сборки, кэш service worker |
| `NEXT_PUBLIC_POSTHOG_*`, `NEXT_PUBLIC_SENTRY_DSN` | опциональная аналитика/мониторинг |

---

## 9. Как реально интегрироваться сегодня

1. **Несколько независимых сервисов → scoped `ApiKey`** (раздел 6,
   "Внешние интеграции"). Владелец выпускает ключ сервису
   (`scripts/create-api-key.mjs <service> [redirect_uri...]`). Дальше два
   равноправных способа получить код на обмен:
   - **«Войти через YeahGrind»** (рекомендуется, если сервис умеет
     браузерный редирект) — сервис ведёт пользователя на
     `GET /oauth/authorize?client_id=&redirect_uri=&state=`, тот логинится
     (или уже залогинен), подтверждает на экране согласия — код прилетает
     редиректом обратно на `redirect_uri`. Для пользователя это неотличимо
     от «войти тем же аккаунтом», хотя технически это не общий логин
     (сессии YeahGrind и стороннего сервиса независимы), а
     authorization-code редирект: `redirect_uri` заранее зарегистрирован
     за конкретным `ApiKey` и сверяется буквально — иначе никакого
     редиректа не будет вовсе (open-redirect защита).
   - **Код из профиля** (`PairingCodeCard`, для сервисов без браузерного
     редиректа — CLI, бэкенд-триггер и т.п.) — пользователь сам копирует
     код из своего профиля YeahGrind и вставляет в настройки сервиса.
   В обоих случаях сервис обменивает полученный код на `userId` одним и тем
   же `POST /api/keys/redeem` и дальше хранит `userId` у себя, вызывая
   `/api/integrations/*` тем же ключом. Ключ можно отозвать в любой момент
   независимо от остальных интеграций — просто `revokedAt` в `ApiKey`.
   Валидного ключа НЕ достаточно для доступа к произвольному пользователю —
   только к тем, кто реально прошёл обмен кода (`ApiKeyUser`).
2. **`/api/state`, `/api/events`, `/api/push/*` без сессии доверяют `userId`
   из тела/query как есть** — никакой подписи, только сама строка id.
   Это не проблема для scoped-интеграций из пункта 1 (там доступ уже
   ограничен по `ApiKeyUser`), но если что-то ДРУГОЕ вызывает эти
   эндпоинты без сессии напрямую — `userId` там нельзя передавать
   стороннему коду как "ключ доступа".
3. **Чего этот механизм намеренно не делает**: не ограничивает набор
   ДЕЙСТВИЙ ключа операциями (`add-todo`/`complete-action`/`stats` — всё,
   что есть под `/api/integrations/*`), не даёт самому пользователю в
   профиле посмотреть/отозвать список сервисов, к которым он привязан
   (сейчас это видно только через БД). Ничего из этого не блокирует
   текущий кейс (один сервис, явная привязка по инициативе пользователя) —
   если понадобится, это отдельное расширение поверх уже готовой
   `ApiKey`/`ApiKeyUser` модели, не переделка.
