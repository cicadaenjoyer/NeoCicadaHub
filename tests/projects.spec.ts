import { test, expect } from "@playwright/test";

test("/projects/ shows Tabi and canonicalises", async ({ page }) => {
  await page.goto("/projects/");
  await expect(page.locator("#detail h2")).toHaveText("Tabi");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/projects\/tabi\/$/);
});

test("project route marks active row", async ({ page }) => {
  await page.goto("/projects/cdb/");
  await expect(page.locator('.prow[aria-current="page"]')).toContainText("C Database System");
  await expect(page.locator("#detail")).toContainText("This was a class project, so the repository isn't public.");
  await expect(page.locator(".gstage video")).toHaveCount(1);
  await expect(page.locator(".gcount")).toHaveText("1 / 3");
});

test("single-image project has no gallery controls", async ({ page }) => {
  await page.goto("/projects/dice/");
  await expect(page.locator("[data-gstep], [data-img]")).toHaveCount(0);
  await expect(page.locator(".gcount")).toHaveText("1 / 1");
});

test("tabi links to GitHub in a new tab", async ({ page }) => {
  await page.goto("/projects/tabi/");
  const a = page.locator("#detail a", { hasText: "View code on GitHub" });
  await expect(a).toHaveAttribute("href", "https://github.com/cicadaenjoyer/Tabi");
  await expect(a).toHaveAttribute("target", "_blank");
});
