import { test, expect } from "@playwright/test";

test("lobby content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Abraham Hernandez");
  await expect(page.locator(".choice")).toHaveText(["Show me your projects", "Where have you worked?", "How can I reach you?"]);
  await expect(page.locator(".choice").nth(1)).toHaveAttribute("href", "/work/");
  await expect(page.locator("[data-slide]:visible")).toHaveCount(1);
  await expect(page.locator("[data-slide]").first()).toHaveAttribute("href", "/projects/shogun/");
  await expect(page.locator(".nowcard")).toContainText("Software Engineer");
});

test("banner auto-advances and dots step", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.clock.runFor(6100);
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/fly/");
  await page.locator('[data-dot="0"]').click(); // arrows are display:none on phone; dots exist everywhere
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/shogun/");
  await expect(page.locator('[data-dot="0"]')).toHaveAttribute("aria-current", "true");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("no auto-advance", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await page.clock.runFor(13000);
    await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/shogun/");
  });
});

test("avatar is synced from GitHub at build time", async ({ page }) => {
  await page.goto("/");
  const img = page.locator(".hello img");
  await expect(img).toHaveAttribute("src", /^\/_astro\//); // optimised local copy, not hot-linked
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(32);
  await expect(img).not.toHaveCSS("image-rendering", "pixelated"); // an illustration, not pixel art
});

test("every featured banner keeps its 16:9 frame", async ({ page }) => {
  await page.goto("/");
  const dots = await page.locator("[data-dot]").count();
  for (let i = 0; i < dots; i++) {
    await page.locator(`[data-dot="${i}"]`).click();
    const box = await page.locator("[data-slide]:visible .art").boundingBox();
    expect(box!.width / box!.height, `slide ${i}`).toBeCloseTo(16 / 9, 1);
  }
});
