import { test, expect } from "@playwright/test";

test("profile card and skills render", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator(".idc .band")).toHaveText("PROFILE");
  await expect(page.locator('#pane-skills svg[role="img"]')).toHaveCount(9);
  await expect(page.locator('svg[aria-label="TypeScript logo"] path')).toHaveAttribute("fill", "#3178c6");
});

test.describe("without JS", () => {
  test.use({ javaScriptEnabled: false });
  test("both About panes are visible", async ({ page }) => {
    await page.goto("/about/");
    await expect(page.locator("#pane-bio")).toBeVisible();
    await expect(page.locator("#pane-skills")).toBeVisible();
  });
});
