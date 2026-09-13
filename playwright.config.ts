import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mobile",
      testMatch: [
        "**/admin-user-drawer.spec.ts",
        "**/create-group-drawers.spec.ts",
      ],
      use: {
        ...devices["iPhone 14 Pro Max"],
        browserName: "chromium",
      },
    },
    {
      name: "desktop",
      testMatch: "**/desktop-*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
      },
    },
  ],
  webServer: {
    command: "pnpm dev --host 127.0.0.1",
    url: "http://127.0.0.1:5173/health",
    reuseExistingServer: !process.env.CI,
  },
});
