import { test, expect } from "@playwright/test";

test("contact options", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.locator("[data-email]")).toHaveText("abehernandez@work.com");
  await expect(page.locator('a[href="mailto:abehernandez@work.com"]')).toHaveCount(1);
  await expect(page.locator('a.opt[href="https://www.linkedin.com/in/abrahamh-dev/"]')).toHaveAttribute("target", "_blank");
});
