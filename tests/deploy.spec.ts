import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

// GitHub Pages (branch deploys) runs Jekyll, which drops every path starting with "_" —
// including Astro's dist/_astro/ (all CSS, JS and optimised images). The deploy must disable Jekyll.
test("deploy disables Jekyll so _astro/ is published", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  expect(pkg.scripts.deploy).toMatch(/gh-pages\b.*--nojekyll/);
});
