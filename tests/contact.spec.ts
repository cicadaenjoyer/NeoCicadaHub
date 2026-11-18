import { test, expect } from "@playwright/test";

test("contact options", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.locator("[data-email]")).toHaveText("abehernandez@work.com");
  await expect(page.locator('a[href="mailto:abehernandez@work.com"]')).toHaveCount(1);
  await expect(page.locator('a.opt[href="https://www.linkedin.com/in/abrahamh-dev/"]')).toHaveAttribute("target", "_blank");
});

// Review Focus 4: clipboard available vs. denied.
test("copy succeeds", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact/");
  await page.locator("[data-copy-email]").click();
  await expect(page.locator("[data-copy-email]")).toHaveText("Copied!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("abehernandez@work.com");
});

test("copy falls back to selection, then resets", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) } });
  });
  await page.goto("/contact/");
  await page.locator("[data-copy-email]").click();
  await expect(page.locator("[data-copy-email]")).toHaveText("Selected, press Ctrl+C");
  expect(await page.evaluate(() => getSelection()?.toString())).toBe("abehernandez@work.com");
  await page.clock.runFor(2100);
  await expect(page.locator("[data-copy-email]")).toHaveText("Copy address");
});
