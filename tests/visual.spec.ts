import { test, expect } from "@playwright/test";
import { ROUTES } from "./helpers";

// Deterministic screens: reduced motion stops the banner auto-advancing.
test.use({ reducedMotion: "reduce" });

// Baselines are rendered on the developer's Linux machine; CI runners have different system
// fallback fonts (monospace email, the △×+○ glyphs), so screenshots are compared locally only.
test.skip(!!process.env.CI, "screenshot baselines are machine-specific");

for (const r of ROUTES) {
  test(`visual ${r}`, async ({ page }) => {
    await page.clock.install();
    await page.goto(r);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      animations: "disabled",
      // The avatar comes from GitHub at build time, so it changes whenever the profile picture does.
      mask: [page.locator(".gstage video"), page.locator(".ring img, .av img")],
    });
  });
}
