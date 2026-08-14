import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { appendFile } from "node:fs/promises";
import { config } from "./config.js";

const execAsync = promisify(exec);

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
 * триггерит. Поэтому вместо поиска элемента — реальный клик мышью по
 * вычисленной точке внутри окна:
 * 1. Находим окно по имени процесса (ждём до 5с, если приложение только
 *    что запущено и ещё не создало окно).
 * 2. Поднимаем его в фокус. Просто SetForegroundWindow из фонового
 *    процесса Windows тихо игнорирует (foreground lock) — обходится
 *    фиктивным нажатием Alt прямо перед вызовом, стандартный трюк.
 * 3. Кликаем по точке на 57%/35% от левого верхнего угла окна — туда
 *    прямо сейчас попадает плитка "Моя волна" целиком (сама плитка
 *    огромная, так что небольшая неточность не страшна). Проверено
 *    вживую пользователем — сработало.
 *
 * Хрупкое место: если пользователь сам изменит размер/положение окна
 * относительно текущего — пропорция может уехать мимо плитки.
 */
export async function clickYandexWaveButton(): Promise<string> {
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

/** Произвольная PowerShell-команда. Всегда должна проходить через подтверждение в tools.ts. */
export async function runCommand(command: string): Promise<string> {
  await logAction(`run_command: ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command, {
      shell: "powershell.exe",
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
  const psPath = filePath.replace(/'/g, "''");
  const script =
    `Add-Type -AssemblyName Microsoft.VisualBasic; ` +
    `[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile('${psPath}', 'OnlyErrorDialogs', 'SendToRecycleBin')`;
  await execAsync(script, { shell: "powershell.exe", timeout: 10_000 });
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

/** Не абсолютная громкость (нужен сторонний инструмент вроде nircmd) — нажатие клавиши N раз. */
export async function mediaControl(action: MediaAction, times = 1): Promise<string> {
  const code = MEDIA_KEYS[action];
  const presses = Math.max(1, Math.min(times, 20));
  const script =
    `$w = New-Object -ComObject WScript.Shell; ` +
    `for ($i=0; $i -lt ${presses}; $i++) { $w.SendKeys([char]${code}); Start-Sleep -Milliseconds 80 }`;
  await execAsync(script, { shell: "powershell.exe", timeout: 10_000 });
  const labels: Record<MediaAction, string> = {
    play_pause: "Пауза/воспроизведение",
    next: "Следующий трек",
    prev: "Предыдущий трек",
    mute: "Звук выключен/включён",
    volume_up: "Громче",
    volume_down: "Тише",
  };
  return labels[action];
}
