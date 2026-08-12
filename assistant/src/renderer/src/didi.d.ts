import type { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PanelEvent {
  id: string;
  kind: string;
  text: string;
  at: number;
}

export interface PanelStatus {
  enabled: boolean;
  online: boolean;
  lastSeenAt: number | null;
  events: PanelEvent[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
}

export interface Fact {
  id: string;
  content: string;
  at: number;
}

export interface ConfigSummary {
  baseUrl: string;
  userId: string;
  audioDeviceIndex: number;
  chatModel: string;
  isConfigured: boolean;
  hasApiKey: boolean;
}

export interface LogEntry {
  level: "info" | "warn" | "error";
  message: string;
  at: number;
}

export type DidiState = "idle" | "listening" | "thinking" | "speaking";

export interface DidiApi {
  getPanel: () => Promise<PanelStatus>;
  setEnabled: (enabled: boolean) => Promise<void>;

  getChatHistory: () => Promise<ChatMessage[]>;
  sendChatMessage: (content: string) => Promise<void>;

  getFacts: () => Promise<Fact[]>;
  rememberFact: (content: string) => Promise<void>;
  forgetFact: (id: string) => Promise<void>;

  getState: () => Promise<DidiState>;

  isVoiceLoopRunning: () => Promise<boolean>;
  startVoiceLoop: () => Promise<void>;
  stopVoiceLoop: () => Promise<void>;

  getConfigSummary: () => Promise<ConfigSummary>;
  getRawSettings: () => Promise<Record<string, string>>;
  saveSettings: (patch: Record<string, string>) => Promise<void>;

  getAutostart: () => Promise<boolean>;
  setAutostart: (enabled: boolean) => Promise<void>;

  relaunch: () => Promise<void>;
  quit: () => Promise<void>;

  onLog: (callback: (entry: LogEntry) => void) => () => void;
  onState: (callback: (state: DidiState) => void) => () => void;
}

declare global {
  interface Window {
    didi: DidiApi;
  }

  namespace JSX {
    interface IntrinsicElements {
      // React не знает про <webview> — его регистрирует сам Electron
      // (webviewTag: true в main/index.ts), тег не входит в стандартный
      // HTML-набор.
      webview: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        partition?: string;
        allowpopups?: string;
      };
    }
  }
}
