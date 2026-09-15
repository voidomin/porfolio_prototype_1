import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: [...nextCoreWebVitals, ...compat.extends("prettier")],

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    rules: {
        "no-console": ["warn", {
            allow: ["warn", "error"],
        }],

        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
            ignoreRestSiblings: true,
        }],

        "prefer-const": "error",
        "no-var": "error",

        // eslint-plugin-react-hooks v6 (bundled by eslint-config-next 16.x)
        // ships the React Compiler-readiness rules as part of "recommended".
        // This project doesn't adopt the React Compiler (no
        // babel-plugin-react-compiler, no compiler config), and these four
        // rules produce false positives against patterns that are correct
        // here: Math.random() inside a useMemo/useState initializer with an
        // empty dep array (stable-per-mount particle/animation randomness,
        // used throughout NatureScene/ContactSection/etc.), the standard
        // `if (!ref.current) { ref.current = ... }` lazy-ref-init pattern in
        // HeroScene.tsx (the rule's own message describes this exact
        // pattern as the fix), an effect syncing local state from a browser
        // API (useSafeReducedMotion's matchMedia listener), and a
        // useCallback depending on a derived array the compiler can't prove
        // is stable. Revisit if this project ever adopts the React
        // Compiler — see ROADMAP.md.
        "react-hooks/purity": "off",
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/preserve-manual-memoization": "off",
        "react-hooks/refs": "off",
    },
}]);