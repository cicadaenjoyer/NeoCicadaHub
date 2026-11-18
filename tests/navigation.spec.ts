import { test, expect } from "@playwright/test";

// Review Focus 1: leaving Home and coming back leaves exactly one live carousel timer
// (a leaked timer would tick on detached slides, invisibly — so count intervals directly),
// and controls still respond after client-side navigation.
test("one carousel timer after leaving and returning; controls still work", async ({ page }) => {
  await page.addInitScript(() => {
    const live = new Set<number>();
    const set = window.setInterval.bind(window);
    const clear = window.clearInterval.bind(window);
    (window as any).__liveBannerTimers = () => live.size;
    window.setInterval = ((fn: TimerHandler, ms?: number, ...rest: unknown[]) => {
      const id = set(fn, ms, ...rest);
      if (ms === 6000) live.add(id);
      return id;
    }) as typeof window.setInterval;
    window.clearInterval = ((id?: number) => {
      if (id !== undefined) live.delete(id);
      clear(id);
    }) as typeof window.clearInterval;
  });
  const timers = () => page.evaluate(() => (window as any).__liveBannerTimers() as number);
  await page.goto("/");
  expect(await timers()).toBe(1);
  for (const label of ["Work", "Home", "About", "Home"]) {
    await page.locator(".dock a", { hasText: label }).click();
    await expect(page.locator(".dock a[aria-current='page']")).toHaveText(label);
  }
  expect(await timers()).toBe(1);
  await page.locator('[data-dot="2"]').click();
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/dice/");
  expect(await timers()).toBe(1);

  await page.locator(".dock a", { hasText: "Projects" }).click();
  await expect(page).toHaveURL("/projects/");
  expect(await timers()).toBe(0);
  await page.locator('[data-gstep="1"]').click();
  await expect(page.locator(".gcount")).toHaveText("2 / 5");
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

// Review Focus 2: the in-app back button never leaves the site.
test("back on a directly-loaded page goes home", async ({ page }) => {
  await page.goto("/work/");
  await page.locator("[data-back]").click();
  await expect(page).toHaveURL("/");
});

test("back after tapping the current dock item still stays in the site", async ({ page }) => {
  await page.goto("/work/");
  await page.locator(".dock a", { hasText: "Work" }).click(); // same-page navigation: no history entry
  await page.locator("[data-back]").click();
  await expect(page).toHaveURL("/");
});

test("back after in-site navigation returns to previous screen", async ({ page }) => {
  await page.goto("/projects/");
  await page.locator(".dock a", { hasText: "About" }).click();
  await expect(page).toHaveURL("/about/");
  await page.locator("[data-back]").click();
  await expect(page).toHaveURL("/projects/");
  await page.locator("[data-back]").click(); // nothing earlier in the site: go Home
  await expect(page).toHaveURL("/");
});

test("open dialog does not survive navigation", async ({ page }) => {
  await page.goto("/work/");
  await page.locator("[data-job-open]").first().click();
  await page.locator("dialog[open] a", { hasText: "See my projects" }).click();
  await expect(page).toHaveURL("/projects/");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});
