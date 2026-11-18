import { test, expect } from "@playwright/test";

// Review Focus 1: leaving Home and coming back must leave exactly one carousel timer.
test("one carousel timer after leaving and returning", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.locator(".dock a", { hasText: "Work" }).click();
  await expect(page).toHaveURL("/work/");
  await page.locator(".dock a", { hasText: "Home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/tabi/");
  await page.clock.runFor(6100);
  // Advanced once (cdb), not twice (dice).
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/cdb/");
});

// Review Focus 3: phone deep link scrolls the detail panel into view, also after in-site navigation.
test("phone deep link scrolls detail into view", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "phone-only behaviour");
  await page.goto("/projects/cdb/#detail");
  await expect.poll(() => page.locator("#main").evaluate((m) => m.scrollTop)).toBeGreaterThan(0);
  await page.goto("/");
  await page.locator(".dock a", { hasText: "Projects" }).click();
  await expect(page).toHaveURL("/projects/");
  await page.locator(".prow", { hasText: "D&D Dice Store" }).click();
  await expect(page).toHaveURL("/projects/dice/#detail");
  await expect.poll(() => page.locator("#main").evaluate((m) => m.scrollTop)).toBeGreaterThan(0);
});
