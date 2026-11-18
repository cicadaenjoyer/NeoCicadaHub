import { test, expect } from "@playwright/test";

test("/projects/ shows the newest project and canonicalises", async ({ page }) => {
  await page.goto("/projects/");
  await expect(page.locator("#detail h2")).toHaveText("Shogun");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/projects\/shogun\/$/);
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

test("gallery steps and keyboard works", async ({ page }) => {
  await page.goto("/projects/tabi/");
  await page.locator('[data-gstep="1"]').click();
  await expect(page.locator(".gcount")).toHaveText("2 / 5");
  await expect(page.locator(".gcap")).toHaveText("Kanji page with radicals, meaning and mnemonic");
  await page.locator(".gstage").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".gcount")).toHaveText("1 / 5");
  await page.locator('[data-gstep="-1"]').click();
  await expect(page.locator(".gcount")).toHaveText("5 / 5");
  await expect(page.locator('.thumbs [aria-current="true"]')).toHaveAttribute("data-img", "4");
});

test("gallery swaps between video and image", async ({ page }) => {
  await page.goto("/projects/cdb/");
  await expect(page.locator(".gstage video")).toHaveCount(1);
  await page.locator('[data-img="1"]').click();
  await expect(page.locator(".gstage video")).toHaveCount(0);
  await expect(page.locator(".gstage img")).toHaveAttribute("alt", "C Database System: Creating a table and inserting rows");
  await page.locator('[data-img="0"]').click();
  await expect(page.locator(".gstage video")).toHaveCount(1);
});

test("private projects explain why the code isn't public", async ({ page }) => {
  await page.goto("/projects/fly/");
  await expect(page.locator("#detail .note")).toHaveText("The repository belongs to the nonprofit, so it isn't public.");
  await page.goto("/projects/dice/");
  await expect(page.locator("#detail .note")).toHaveText("This was a class project, so the repository isn't public.");
});
