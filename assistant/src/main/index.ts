// Бандл main-процесса собирается в CJS (.cjs, см. electron.vite.config.ts) —
// ESM-загрузчик Node не может импортировать синтетический модуль "electron"
// (падает на связывании ещё до всякого кода), а require("electron") в CJS
// идёт через штатный перехват Electron и работает всегда. Раз бандл CJS —
// __dirname здесь нативный, fileURLToPath(import.meta.url) не нужен.
import electron from "electron";
import path from "node:path";
import { config, isConfigured } from "./didi/config.js";
import { readRawSettings, writeSettings, type SettingsPatch } from "./didi/settingsStore.js";
import { startVoiceLoop, stopVoiceLoop, isVoiceLoopRunning } from "./didi/voiceLoop.js";
import { startChatLoop } from "./didi/chat.js";
import { startPresenceLoop } from "./didi/presence.js";
import { didiLog, log } from "./didi/logger.js";
import { setLocalEnabled } from "./didi/presence.js";
import { didiState, getState } from "./didi/state.js";
import { listFacts, rememberFact, forgetFact } from "./didi/yeahgrind.js";
import { getPanel, setEnabled, getChatHistory, sendChatMessage } from "./didi/bridge.js";

const { app, BrowserWindow, ipcMain } = electron;
type BrowserWindowInstance = InstanceType<typeof BrowserWindow>;

let mainWindow: BrowserWindowInstance | null = null;
let isQuitting = false;
let servicesStarted = false;

// Только один живой процесс ДиДи одновременно — второй запуск (например,
// автозапуск при входе, пока уже открыт вручную) просто поднимает окно
// уже работающего, а не плодит второй микрофонный слушатель.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

/** Иконка окна во время работы (отдельно от иконки .exe — ту электрон-билдер зашивает в бинарник при сборке, см. electron-builder.yml). */
function windowIconPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, "icon.png")
    : path.join(process.cwd(), "build", "icon.png");
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 720,
    minWidth: 720,
    minHeight: 560,
    title: "СалемАй",
    icon: windowIconPath(),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      // Вкладка "YeahGrind" рендерит сам сайт внутри окна — по умолчанию
      // Electron этот тег отключает (историческая CVE-поверхность), но
      // сам webview всё равно в своём изолированном процессе без доступа
      // к Node, так что риск не выше обычной вкладки браузера.
      webviewTag: true,
    },
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    void mainWindow.loadURL(rendererUrl);
  } else {
    void mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  // Закрытие окна сворачивает приложение, а не убивает голосовой цикл —
  // так же вёл себя прежний CLI без окна вообще. Настоящий выход — кнопка
  // "Выход" в настройках (didi:quit), она явно ставит isQuitting.
  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });
}

function startServicesOnce(): void {
  if (servicesStarted) return;
  if (!isConfigured()) {
    log(
      "Не заполнены настройки (OPENAI_API_KEY / YEAHGRIND_USER_ID / ASSISTANT_SECRET) — открой вкладку «Настройки».",
      "warn",
    );
    return;
  }
  servicesStarted = true;
  startPresenceLoop();
  void startChatLoop();
  void startVoiceLoop();
}

function registerIpc(): void {
  ipcMain.handle("didi:getPanel", () => getPanel());
  ipcMain.handle("didi:setEnabled", async (_e, enabled: boolean) => {
    await setEnabled(enabled); // сообщает серверу
    setLocalEnabled(enabled); // и локальному кэшу сразу же, не ждём heartbeat
  });
  ipcMain.handle("didi:getChatHistory", () => getChatHistory());
  ipcMain.handle("didi:sendChatMessage", (_e, content: string) => sendChatMessage(content));
  ipcMain.handle("didi:getFacts", () => listFacts());
  ipcMain.handle("didi:rememberFact", (_e, content: string) => rememberFact(content));
  ipcMain.handle("didi:forgetFact", (_e, id: string) => forgetFact(id));

  ipcMain.handle("didi:getState", () => getState());

  ipcMain.handle("didi:isVoiceLoopRunning", () => isVoiceLoopRunning());
  ipcMain.handle("didi:startVoiceLoop", () => {
    void startVoiceLoop();
  });
  ipcMain.handle("didi:stopVoiceLoop", () => stopVoiceLoop());

  ipcMain.handle("didi:getConfigSummary", () => ({
    baseUrl: config.yeahgrindBaseUrl,
    userId: config.yeahgrindUserId,
    audioDeviceIndex: config.audioDeviceIndex,
    chatModel: config.chatModel,
    isConfigured: isConfigured(),
    hasApiKey: !!config.openaiApiKey,
  }));
  ipcMain.handle("didi:getRawSettings", () => readRawSettings());
  ipcMain.handle("didi:saveSettings", async (_e, patch: SettingsPatch) => {
    await writeSettings(patch);
  });

  ipcMain.handle("didi:getAutostart", () => app.getLoginItemSettings().openAtLogin);
  ipcMain.handle("didi:setAutostart", (_e, enabled: boolean) => {
    app.setLoginItemSettings({ openAtLogin: enabled });
  });

  ipcMain.handle("didi:relaunch", () => {
    app.relaunch();
    isQuitting = true;
    app.quit();
  });
  ipcMain.handle("didi:quit", () => {
    isQuitting = true;
    app.quit();
  });
}

if (gotLock) {
  void app.whenReady().then(() => {
    createWindow();
    registerIpc();
    startServicesOnce();

    // Живая лента логов (то, что раньше просто летело в консоль CLI) — в окно.
    didiLog.on("line", (entry: { level: string; message: string; at: number }) => {
      mainWindow?.webContents.send("didi:log", entry);
    });
    didiState.on("change", (state: string) => {
      mainWindow?.webContents.send("didi:state", state);
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
      else mainWindow?.show();
    });
  });

  app.on("before-quit", () => {
    isQuitting = true;
    stopVoiceLoop();
  });

  app.on("window-all-closed", () => {
    // Окно скрывается, а не закрывается (см. createWindow) — сюда почти
    // никогда не попадаем не на macOS. Ничего не делаем: процесс должен
    // жить и слушать микрофон, даже если окно спрятано.
  });
}
