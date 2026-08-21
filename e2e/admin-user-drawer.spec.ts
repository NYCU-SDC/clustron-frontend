import { expect, test } from "@playwright/test";
import { authenticate, mockRoles, mockSetup } from "./test-utils";

test.beforeEach(async ({ context, page }) => {
  await authenticate(context);
  await mockSetup(page);
});

test("opens the mobile admin user detail drawer", async ({ page }) => {
  await page.route("**/api/users?**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [
          {
            id: "user-1",
            fullName: "Test User",
            email: "test.user@example.com",
            studentId: "B12345678",
            linuxUsername: "testuser",
            role: "USER",
          },
        ],
        totalPages: 1,
        totalItems: 1,
        currentPage: 0,
        pageSize: 20,
        hasNextPage: false,
      }),
    }),
  );
  await mockRoles(page);

  await page.goto("/admin/users");
  await page.getByRole("button", { name: "User details" }).click();

  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await expect(
    drawer.getByRole("heading", { name: "Test User" }),
  ).toBeVisible();
  await expect(drawer).toContainText("B12345678");
  await expect(drawer).toContainText("test.user@example.com");
  await expect(drawer).toContainText("testuser");
  await expect(drawer.getByRole("button", { name: "Done" })).toBeVisible();

  await drawer.getByRole("button", { name: "Cancel" }).click();
  await expect(drawer).toBeHidden();
});
