import type { BrowserContext, Page } from "@playwright/test";

function unsignedJwt(payload: Record<string, unknown>) {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");

  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.`;
}

export async function authenticate(context: BrowserContext) {
  await context.addInitScript(() => localStorage.setItem("lang", "en"));

  await context.addCookies([
    {
      name: "accessToken",
      value: unsignedJwt({
        ID: "admin-1",
        FullName: "Playwright Admin",
        Email: "admin@example.com",
        Role: "admin",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
      url: "http://127.0.0.1:5173",
    },
    {
      name: "refreshToken",
      value: "playwright-refresh-token",
      url: "http://127.0.0.1:5173",
    },
  ]);
}

export async function mockSetup(page: Page) {
  await page.route("**/api/setup/status", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ progress: { database: true } }),
    }),
  );
}

export async function mockRoles(page: Page, roles: unknown[] = []) {
  await page.route("**/api/roles", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(roles),
    }),
  );
}
