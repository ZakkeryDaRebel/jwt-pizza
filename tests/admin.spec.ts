import { test, expect } from "playwright-test-coverage";
import { Role } from "../src/service/pizzaService";

async function adminInit(page: any) {
  await page.addInitScript(() =>
    localStorage.setItem("token", "admin-fake-jwt-token"),
  );

  // Authorize login for the given user
  await page.route("*/**/api/auth", async (route: any) => {
    const loginReq = route.request().postDataJSON();
    const user = {
      id: "3",
      name: "admin",
      email: "a@jwt.com",
      password: "admin",
      roles: [{ role: Role.Admin }],
    };
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
      return;
    }
    const loginRes = {
      user: user,
      token: "abcdef",
    };
    await expect(route.request().method()).toBe("PUT");
    await route.fulfill({ json: loginRes });
  });

  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login", exact: true }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await Promise.all([
    page.waitForResponse("**/api/auth"),
    page.getByRole("button", { name: "Login" }).click(),
  ]);
}

test("create franchise", async ({ page }) => {
  await adminInit(page);

  const franchises: any[] = [];

  await page.route("**/api/franchise*", async (route) => {
    let method = route.request().method();

    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ franchises, more: false }),
      });
    }

    if (method === "POST") {
      const body = await route.request().postDataJSON();
      const newF = {
        id: Date.now(),
        name: body.name,
        admins: body.admins || [],
        stores: [],
      };
      franchises.push(newF);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(newF),
      });
    }
  });

  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  let franchiseName = "Test Franchise";
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill(franchiseName);
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("a@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  // await page.getByRole("link", { name: "Admin" }).click();
  // await expect(page.getByRole("cell", { name: franchiseName })).toBeVisible();
});
