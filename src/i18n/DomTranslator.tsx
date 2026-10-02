"use client";

import { useEffect } from "react";
import { useLocaleStore, type Locale } from "./locale";
import { createTranslator, type Dictionary, type Translate } from "./translate";

/**
 * Переводчик страницы для английского и казахского интерфейса.
 *
 * Почему слой поверх разметки, а не `t("…")` в каждом компоненте:
 * интерфейс — это больше двух тысяч строк в сотне с лишним файлов, причём
 * в двух ветках, которые расходятся (локальная и та, что уходит на прод).
 * Переписать их все под ключи значило бы неделями разрешать конфликты и
 * рисковать русской версией, которой пользуются почти все. Здесь же при
 * русском языке компонент не делает вообще ничего, а при другом — меняет
 * текст уже отрисованных узлов по словарю.
 *
 * Что важно для совместной жизни с React: мы только пишем в nodeValue
 * существующих текстовых узлов и в атрибуты, не добавляя и не удаляя узлы
 * (именно удаление узлов ломает React под переводчиком браузера). Когда
 * React сам обновит текст, наблюдатель увидит новое русское значение и
 * переведёт его снова.
 *
 * Не трогаем: поля ввода, блоки с собственным `lang` (конспекты и вопросы
 * ивентов — у них свой переключатель) и всё внутри `data-no-i18n`
 * (юридические тексты: силу имеет русская версия).
 */

const ATTRIBUTES = ["placeholder", "aria-label", "title", "alt"];
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "CODE", "PRE", "NOSCRIPT", "IFRAME"]);

type Saved = { ru: string; out: string };
const texts = new WeakMap<Text, Saved>();
const attributes = new WeakMap<Element, Record<string, Saved>>();

function skipped(element: Element | null): boolean {
  for (let el = element; el && el !== document.documentElement; el = el.parentElement) {
    if (SKIP_TAGS.has(el.tagName) || el.hasAttribute("data-no-i18n") || el.hasAttribute("lang") || el.hasAttribute("contenteditable")) return true;
  }
  return false;
}

function translateText(node: Text, translate: Translate) {
  const value = node.nodeValue ?? "";
  const saved = texts.get(node);
  if (saved && saved.out === value) return; // это наша же запись
  const out = translate(value);
  if (out === null || out === value) {
    if (saved) texts.delete(node);
    return;
  }
  texts.set(node, { ru: value, out });
  node.nodeValue = out;
}

function translateAttributes(element: Element, translate: Translate) {
  for (const name of ATTRIBUTES) {
    const value = element.getAttribute(name);
    if (!value) continue;
    const saved = attributes.get(element)?.[name];
    if (saved && saved.out === value) continue;
    const out = translate(value);
    if (out === null || out === value) continue;
    attributes.set(element, { ...attributes.get(element), [name]: { ru: value, out } });
    element.setAttribute(name, out);
  }
}

function walk(root: Node, visit: (node: Text | Element) => void) {
  if (root.nodeType === Node.TEXT_NODE) {
    if (!skipped(root.parentElement)) visit(root as Text);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE || skipped(root as Element)) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
      const el = node as Element;
      return SKIP_TAGS.has(el.tagName) || el.hasAttribute("data-no-i18n") || el.hasAttribute("lang") || el.hasAttribute("contenteditable")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT;
    },
  });
  visit(root as Element);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) visit(node as Text | Element);
}

function apply(root: Node, translate: Translate) {
  walk(root, (node) => (node.nodeType === Node.TEXT_NODE ? translateText(node as Text, translate) : translateAttributes(node as Element, translate)));
}

/** Вернуть русский текст — при переключении обратно или на другой язык. */
function restore() {
  walk(document.body, (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const saved = texts.get(node as Text);
      if (saved && node.nodeValue === saved.out) node.nodeValue = saved.ru;
      texts.delete(node as Text);
      return;
    }
    const saved = attributes.get(node as Element);
    if (!saved) return;
    for (const [name, value] of Object.entries(saved)) if ((node as Element).getAttribute(name) === value.out) (node as Element).setAttribute(name, value.ru);
    attributes.delete(node as Element);
  });
}

const loaders: Record<Exclude<Locale, "ru">, () => Promise<{ default: Dictionary }>> = {
  en: () => import("./dict/en.json"),
  kk: () => import("./dict/kk.json"),
};

const reveal = () => document.documentElement.removeAttribute("data-i18n-pending");

export default function DomTranslator() {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    if (locale === "ru") {
      reveal();
      return;
    }
    let observer: MutationObserver | null = null;
    let cancelled = false;

    loaders[locale]()
      .then(({ default: dictionary }) => {
        if (cancelled) return;
        const translate = createTranslator(dictionary);
        const title = translate(document.title);
        if (title) document.title = title;
        apply(document.body, translate);
        observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.type === "characterData") {
              if (!skipped(m.target.parentElement)) translateText(m.target as Text, translate);
            } else if (m.type === "attributes") {
              if (!skipped(m.target as Element)) translateAttributes(m.target as Element, translate);
            } else {
              m.addedNodes.forEach((node) => apply(node, translate));
            }
          }
        });
        observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRIBUTES });
      })
      // Словарь не загрузился (нет сети) — остаёмся на русском, но экран показываем.
      .catch(() => {})
      .finally(reveal);

    return () => {
      cancelled = true;
      observer?.disconnect();
      restore();
    };
  }, [locale]);

  return null;
}
