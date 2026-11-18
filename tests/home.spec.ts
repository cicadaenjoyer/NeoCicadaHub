import { test, expect } from "@playwright/test";

test("lobby content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Abraham Hernandez");
  await expect(page.locator(".choice")).toHaveText([
    "Show me your projects",
    "Where have you worked?",
    "How can I reach you?",
  ]);
  await expect(page.locator(".choice").nth(1)).toHaveAttribute("href", "/work/");
  await expect(page.locator("[data-slide]:visible")).toHaveCount(1);
  await expect(page.locator("[data-slide]").first()).toHaveAttribute("href", "/projects/tabi/");
  await expect(page.locator(".nowcard")).toContainText("Software Programmer");
  await expect(page.locator(".hello img")).toHaveCSS("image-rendering", "pixelated");
});
