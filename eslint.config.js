import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import css from "@eslint/css";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginQuery from "@tanstack/eslint-plugin-query";

// Downgrade a recommended ruleset's *active* rules to "warn" (incremental
// rollout) while preserving each rule's options and keeping disabled rules off.
/** @param {import("eslint").Linter.RulesRecord} rules */
const asWarnings = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([name, value]) => {
      const severity = Array.isArray(value) ? value[0] : value;
      if (severity === "off" || severity === 0) return [name, value];
      return [
        name,
        Array.isArray(value) ? ["warn", ...value.slice(1)] : "warn",
      ];
    }),
  );

export default defineConfig([
  {
    ignores: [
      "**/*.css",
      "**/package-lock.json",
      "dist",
      "src/components/ui/*",
      "coverage",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.{jsx,ts,js,tsx}"],
    plugins: { react: pluginReact },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  // TanStack Query and jsx-a11y are reported as warnings for now (incremental
  // rollout): surface the issues without failing lint/CI. Flip to the plugins'
  // recommended error severities once the existing findings are cleared.
  ...pluginQuery.configs["flat/recommended"].map((config) =>
    config.rules ? { ...config, rules: asWarnings(config.rules) } : config,
  ),
  {
    files: ["**/*.{jsx,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    rules: asWarnings(jsxA11y.flatConfigs.recommended.rules),
  },
  eslintConfigPrettier,
]);
