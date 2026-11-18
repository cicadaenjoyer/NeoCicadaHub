import { test, expect } from "@playwright/test";
import { ROUTES } from "./helpers";

// Deterministic screens: reduced motion shows the tagline whole, and Math.random() = 0 picks the first one.
test.use({ reducedMotion: "reduce" });

for (const r of ROUTES) {
  test(`visual ${r}`, async ({ page }) => {
    await page.clock.install();
    await page.addInitScript(() => {
      Math.random = () => 0;
    });
    await page.goto(r);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      animations: "disabled",
      mask: [page.locator(".tag"), page.locator(".gstage video")],
    });
  });
}
