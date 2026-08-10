// Именованный импорт из "electron" ломает ESM-загрузчик Node на связывании
// модулей — см. подробный комментарий в src/main/didi/config.ts.
import electron from "electron";
const { contextBridge, ipcRenderer } = electron;

/**
 * Единственная дверь между renderer (веб-страница, без доступа к Node) и
 * main (голосовой цикл, БД YeahGrind, файловая система) — contextIsolation
 * включён, так что renderer не может дотянуться до require/fs напрямую,
 * только через то, что явно перечислено здесь.
 */
const api = {
  getPanel: () => ipcRenderer.invoke("didi:getPanel"),
  setEnabled: (enabled: boolean) => ipcRenderer.invoke("didi:setEnabled", enabled),

  getChatHistory: () => ipcRenderer.invoke("didi:getChatHistory"),
  sendChatMessage: (content: string) => ipcRenderer.invoke("didi:sendChatMessage", content),

  getFacts: () => ipcRenderer.invoke("didi:getFacts"),
  rememberFact: (content: string) => ipcRenderer.invoke("didi:rememberFact", content),
  forgetFact: (id: string) => ipcRenderer.invoke("didi:forgetFact", id),

  isVoiceLoopRunning: () => ipcRenderer.invoke("didi:isVoiceLoopRunning"),
  startVoiceLoop: () => ipcRenderer.invoke("didi:startVoiceLoop"),
  stopVoiceLoop: () => ipcRenderer.invoke("didi:stopVoiceLoop"),

  getConfigSummary: () => ipcRenderer.invoke("didi:getConfigSummary"),
  getRawSettings: () => ipcRenderer.invoke("didi:getRawSettings"),
  saveSettings: (patch: Record<string, string>) => ipcRenderer.invoke("didi:saveSettings", patch),

  getAutostart: () => ipcRenderer.invoke("didi:getAutostart"),
  setAutostart: (enabled: boolean) => ipcRenderer.invoke("didi:setAutostart", enabled),

  relaunch: () => ipcRenderer.invoke("didi:relaunch"),
  quit: () => ipcRenderer.invoke("didi:quit"),

  onLog: (callback: (entry: { level: string; message: string; at: number }) => void) => {
    const listener = (_e: unknown, entry: { level: string; message: string; at: number }) => callback(entry);
    ipcRenderer.on("didi:log", listener);
    return () => ipcRenderer.removeListener("didi:log", listener);
  },
};

contextBridge.exposeInMainWorld("didi", api);

export type DidiApi = typeof api;
