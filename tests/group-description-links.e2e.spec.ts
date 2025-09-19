import { test, expect } from "@playwright/test";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// 伪造的 group description links 数据
const links = [
  { title: "Google", url: "https://www.google.com" },
  { title: "GitHub", url: "https://github.com" },
];

const TEST_EMAIL = "bendoris0509@gmail.com";
const TEST_ROLE = "admin";
const TEST_SECRET = "default-secret";

function getAccessToken() {
  // 模拟后端 claims 结构
  const id = uuidv4();
  const email = TEST_EMAIL;
  const role = TEST_ROLE;
  const studentID = "";
  const jwtID = uuidv4();
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + 3600; // 1小时
  const payload = {
    ID: id,
    Email: email,
    Role: role,
    StudentID: studentID,
    iss: "Clustron",
    sub: id,
    exp: expiration,
    nbf: now,
    iat: now,
    jti: jwtID,
  };
  return jwt.sign(payload, TEST_SECRET);
}

function getDummyRefreshToken() {
  return (
    (process.env.PLAYWRIGHT_REFRESH_TOKEN as string) || "dummy-refresh-token"
  );
}

test.describe("GroupDescription 外部链接", () => {
  let groupId: string;

  test.beforeEach(async ({ page, context }) => {
    // 设置登录 cookie
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
    // 创建群组
    await page.goto("http://localhost:5173/groups");
    await page.getByRole("button", { name: "+ 新群組" }).click();
    await expect(page).toHaveURL(/.*\/groups\/new/);
    await page.getByPlaceholder("為你的新群組取個名稱").fill("E2E 外链群组");
    await page.getByPlaceholder("介紹一下這個群組").fill("测试外部链接渲染");
    // 添加两个外部链接
    await page
      .getByPlaceholder("https://example.com")
      .first()
      .fill("https://www.google.com");
    // 添加第二个链接（无 https 前缀）
    await page.getByRole("button", { name: /新增連結/ }).click();
    const linkInputs = await page.locator(
      'input[placeholder="https://example.com"]',
    );
    await linkInputs.nth(1).fill("github.com");
    // 填写成员
    await page.getByPlaceholder("學號或電子信箱").first().fill(TEST_EMAIL);
    const roleCombo = page.getByRole("combobox").first();
    await roleCombo.click();
    await page.getByRole("option").first().click();
    // 提交
    const createBtn = page.getByRole("button", { name: "建立" });
    await expect(createBtn).toBeEnabled();
    await createBtn.click();
    // 跳转到 add-member-result，获取 groupId
    await expect(page).toHaveURL(/.*\/groups\/.+\/add-member-result/, {
      timeout: 15000,
    });
    const url = page.url();
    const match = url.match(/groups\/(.+)\/add-member-result/);
    groupId = match ? match[1] : "";
    expect(groupId).not.toBe("");
  });

  test("每个链接都指向外部网站并在新标签页打开", async ({ page, context }) => {
    // 跳转到群组详情页
    await page.goto(`http://localhost:5173/groups/${groupId}`);
    // 获取所有外部链接
    const linkElements = await page.locator('a[href^="http"]');
    const count = await linkElements.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const link = linkElements.nth(i);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^https?:\/\//);
      // 检查点击后是否在新标签页打开
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        link.click(),
      ]);
      expect(newPage.url()).toContain(href.replace(/^https?:\/\//, ""));
      await newPage.close();
    }
  });
});
