/**
 * Спокойный фон для квиза — синтезируется прямо в браузере.
 *
 * Почему не аудиофайл: готовую музыку нельзя положить в репозиторий без
 * лицензии, а подходящий трек весит мегабайты, которые скачивал бы каждый
 * телефон. Здесь — четыре медленных аккорда по кругу и редкие тихие
 * «колокольчики» из пентатоники: ничего не отвлекает и не повторяется
 * дословно, а весит это пару килобайт кода.
 */

// Cmaj7 → Am7 → Fmaj7 → G6, нижний регистр: мягко и без напряжения.
const CHORDS = [
  [130.81, 164.81, 196.0, 246.94],
  [110.0, 130.81, 164.81, 196.0],
  [87.31, 110.0, 130.81, 164.81],
  [98.0, 123.47, 146.83, 164.81],
];
// До-мажорная пентатоника октавой выше — любая нота звучит согласно.
const BELLS = [523.25, 587.33, 659.25, 783.99, 880.0];
const CHORD_SECONDS = 10;

export interface Ambient {
  start(): void;
  stop(): void;
  readonly playing: boolean;
}

export function createAmbient(): Ambient {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let timer: ReturnType<typeof setInterval> | undefined;
  let step = 0;

  function voice(frequency: number, at: number, peak: number, attack: number, hold: number, release: number, type: OscillatorType = "sine") {
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.linearRampToValueAtTime(peak, at + attack);
    gain.gain.setValueAtTime(peak, at + attack + hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release);
    osc.connect(gain).connect(master);
    osc.start(at);
    osc.stop(at + attack + hold + release + 0.1);
  }

  function chord() {
    if (!ctx) return;
    const now = ctx.currentTime + 0.05;
    for (const note of CHORDS[step % CHORDS.length]) {
      // Вторая, чуть расстроенная копия даёт «дыхание» вместо ровного гула.
      voice(note, now, 0.05, 4, CHORD_SECONDS - 5, 6);
      voice(note * 1.003, now, 0.03, 4, CHORD_SECONDS - 5, 6, "triangle");
    }
    for (let i = 0; i < 2; i++) {
      const bell = BELLS[Math.floor(Math.random() * BELLS.length)];
      voice(bell, now + 1.5 + Math.random() * (CHORD_SECONDS - 3), 0.018, 0.02, 0, 3.5);
    }
    step++;
  }

  return {
    get playing() {
      return ctx !== null;
    },
    start() {
      if (ctx) return;
      try {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        ctx = new Ctor();
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1800;
        master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 2);
        master.connect(filter).connect(ctx.destination);
        void ctx.resume();
        chord();
        timer = setInterval(chord, CHORD_SECONDS * 1000);
      } catch {
        // Без звука квиз работает так же; ошибка аудио не должна его ломать.
        ctx = null;
      }
    },
    stop() {
      if (timer) clearInterval(timer);
      timer = undefined;
      const closing = ctx;
      const gain = master;
      ctx = null;
      master = null;
      if (!closing) return;
      try {
        gain?.gain.cancelScheduledValues(closing.currentTime);
        gain?.gain.setValueAtTime(gain.gain.value, closing.currentTime);
        gain?.gain.linearRampToValueAtTime(0.0001, closing.currentTime + 0.5);
        setTimeout(() => void closing.close().catch(() => {}), 600);
      } catch {
        void closing.close().catch(() => {});
      }
    },
  };
}
