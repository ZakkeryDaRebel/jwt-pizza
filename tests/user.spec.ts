import { test, expect } from "playwright-test-coverage";

test("db register", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  for (let i = 0; i < 11; i++) {
    await page.getByRole("link", { name: "Register" }).click();
    await page.getByRole("textbox", { name: "Full name" }).fill(`user${i}`);
    const email = `user${i}${Math.floor(Math.random() * 10000)}@jwt.com`;
    await page.getByRole("textbox", { name: "Email address" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill("password");
    await page.getByRole("button", { name: "Register" }).click();
    await page.getByRole("link", { name: "Logout" }).click();
  }
});

test("list users", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();

  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Name" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "常用名字" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Email" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "a@jwt.com" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Role" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "admin" })).toBeVisible();
  await expect(
    page.getByRole("columnheader", { name: "Action" }).first(),
  ).toBeVisible();
  await expect(
    page
      .getByRole("row", { name: "常用名字 a@jwt.com admin X" })
      .getByRole("button"),
  ).toBeVisible();
});

test("list users arrows", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();

  await expect(page.getByRole("cell", { name: "常用名字" })).toBeVisible();
  await expect(page.getByRole("button", { name: "»" }).first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: "»" }).first(),
  ).not.toBeDisabled();
  await expect(page.getByRole("button", { name: "«" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "«" }).first()).toBeDisabled();
  await page.getByRole("button", { name: "»" }).first().click();
  await expect(page.getByRole("cell", { name: "常用名字" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "»" }).first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: "»" }).first(),
  ).not.toBeDisabled();
  await expect(page.getByRole("button", { name: "«" }).first()).toBeVisible();
  await expect(
    page.getByRole("button", { name: "»" }).first(),
  ).not.toBeDisabled();
  await page.getByRole("button", { name: "«" }).first().click();
  await expect(page.getByRole("cell", { name: "常用名字" })).toBeVisible();
});

test("list users search and delete", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("delete me");
  const email = `deleteme${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("delete");
  await page.getByRole("button", { name: "Register" }).click();

  await page.getByRole("link", { name: "Logout" }).click();

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();

  await page.getByRole("textbox", { name: "Search" }).fill("delete");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByRole("cell", { name: "delete me" })).toBeVisible();
  await page.getByRole("button").first().click();
  await expect(page.getByRole("cell", { name: "delete me" })).not.toBeVisible();
});

test("updateUser username", async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();

  await page.getByRole("link", { name: "pd" }).click();

  await expect(page.getByRole("main")).toContainText("pizza diner");

  // Edit button

  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator("h3")).toContainText("Edit user");
  await page.getByRole("textbox").first().fill("pizza dinerx");
  await page.getByRole("button", { name: "Update" }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });

  await expect(page.getByRole("main")).toContainText("pizza dinerx");

  // Logout and See if Changes stayed

  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();

  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("link", { name: "pd" }).click();

  await expect(page.getByRole("main")).toContainText("pizza dinerx");
});

test("updateUser password", async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();

  await page.getByRole("link", { name: "pd" }).click();

  // Edit button

  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator("h3")).toContainText("Edit user");
  await page.locator("#password").fill("dinerx");
  await page.getByRole("button", { name: "Update" }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });

  // Logout and See if Changes stayed

  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();

  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("dinerx");
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("link", { name: "pd" }).click();
});

test("updateUser email", async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();

  await page.getByRole("link", { name: "pd" }).click();

  // Edit button

  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator("h3")).toContainText("Edit user");
  const newEmail = `user${Math.floor(Math.random() * 10000)}@jwt.com`;

  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill(newEmail);
  await page.getByRole("button", { name: "Update" }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });

  // Logout and See if Changes stayed

  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();

  await page.getByRole("textbox", { name: "Email address" }).fill(newEmail);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("link", { name: "pd" }).click();

  // Logout and Make sure old email doesn't work

  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();

  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("main")).toContainText("Login");
  await expect(page.getByText('{"code":404,"message":"')).toBeVisible();
});

test("updateUser as admin", async ({ page }) => {
  const email = `admin${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto("http://localhost:5173/");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
  await page.getByRole("link", { name: "常" }).click();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByRole("textbox").first().fill("old admin");
  await page.locator('input[type="email"]').fill("oa@jwt.com");
  await page.locator("#password").fill("old");
  await page.getByRole("button", { name: "Update" }).click();

  await expect(
    page.getByRole("link", { name: "oa", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("oa@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("old");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "oa", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "oa", exact: true }).click();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByRole("textbox").first().fill("常用名字");
  await page.locator('input[type="email"]').fill("a@jwt.com");
  await page.locator("#password").fill("admin");
  await page.getByRole("button", { name: "Update" }).click();

  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
});
