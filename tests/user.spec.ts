import { test, expect } from "playwright-test-coverage";

async function mockApi(page) {
  await page.route("**/api/auth", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          id: 1,
          name: "pizza diner",
          email: "admin@test.com",
          roles: [{ role: "admin" }],
        },
        token: "fake-jwt-token",
      }),
    });
  });

  await page.route("**/api/user**", async (route, request) => {
    if (request.method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          users: [
            {
              id: 1,
              name: "常用名字",
              email: "a@jwt.com",
              roles: [{ role: "admin" }],
            },
            {
              id: 2,
              name: "pd",
              email: "pd2@jwt.com",
              roles: [{ role: "diner" }],
            },
            {
              id: 3,
              name: "pd",
              email: "p3@jwt.com",
              roles: [{ role: "diner" }],
            },
            {
              id: 4,
              name: "pd",
              email: "p4@jwt.com",
              roles: [{ role: "diner" }],
            },
            {
              id: 5,
              name: "pd",
              email: "p5@jwt.com",
              roles: [{ role: "diner" }],
            },
          ],
        }),
      });
    } else if (request.method() === "PUT") {
      const body = JSON.parse(request.postData() || "{}");

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: 1,
            name: body.name,
            email: body.email,
            roles: [{ role: "admin" }],
          },
          token: "fake-jwt-token",
        }),
      });
    }
  });
}

async function login(page: any) {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
}

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("list users", async ({ page }) => {
  await login(page);

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

// test("list users arrows", async ({ page }) => {
//   await login(page);

//   await expect(page.getByRole("cell", { name: "常用名字" })).toBeVisible();
//   await expect(page.getByRole("button", { name: "»" }).first()).toBeVisible();
//   await expect(
//     page.getByRole("button", { name: "»" }).first(),
//   ).not.toBeDisabled();
//   await expect(page.getByRole("button", { name: "«" }).first()).toBeVisible();
//   await expect(page.getByRole("button", { name: "«" }).first()).toBeDisabled();
//   await page.getByRole("button", { name: "»" }).first().click();
//   await expect(page.getByRole("cell", { name: "常用名字" })).not.toBeVisible();
//   await expect(page.getByRole("button", { name: "»" }).first()).toBeVisible();
//   await expect(page.getByRole("button", { name: "«" }).first()).toBeVisible();
//   await page.getByRole("button", { name: "«" }).first().click();
//   await expect(page.getByRole("cell", { name: "常用名字" })).toBeVisible();
// });

test("list users search and delete", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  const name = `delete${Math.floor(Math.random() * 10000)}`;

  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill(name);
  const email = `${name}@jwt.com`;
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(name);
  await page.getByRole("button", { name: "Register" }).click();

  await page.getByRole("link", { name: "Logout" }).click();

  await login(page);

  await page.getByRole("textbox", { name: "Search" }).fill(name);
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByRole("cell", { name: name }).first()).toBeVisible();
  await page.getByRole("button").first().click();

  await page.getByRole("textbox", { name: "Search" }).fill(name);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("");
  await expect(page.getByRole("cell", { name: name })).not.toBeVisible();
});

// test("updateUser username", async ({ page }) => {
//   const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
//   await page.goto("http://localhost:5173/");
//   await page.getByRole("link", { name: "Register" }).click();
//   await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
//   await page.getByRole("textbox", { name: "Email address" }).fill(email);
//   await page.getByRole("textbox", { name: "Password" }).fill("diner");
//   await page.getByRole("button", { name: "Register" }).click();

//   await page.getByRole("link", { name: "pd" }).click();

//   await expect(page.getByRole("main")).toContainText("pizza diner");

//   // Edit button

//   await page.getByRole("button", { name: "Edit" }).click();
//   await expect(page.locator("h3")).toContainText("Edit user");
//   await page.getByRole("textbox").first().fill("pizza dinerx");
//   await page.getByRole("button", { name: "Update" }).click();

//   await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });

//   await expect(page.getByRole("main")).toContainText("pizza dinerx");

//   // Logout and See if Changes stayed

//   await page.getByRole("link", { name: "Logout" }).click();
//   await page.getByRole("link", { name: "Login" }).click();

//   await page.getByRole("textbox", { name: "Email address" }).fill(email);
//   await page.getByRole("textbox", { name: "Password" }).fill("diner");
//   await page.getByRole("button", { name: "Login" }).click();

//   await page.getByRole("link", { name: "pd" }).click();

//   await expect(page.getByRole("main")).toContainText("pizza dinerx");
// });

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
  await expect(page.getByRole("link", { name: "pd" })).not.toBeVisible();
});
