import { expect, test } from "@playwright/test";
import { authenticate, mockRoles, mockSetup } from "./fixtures";

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

test("adds a link through the mobile Link Resources drawer", async ({
  page,
}) => {
  await mockRoles(page);
  await page.goto("/groups/new");
  await page.getByRole("button", { name: "+ Add More Links" }).click();

  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await drawer.getByPlaceholder("Link Title").fill("Project docs");
  await drawer.getByPlaceholder("URL").fill("https://example.com/docs");
  await drawer.getByRole("button", { name: "Done" }).click();

  await expect(drawer).toBeHidden();
  await expect(page.getByText("Project docs", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "https://example.com/docs", exact: true }),
  ).toBeVisible();
});

test("adds an initial member through the mobile member drawer", async ({
  page,
}) => {
  await mockRoles(page, [
    { id: "role-user", roleName: "student", accessLevel: "USER" },
  ]);
  await page.goto("/groups/new");
  await page.getByRole("button", { name: "+ Add More Users" }).click();

  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await drawer
    .getByPlaceholder("Email or Student ID")
    .fill("student@example.com");
  await drawer.getByRole("button", { name: "Add" }).click();

  await expect(drawer).toBeHidden();
  await expect(
    page.getByText("student@example.com", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "student", exact: true }),
  ).toBeVisible();
});
