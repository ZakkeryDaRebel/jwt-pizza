import { test, expect } from "playwright-test-coverage";

test("register", async ({ page }) => {
  await page.goto("http://localhost:5173");

  //generate random email
  let email = "bob@gmail.com";

  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("bob");
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("monkeypie");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByRole("link", { name: "b", exact: true }).click();
  await expect(page.getByText("bob@gmail.com")).toBeVisible();
  await expect(page.getByRole("main")).toContainText("bob@gmail.com");
  await page.getByText(email).click();
});

test("login Bob", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "bob@gmail.com", password: "monkeypie" };
    const loginRes = {
      user: {
        id: 3,
        name: "bob",
        email: "bob@gmail.com",
        roles: [{ role: "diner" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto("http://localhost:5173");

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("bob@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("monkeypie");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(
    page.getByRole("link", { name: "b", exact: true }),
  ).toBeVisible();
});
