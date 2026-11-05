# PM Quiz 2 — практика по лекциям

Название в приложении: ПРАКТИКА ПО ЛЕКЦИЯМ 4–8.

Отдельный блок внутри `/events/project-management-test-2`, не лекция и не часть лекционной готовности. Авторские 50 вопросов на английском, A–E, один правильный ответ. Разбор на русском только после сдачи. Таймер 60 минут — допущение для тренировки для самостоятельной работы, учебный режим. Распределение 11/10/11/11/7 — редакционный план, не прогноз экзамена.

## Источники и границы

Основа — PDF лекций 4–8; ссылки ниже указывают страницы PDF, считая с 1. Все задания и разборы составлены для самостоятельного повторения этих материалов.

L6 p.35 просмотрена как изображение: таблица содержит шесть строк, несмотря на заголовок The 7 Wastes of Lean. Неизвестная седьмая потеря не тестируется. L8 использует Sized Appropriately для S в INVEST. L7 использует термины Scrum Guide 2020.

SHA-256 фактически прочитанных лекций:

- `Lecture 4 Cost Control and Group Behavior (2).pdf`: `43c57cadb668da6212f7af61c215be93e8ec20a40b6c7e3d8bb7c2b0f6f70e4f`
- `Lecture 5 Organizational Structures.pdf`: `00abaf4558f0304934ce8eae8384c8d49ca8f75c2cdbbd23bc47e42a4b0d7a22`
- `Lecture 6 Agile Principles and Mindset (2).pdf`: `1cf75ad135d365080df7375064413de9b3348ca7c7041d9b96437baaf79ae6c7`
- `Lecture 7 Scrum framework (1).pdf`: `a32813d00b2c27778c13b78eecce7972bba671c6c9e61a0da4a641805c908d3f`
- `Lecture 8 Practices in agile frameworks.pdf`: `72b08b8080aa0314542b3ecb99b77ab2c3c1ccf86f5713707777f24781091372`

## Покрытие

| Lecture | Вопросов |
|---|---:|
| 4 | 11 |
| 5 | 10 |
| 6 | 11 |
| 7 | 11 |
| 8 | 7 |

Ответы A/B/C/D/E: по 10; фиксированная нерегулярная последовательность. Пять независимых расчётных заданий EVM проверяются тестом. Вопросы включают четыре Agile values, три Scrum pillars и пять values. Детальный покадровый охват всех слайдов не заявляется.

## Поведение и проверки

- Локальное сохранение с отдельным ключом аккаунта и версией банка; синхронизация между устройствами не заявляется.
- Абсолютный deadline продолжает идти при уходе со страницы; просроченная попытка сдаётся при возврате.
- Сдача вручную требует подтверждения, пропуски отмечаются в результате.
- Разбор всех пяти вариантов, фильтр ошибок, результат по каждой лекции.
- Повторная попытка заменяет текущую локальную попытку; история попыток не ведётся.
- Данные загружаются отдельным динамическим чанком при открытии; ИИ и новые запросы к БД не нужны.
- Unit-тесты проверяют банк, вычисления, валидацию хранения, блокировку поздних ответов.
- Browser-тест проверяет 320/390/1440px, навигацию, сохранение, сдачу, повтор и истечение времени.

## Вопросы и источники

| № | Lecture | Тема | Страницы | Ответ |
|---|---:|---|---|---|
| 1 | 4 | CV and SV | 13 | B |
| 2 | 4 | CPI and SPI | 17 | C |
| 3 | 4 | Earned value | 20 | A |
| 4 | 4 | EAC and VAC | 22 | D |
| 5 | 4 | Variance percentages | 14 | B |
| 6 | 4 | MCCS operating cycle | 7 | B |
| 7 | 4 | Undistributed budget | 9 | D |
| 8 | 4 | Group classification | 24 | A |
| 9 | 4 | Group development | 26 | E |
| 10 | 4 | Groupthink | 31 | E |
| 11 | 4 | Role conflict | 32 | B |
| 12 | 5 | Functional organization | 12 | C |
| 13 | 5 | Projectized authority | 28 | D |
| 14 | 5 | Projectized costs | 29 | E |
| 15 | 5 | Strong matrix | 44 | C |
| 16 | 5 | Weak matrix | 44 | E |
| 17 | 5 | Authority | 7 | B |
| 18 | 5 | Accountability | 7 | D |
| 19 | 5 | Task force | 21 | E |
| 20 | 5 | Liaison department | 23 | A |
| 21 | 5 | Contingent structure | 4 | A |
| 22 | 6 | Agile values | 11 | B |
| 23 | 6 | Sustainable pace | 15 | D |
| 24 | 6 | Changing requirements | 14 | D |
| 25 | 6 | Agile triangle | 8 | E |
| 26 | 6 | Empirical process | 4 | A |
| 27 | 6 | XP practices | 30 | C |
| 28 | 6 | Lean waste | 35 | C |
| 29 | 6 | Kanban WIP | 37 | A |
| 30 | 6 | Leadership duties | 45 | E |
| 31 | 6 | Safe experimentation | 49 | B |
| 32 | 6 | Crystal | 40 | A |
| 33 | 7 | Product Owner | 17 | C |
| 34 | 7 | Scrum Master | 21 | D |
| 35 | 7 | Developers and sizing | 38 | B |
| 36 | 7 | Sprint Planning timebox | 31 | D |
| 37 | 7 | Daily Scrum | 33 | E |
| 38 | 7 | Review and Retrospective | 35, 36 | D |
| 39 | 7 | Artifacts and commitments | 37 | B |
| 40 | 7 | Sprint Backlog | 40 | C |
| 41 | 7 | Increment release | 42 | E |
| 42 | 7 | Sprint cancellation | 27 | B |
| 43 | 7 | Pillars and values | 11 | A |
| 44 | 8 | Persona purpose | 4 | C |
| 45 | 8 | Persona limitations | 15 | E |
| 46 | 8 | INVEST Negotiable | 18 | D |
| 47 | 8 | INVEST Sized Appropriately | 18 | A |
| 48 | 8 | WHO WHAT WHY | 22 | C |
| 49 | 8 | 3Cs Conversation | 24 | A |
| 50 | 8 | Confirmation and acceptance criteria | 25 | C |
