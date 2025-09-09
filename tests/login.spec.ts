import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await expect(page).toHaveTitle(/Clustron/);
    await expect(page.locator('[data-slot="card-title"]')).toBeVisible();
  });
});
