import { test, expect } from "playwright-test-coverage";

test("history", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await expect(page.getByRole("link", { name: "History" })).toBeVisible();
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByText("Mama Rucci, my my")).toBeVisible();
  await expect(page.getByText("It all started in Mama Ricci'")).toBeVisible();
});

test("about", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByText("The secret sauce")).toBeVisible();
  await expect(page.getByText("At JWT Pizza, our amazing")).toBeVisible();
});

test("franchise", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Franchise" }),
  ).toBeVisible();
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByText("So you want a piece of the")).toBeVisible();
  await page.getByText("Now is the time to get in on").click();
});

test("return home", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByText("homehistory")).toBeVisible();
  await page.getByRole("link", { name: "history", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "history", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "home" })).toBeVisible();
  await page.getByRole("link", { name: "home" }).click();
});

test("not found", async ({ page }) => {
  await page.goto("http://localhost:5173/pizza");

  await expect(page.getByText("Oops")).toBeVisible();
  await expect(page.getByText("It looks like we have dropped")).toBeVisible();
});

test("docs", async ({ page }) => {
  await page.route("**/api/docs", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        version: 12345,
        endpoints: [
          {
            method: "POST",
            path: "/api/auth",
            description: "Register a new user",
            example: `curl -X POST localhost:3000/api/auth -d '{"name":"pizza diner", "email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json'`,
            response: {
              user: {
                id: 2,
                name: "pizza diner",
                email: "d@jwt.com",
                roles: [{ role: "diner" }],
              },
              token: "tttttt",
            },
          },
          {
            method: "PUT",
            path: "/api/auth",
            description: "Login existing user",
            example: `curl -X PUT localhost:3000/api/auth -d '{"email":"a@jwt.com", "password":"admin"}' -H 'Content-Type: application/json'`,
            response: {
              user: {
                id: 1,
                name: "常用名字",
                email: "a@jwt.com",
                roles: [{ role: "admin" }],
              },
              token: "tttttt",
            },
          },
          {
            method: "DELETE",
            path: "/api/auth",
            requiresAuth: true,
            description: "Logout a user",
            example: `curl -X DELETE localhost:3000/api/auth -H 'Authorization: Bearer tttttt'`,
            response: { message: "logout successful" },
          },
        ],
        config: { factory: "FactoryURL", db: "DBURL" },
      }),
    });
  });

  await page.goto("http://localhost:5173/docs");

  await expect(page.getByText("JWT Pizza API")).toBeVisible();
  await expect(page.getByText("[POST] /api/authRegister a")).toBeVisible();
});
