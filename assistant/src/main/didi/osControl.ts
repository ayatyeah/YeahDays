import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { appendFile } from "node:fs/promises";
import { config } from "./config.js";

const execAsync = promisify(exec);
const isWindows = process.platform === "win32";
const shellBin = isWindows ? "powershell.exe" : "/bin/bash";

/** Безопасно подставляет путь/строку одним аргументом в bash-команду — POSIX-приём '\'' для escape одиночной кавычки внутри одинарных кавычек. */
function shQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/**
 * Аудит: каждая команда/файловая мутация пишется в лог с меткой времени.
 * Нужно, чтобы после факта можно было понять, что именно ДиДи сделал.
 */
async function logAction(line: string) {
  const ts = new Date().toISOString();
  await appendFile(config.logFile, `[${ts}] ${line}\n`).catch(() => {});
}

/**
 * Раньше запускалась через spawn(...).unref() и всегда возвращала "Открываю:
 * X" — даже когда Windows не находила программу с таким именем (например
 * "Valorant": игры от Riot запускаются не по имени, а через отдельный
 * лаунчер). Ошибка тихо проглатывалась, ДиДи врала об успехе. Теперь ждём
 * exec() и реально проверяем код возврата — start сам по себе завершается
 * сразу после передачи управления найденной программе, так что ждать
 * закрытия самого приложения не приходится.
 */
export async function openApp(nameOrPath: string): Promise<string> {
  await logAction(`open_app: ${nameOrPath}`);
  if (!isWindows) return openAppLinux(nameOrPath);
  const target = nameOrPath.replace(/"/g, '""');
  try {
    await execAsync(`start "" "${target}"`, { timeout: 8000 });
    return `Открываю: ${nameOrPath}`;
  } catch (e) {
    const msg = (e instanceof Error ? e.message : String(e)).split("\n")[0];
    return (
      `Не получилось: Windows не нашла программу "${nameOrPath}" по имени ` +
      `(${msg}). У некоторых программ (например игры из лаунчеров вроде Riot ` +
      `Client/Steam/Epic) нет простого имени для запуска — попробуй run_command, ` +
      `чтобы найти установленный .exe и запустить его напрямую по полному пути.`
    );
  }
}

/**
 * На Linux нет аналога Windows `start` (регистр программ по "дружественному"
 * имени) — обычная модель другая: бинарник ищется в PATH ровно по тому
 * имени, каким его запускают из терминала ("code", "spotify", firefox"),
 * а URL/URI-схемы (http, yandexmusic:// и т.п.) открывает xdg-open через
 * зарегистрированный .desktop-обработчик. spawn().unref() без ожидания
 * exit — GUI-приложение не должно блокировать вызывающего до своего
 * закрытия (в отличие от Windows-ветки, где `start` сам возвращается сразу
 * после передачи управления и ждать нечего).
 */
async function openAppLinux(nameOrPath: string): Promise<string> {
  const isUrl = /^[a-z][a-z0-9+.-]*:\/\//i.test(nameOrPath);
  const cmd = isUrl ? "xdg-open" : nameOrPath;
  const args = isUrl ? [nameOrPath] : [];
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { detached: true, stdio: "ignore" });
    let settled = false;
    proc.once("error", (e: NodeJS.ErrnoException) => {
      if (settled) return;
      settled = true;
      resolve(
        `Не получилось: не нашла "${nameOrPath}" в PATH (${e.code ?? e.message}). ` +
          `На Linux запуск идёт по имени бинарника — убедись, что он называется именно так, ` +
          `либо попробуй run_command с полным путём.`,
      );
    });
    // spawn кидает ENOENT практически сразу — короткая пауза, чтобы
    // гарантированно успеть поймать её раньше, чем отрапортуем об успехе.
    setTimeout(() => {
      if (settled) return;
      settled = true;
      proc.unref();
      resolve(`Открываю: ${nameOrPath}`);
    }, 150);
  });
}

export async function openUrl(url: string): Promise<string> {
  return openApp(url);
}

