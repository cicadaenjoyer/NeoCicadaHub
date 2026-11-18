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
