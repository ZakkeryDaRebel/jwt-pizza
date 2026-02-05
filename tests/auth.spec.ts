import { test, expect } from "playwright-test-coverage";

let bobEmail = "bob" + Math.floor(Math.random() * 10000) + "@gmail.com";

test("register", async ({ page }) => {
  await page.route("**/api/auth", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          name: "b",
          email: bobEmail,
          roles: [
            {
              role: "diner",
            },
          ],
          id: 12,
        },
        token: "abcdef",
      }),
    });
  });

  await page.goto("http://localhost:5173");

  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("bob");
  await page.getByRole("textbox", { name: "Email address" }).fill(bobEmail);
  await page.getByRole("textbox", { name: "Password" }).fill("monkeypie");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByRole("link", { name: "b", exact: true }).click();
  await expect(page.getByText(bobEmail)).toBeVisible();
  await expect(page.getByRole("main")).toContainText(bobEmail);
  await page.getByText(bobEmail).click();
});

test("login then logout", async ({ page }) => {
  await page.route("**/api/auth", async (route) => {
    let method = route.request().method();

    if (method === "PUT") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            name: "b",
            email: bobEmail,
            roles: [
              {
                role: "diner",
              },
            ],
            id: 12,
          },
          token: "abcdef",
        }),
      });
    }
    if (method === "DELETE") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "logout successful" }),
      });
    }
  });

  await page.goto("http://localhost:5173");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill(bobEmail);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("monkeypie");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("link", { name: "b", exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
});