/**
 * Клик по плитке "Моя волна" в десктопном приложении Яндекс Музыки.
 *
 * Обычный Windows UI Automation не видит внутри окна вообще ничего —
 * проверено вживую (FindAll возвращает только сам корневой элемент):
 * Chromium/Electron не отдают дерево accessibility, пока не обнаружат
 * активный скринридер, а обычный автоматизационный клиент это не
 * триггерит. Пробовали то же самое для браузера (Firefox) вместо
 * приложения — там ненадёжно принципиально: одно окно держит много
 * вкладок, поиск/подъём нужного окна в фокус из фонового процесса ломался
 * по-разному на каждом заходе. У десктоп-приложения своё отдельное окно —
 * надёжно, проверено вживую дважды подряд. Поэтому вместо поиска элемента
 * — реальный клик мышью по вычисленной точке внутри окна:
 * 1. Находим окно по имени процесса (ждём до 5с, если приложение только
 *    что запущено и ещё не создало окно).
 * 2. Поднимаем его в фокус. Просто SetForegroundWindow из фонового
 *    процесса Windows тихо игнорирует (foreground lock) — обходится
 *    фиктивным нажатием Alt прямо перед вызовом, стандартный трюк.
 * 3. Кликаем по точке на 57%/35% от левого верхнего угла окна — туда
 *    прямо сейчас попадает плитка "Моя волна" целиком (сама плитка
 *    огромная, так что небольшая неточность не страшна).
 *
 * Хрупкое место: если пользователь сам изменит размер/положение окна
 * относительно текущего — пропорция может уехать мимо плитки.
 */
export async function clickYandexWaveButton(): Promise<string> {
  // Автоматизация завязана на конкретный win32 UI Automation / desktop-клиент
  // Яндекс Музыки — на Linux у него нет прямого аналога (нет официального
  // нативного клиента с тем же окном/раскладкой), а гадать координаты клика
  // вслепую только сломает что-то другое. Явная ошибка лучше молчаливого
  // клика в случайное место — вызывающий код (quickCommands.ts::clickWaveAfterLaunch)
  // и так только логирует её, не падает.
  if (!isWindows) {
    throw new Error("Клик по «Моей волне» пока доступен только на Windows.");
  }
  const script = `
Add-Type @'
using System;
using System.Runtime.InteropServices;
public class DidiYandexClick {
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
  [DllImport("user32.dll")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, UIntPtr dwExtraInfo);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
  public struct RECT { public int Left, Top, Right, Bottom; }
}
'@

$proc = $null
for ($i = 0; $i -lt 10 -and -not $proc; $i++) {
  $proc = Get-Process | Where-Object { $_.MainWindowTitle -ne "" -and $_.Path -match "YandexMusic" } | Select-Object -First 1
  if (-not $proc) { Start-Sleep -Milliseconds 500 }
}
if (-not $proc) { Write-Host "NOWINDOW"; exit }
$hwnd = $proc.MainWindowHandle

[DidiYandexClick]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero)
[DidiYandexClick]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)
[DidiYandexClick]::ShowWindow($hwnd, 9) | Out-Null
[DidiYandexClick]::SetForegroundWindow($hwnd) | Out-Null
Start-Sleep -Milliseconds 400

$rect = New-Object DidiYandexClick+RECT
[DidiYandexClick]::GetWindowRect($hwnd, [ref]$rect) | Out-Null
$w = $rect.Right - $rect.Left
$h = $rect.Bottom - $rect.Top
$x = $rect.Left + [int]($w * 0.57)
$y = $rect.Top + [int]($h * 0.35)
[DidiYandexClick]::SetCursorPos($x, $y) | Out-Null
Start-Sleep -Milliseconds 150
[DidiYandexClick]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 50
[DidiYandexClick]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
Write-Host "OK"
`;
  const { stdout } = await execAsync(script, { shell: "powershell.exe", timeout: 15_000 });
  if (!stdout.includes("OK")) {
    throw new Error("Окно Яндекс Музыки не найдено — приложение не запущено?");
  }
  return "Кликнула по Моей волне.";
}

