import { test, expect } from "@playwright/test";

test("profile card and skills render", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator(".idc .band")).toHaveText("PROFILE");
  await expect(page.locator('#pane-skills svg[role="img"]')).toHaveCount(12);
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

test("skills keep their order", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator("#pane-skills .nm")).toHaveText([
    "TypeScript",
    "JavaScript",
    "Python",
    "C#",
    "PHP",
    "C",
    "React",
    "Next.js",
    "Expo",
    "Laravel",
    "Firebase",
    "Docker",
  ]);
});

test("tabs switch by click and arrow keys", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator("#pane-skills")).toBeHidden();
  await page.locator("#tab-skills").click();
  await expect(page.locator("#pane-skills")).toBeVisible();
  await expect(page.locator("#pane-bio")).toBeHidden();
  await page.locator("#tab-skills").press("ArrowRight"); // wraps to Bio
  await expect(page.locator("#tab-bio")).toBeFocused();
  await expect(page.locator("#tab-bio")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#tab-bio")).toHaveAttribute("tabindex", "0");
  await expect(page.locator("#tab-skills")).toHaveAttribute("tabindex", "-1");
  await page.keyboard.press("End");
  await expect(page.locator("#tab-skills")).toBeFocused();
  await expect(page.locator("#pane-skills")).toBeVisible();
  await expect(page.locator("#pane-bio")).toBeHidden();
});
