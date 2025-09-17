/// <reference types="vitest" />
import path from "path";
// ⬇️ 改這行：從 vitest/config 匯入
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "^/api/.*": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
    },
  },
});
