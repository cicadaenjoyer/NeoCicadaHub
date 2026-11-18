import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ROUTES } from "./helpers";

for (const r of ROUTES) {
  test(`axe ${r}`, async ({ page }) => {
    await page.goto(r);
    const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
  });
}

test("404 page", async ({ page }) => {
  const res = await page.goto("/nope/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Not found");
  await expect(page.locator(".dock a[aria-current]")).toHaveCount(0);
  await page.locator("a", { hasText: "Back to Home" }).click();
  await expect(page).toHaveURL("/");
});

test("one h1 and a skip link per route", async ({ page }) => {
  for (const r of ROUTES) {
    await page.goto(r);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('a[href="#main"]')).toHaveCount(1);
  }
});

test("social meta tags", async ({ page }) => {
  await page.goto("/work/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://www.cicadahub.dev/og.png");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Work · Abraham Hernandez");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.cicadahub.dev/work/");
});
