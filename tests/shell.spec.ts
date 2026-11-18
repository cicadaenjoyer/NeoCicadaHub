import { test, expect } from "@playwright/test";

test("home responds and has a title", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Abraham Hernandez/);
});
