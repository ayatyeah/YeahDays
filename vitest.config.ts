import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    // Hosting builders may export NODE_ENV=production; unit tests must never
    // inherit production behavior or spend real database/AI quotas.
    env: { NODE_ENV: "test" },
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