/** Произвольная shell-команда (PowerShell на Windows, bash на Linux/macOS). Всегда должна проходить через подтверждение в tools.ts. */
export async function runCommand(command: string): Promise<string> {
  await logAction(`run_command: ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command, {
      shell: shellBin,
      timeout: 20_000,
      maxBuffer: 1024 * 1024,
    });
    const out = (stdout || stderr || "").trim();
    return out.length > 1500 ? `${out.slice(0, 1500)}…(обрезано)` : out || "Команда выполнена, вывода нет.";
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return `Ошибка выполнения: ${msg.slice(0, 500)}`;
  }
}

export async function listDir(dirPath: string): Promise<string> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const names = entries.map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
  return names.length ? names.join(", ") : "Пусто.";
}

export async function readTextFile(filePath: string, maxChars = 4000): Promise<string> {
  const buf = await fs.readFile(filePath, "utf-8");
  return buf.length > maxChars ? `${buf.slice(0, maxChars)}…(обрезано)` : buf;
}

/** Требует подтверждения — перезаписывает или создаёт файл. */
export async function writeTextFile(filePath: string, content: string): Promise<string> {
  await logAction(`write_file: ${filePath}`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
  return `Записано: ${filePath}`;
}

/** Требует подтверждения. */
export async function moveFile(from: string, to: string): Promise<string> {
  await logAction(`move_file: ${from} -> ${to}`);
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.rename(from, to);
  return `Перемещено: ${from} → ${to}`;
}

/**
 * Требует подтверждения. Удаляет В КОРЗИНУ, не насовсем — голосовая
 * команда, неправильно распознанная (STT ошибается), не должна означать
 * безвозвратную потерю файла.
 */
export async function deleteFile(filePath: string): Promise<string> {
  await logAction(`delete_file (recycle bin): ${filePath}`);
  if (isWindows) {
    const psPath = filePath.replace(/'/g, "''");
    const script =
      `Add-Type -AssemblyName Microsoft.VisualBasic; ` +
      `[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('${psPath}', 'OnlyErrorDialogs', 'SendToRecycleBin')`;
    await execAsync(script, { shell: "powershell.exe", timeout: 10_000 });
  } else {
    // gio (glib2) реализует freedesktop.org trash spec — есть по умолчанию
    // на GNOME/большинстве Linux-десктопов (в т.ч. Fedora Workstation),
    // в отличие от отдельно устанавливаемого trash-cli.
    try {
      await execAsync(`gio trash -- ${shQuote(filePath)}`, { shell: shellBin, timeout: 10_000 });
    } catch (e) {
      const msg = (e instanceof Error ? e.message : String(e)).split("\n")[0];
      throw new Error(`Не получилось отправить в корзину через gio (${msg}). Нужен пакет glib2 (команда gio).`);
    }
  }
  return `Отправлено в корзину: ${filePath}`;
}

/** Виртуальные коды медиаклавиш Windows — нажатие системной клавиши, а не конкретного плеера. */
const MEDIA_KEYS = {
  play_pause: "0xB3",
  next: "0xB0",
  prev: "0xB1",
  mute: "0xAD",
  volume_up: "0xAF",
  volume_down: "0xAE",
} as const;

export type MediaAction = keyof typeof MEDIA_KEYS;

const MEDIA_LABELS: Record<MediaAction, string> = {
  play_pause: "Пауза/воспроизведение",
  next: "Следующий трек",
  prev: "Предыдущий трек",
  mute: "Звук выключен/включён",
  volume_up: "Громче",
  volume_down: "Тише",
};

/** Не абсолютная громкость (нужен сторонний инструмент вроде nircmd) — нажатие клавиши N раз. */
export async function mediaControl(action: MediaAction, times = 1): Promise<string> {
  const presses = Math.max(1, Math.min(times, 20));
  if (!isWindows) return mediaControlLinux(action, presses);
  const code = MEDIA_KEYS[action];
  const script =
    `$w = New-Object -ComObject WScript.Shell; ` +
    `for ($i=0; $i -lt ${presses}; $i++) { $w.SendKeys([char]${code}); Start-Sleep -Milliseconds 80 }`;
  await execAsync(script, { shell: "powershell.exe", timeout: 10_000 });
  return MEDIA_LABELS[action];
}

/**
 * play_pause/next/prev идут через playerctl (MPRIS по D-Bus — работает
 * одинаково что под X11, что под Wayland, в отличие от xdotool, который
 * симулирует физические медиаклавиши только на X11). mute/громкость — через
 * wpctl (WirePlumber), штатный микшер PipeWire на современных Fedora/GNOME;
 * шаг 5% на "нажатие", чтобы times сохранял тот же смысл, что и в Windows-
 * ветке (N нажатий кнопки).
 */
async function mediaControlLinux(action: MediaAction, presses: number): Promise<string> {
  try {
    if (action === "mute") {
      await execAsync("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle", { timeout: 5000 });
    } else if (action === "volume_up" || action === "volume_down") {
      const sign = action === "volume_up" ? "+" : "-";
      await execAsync(`wpctl set-volume @DEFAULT_AUDIO_SINK@ ${5 * presses}%${sign}`, { timeout: 5000 });
    } else {
      const playerctlAction = { play_pause: "play-pause", next: "next", prev: "previous" }[action];
      for (let i = 0; i < presses; i++) {
        await execAsync(`playerctl ${playerctlAction}`, { timeout: 5000 });
      }
    }
  } catch (e) {
    const msg = (e instanceof Error ? e.message : String(e)).split("\n")[0];
    throw new Error(
      `Не получилось (${msg}). Для play/pause/next/prev нужен playerctl, для громкости/mute — wpctl (пакет wireplumber).`,
    );
  }
  return MEDIA_LABELS[action];
}
