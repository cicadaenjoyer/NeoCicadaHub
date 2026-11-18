import { test, expect } from "@playwright/test";
import { ROUTES, expectNoHorizontalOverflow } from "./helpers";

test("home responds and has a title", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Abraham Hernandez/);
});

const screens: [string, string][] = [
  ["/projects/", "Projects"],
  ["/work/", "Work"],
  ["/about/", "About"],
  ["/contact/", "Contact"],
];

for (const [path, title] of screens) {
  test(`${path} shows title and back button`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator(".top h1")).toHaveText(title);
    await expect(page.locator("[data-back]")).toBeVisible();
    await expect(page.locator(`.dock a[aria-current="page"]`)).toHaveText(title);
  });
}

test("home shows Home title, no back button, no avatar in top bar", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".top .ttl-t")).toHaveText("Home");
  await expect(page.locator(".top h1")).toHaveCount(0);
  await expect(page.locator("[data-back]")).toHaveCount(0);
  await expect(page.locator(".top img")).toHaveCount(0);
});

test("no Japanese text on any route", async ({ page }) => {
  for (const r of ROUTES) {
    await page.goto(r);
    expect(await page.locator("body").innerText()).not.toMatch(/[぀-ヿ一-鿿]/);
  }
});

test("dock link navigates and updates aria-current", async ({ page }) => {
  await page.goto("/");
  await page.locator(".dock a", { hasText: "Work" }).click();
  await expect(page).toHaveURL("/work/");
  await expect(page.locator(`.dock a[aria-current="page"]`)).toHaveText("Work");
});

test("no horizontal overflow", async ({ page }) => {
  for (const r of ROUTES) {
    await page.goto(r);
    await expectNoHorizontalOverflow(page);
  }
});

test("backdrop switches scene between home and sub-screens", async ({ page }) => {
  await page.goto("/");
  const px = () =>
    page.locator("canvas.bg").evaluate((c: HTMLCanvasElement) => Array.from(c.getContext("2d")!.getImageData(2, 2, 1, 1).data).join(","));
  await expect.poll(px).not.toBe("0,0,0,0");
  const home = await px();
  await page.locator(".dock a", { hasText: "Work" }).click();
  await expect(page).toHaveURL("/work/");
  await expect.poll(px).not.toBe(home);
});

test("backdrop redraws on resize after navigating", async ({ page }) => {
  await page.goto("/");
  await page.locator(".dock a", { hasText: "Work" }).click();
  await expect(page).toHaveURL("/work/");
  const size = () => page.locator("canvas.bg").evaluate((c: HTMLCanvasElement) => c.width / Math.min(2, devicePixelRatio || 1));
  const vp = page.viewportSize()!;
  await page.setViewportSize({ width: vp.width - 50, height: vp.height });
  await expect.poll(size).toBe(vp.width - 50);
});

test("persistent shell scripts wire up only once", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const add = document.addEventListener.bind(document);
    (window as any).__swapListeners = 0;
    document.addEventListener = ((type: string, ...rest: any[]) => {
      if (type === "astro:after-swap") (window as any).__swapListeners++;
      return (add as any)(type, ...rest);
    }) as typeof document.addEventListener;
  });
  for (const label of ["Work", "About", "Contact"]) {
    await page.locator(".dock a", { hasText: label }).click();
    await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}/$`));
  }
  expect(await page.evaluate(() => (window as any).__swapListeners)).toBe(0);
});
