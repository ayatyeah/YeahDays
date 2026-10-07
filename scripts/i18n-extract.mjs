// Собрать из исходников русские строки интерфейса — ключи словарей перевода.
//
//   node scripts/i18n-extract.mjs            → src/i18n/keys.json
//
// Ключ — сама русская строка (как в gettext): компоненты остаются как есть,
// а переводчик на странице ищет текст в словаре. Шаблонные строки
// (`Осталось ${n} дн.`) превращаются в образцы с {0}, {1}.
import ts from "typescript";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = "src";
// Не переводится слоем интерфейса: содержимое ивентов (у него свой
// переключатель EN/RU), юридические тексты (сила — у русской версии),
// консоль владельца, тесты и сам каталог переводов.
// Схемы, демонстрации и вопросы самопроверки в конспектах двуязычны сами по себе (ru/en по языку конспекта).
const SKIP = [/^lib\/events\/(researchMethods|computerNetworks|cloudComputing)\//, /^components\/events\/(NotesDiagram|NotesDemo|CheckQuestion)\.tsx$/, /^app\/privacy\//, /^app\/terms\//, /^app\/admin\//, /^components\/Owner/, /^i18n\//, /\.test\.tsx?$/, /^app\/api\/(owner|admin|cron|push|assistant)\//, /^lib\/(push|notify|telegram|presence)/];
const cyr = /[А-Яа-яЁё]/;
const keys = new Map();
const add = (raw, file) => {
  const text = raw.replace(/\s+/g, " ").trim();
  // Длинные строки — это инструкции для ИИ и абзацы документов, а не интерфейс.
  if (!cyr.test(text) || text.length > 700) return;
  if (/^(Ты |Составь |Проверь |Оцени |Режим )/.test(text) && text.length > 160) return;
  const entry = keys.get(text) ?? new Set();
  entry.add(file);
  keys.set(text, entry);
};

(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) { walk(path); continue; }
    if (!/\.tsx?$/.test(name)) continue;
    const file = relative(root, path);
    if (SKIP.some((re) => re.test(file))) continue;
    const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, name.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    (function visit(node) {
      if (ts.isJsxText(node)) add(node.text, file);
      else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node.text, file);
      else if (ts.isTemplateExpression(node)) {
        add(node.head.text + node.templateSpans.map((span, i) => `{${i}}` + span.literal.text).join(""), file);
        return; // вложенные куски уже учтены образцом
      }
      ts.forEachChild(node, visit);
    })(source);
  }
})(root);

const list = [...keys.keys()].sort((a, b) => a.localeCompare(b, "ru"));
writeFileSync("src/i18n/keys.json", JSON.stringify(list, null, 0) + "\n");
console.log(`keys: ${list.length}, chars: ${list.reduce((n, k) => n + k.length, 0)}, patterns: ${list.filter((k) => /\{\d\}/.test(k)).length}`);
