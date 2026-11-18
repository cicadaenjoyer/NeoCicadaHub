import { test, expect } from "@playwright/test";

test("lobby content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Abraham Hernandez");
  await expect(page.locator(".choice")).toHaveText(["Show me your projects", "Where have you worked?", "How can I reach you?"]);
  await expect(page.locator(".choice").nth(1)).toHaveAttribute("href", "/work/");
  await expect(page.locator("[data-slide]:visible")).toHaveCount(1);
  await expect(page.locator("[data-slide]").first()).toHaveAttribute("href", "/projects/tabi/");
  await expect(page.locator(".nowcard")).toContainText("Software Programmer");
  await expect(page.locator(".hello img")).toHaveCSS("image-rendering", "pixelated");
});

test("banner auto-advances and dots step", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.clock.runFor(6100);
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/cdb/");
  await page.locator('[data-dot="0"]').click(); // arrows are display:none on phone; dots exist everywhere
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/tabi/");
  await expect(page.locator('[data-dot="0"]')).toHaveAttribute("aria-current", "true");
});

test("tagline types out one of the taglines", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.clock.runFor(5000);
  const lines: string[] = JSON.parse((await page.locator("[data-typewriter]").getAttribute("data-lines")) ?? "[]");
  expect(lines).toContain(await page.locator(".tag").innerText());
  await expect(page.locator("[data-typewriter-live]")).toHaveText(await page.locator(".tag").innerText());
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("no auto-advance, tagline whole at once", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    const lines: string[] = JSON.parse((await page.locator("[data-typewriter]").getAttribute("data-lines")) ?? "[]");
    expect(lines).toContain(await page.locator(".tag").innerText());
    await page.clock.runFor(13000);
    await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/tabi/");
  });
});
