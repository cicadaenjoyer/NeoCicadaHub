import { test, expect } from "@playwright/test";

test("three jobs, newest first, each with a dialog", async ({ page }) => {
  await page.goto("/work/");
  await expect(page.locator(".job b")).toHaveText([
    "Software Programmer",
    "Artificial Intelligence Instructor",
    "Supplemental Instruction Leader",
  ]);
  await expect(page.locator("dialog.win")).toHaveCount(3);
  await expect(page.locator(".job .chip").first()).toHaveText("Current");
});

test("details dialog opens, closes on Esc and backdrop, restores focus", async ({ page }) => {
  await page.goto("/work/");
  const btn = page.locator("[data-job-open]").first();
  await btn.click();
  const dlg = page.locator("#job-" + (await btn.getAttribute("data-job-open")));
  await expect(dlg).toBeVisible();
  await expect(dlg.locator("h2")).toHaveText("Software Programmer");
  await page.keyboard.press("Escape");
  await expect(dlg).toBeHidden();
  await expect(btn).toBeFocused();
  await btn.click();
  await expect(dlg).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dlg).toBeHidden();
  await btn.click();
  await dlg.locator(".win-foot button", { hasText: "Close" }).click();
  await expect(dlg).toBeHidden();
});
