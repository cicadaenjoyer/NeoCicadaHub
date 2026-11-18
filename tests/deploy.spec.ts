import { test, expect } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const WORKFLOW = ".github/workflows/deploy.yml";

// Deploys go through GitHub Actions: the built dist/ is uploaded as a Pages artifact (no Jekyll,
// so Astro's _astro/ folder is served), and only after the test suite passes.
test("GitHub Actions builds, tests and deploys dist/ to Pages", () => {
  expect(existsSync(new URL(`../${WORKFLOW}`, import.meta.url))).toBe(true);
  const wf = read(WORKFLOW);
  expect(wf).toContain("node-version-file: .nvmrc");
  expect(wf).toMatch(/run: yarn test/);
  expect(wf).toMatch(/actions\/upload-pages-artifact@v\d+[\s\S]*path: dist/);
  expect(wf).toMatch(/actions\/deploy-pages@v\d+/);
  expect(wf).toMatch(/needs: test/);
  expect(wf).toContain("github.ref == 'refs/heads/main'");
});

test("no leftover branch-based deploy", () => {
  const pkg = JSON.parse(read("package.json"));
  expect(pkg.scripts.deploy).toBeUndefined();
  expect(pkg.devDependencies["gh-pages"]).toBeUndefined();
});
