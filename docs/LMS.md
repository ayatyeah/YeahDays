# LMS AITU: Microsoft OpenID и личные дедлайны

## Текущее состояние

Студенты AITU используют OpenID Connect через Microsoft. Проверено:
`/auth/oidc/?source=loginpage` отправляет пользователя на
`login.microsoftonline.com/organizations/oauth2/authorize`; callback
зарегистрирован на `https://lms.astanait.edu.kz/auth/oidc/`.
Форма с логином и паролем Moodle не заменяет этот способ входа.

**Вход Microsoft реализован через Auth.js / Microsoft Entra ID.** Провайдер
появляется только при заданном `AUTH_MICROSOFT_ENTRA_ID_SECRET`.
Учётные данные и MFA вводятся на странице Microsoft. В YeahGrind создаётся
профиль при первом входе; последующие входы используют Microsoft subject ID.
Для существующего профиля надо сначала войти обычным способом и нажать
«Привязать Microsoft AITU» в настройках интеграции. Совпадение email не
объединяет аккаунты. Храним Microsoft identity, но не access/refresh/ID tokens.
Проверку подписи, issuer, audience, PKCE, state и nonce выполняет Auth.js;
дополнительно профиль должен принадлежать AITU tenant.

Парольная форма Moodle не используется для Microsoft. Legacy provider
`lms-aitu` по-прежнему выключен по умолчанию.

Для дедлайнов после входа (Microsoft или обычный аккаунт YeahGrind) → Настройки →
Интеграции → LMS AITU. Войти в LMS через OpenID, открыть Calendar →
Export calendar → All events → Custom range (либо Recent and next 60 days) →
Get calendar URL. Вставить полученную ссылку в настройки YeahGrind.
Ссылка проверяется сервером, шифруется и привязывается только к текущей
сессии YeahGrind. Она не является доказательством Microsoft identity и не
используется для регистрации, входа или объединения пользователей.

`PUT /api/account/lms` — проверить и сохранить ссылку, `POST` — обновить
дедлайны, `GET` — получить статус без секрета, `DELETE` — отключить календарь.
После подключения клиент сразу вызывает обновление. Если оно не удалось,
подключение сохраняется, а интерфейс показывает ошибку для повторной попытки.
Фоновый крон по-прежнему обновляет персональные подключения три раза в день.

## Активация Microsoft-входа

Владелец зарегистрировал YeahGrind в Entra AITU:

- Application (client) ID: `552b08ec-6293-4081-9a66-5f0467a243ca`.
- Directory (tenant) ID: `158f15f3-83e0-4906-824c-69bdc50d9d61`.
- Web redirect URI: `https://yeahgrind.site/api/auth/callback/microsoft-entra-id`.

Публичные ID закреплены в `src/lib/microsoftAuth.ts`; чужие tenants не
принимаются. В Entra → Сертификаты и секреты создать секрет клиента, затем
сохранить его **значение** в Railway → YeahDays → Variables →
`AUTH_MICROSOFT_ENTRA_ID_SECRET`. Не использовать Secret ID. Применить
настройки / перезапустить сервис. Секрет в Git и клиентский код не добавлять.

Используем authorization code flow (response_type=code), не implicit flow.
Достаточно scopes `openid profile email`; Graph User.Read и offline_access
код не запрашивает. Политика университета может потребовать admin consent.
Секрет имеет срок действия: до его истечения нужно создать новый и обновить
переменную. Без секрета сайт честно показывает, что Microsoft ещё настраивается.

После активации проверить успешный вход, повторный вход и отдельного второго
студента; отдельно — привязку к существующему профилю. Проверка одного лишь
редиректа на Microsoft не подтверждает успешный обмен code на токены.

Microsoft-вход подтверждает учётную запись, но сам по себе не выдаёт
Moodle cookies или календарный токен. Для автоматического получения
дедлайнов дополнительно нужна поддерживаемая интеграция Moodle/API
университета; пока доступна личная ссылка календаря.

Источники: [регистрация приложения Microsoft](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app),
[настройка callback](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri).

## Хранение и синхронизация

Секреты календарей хранятся в `LmsConnection`, AES-256-GCM. Ключ:
`LMS_ENCRYPTION_KEY`, с резервным использованием `AUTH_SECRET`.
Смена ключа требует повторного подключения календарей. Ссылки не попадают
в клиентский persist-слой или ответы API. Разрешён только HTTPS-экспорт
на `lms.astanait.edu.kz`, перенаправления при загрузке запрещены.

Синхронизация добавляет события в задачи владельца, не меняя выполнение.
Дедупликация — по заголовку и дате. Перенос дедлайна преподавателем пока
создаёт новую задачу; старую нужно убрать вручную. Оценки и полное
расписание занятий не импортируются.

Старые переменные `LMS_ICAL_URL`, `LMS_SYNC_USER_ID`, `LMS_TIMEZONE`
сохраняют календарь владельца. Личные подключения имеют приоритет.

## Развёртывание

Таблица добавляется без изменения существующих данных:
`npx prisma db execute --schema prisma/schema.prisma --file docs/sql/2026-09-26-lms-connection.sql`.
Затем `npx prisma generate`, сборка и запуск. Крон использует прежний
`CRON_SECRET`. `POST /api/cron/lms-sync?dry=1` не записывает задачи и не
отправляет уведомления.
