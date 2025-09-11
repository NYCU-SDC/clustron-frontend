import { test, expect } from "@playwright/test";
import jwt from "jsonwebtoken";

const TEST_EMAIL = "bendoris0509@gmail.com";
const TEST_ROLE = "admin";
const TEST_SECRET = "default-secret";

function getAccessToken() {
  if (process.env.PLAYWRIGHT_ACCESS_TOKEN) {
    return process.env.PLAYWRIGHT_ACCESS_TOKEN as string;
  }
  // Use capitalized claims to match frontend's expected payload keys
  return jwt.sign(
    {
      Email: TEST_EMAIL,
      Role: TEST_ROLE,
    },
    TEST_SECRET,
    { expiresIn: "1h" },
  );
}

function getDummyRefreshToken() {
  // Prefer real token from env when hitting live backend
  return (
    (process.env.PLAYWRIGHT_REFRESH_TOKEN as string) || "dummy-refresh-token"
  );
}

test.describe("Admin E2E", () => {
  test("login with valid cookies shows navbar and links", async ({
    page,
    context,
  }) => {
    const accessToken = getAccessToken();
    const refreshToken = getDummyRefreshToken();
    await context.addCookies([
      {
        name: "accessToken",
        value: accessToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
      {
        name: "refreshToken",
        value: refreshToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.goto("http://localhost:5173/");
    // Home redirects to /groups when logged in
    await expect(page).toHaveURL(/.*\/groups/);
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("link", { name: "群組" })).toBeVisible();
    await expect(page.getByRole("link", { name: "設定" })).toBeVisible();
  });

  test("no cookies redirects protected pages to login", async ({ page }) => {
    await page.goto("http://localhost:5173/groups");
    await expect(page).toHaveURL(/.*login/);
    await page.goto("http://localhost:5173/setting");
    await expect(page).toHaveURL(/.*login/);
  });

  test("navbar and links visible after login", async ({ page, context }) => {
    const accessToken = getAccessToken();
    const refreshToken = getDummyRefreshToken();
    await context.addCookies([
      {
        name: "accessToken",
        value: accessToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
      {
        name: "refreshToken",
        value: refreshToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.goto("http://localhost:5173/");
    await expect(page).toHaveURL(/.*\/groups/);
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("link", { name: "群組" })).toBeVisible();
    await expect(page.getByRole("link", { name: "設定" })).toBeVisible();
  });

  test("navigation links work", async ({ page, context }) => {
    const accessToken = getAccessToken();
    const refreshToken = getDummyRefreshToken();
    await context.addCookies([
      {
        name: "accessToken",
        value: accessToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
      {
        name: "refreshToken",
        value: refreshToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.goto("http://localhost:5173/");
    await page.getByRole("link", { name: "群組" }).click();
    await expect(page).toHaveURL(/.*groups/);
    await page.getByRole("link", { name: "設定" }).click();
    await expect(page).toHaveURL(/.*setting/);
  });

  // Duplicate of redirection coverage above; keep minimal
  // to ensure protected routes are guarded.

  test("create group via UI", async ({ page, context }) => {
    const accessToken = getAccessToken();
    const refreshToken = getDummyRefreshToken();
    await context.addCookies([
      {
        name: "accessToken",
        value: accessToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
      {
        name: "refreshToken",
        value: refreshToken,
        domain: "localhost",
        path: "/",
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    // No network mocks: talk to live backend

    await page.goto("http://localhost:5173/groups");
    // Click "+ 新群組"
    await page.getByRole("button", { name: "+ 新群組" }).click();
    await expect(page).toHaveURL(/.*\/groups\/new/);

    // Fill title and description by placeholder
    await page.getByPlaceholder("為你的新群組取個名稱").fill("E2E 測試群組");
    await page
      .getByPlaceholder("介紹一下這個群組")
      .fill("由 Playwright 自動建立");

    // Provide one initial member and choose a role (wait for roles to load)
    await page.getByPlaceholder("學號或電子信箱").first().fill(TEST_EMAIL);
    const roleCombo = page.getByRole("combobox").first();
    await roleCombo.click();
    await page.getByRole("option").first().click();

    // Submit and wait for POST /api/groups to complete
    const createBtn = page.getByRole("button", { name: "建立" });
    await expect(createBtn).toBeEnabled();
    await createBtn.click();

    await page.waitForTimeout(3000);

    // Expect redirected to add-member-result page
    await expect(page).toHaveURL(/.*\/groups\/.+\/add-member-result/, {
      timeout: 15000,
    });
    // Title inside the result page table
    await expect(page.getByText("群組建立結果")).toBeVisible({
      timeout: 15000,
    });
  });
});
