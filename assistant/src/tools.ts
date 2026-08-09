import type { ChatCompletionTool } from "openai/resources/chat/completions";
import * as os from "./osControl.js";
import * as yg from "./yeahgrind.js";

/**
 * args приходит из JSON.parse(model tool_call.arguments) — по контракту
 * OpenAI это всегда объект, но не типизирован сильнее unknown на входе.
 */
type Args = Record<string, unknown>;

function str(args: Args, key: string, fallback = ""): string {
  const v = args[key];
  return typeof v === "string" ? v : fallback;
}
function num(args: Args, key: string): number | undefined {
  const v = args[key];
  return typeof v === "number" ? v : undefined;
}

export interface ToolDef {
  spec: ChatCompletionTool;
  /** true → обязательное голосовое подтверждение перед execute() */
  destructive: boolean;
  /** человекочитаемое описание действия для вопроса "точно сделать X?" */
  describe: (args: Args) => string;
  execute: (args: Args) => Promise<string>;
}

function tool(
  name: string,
  description: string,
  parameters: Record<string, unknown>,
  destructive: boolean,
  describe: (args: Args) => string,
  execute: (args: Args) => Promise<string>,
): ToolDef {
  return {
    spec: { type: "function", function: { name, description, parameters } },
    destructive,
    describe,
    execute,
  };
}

export const TOOLS: Record<string, ToolDef> = {
  get_today_status: tool(
    "get_today_status",
    "Прочитать план на сегодня, задачи и настроение пользователя из YeahGrind.",
    { type: "object", properties: {}, additionalProperties: false },
    false,
    () => "",
    async () => JSON.stringify(await yg.getTodayStatus()),
  ),

  add_todo: tool(
    "add_todo",
    "Добавить задачу в YeahGrind на сегодня (или на другую дату).",
    {
      type: "object",
      properties: {
        title: { type: "string", description: "Текст задачи" },
        hour: { type: "number", description: "Час 0-23, если задача привязана ко времени" },
        duration: { type: "number", description: "Сколько минут займёт" },
        priority: { type: "string", enum: ["low", "normal", "high"] },
        date: { type: "string", description: "YYYY-MM-DD, по умолчанию сегодня" },
      },
      required: ["title"],
      additionalProperties: false,
    },
    false,
    () => "",
    async (a) =>
      JSON.stringify(
        await yg.addTodo({
          title: str(a, "title"),
          hour: num(a, "hour"),
          duration: num(a, "duration"),
          priority: (str(a, "priority") as "low" | "normal" | "high") || undefined,
          date: str(a, "date") || undefined,
        }),
      ),
  ),

  complete_todo: tool(
    "complete_todo",
    "Отметить задачу YeahGrind выполненной (или снять отметку) по её id.",
    {
      type: "object",
      properties: {
        id: { type: "string" },
        done: { type: "boolean", description: "true — выполнено, false — снять отметку" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    false,
    () => "",
    async (a) => JSON.stringify(await yg.completeTodo(str(a, "id"), a.done !== false)),
  ),

  set_mood: tool(
    "set_mood",
    "Записать текущее настроение/энергию пользователя на сегодня в YeahGrind.",
    {
      type: "object",
      properties: {
        energy: { type: "string", enum: ["low", "medium", "high"] },
        minutes: { type: "number", description: "Сколько минут готов вложить сегодня" },
      },
      required: ["energy"],
      additionalProperties: false,
    },
    false,
    () => "",
    async (a) =>
      JSON.stringify(
        await yg.setMood(a.energy as "low" | "medium" | "high", num(a, "minutes") ?? 30),
      ),
  ),

  open_app: tool(
    "open_app",
    "Открыть приложение или файл на ноутбуке по имени/пути (как через Пуск или проводник).",
    {
      type: "object",
      properties: { target: { type: "string" } },
      required: ["target"],
      additionalProperties: false,
    },
    false,
    () => "",
    async (a) => os.openApp(str(a, "target")),
  ),

  open_url: tool(
    "open_url",
    "Открыть сайт в браузере по умолчанию.",
    {
      type: "object",
      properties: { url: { type: "string" } },
      required: ["url"],
      additionalProperties: false,
    },
    false,
    () => "",
    async (a) => os.openUrl(str(a, "url")),
  ),

  list_dir: tool(
    "list_dir",
    "Показать содержимое папки.",
    {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
      additionalProperties: false,
    },
    false,
    () => "",
    async (a) => os.listDir(str(a, "path")),
  ),

  read_file: tool(
    "read_file",
    "Прочитать текстовый файл.",
    {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
      additionalProperties: false,
    },
    false,
    () => "",
    async (a) => os.readTextFile(str(a, "path")),
  ),

  write_file: tool(
    "write_file",
    "Записать (создать или перезаписать) текстовый файл. Необратимо перезаписывает содержимое.",
    {
      type: "object",
      properties: { path: { type: "string" }, content: { type: "string" } },
      required: ["path", "content"],
      additionalProperties: false,
    },
    true,
    (a) => `Записать файл ${str(a, "path")}?`,
    async (a) => os.writeTextFile(str(a, "path"), str(a, "content")),
  ),

  move_file: tool(
    "move_file",
    "Переместить или переименовать файл.",
    {
      type: "object",
      properties: { from: { type: "string" }, to: { type: "string" } },
      required: ["from", "to"],
      additionalProperties: false,
    },
    true,
    (a) => `Переместить ${str(a, "from")} в ${str(a, "to")}?`,
    async (a) => os.moveFile(str(a, "from"), str(a, "to")),
  ),

  delete_file: tool(
    "delete_file",
    "Удалить файл (в корзину).",
    {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
      additionalProperties: false,
    },
    true,
    (a) => `Удалить файл ${str(a, "path")}? Уйдёт в корзину, не насовсем.`,
    async (a) => os.deleteFile(str(a, "path")),
  ),

  run_command: tool(
    "run_command",
    "Выполнить произвольную команду PowerShell на ноутбуке и вернуть вывод.",
    {
      type: "object",
      properties: { command: { type: "string" } },
      required: ["command"],
      additionalProperties: false,
    },
    true,
    (a) => `Выполнить команду: ${str(a, "command")}?`,
    async (a) => os.runCommand(str(a, "command")),
  ),

  media_control: tool(
    "media_control",
    "Управление воспроизведением медиа: пауза/play, следующий/предыдущий трек, звук.",
    {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["play_pause", "next", "prev", "mute", "volume_up", "volume_down"],
        },
        times: { type: "number", description: "Сколько раз нажать (для громкости)" },
      },
      required: ["action"],
      additionalProperties: false,
    },
    false,
    () => "",
    async (a) => os.mediaControl(a.action as os.MediaAction, num(a, "times") ?? 1),
  ),
};

export const TOOL_SPECS: ChatCompletionTool[] = Object.values(TOOLS).map((t) => t.spec);
