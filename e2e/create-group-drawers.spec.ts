import { expect, test } from "@playwright/test";
import { authenticate, mockRoles, mockSetup } from "./test-utils";

test.beforeEach(async ({ context, page }) => {
  await authenticate(context);
  await mockSetup(page);
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
