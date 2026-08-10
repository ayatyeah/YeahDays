import { resolve } from "node:path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    // Исходники на ESM (import/export, package.json — "type": "module"),
    // но бандл нарочно собираем в CJS с расширением .cjs: Node's ESM-загрузчик
    // не умеет корректно импортировать синтетический модуль "electron" (падает
    // на связывании ещё до всякого кода, воспроизводится даже голым
    // `import electron from "electron"` — не баг в этом проекте, а известное
    // ограничение ESM main-процесса в Electron). require("electron") в CJS
    // идёт через штатный перехват Module._load у Electron и работает всегда.
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, "src/main/index.ts"),
        output: { format: "cjs", entryFileNames: "[name].cjs" },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, "src/preload/index.ts"),
        output: { format: "cjs", entryFileNames: "[name].cjs" },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, "src/renderer"),
    plugins: [react()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, "src/renderer/index.html"),
      },
    },
  },
});
