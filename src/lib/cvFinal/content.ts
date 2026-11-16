/** Original preparation exercises, informed by LMS lectures and the published practice format. */
export type CvPrepUnit = { id: string; title: { ru: string; en: string }; notes: { ru: string; en: string }; prompt: { ru: string; en: string } };
export const CV_PREP: CvPrepUnit[] = [
  { id: 'pipeline', title: { ru: '1. Данные без утечки', en: '1. A leak-free data pipeline' }, notes: {
    ru: `## Что нужно уметь
Изображение → проверка метки и размера → разделение данных → преобразования → batch → модель. Сначала посмотри примеры каждого класса и распределение меток. Проверь повреждённые файлы, дубликаты и связанные кадры одной сцены.
## Train / validation / test
Train обновляет веса. Validation помогает выбирать настройки и checkpoint. Test используется для итоговой оценки после выбора модели. Похожие кадры одного объекта нужно держать в одном split: случайное разделение кадров может дать утечку. Augmentation применяй после разделения и только к train; вычисляемые mean/std оценивай по train.
## Augmentation — это гипотеза
Преобразование должно сохранять смысл метки. Горизонтальное отражение может изменить направление стрелки; сильный crop — убрать объект. Валидация и тест обычно получают одинаковые детерминированные resize/normalization. Проверка устойчивости — отдельный явно обозначенный эксперимент.
## Самостоятельная практика · 20 минут
На небольшом размеченном наборе покажи 8 изображений, таблицу количества примеров по классам, размеры splits и по одному допустимому и недопустимому преобразованию. Результат: одна страница аудита данных и объяснение, почему split не допускает утечки.
## Короткий ответ на английском
“We split the data before augmentation. Validation guides model selection, while the test set is reserved for final evaluation. Related images stay in the same split to prevent leakage.”`,
    en: `## What to practise
Image → label and shape checks → split → transforms → batch → model. Inspect examples and class counts. Check corrupt files, duplicates and related frames from the same scene.
## Train / validation / test
Training updates weights. Validation selects settings and checkpoints. Test evaluates the selected model. Keep related frames or subjects in the same split. Augment after splitting and only in training; estimate data-dependent normalization statistics from training data.
## Augmentation is a hypothesis
A transform must preserve the label. Flipping a directional symbol can change its meaning; aggressive cropping can remove the object. Validation and test normally use deterministic preprocessing. Corruption testing is a separate labelled experiment.
## Independent practice · 20 minutes
Use a small labelled dataset. Show 8 examples, class counts, split sizes and one safe and unsafe transform. Deliver a one-page data audit and explain why the split avoids leakage.
## Defence sentence
“We split the data before augmentation. Validation guides model selection, while the test set is reserved for final evaluation. Related images stay in the same split to prevent leakage.”`,
  }, prompt: { ru: 'Проверь моё понимание train/validation/test и augmentation: задавай по одному вопросу, затем объясняй ошибки.', en: 'Check my understanding of train/validation/test and augmentation, one question at a time. Explain errors after my attempt.' } },
  { id: 'cnn', title: { ru: '2. CNN и обучение', en: '2. CNN and training' }, notes: {
    ru: `## Объясни путь одного batch
Вход CNN обычно N×C×H×W. Convolution извлекает локальные признаки, activation добавляет нелинейность, pooling уменьшает пространственный размер, classifier выдаёт logits классов. Не путай число каналов с размером изображения.
## Два расчёта
Для обычной свёртки без dilation: out = floor((in + 2p − k)/s) + 1. Вход 32, kernel 3, padding 1, stride 2 → 16.
Число параметров с bias: (k×k×C_in + 1)×C_out. Для 3×3, 3 входных и 16 выходных каналов: (27 + 1)×16 = 448. Размер картинки не меняет число весов этого слоя.
## Training loop
Обнулить градиенты → forward → loss → backward → optimizer step. Для стандартной многоклассовой CrossEntropyLoss подают logits, а не заранее рассчитанный softmax. Training mode и evaluation mode меняют поведение dropout и batch normalization; отключение градиентов само по себе не включает evaluation mode.
## Transfer learning
Замени classifier под число классов, обучи новую голову, затем при необходимости разморозь часть backbone с меньшим learning rate. Обоснуй выбор временем, параметрами и измеренным качеством. Малое число параметров не доказывает скорость на устройстве.
## Практика · 25 минут
Нарисуй размеры тензоров трёх блоков CNN, посчитай параметры первого слоя, объясни каждый шаг training loop. Затем сравни обучение с нуля и transfer learning как два плана эксперимента.`,
    en: `## Explain one batch
CNN input is commonly N×C×H×W. Convolutions extract local features; activations add nonlinearity; pooling reduces spatial size; the classifier emits class logits.
## Two calculations
For a standard convolution without dilation: out = floor((in + 2p − k)/s) + 1. Input 32, kernel 3, padding 1 and stride 2 give 16.
Parameters with bias: (k×k×C_in + 1)×C_out. A 3×3 layer from 3 to 16 channels has 448 parameters. Image size does not change this layer's weight count.
## Training loop
Zero gradients → forward → loss → backward → optimizer step. Standard multiclass cross-entropy consumes logits, not precomputed softmax. Evaluation mode changes dropout and batch normalization; disabling gradients alone does not switch evaluation mode.
## Transfer learning
Replace the classifier, train its new head, then optionally unfreeze part of the backbone at a smaller learning rate. Justify time, parameters and measured quality. Parameter count alone does not prove device latency.
## Practice · 25 minutes
Draw tensor shapes through three CNN blocks, calculate the first layer's parameters and explain the training loop. Compare training from scratch and transfer learning as experimental plans.`,
  }, prompt: {ru:'Дай новую задачу на размеры CNN и число параметров. Дождись моего решения, затем разбери его по шагам.',en:'Give me a new CNN shape and parameter-count exercise. Wait for my attempt, then review it step by step.'} },
  { id: 'metrics', title: {ru:'3. Метрики и дисбаланс',en:'3. Metrics and imbalance'}, notes: {
    ru: `## Почему accuracy недостаточно
Если 90 из 100 объектов относятся к классу A, ответ «всегда A» даёт 90% accuracy и не распознаёт B. Смотри количество объектов каждого класса, confusion matrix и метрики по классам.
## Формулы с примером
Precision = TP/(TP+FP), recall = TP/(TP+FN), F1 = 2TP/(2TP+FP+FN). Пусть TP=12, FP=3, FN=5: precision=0.80, recall≈0.706, F1=24/32=0.75. Macro-F1 — среднее F1 по классам, а не F1 от усреднённых precision и recall. Weighted-F1 взвешивает классы по support.
## Confusion matrix
Явно подпиши оси true/predicted. Строковая нормализация показывает, куда уходят объекты каждого истинного класса. Маленькая выборка класса означает большую неопределённость. Подматрица популярных классов не заменяет метрики по всем классам.
## Честный эксперимент
Сравни baseline и weighted loss ИЛИ oversampling при одинаковом split, бюджете обучения и оценке. Не меняй сразу архитектуру, augmentation и балансировку. Зафиксируй seed и версии; несколько seed лучше отражают вариативность. Не обещай, что балансировка обязательно улучшит результат.
## Практика · 20 минут
Для матрицы [[45,5],[15,5]] (строки true) вычисли accuracy и F1 каждого класса. Самопроверка: accuracy=0.7143, F1_A=0.8182, F1_B=0.3333, macro-F1≈0.5758. Объясни разрыв.`,
    en: `## Why accuracy is not enough
Predicting A for every example gives 90% accuracy if A represents 90 of 100 examples, while missing all B examples. Inspect class support, confusion matrices and per-class metrics.
## Worked formulas
Precision = TP/(TP+FP), recall = TP/(TP+FN), F1 = 2TP/(2TP+FP+FN). With TP=12, FP=3, FN=5: precision=0.80, recall≈0.706 and F1=0.75. Macro-F1 averages class F1 values; it is not F1 computed from averaged precision and recall. Weighted-F1 weights by class support.
## Confusion matrix
Label true and predicted axes. Row normalization shows where each true class goes. Small class support increases uncertainty. A subset of frequent classes does not replace all-class metrics.
## A fair experiment
Compare baseline against weighted loss OR oversampling with the same split, training budget and evaluation. Do not change architecture, augmentation and balancing together. Record seeds and versions; multiple seeds better show variability. Balancing is not guaranteed to improve results.
## Practice · 20 minutes
For [[45,5],[15,5]] with true labels in rows, calculate accuracy and class F1 values. Check: accuracy=0.7143, F1_A=0.8182, F1_B=0.3333 and macro-F1≈0.5758. Explain the gap.`,
  }, prompt:{ru:'Проведи устную проверку по accuracy, macro-F1 и class imbalance. По одному вопросу; оценивай моё объяснение, а не только формулу.',en:'Run an oral check on accuracy, macro-F1 and class imbalance. Ask one question at a time and assess my explanation, not just the formula.'} },
  { id:'debug',title:{ru:'4. Ошибки и устойчивость',en:'4. Debugging and robustness'},notes:{
    ru:`## Читай две кривые вместе
Train loss падает, validation loss растёт → возможное переобучение. Обе высокие → проверь данные, метки, preprocessing, capacity и learning rate. NaN → проверь learning rate, входные значения и численную устойчивость. Это диагностические гипотезы, а не доказанные причины.
## Сначала маленькая проверка
Посмотри один batch, диапазоны значений, dtype, shape и метки. Попробуй переобучить крошечный train subset: если не получается, ищи ошибку pipeline прежде, чем усложнять сеть. Сохраняй checkpoint по validation, не по test.
## Stress test
Оцени один и тот же checkpoint на чистых и отдельно затемнённых, размытых и зашумлённых изображениях. Сохрани метки и параметры искажений. Не допускай переполнения uint8: считай в float, затем clip в допустимый диапазон. Применяй искажения до normalization и согласуй RGB/BGR.
## Как писать результат
Падение accuracy с 0.80 до 0.68 — это 12 процентных пунктов, или 15% относительно исходной accuracy. Предложи улучшение, например train augmentation с умеренной яркостью, но называй его гипотезой до нового эксперимента. После настройки по stress-test этот набор уже не независимый финальный тест.
## Практика · 20 минут
Составь таблицу clean/dark/blur/noise с пустыми полями для своих измерений. Для каждого ухудшения запиши одну возможную причину, одну проверку и одно улучшение. Не заполняй таблицу придуманными результатами.`,
    en:`## Read both curves
Falling train loss with rising validation loss suggests overfitting. Both high: inspect labels, preprocessing, capacity and learning rate. NaN: inspect input values, learning rate and numerical stability. These are diagnostic hypotheses, not proven causes.
## Start small
Inspect batch shapes, dtypes, ranges and labels. Try overfitting a tiny training subset before adding complexity. Select checkpoints on validation, not test.
## Stress test
Evaluate the same checkpoint on clean, darkened, blurred and noisy images separately. Keep labels and record corruption settings. Compute in floating point and clip before converting to uint8. Apply corruptions before normalization and handle RGB/BGR consistently.
## Interpret the result
Accuracy dropping from 0.80 to 0.68 is a 12 percentage-point drop, or 15% relative decrease. Propose a fix as a hypothesis until tested. A stress-test set used to tune the model is no longer an independent final test.
## Practice · 20 minutes
Create an empty clean/dark/blur/noise results table for your measurements. For each failure, propose a cause, a check and a possible fix. Never invent measurements.`,
  },prompt:{ru:'Дай сценарий с train/validation curves и попроси меня найти возможную причину и следующий диагностический шаг.',en:'Give me a train/validation curve scenario and ask for a possible cause and the next diagnostic check.'}},
  {id:'defence',title:{ru:'5. Защита простым английским',en:'5. Defence in simple English'},notes:{
    ru:`## Структура ответа на 30–45 секунд
Что сделали → почему → чем проверили → ограничение. Говори про собственные измерения; если число неизвестно, не выдумывай его.
## Пять тренировочных вопросов
1. Why did you choose this architecture?
2. How did you prevent data leakage?
3. Why report macro-F1 as well as accuracy?
4. What changed in your controlled experiment?
5. What fails under poor lighting, and how would you investigate it?
## Заготовки, которые нужно дополнить
“We chose this model because … We compared it with … under the same training budget.”
“Macro-F1 gives each class equal weight, so weak minority-class performance is easier to notice.”
“Our result applies to this dataset and split. We have not measured performance on a real device.”
“The model struggled with … Our next experiment would test … while keeping … fixed.”
## Самопроверка
Можешь ли ты без подсказки объяснить загрузку данных, loss, optimizer, checkpoint, метрики и ограничения? Каждый участник должен понимать весь pipeline. Прогони notebook с чистого runtime до конца; проверь, что результаты на графиках совпадают с отчётом.
## Репетиция
Три минуты на объяснение командного решения, затем по одному неожиданному вопросу каждому. Это учебная репетиция, не прогноз вопросов преподавателя.`,
    en:`## A 30–45 second answer
State what you did, why, how you checked it and one limitation. Use your own measured results. Never invent a missing number.
## Five original practice questions
1. Why did you choose this architecture?
2. How did you prevent data leakage?
3. Why report macro-F1 as well as accuracy?
4. What changed in your controlled experiment?
5. What fails under poor lighting, and how would you investigate it?
## Complete these sentence frames
“We chose this model because … We compared it with … under the same training budget.”
“Macro-F1 gives each class equal weight, so weak minority-class performance is easier to notice.”
“Our result applies to this dataset and split. We have not measured performance on a real device.”
“The model struggled with … Our next experiment would test … while keeping … fixed.”
## Self-check
Explain data loading, loss, optimizer, checkpoint choice, metrics and limitations without prompts. Every teammate should understand the full pipeline. Run the notebook from a clean runtime and match reported numbers to outputs.
## Rehearsal
Explain the team solution in three minutes, then answer one unexpected question per member. These are practice prompts, not predicted instructor questions.`,
  },prompt:{ru:'Проведи репетицию CV defence на простом английском. Задавай один вопрос за раз. После моего ответа объясни ошибки по-русски и предложи улучшенную английскую формулировку.',en:'Run a CV defence rehearsal in simple English. Ask one question at a time, wait for my answer, then explain mistakes and suggest clearer wording.'}},
];
