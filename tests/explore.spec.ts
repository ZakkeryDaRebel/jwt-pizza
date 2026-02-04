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
