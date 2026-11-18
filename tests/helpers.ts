import { expect, type Page } from "@playwright/test";

export const ROUTES: string[] = [
  "/",
  "/projects/",
  "/projects/tabi/",
  "/projects/cdb/",
  "/projects/dice/",
  "/work/",
  "/about/",
  "/contact/",
];

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const main = document.querySelector<HTMLElement>("#main");
    return {
      doc: doc.scrollWidth - doc.clientWidth,
      main: main ? main.scrollWidth - main.clientWidth : 0,
    };
  });
  expect(overflow.doc, "document overflows horizontally").toBeLessThanOrEqual(0);
  expect(overflow.main, "#main overflows horizontally").toBeLessThanOrEqual(0);
}
