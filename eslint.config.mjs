import hooks from "eslint-plugin-react-hooks";
import next from "@next/eslint-plugin-next";
import js from "@eslint/js";
import ts from "typescript-eslint";
export default ts.config(
  { ignores: [".next/**", "node_modules/**", "docs/**", "assistant/**", "public/**", "artifacts/**"] },
  { files: ["src/**/*.{ts,tsx}"], extends: [js.configs.recommended, ...ts.configs.recommended],
    plugins: { "react-hooks": hooks, "@next/next": next },
    linterOptions: { reportUnusedDisableDirectives: "off" },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      // Existing catch fallbacks and typed legacy APIs are migrated incrementally.
      "no-undef": "off", "no-empty": ["error", { allowEmptyCatch: true }],
      "@typescript-eslint/no-unused-vars": "off", "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off", "@typescript-eslint/no-require-imports": "off",
    },
  },
);
