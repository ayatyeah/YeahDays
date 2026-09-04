/**
 * Пустой конфиг, чтобы Vite не поднимался в корень монорепо и не находил
 * там postcss.config.mjs основного Next.js-приложения (Tailwind) — это
 * отдельный проект (свой package.json/node_modules), Tailwind ему не нужен,
 * styles.css — обычный CSS без препроцессинга.
 */
export default {
  plugins: {},
};
