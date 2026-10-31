/**
 * «Истории» — мультфильмы по лекциям: сюжет с персонажами, где каждое
 * понятие лекции появляется в момент, когда оно нужно героям.
 *
 * История — сцены, сцена — реплики. У каждой реплики свой кадр (картинка
 * 16:9, плеер ведёт по ней камеру) и, если в ней звучит термин, карточка
 * термина: сам термин по-английски, как на слайдах и в тесте, пояснение —
 * по-русски. Озвучка — по реплике на файл (scripts/story-tts.mjs), поэтому
 * время каждой реплики известно точно.
 */

/** Настроение сцены — по нему подбирается фоновая музыка (scripts/story-tts.mjs). */
export type StoryMood = "hope" | "tension" | "calm" | "smart" | "strategy" | "conflict" | "uplift" | "triumph" | "grief";

export interface StoryCharacter {
  /** Имя в субтитрах. */
  name: string;
  /** Роль в команде — по-английски, как подпись на кадрах. */
  role?: string;
  /** Голос Gemini TTS. */
  voice: string;
  /** Голос ElevenLabs (voice_id). Есть у всех героев истории — она озвучивается ElevenLabs. */
  eleven?: string;
}

export interface StoryTerm {
  /** Термин как на слайде: «BCWS», «Storming». */
  term: string;
  /** Полная английская форма, если термин — сокращение. */
  full?: string;
  /** Что это значит — по-русски, одной-двумя фразами. */
  ru: string;
}

export interface StoryLine {
  who: string;
  text: string;
  /** Кадр — имя файла без расширения в public/stories/<id>/frames. */
  frame: string;
  terms?: StoryTerm[];
  /** Как сказать — теги эмоций ElevenLabs по-английски: «[crying]», «[shouting]». Только в озвучку, не в субтитры. */
  say?: string;
  /** Постановка реплики в перекладке (если у сцены есть stage). */
  act?: StoryAct;
}

/**
 * Перекладка: сцена собирается из фона без людей и героев-спрайтов, а плеер
 * их оживляет (components/stories/StoryStage.tsx) — дыхание, моргание, рот
 * в такт голосу, наклоны головы, смена поз, камера, эффекты. Картинки —
 * scripts/story-rig.py, губы — scripts/story-lipsync.mjs.
 */
export interface StoryStage {
  /** Фон — public/stories/<id>/rig/<plate>.webp. */
  plate: string;
  /** Герои на сцене (в порядке отрисовки — дальние раньше). */
  cast: Record<string, StoryActor>;
  /** Видение — круг с картинкой над сценой (rig/<vision>.webp): центр и радиус в долях высоты фона. */
  vision?: { src: string; x: number; y: number; r: number; shown?: boolean };
  /** Отзеркалить фон — обратный ракурс той же комнаты. */
  mirror?: boolean;
  /** Цвет света на героях (множители RGB): красное зарево, ночь. */
  light?: [number, number, number];
  /** Портал (эффект «portal»): центр в долях кадра, радиус в долях высоты. */
  portal?: { x: number; y: number; r: number };
}

export interface StoryActor {
  /** Где герой: x — шея (голова при смене поз остаётся на месте), y — ступни; доли ширины и высоты фона (y ниже 1 — герой стоит за столом, ног не видно). */
  x: number;
  y: number;
  /** Рост — доля высоты фона. */
  h: number;
  /** Поза в начале сцены: спрайт rig/<герой>_<поза>.webp. */
  pose: string;
  /** Отзеркалить (спрайт смотрит в другую сторону). */
  flip?: boolean;
  /** Насколько герой собран из золотой пыли: 0 — его нет, 1 — целиком (по умолчанию). Меняет эффект «assemble». */
  level?: number;
}

export interface StoryAct {
  /** Камера: «wide» — общий план, «medium:<герой>», «close:<герой>», «two:<герой>,<герой>». Без неё — средний план говорящего. */
  shot?: string;
  /** Новые позы с начала реплики: герой → поза. */
  pose?: Record<string, string>;
  /** Герой переходит на новое место: x в долях ширины фона или [x, за сколько секунд, через сколько после начала реплики]. */
  move?: Record<string, number | [number, number?, number?]>;
  /** Вывести героев вперёд — дальше они рисуются поверх остальных. */
  front?: string[];
  /**
   * Эффекты, через «@секунды» — с задержкой от начала реплики:
   * «vision-in» / «vision-out», «shake», «flash», «dark-in» (из темноты), «portal»,
   * «snap:<герой>» — рассыпается золотой пылью, «assemble:<герой>:<0…1>» — собирается из пыли,
   * «vanish:<герой>» — мерцает и тает, «hit:<кто>><кого>» — удар с выпадом и отдачей,
   * «stickers:<x>:<y>» — со стены сыплются стикеры.
   */
  fx?: string[];
}

export interface StoryScene {
  id: string;
  title: string;
  mood: StoryMood;
  /** Фоновый звук сцены — описание для генерации эффектов по-английски: «rain on office windows». */
  ambience?: string;
  /** Перекладка вместо кадров: фон и герои, которых двигает плеер. */
  stage?: StoryStage;
  lines: StoryLine[];
}

/** Спрайты и фоны перекладки истории (scripts/story-rig.py): размеры в пикселях картинки. */
export interface StoryRig {
  sprites: Record<string, RigSprite>;
  plates: Record<string, { w: number; h: number; front?: RigBox }>;
}

export interface RigBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RigSprite {
  w: number;
  h: number;
  /** Ступни — точка опоры. */
  foot: [number, number];
  /** Шея — вокруг неё наклоняется голова. */
  neck: [number, number];
  /** Макушка (y): рост героя — от неё до ступней, поднятые руки и посох не в счёт. */
  top?: number;
  /** Где рот (заплатка с открытым ртом _o) и глаза (с закрытыми, _b). */
  mouth?: RigBox;
  blink?: RigBox;
  /** Свечение (навершие посоха). */
  glow?: [number, number];
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  /** К какой лекции: ивент, лекция и подпись для списка. */
  lecture: { eventId: string; lectureId: string; label: string };
  /** Обложка — кадр из frames. */
  cover: string;
  cast: Record<string, StoryCharacter>;
  scenes: StoryScene[];
  /** Финальная карточка после последней сцены. */
  moral: string;
  /** Финал сезона: у лекции — своя кнопка «🏁 Финал сезона», а не «📖 История лекции». */
  finale?: boolean;
}

/** Время реплик в озвучке сцены (scripts/story-tts.mjs): начало и конец, с. silent — реплика ещё без голоса (кончилась квота TTS): на её месте пауза, плеер показывает субтитр. */
export interface SceneTiming {
  duration: number;
  lines: { start: number; end: number; silent?: boolean }[];
}
