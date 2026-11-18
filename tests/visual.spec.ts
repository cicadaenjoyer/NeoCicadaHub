import { test, expect } from "@playwright/test";
import { ROUTES } from "./helpers";

for (const r of ROUTES) {
  test(`visual ${r}`, async ({ page }) => {
    await page.clock.install();
    await page.goto(r);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      animations: "disabled",
      mask: [page.locator(".tag"), page.locator(".gstage video")],
    });
  });
}
