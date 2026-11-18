# CicadaHub Astro Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vite + React site with a static Astro site that reproduces the v5 mockup, giving each screen its own URL.

**Architecture:** Static Astro output. `AppShell.astro` provides the top bar, scrolling view, bottom dock and canvas backdrop, with `<ClientRouter />` so the dock and backdrop persist across navigations. Content lives in typed collections. All interactivity is plain TypeScript in `<script>` tags, registered through one lifecycle helper that runs on `astro:page-load` and cleans up on `astro:before-swap`.

**Tech Stack:** Astro (current major), TypeScript strict, plain CSS (ported from the mockup), `@fontsource/noto-sans`, `simple-icons`, `@astrojs/sitemap`, Playwright + `@axe-core/playwright`, Prettier + `prettier-plugin-astro`, `gh-pages`. Package manager: yarn 1 (classic).

**Spec:** `docs/superpowers/specs/2026-11-17-astro-rebuild-design.md`
**Visual source of truth:** `design/mockups/v5/index.html` (its CSS is ported by copying; selectors are referenced by name below)

## Global Constraints

- `output: "static"`, `site: "https://www.cicadahub.dev"`, trailing slashes on all routes (`trailingSlash: "always"`).
- No UI framework: no React, Preact, Vue, Svelte or Tailwind.
- No Blue Archive assets. No Japanese text anywhere. No game-only UI such as "+" counters, notices, "new" badges or clickable-looking decorative dots.
- Skew only on `.btn` and `.tabs button`, with the label counter-skewed. Never on images or body text.
- The avatar `avatar-32.png` is never passed through `<Image>`. Render it as a raw `<img class="px">` with `image-rendering: pixelated`.
- Single light theme with `color-scheme: light`. No dark mode.
- External links: `target="_blank" rel="noopener"`, and the accessible name ends in "(opens in a new tab)".
- Contact email: `abehernandez@work.com`. GitHub: `https://github.com/cicadaenjoyer`. LinkedIn: `https://www.linkedin.com/in/abrahamh-dev/`.
- Copy is taken verbatim from the v5 mockup, not from the old `constants.ts`.
- Every screen's `<main>` has `id="main"`. Each page has exactly one `<h1>`.
- `prefers-reduced-motion: reduce` disables the typewriter effect, carousel auto-advance, page slide animation, and all CSS animations and transitions.
- Breakpoints are container queries on `container: app`: phone `max-width: 639px`, tablet `min-width: 640px`, laptop `min-width: 1024px`, wide `min-width: 1500px`.

## Review Focus

1. **Navigating away and back:** going `/` → `/work/` → `/` through the dock must leave exactly one carousel timer running, and the banner and gallery controls must still respond. Tested in Task 8.
2. **Arriving directly on a deep page:** loading `/work/` directly and pressing the in-app back button goes to `/`, not out of the site. Tested in Task 9.
3. **Phone deep link `/projects/cdb/#detail`:** on the first load and after an in-site navigation, the detail panel scrolls into view inside `.view`. Tested in Task 8.
4. **Clipboard unavailable or denied:** the copy button falls back to selecting the address and shows "Selected, press Ctrl+C". Tested in Task 9.
5. **Reduced motion:** the tagline appears whole, the banner never advances on its own, and `<main>` does not slide in. Tested in Task 8.

---

## File map

```
astro.config.mjs  playwright.config.ts  tsconfig.json  .prettierrc  package.json
public/CNAME  public/favicon.ico  public/og.png  public/media/cdb/demo.{mp4,webm}
src/content.config.ts
src/content/{projects/*.md, jobs.json, skills.json, site.json, bio.md}
src/assets/{avatar-32.png, logos/*, projects/<slug>/*}
src/styles/{tokens.css, global.css, ui.css}
src/scripts/{lifecycle.ts, motion.ts, backdrop.ts}
src/layouts/AppShell.astro
src/components/shell/{TopBar,Dock,Backdrop,BackButton}.astro
src/components/ui/{Button,Chip,SectionBar,Facts,Avatar}.astro
src/components/home/{DialogueBox,Choices,FeaturedBanner,BannerArt,NowCard}.astro
src/components/projects/{ProjectsView,ProjectList,ProjectDetail,Gallery}.astro
src/components/work/{JobCard,JobDialog}.astro
src/components/about/{ProfileCard,AboutTabs,SkillGrid}.astro
src/components/contact/{ChatThread,ContactOption,CopyEmail}.astro
src/pages/{index,work,about,contact,404}.astro  src/pages/projects/{index,[slug]}.astro
tests/{helpers.ts, shell, home, projects, work, about, contact, navigation, a11y, visual}.spec.ts
```

`ProjectsView.astro` is not listed in the spec. Both project routes render it, so the list-plus-detail layout lives in one place.

---

### Task 1: Scaffold Astro and the test harness

**Files:**
- Delete: `src/**` (all React code and old assets), `index.html`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `TODO.md`
- Create: `astro.config.mjs`, `tsconfig.json`, `.prettierrc`, `public/CNAME`, `src/pages/index.astro` (placeholder), `playwright.config.ts`, `tests/helpers.ts`, `tests/shell.spec.ts`
- Modify: `package.json`, `.gitignore` (add `.astro/`, `test-results/`, `playwright-report/`)

**Interfaces:**
- Produces: `tests/helpers.ts` exporting `ROUTES: string[]` = `["/", "/projects/", "/projects/tabi/", "/projects/cdb/", "/projects/dice/", "/work/", "/about/", "/contact/"]` and `expectNoHorizontalOverflow(page: Page): Promise<void>`, which asserts `document.documentElement.scrollWidth <= clientWidth` and the same for `#main`.
- Produces: the Playwright projects `phone` (390×844), `tablet` (820×1180) and `laptop` (1440×900), all Chromium. `webServer` runs `yarn astro build && yarn astro preview --port 4321`, with `baseURL` `http://localhost:4321`.

- [ ] **Step 1:** Tag the old site and branch: `git tag v1-react main && git switch -c astro-rebuild redesign-mockups`.
- [ ] **Step 2:** Delete the files listed above. Set `package.json` scripts exactly as in spec §14. Remove every dependency listed in spec §5 under "Removed". Run `yarn add astro @astrojs/sitemap @fontsource/noto-sans simple-icons` and `yarn add -D @playwright/test @axe-core/playwright prettier prettier-plugin-astro gh-pages typescript`, then `yarn playwright install chromium`.
- [ ] **Step 3:** Write `astro.config.mjs` with `site`, `output: "static"`, `trailingSlash: "always"` and `integrations: [sitemap()]`. Write `tsconfig.json` extending `astro/tsconfigs/strict`. Write `public/CNAME` containing `www.cicadahub.dev`.
- [ ] **Step 4: Write the failing test** `tests/shell.spec.ts`:

```ts
test("home responds and has a title", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Abraham Hernandez/);
});
```

- [ ] **Step 5:** Run `yarn test tests/shell.spec.ts`. Expected: FAIL, because `src/pages/index.astro` does not exist or has no title.
- [ ] **Step 6:** Create a placeholder `src/pages/index.astro` with `<title>Abraham Hernandez · Software Developer</title>`.
- [ ] **Step 7:** Run `yarn test tests/shell.spec.ts`. Expected: PASS in all three projects. Run `yarn build`. Expected: `astro check` reports 0 errors and `dist/CNAME` exists.
- [ ] **Step 8: Commit:** `git add -A && git commit -m "chore: replace Vite/React scaffold with Astro and Playwright"`

---

### Task 2: Content layer and assets

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/{tabi,cdb,dice}.md`, `src/content/{jobs.json,skills.json,site.json,bio.md}`
- Create (copied from `design/mockups/v5/assets/`, not moved): `src/assets/avatar-32.png`, `src/assets/logos/{morevang,idtech,rit}.png`, `src/assets/projects/tabi/{icon,1,2,3,4,5}.webp`, `src/assets/projects/cdb/{1,2,poster}.webp`, `src/assets/projects/dice/1.webp`
- Create: `public/media/cdb/demo.mp4`, `public/media/cdb/demo.webm`

**Interfaces:**
- Produces these collections (Zod via `schema: ({ image }) => …`):
  - `projects`: `glob({ pattern: "*.md", base: "src/content/projects" })` with `{ title: string; line: string; order: number; thumb: image(); tone: "light"|"dark"|"navy"; platform: string; team: string; stack: string[]; link?: url; images: { src: image(); caption: string; video?: { mp4: string; webm: string } }[] (min 1); featured: { art: "tabi"|"shot"; shot?: image() } }`. The body is the description. Entry ids are `tabi`, `cdb` and `dice`.
  - `jobs`: `file("src/content/jobs.json")` with `{ id; title; org; logo: image(); current: boolean; order: number; tools: string[]; desc: string }`.
  - `skills`: `file("src/content/skills.json")` with `{ id; label; icon: string /* simple-icons export name, e.g. "siTypescript" */; color: string /* hex, from mockup */ }`.
  - `site`: `file("src/content/site.json")`, a single entry with id `main`: `{ name; role; employer; subtitle; taglines: string[] (min 1); email: email; github: url; linkedin: url; facts: { label; value }[] }`.
  - `bio.md` is imported directly as a Markdown module (`import { Content as Bio } from "../content/bio.md"`). It is not a collection.
- `site.subtitle` = "Software developer · RIT computer science grad". `site.role` = "Software Developer". `site.employer` = "More Vang".
- `featured`: Tabi uses `{ art: "tabi" }`, which renders its icon plus phones `2`, `3` and `5`. CDB uses `{ art: "shot", shot: cdb/2.webp }`. Dice uses `{ art: "shot", shot: dice/1.webp }`.
- CDB `images[0]` = `{ src: cdb/poster.webp, caption: "Demo: creating a table, inserting rows and running queries", video: { mp4: "/media/cdb/demo.mp4", webm: "/media/cdb/demo.webm" } }`.

- [ ] **Step 1:** Run `which ffmpeg`. If it is missing, stop and ask the user to run `! sudo apt install ffmpeg`. If they decline, use the GIF in `public/media/cdb/demo.gif`, change `video` to `{ gif: string }`, and note the deviation in the commit message.
- [ ] **Step 2:** Convert the demo GIF:
  - `ffmpeg -i design/mockups/v5/assets/cdb-demo.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" public/media/cdb/demo.mp4`
  - `ffmpeg -i design/mockups/v5/assets/cdb-demo.gif -c:v libvpx-vp9 -b:v 0 -crf 40 public/media/cdb/demo.webm`
  - `ffmpeg -i design/mockups/v5/assets/cdb-demo.gif -frames:v 1 src/assets/projects/cdb/poster.webp`
  
  Expected: the mp4 is under 300 KB.
- [ ] **Step 3:** Copy the assets and write every data file. Copy text comes from the mockup's `projects`, `jobs`, `skills` and `taglines` arrays and its About bio paragraphs. The project gallery order and captions follow the mockup's `images` arrays.
- [ ] **Step 4:** Run `yarn astro sync && yarn astro check`. Expected: 0 errors.
- [ ] **Step 5: Verify the schema rejects bad data.** Temporarily change `tabi.md`'s first image path to `./missing.webp` and run `yarn astro build`. Expected: the build fails with an image-not-found error. Revert the change.
  - If `image()` does not resolve inside `file()` JSON loaders in the installed Astro version, change `logo` to a string key such as `"morevang"` and resolve it via `import.meta.glob("../assets/logos/*.png", { eager: true })` in `JobCard`. Note this in the commit.
- [ ] **Step 6: Commit:** `git add -A && git commit -m "feat: add typed content collections and v5 assets"`

---

### Task 3: Styles, app shell, and empty routes

**Files:**
- Create: `src/styles/{tokens.css,global.css,ui.css}`, `src/layouts/AppShell.astro`, `src/components/shell/{TopBar,Dock,BackButton}.astro`, `src/scripts/{lifecycle.ts,motion.ts}`, every route in `src/pages/`, and `src/components/ui/*.astro`
- Test: `tests/shell.spec.ts`

**Interfaces:**
- `AppShell.astro` props: `{ screen: "home"|"projects"|"work"|"about"|"contact"|"notfound"; title: string; pageTitle: string; description: string; canonical?: string }`.
  - Renders `<html lang="en" data-screen={screen}>`, `<ClientRouter />`, a skip link to `#main`, and `.app` (grid `auto minmax(0,1fr) auto`, `height: 100dvh`, `container: app / inline-size`). Inside `.app`: `<Backdrop/>` (a placeholder until Task 10), `<TopBar/>`, `<main id="main" class="view" transition:animate={enter}><slot/></main>`, and `<Dock/>`.
- `TopBar.astro` props: `{ screen; title }`. On `home` it shows no back button and renders the title in `<p class="ttl-t">`. On `notfound` it shows the back button but still uses `<p class="ttl-t">`, because the 404 panel holds the page's `<h1>`. On every other screen it shows `<BackButton/>` and renders the title in `<h1 class="ttl-t">`. The `.caps` GitHub and LinkedIn capsules sit on the right. This replaces the mockup's `.ttl h2` selector with `.ttl-t`.
- `BackButton.astro` renders `<button class="back" type="button" data-back aria-label="Back">`. Its behavior comes in Task 9.
- `Dock.astro` renders `<nav class="dock" aria-label="Main" transition:persist="dock">` with links to `/`, `/projects/`, `/work/`, `/about/` and `/contact/`. `aria-current="page"` is set at build time, and again on `astro:after-swap` by `isCurrent(href, pathname)`: exact match, except `/projects/` matches any path starting with `/projects/`.
- `src/scripts/lifecycle.ts`:
  - `onPage(selector: string, init: (root: HTMLElement) => void | (() => void)): void`. On every `astro:page-load`, call `init` for each matching element and collect the returned cleanups. On `astro:before-swap`, run and clear the cleanups.
- `src/scripts/motion.ts`: `prefersReducedMotion(): boolean`.
- `enter` animation object: `{ forwards: { old: { name: "none", duration: "0s" }, new: { name: "enter", duration: ".28s", easing: "ease-out" } }, backwards: <same> }`. The `@keyframes enter { from { opacity: .4; translate: 12px 0; } }` rule lives in `global.css`, which is unscoped.
- UI primitives:
  - `Button.astro`: `{ variant?: "c"|"y"|"w"|"off"; size?: "sm"; href?; type? }`. Renders `<a>` when `href` is set, otherwise `<button>`. Wraps the slot in `<span>` for the counter-skew.
  - `Chip.astro`: `{ tone?: "now"|"pub" }`.
  - `SectionBar.astro` renders a slot inside `.sbar`.
  - `Facts.astro`: `{ items: { label: string; value: string }[] }`, plus an optional named slot per item for the chips case.
  - `Avatar.astro`: `{ size: 44|96|128|160 }`. Renders a raw `<img class="px">` inside `.ring` (or `.av` at 44).
- Page titles: Home `Abraham Hernandez · Software Developer`; other pages `<Screen> · Abraham Hernandez`. The implementer writes one-sentence descriptions.

- [ ] **Step 1: Write the failing tests** in `tests/shell.spec.ts`:

```ts
for (const [path, title] of [["/projects/","Projects"],["/work/","Work"],["/about/","About"],["/contact/","Contact"]]) {
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
  for (const r of ROUTES) { await page.goto(r);
    expect(await page.locator("body").innerText()).not.toMatch(/[぀-ヿ一-鿿]/); }
});
test("dock link navigates and updates aria-current", async ({ page }) => {
  await page.goto("/");
  await page.locator(".dock a", { hasText: "Work" }).click();
  await expect(page).toHaveURL("/work/");
  await expect(page.locator(`.dock a[aria-current="page"]`)).toHaveText("Work");
});
test("no horizontal overflow", async ({ page }) => {
  for (const r of ROUTES) { await page.goto(r); await expectNoHorizontalOverflow(page); }
});
```

- [ ] **Step 2:** Run `yarn test tests/shell.spec.ts`. Expected: FAIL (routes missing).
- [ ] **Step 3:** Port the CSS.
  - `:root` tokens go to `tokens.css`, without `--chrome-*`, `--bezel` or `--f-jp`.
  - The reset, `:focus-visible`, `.sr`, `.px`, `@keyframes enter` and the reduced-motion block go to `global.css`. Also import `@fontsource/noto-sans` weights 400/500/600/700/800 and 700/800 italic there.
  - The shared rules `.panel .sbar .hl .btn .chip .chips .round .facts .deco .logo` go to `ui.css`. Their container-query overrides from the phone block (`.facts > div`) come along.
  - Shell rules (`.app .top .tl .back .ttl .caps .cap .slash .dock .view .wrap`) go into the scoped `<style>` blocks of the shell components, with their container-query rules.
  - Do not port `.studio`, `.stage`, `.device`, `.seg`, `.scr` or `[data-screen]` visibility rules.
- [ ] **Step 4:** Build `AppShell`, the shell components, the UI primitives, `lifecycle.ts` and `motion.ts`, and every route in `src/pages/`. Each route renders `AppShell` with an empty `.wrap`. `projects/[slug].astro` uses `getStaticPaths` over the `projects` collection.
- [ ] **Step 5:** Run `yarn test tests/shell.spec.ts`. Expected: PASS in all three projects.
- [ ] **Step 6: Commit:** `git commit -am "feat: app shell with top bar, dock, routes and view transitions"` (add any new files first)

---

### Task 4: Home screen (static)

**Files:**
- Create: `src/components/home/{DialogueBox,Choices,FeaturedBanner,BannerArt,NowCard}.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/home.spec.ts`

**Interfaces:**
- Consumes: `site`, `projects` sorted by `order`, and `jobs` (the entry with `current: true`).
- `DialogueBox`: `{ name: "Abraham"; role: string /* "Software Developer at More Vang" */; greeting: string; taglines: string[] }`.
  - Renders `<p class="tag" data-typewriter data-lines={JSON.stringify(taglines)}>{taglines[0]}</p>` plus a visually hidden `<p class="sr" aria-live="polite" data-typewriter-live>`.
  - The greeting copy is "Hi, welcome to my portfolio! This is where I keep the projects I've built and the places I've worked."
- `Choices`: three `<a class="choice">` links:
  - "Show me your projects" → `/projects/`
  - "Where have you worked?" → `/work/`
  - "How can I reach you?" → `/contact/`
- `FeaturedBanner`: `{ projects }`. Renders `<div class="banner" data-banner>` containing `.slides`, where each slide is `<a class="slide" href="/projects/{id}/" data-slide>`. Every slide except the first is `hidden`. Also renders `.bnav` buttons with `data-bstep="-1|1"` and `.dots` buttons with `data-dot="{i}"`, the first carrying `aria-current="true"`.
- `BannerArt`: `{ project }` renders the `.art.tabi` or `.art.dark|.art.navy` composition from `featured`.
- `NowCard`: `<a class="panel nowcard" href="/work/">` with the current job's logo, title and "More Vang · current role".
- `<h1>` = `site.name` inside `.hello`, with `<Avatar size={128}>` (96 on phone and 160 on laptop via CSS, as in the mockup).

- [ ] **Step 1: Write the failing tests** in `tests/home.spec.ts`:

```ts
test("lobby content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Abraham Hernandez");
  await expect(page.locator(".choice")).toHaveText(["Show me your projects","Where have you worked?","How can I reach you?"]);
  await expect(page.locator(".choice").nth(1)).toHaveAttribute("href", "/work/");
  await expect(page.locator("[data-slide]:visible")).toHaveCount(1);
  await expect(page.locator("[data-slide]").first()).toHaveAttribute("href", "/projects/tabi/");
  await expect(page.locator(".nowcard")).toContainText("Software Programmer");
  await expect(page.locator(".hello img")).toHaveCSS("image-rendering", "pixelated");
});
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement the components and port the mockup's Home CSS (`.s-home .h-left .portrait .ring .hello .dlg* .choices .choice .h-right .banner .slides .slide .art* .info .bnav .dots .nowcard`) into their scoped styles, with their container-query overrides.
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -m "feat: home lobby screen"`

---

### Task 5: Projects screens (static)

**Files:**
- Create: `src/components/projects/{ProjectsView,ProjectList,ProjectDetail,Gallery}.astro`
- Modify: `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`
- Test: `tests/projects.spec.ts`

**Interfaces:**
- `ProjectsView`: `{ projects: CollectionEntry<"projects">[]; active: CollectionEntry<"projects"> }`. Renders `ProjectList` and `ProjectDetail` in `.s-projects.wrap`.
- `/projects/` renders `ProjectsView` with `active = projects[0]` and passes `canonical="/projects/tabi/"` to AppShell.
- `ProjectList`: a `SectionBar` reading "3 projects · pick one", then `<a class="prow" href="/projects/{id}/#detail">` per project, with `aria-current="page"` on the active one. Shows a "Open source" (`pub`) chip when `link` is set, otherwise "Private code". This replaces the mockup's `aria-pressed` styling selectors with `[aria-current="page"]`.
- `ProjectDetail`: `<article class="panel pd" id="detail">` with an `h2.hl` title, the line, `<Gallery>`, `<Facts>` (Platform, Team, Built with as chips), the rendered body, and actions.
  - With a link: a yellow button "View code on GitHub ↗" with `target="_blank"` and the aria-label suffix.
  - Without one: an `off` button "Code is private" plus the note "This was a class project, so the repository isn't public."
- `Gallery`: `{ title: string; tone; images }`. Renders `<figure class="gal" data-gallery>`:
  - `.gstage[data-tone]` holding the first item. That is an `<img>` from `getImage()`, or `<video autoplay muted loop playsinline poster>` with webm and mp4 `<source>` elements when `video` is set.
  - `<span class="gcount">1 / n</span>`, and `figcaption.gcap`.
  - When `images.length > 1`: `.round` buttons `data-gstep="-1|1"` and `.thumbs` buttons `data-img="{i}"`. Each thumbnail button carries `data-full`, `data-alt` and `data-caption` (plus `data-mp4`/`data-webm` when it has a video) for Task 8's script. The first thumbnail has `aria-current="true"`.
  - Image alt = `"{title}: {caption}"`.
  - The `.gstage` gets `tabindex="0"` and `aria-label="{title} screenshots"`.
- Section headings inside the detail are `h2`, not the mockup's `h3`, because the top-bar title is the page's `h1`.

- [ ] **Step 1: Write the failing tests** in `tests/projects.spec.ts`:

```ts
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
```

- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement, porting `.s-projects .plist .prow* .pd* .gal .gstage* .gcount .gcap .thumbs* .desc .acts`. Keep the `.plist { position: sticky; top: 0 }` rule from the laptop breakpoint.
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -m "feat: project list and detail routes"`

---

### Task 6: Work, About, and Contact screens (static)

**Files:**
- Create: `src/components/work/{JobCard,JobDialog}.astro`, `src/components/about/{ProfileCard,AboutTabs,SkillGrid}.astro`, `src/components/contact/{ChatThread,ContactOption,CopyEmail}.astro`
- Modify: `src/pages/{work,about,contact}.astro`
- Test: `tests/work.spec.ts`, `tests/about.spec.ts`, `tests/contact.spec.ts`

**Interfaces:**
- `JobCard`: `{ job }`.
  - Shows the logo (alt `"{org} logo"`), title, a chip ("Current" `now` / "Previous"), the org, and the description (clamped to 2 lines).
  - Has a button `<Button data-job-open={job.id}>Details</Button>`.
  - Renders `<JobDialog job={job}/>` right after the card.
- `JobDialog`: `<dialog class="win" id="job-{id}" aria-labelledby="job-{id}-t">`. Inside:
  - `.win-head` with `h2#job-{id}-t > span.hl` (the title) and a close button `.x` with `data-close` and `aria-label="Close"`.
  - `.win-body`: an org card with a "Current role"/"Previous role" chip, a "What I did" section bar with a card, and a "Tools" section bar with chips.
  - `.win-foot`: `<Button variant="w" data-close>Close</Button>` and `<Button variant="y" href="/projects/">See my projects</Button>`.
  - Style `::backdrop` with `color-mix(in srgb, var(--navy-3) 55%, transparent)`, and remove the mockup's `.modal` wrapper.
- Work page: a `SectionBar` reading "Work history · newest first", then jobs sorted by `order`.
- `ProfileCard`:
  - A `.band` containing a single `<span>PROFILE</span>`.
  - `<Avatar size={160}>`.
  - The name, "Software Developer · More Vang", and `<Facts items={site.facts}>`.
- `AboutTabs`:
  - A `div[role=tablist][data-tabs]` with tabs `#tab-bio` and `#tab-skills`. The first has `aria-selected="true"` and `tabindex="0"`; the second has `aria-selected="false"` and `tabindex="-1"`.
  - Panes `#pane-bio` (the `Bio` content under `h2.hl` "A little about me") and `#pane-skills` (`SkillGrid` under "Languages & tools").
  - **Neither pane is `hidden` in the HTML.** Task 9's script hides the inactive one.
- `SkillGrid`: for each skill, `import * as si from "simple-icons"` and use `si[icon].path`. Renders an inline `<svg role="img" aria-label="{label} logo"><path fill={color} d={path}/></svg>`.
  - Colors come from `skills.json` (the mockup's values), not simple-icons' `hex`. This deliberately overrides spec §11, because the mockup's colors are the visual source of truth and simple-icons' C color (`#A8B9CC`) is too faint on white.
- `ChatThread`:
  - A pink "Messages" header, the 44px avatar, and the two message bubbles.
  - A "Reply" section listing `ContactOption`s for Email (with `CopyEmail`), LinkedIn and GitHub.
- `CopyEmail`:
  - Renders `<small class="mail" data-email>{email}</small>`.
  - A `<Button size="sm" data-copy-email>Copy address</Button>`.
  - A visually present `<a href="mailto:{email}">`. The implementer places it as an `Email me` link on the `<b>`.

- [ ] **Step 1: Write the failing tests:**

```ts
// work.spec.ts
test("three jobs, newest first, each with a dialog", async ({ page }) => {
  await page.goto("/work/");
  await expect(page.locator(".job b")).toHaveText(["Software Programmer","Artificial Intelligence Instructor","Supplemental Instruction Leader"]);
  await expect(page.locator("dialog.win")).toHaveCount(3);
  await expect(page.locator(".job .chip").first()).toHaveText("Current");
});
// about.spec.ts
test("profile card and skills render", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator(".idc .band")).toHaveText("PROFILE");
  await expect(page.locator('#pane-skills svg[role="img"]')).toHaveCount(9);
  await expect(page.locator('svg[aria-label="TypeScript logo"] path')).toHaveAttribute("fill", "#3178c6");
});
test.describe("without JS", () => {
  test.use({ javaScriptEnabled: false });
  test("both About panes are visible", async ({ page }) => {
    await page.goto("/about/");
    await expect(page.locator("#pane-bio")).toBeVisible();
    await expect(page.locator("#pane-skills")).toBeVisible();
  });
});
// contact.spec.ts
test("contact options", async ({ page }) => {
  await page.goto("/contact/");
  await expect(page.locator("[data-email]")).toHaveText("abehernandez@work.com");
  await expect(page.locator('a[href="mailto:abehernandez@work.com"]')).toHaveCount(1);
  await expect(page.locator('a.opt[href="https://www.linkedin.com/in/abrahamh-dev/"]')).toHaveAttribute("target", "_blank");
});
```

- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement, porting `.s-work .jobs .job*`, the `.win*` rules and `.card`, `.s-about .idc* .tabs* .pane .bio .items .itm*`, and `.s-contact .talk* .thread .stack .msg .reply* .opts .opt* .mail`. Drop the `.idc .band span:last-child` rule.
- [ ] **Step 4:** Run them. Expected: PASS.
- [ ] **Step 5: Commit:** `git commit -m "feat: work, about and contact screens"`

---

### Task 7: Visual parity check against the mockup

**Files:**
- Test: `tests/visual.spec.ts` (baselines under `tests/visual.spec.ts-snapshots/`)

**Interfaces:**
- Consumes: every route. Clock install and masking are as below.

- [ ] **Step 1:** Serve the mockup with `python3 -m http.server -d design/mockups/v5 8099`. Compare each screen against the matching route at 390, 820 and 1440 widths: open the mockup at `http://localhost:8099/#<screen>` with the matching Phone/Tablet/Laptop preview. Fix any spacing, size or color difference in the component CSS. The only allowed differences are the missing review chrome and the backdrop, which is still the CSS gradient until Task 10.
- [ ] **Step 2: Write the screenshot test:**

```ts
for (const r of ROUTES) test(`visual ${r}`, async ({ page }) => {
  await page.clock.install();
  await page.goto(r);
  await expect(page).toHaveScreenshot({ fullPage: true, animations: "disabled", mask: [page.locator(".tag")] });
});
```

- [ ] **Step 3:** Run `yarn test tests/visual.spec.ts --update-snapshots`, then run `yarn test tests/visual.spec.ts`. Expected: PASS.
- [ ] **Step 4: Commit:** `git add tests && git commit -m "test: visual baselines for static screens"`

---

### Task 8: Home and project scripts (typewriter, banner, gallery, deep-link scroll)

**Files:**
- Modify: `DialogueBox.astro`, `FeaturedBanner.astro`, `Gallery.astro`, `ProjectsView.astro` (each gets a `<script>`)
- Test: `tests/home.spec.ts`, `tests/projects.spec.ts`, `tests/navigation.spec.ts`

**Interfaces:**
- Consumes: `onPage`, `prefersReducedMotion`, and the data hooks from Tasks 4 and 5.
- **Typewriter:** picks a random line from `data-lines` and types it at **35 ms/char** into `.tag`. When finished, it writes the full line once into `[data-typewriter-live]`. Under reduced motion it sets the line instantly. The cleanup clears the interval.
- **Banner:** `slideTo(i)` wraps modulo n, toggles `hidden` on `[data-slide]`, and sets `aria-current` on dots.
  - Auto-advance runs every **6000 ms** unless reduced motion is on. It pauses on `mouseenter`/`focusin` and resumes on `mouseleave`/`focusout`. Arrows and dots restart the timer.
  - Swipe: `pointerdown`/`pointerup` with |dx| ≥ **40 px** and `pointerType !== "mouse"` steps the slide and prevents the link click.
  - The cleanup clears the timer.
- **Gallery:** `show(i)` swaps the stage between `<img>` and `<video>` from the thumbnail's `data-*`. It updates the alt, the caption, the counter `"{i+1} / {n}"` and the thumbnails' `aria-current`. Arrows step with wraparound. `ArrowLeft`/`ArrowRight` work while the stage has focus.
- **Deep-link scroll** (in `ProjectsView`): on page load, if `location.hash === "#detail"` and `document.querySelector(".app").clientWidth < 1024`, call `#detail.scrollIntoView({ block: "start" })`.

- [ ] **Step 1: Write the failing tests:**

```ts
// home.spec.ts
test("banner auto-advances and arrows step", async ({ page }) => {
  await page.clock.install(); await page.goto("/");
  await page.clock.runFor(6100);
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/cdb/");
  await page.locator('[data-dot="0"]').click(); // arrows are display:none on phone; dots exist everywhere
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/tabi/");
});
test("tagline types out one of the taglines", async ({ page }) => {
  await page.clock.install(); await page.goto("/"); await page.clock.runFor(5000);
  const lines = JSON.parse(await page.locator("[data-typewriter]").getAttribute("data-lines") ?? "[]");
  expect(lines).toContain(await page.locator(".tag").innerText());
});
test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("no auto-advance, tagline whole at once", async ({ page }) => {
    await page.clock.install(); await page.goto("/");
    const lines = JSON.parse(await page.locator("[data-typewriter]").getAttribute("data-lines") ?? "[]");
    expect(lines).toContain(await page.locator(".tag").innerText());
    await page.clock.runFor(13000);
    await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/tabi/");
  });
});
// projects.spec.ts
test("gallery steps and keyboard works", async ({ page }) => {
  await page.goto("/projects/tabi/");
  await page.locator('[data-gstep="1"]').click();
  await expect(page.locator(".gcount")).toHaveText("2 / 5");
  await expect(page.locator(".gcap")).toHaveText("Kanji page with radicals, meaning and mnemonic");
  await page.locator(".gstage").focus(); await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".gcount")).toHaveText("1 / 5");
  await page.locator('[data-gstep="-1"]').click();
  await expect(page.locator(".gcount")).toHaveText("5 / 5");
});
// navigation.spec.ts — Review Focus 1 & 3
test("one carousel timer after leaving and returning", async ({ page }) => {
  await page.clock.install(); await page.goto("/");
  await page.locator(".dock a", { hasText: "Work" }).click(); await expect(page).toHaveURL("/work/");
  await page.locator(".dock a", { hasText: "Home" }).click(); await expect(page).toHaveURL("/");
  await page.clock.runFor(6100);
  await expect(page.locator("[data-slide]:visible")).toHaveAttribute("href", "/projects/cdb/"); // advanced once, not twice
});
test("phone deep link scrolls detail into view", async ({ page }, info) => {
  test.skip(info.project.name !== "phone");
  await page.goto("/projects/cdb/#detail");
  await expect.poll(() => page.locator("#main").evaluate((m) => m.scrollTop)).toBeGreaterThan(0);
  await page.goto("/");
  await page.locator(".dock a", { hasText: "Projects" }).click();
  await page.locator(".prow", { hasText: "D&D Dice Store" }).click();
  await expect.poll(() => page.locator("#main").evaluate((m) => m.scrollTop)).toBeGreaterThan(0);
});
```

- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement the four scripts with `onPage`.
- [ ] **Step 4:** Run `yarn test`. Expected: all pass. The visual baselines still pass because the clock is frozen.
- [ ] **Step 5: Commit:** `git commit -am "feat: typewriter, featured banner, gallery and deep-link scroll"`

---

### Task 9: Dialog, tabs, copy email, and back button scripts

**Files:**
- Modify: `JobCard.astro`/`JobDialog.astro`, `AboutTabs.astro`, `CopyEmail.astro`, `BackButton.astro`
- Test: `tests/work.spec.ts`, `tests/about.spec.ts`, `tests/contact.spec.ts`, `tests/navigation.spec.ts`

**Interfaces:**
- **Dialog:** `[data-job-open]` calls `document.getElementById("job-" + id).showModal()`.
  - It closes when the click target is the `<dialog>` itself (the backdrop) or on a click inside `[data-close]`. `Esc` is native.
  - The cleanup closes any open dialog.
- **Tabs:** the init adds `hidden` to the inactive pane.
  - Click selects a tab. `ArrowLeft`/`ArrowRight` move focus and selection with wraparound, and `Home`/`End` jump to the first/last tab. The selected tab gets `tabindex="0"`, the others `-1`.
- **Copy email:** `navigator.clipboard.writeText(email)` → the label becomes "Copied!".
  - On rejection, or when `navigator.clipboard` is missing: select the `[data-email]` contents and set the label to "Selected, press Ctrl+C".
  - The label resets to "Copy address" after **2000 ms**. The cleanup clears the timer.
- **Back button:** a module-level `depth` counter. On `astro:before-preparation`, do `depth = e.direction === "back" ? max(0, depth - 1) : depth + 1`.
  - Click: if `depth > 0`, call `history.back()`; otherwise `navigate("/")` from `astro:transitions/client`.
  - Do not use `document.referrer`: it does not change on client-side navigations.

- [ ] **Step 1: Write the failing tests:**

```ts
// work.spec.ts
test("details dialog opens, closes on Esc and backdrop, restores focus", async ({ page }) => {
  await page.goto("/work/");
  const btn = page.locator("[data-job-open]").first(); await btn.click();
  const dlg = page.locator("#job-" + await btn.getAttribute("data-job-open"));
  await expect(dlg).toBeVisible(); await expect(dlg.locator("h2")).toHaveText("Software Programmer");
  await page.keyboard.press("Escape"); await expect(dlg).toBeHidden(); await expect(btn).toBeFocused();
  await btn.click(); await page.mouse.click(5, 5); await expect(dlg).toBeHidden();
});
// about.spec.ts
test("tabs switch by click and arrow keys", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator("#pane-skills")).toBeHidden();
  await page.locator("#tab-bio").focus(); await page.keyboard.press("ArrowRight");
  await expect(page.locator("#tab-skills")).toBeFocused();
  await expect(page.locator("#tab-skills")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#pane-skills")).toBeVisible(); await expect(page.locator("#pane-bio")).toBeHidden();
});
// contact.spec.ts — Review Focus 4
test("copy succeeds", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact/"); await page.locator("[data-copy-email]").click();
  await expect(page.locator("[data-copy-email]")).toHaveText("Copied!");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("abehernandez@work.com");
});
test("copy falls back to selection", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) } }); });
  await page.goto("/contact/"); await page.locator("[data-copy-email]").click();
  await expect(page.locator("[data-copy-email]")).toHaveText("Selected, press Ctrl+C");
  expect(await page.evaluate(() => getSelection()?.toString())).toBe("abehernandez@work.com");
});
// navigation.spec.ts — Review Focus 2
test("back on a directly-loaded page goes home", async ({ page }) => {
  await page.goto("/work/"); await page.locator("[data-back]").click(); await expect(page).toHaveURL("/");
});
test("back after in-site navigation returns to previous screen", async ({ page }) => {
  await page.goto("/projects/");
  await page.locator(".dock a", { hasText: "About" }).click(); await expect(page).toHaveURL("/about/");
  await page.locator("[data-back]").click(); await expect(page).toHaveURL("/projects/");
});
test("open dialog does not survive navigation", async ({ page }) => {
  await page.goto("/work/"); await page.locator("[data-job-open]").first().click();
  await page.locator("dialog[open] a", { hasText: "See my projects" }).click();
  await expect(page).toHaveURL("/projects/"); await expect(page.locator("dialog[open]")).toHaveCount(0);
});
```

- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement the four scripts with `onPage`. The back-button `depth` listener is registered once at module level, outside `onPage`.
- [ ] **Step 4:** Run `yarn test`. Expected: all pass.
- [ ] **Step 5: Commit:** `git commit -am "feat: job dialog, about tabs, copy email and back button"`

---

### Task 10: Canvas backdrop

**Files:**
- Create: `src/scripts/backdrop.ts`
- Modify: `src/components/shell/Backdrop.astro`
- Test: `tests/shell.spec.ts`, plus updated visual baselines

**Interfaces:**
- `backdrop.ts` exports:
  - `drawLobby(cx: CanvasRenderingContext2D, W: number, H: number): void` (seed **7**)
  - `drawPoly(cx: CanvasRenderingContext2D, W: number, H: number): void` (seed **19**)
  - `mountBackdrop(canvas: HTMLCanvasElement): void`
  
  The drawing code is the mockup's `rng`, `skyline`, `lobby` and `poly`, ported verbatim and typed.
- `mountBackdrop`:
  - Sizes the canvas to `.app` with `dpr = min(2, devicePixelRatio)`.
  - Draws `drawLobby` when `document.documentElement.dataset.screen === "home"`, otherwise `drawPoly`.
  - Redraws on a `ResizeObserver` of `.app` and on `astro:after-swap`.
- `Backdrop.astro` renders `<canvas class="bg" aria-hidden="true" transition:persist="backdrop">`. The script calls `mountBackdrop` once, not inside `onPage`, because the canvas persists.

- [ ] **Step 1: Write the failing test:**

```ts
test("backdrop switches scene between home and sub-screens", async ({ page }) => {
  await page.goto("/");
  const px = () => page.locator("canvas.bg").evaluate((c: HTMLCanvasElement) =>
    Array.from(c.getContext("2d")!.getImageData(2, 2, 1, 1).data).join(","));
  const home = await px(); expect(home).not.toBe("0,0,0,0");
  await page.locator(".dock a", { hasText: "Work" }).click(); await expect(page).toHaveURL("/work/");
  await expect.poll(px).not.toBe(home);
});
```

- [ ] **Step 2:** Run it. Expected: FAIL (no canvas).
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `yarn test tests/shell.spec.ts`. Expected: PASS. Then run `yarn test tests/visual.spec.ts --update-snapshots`, check the new screenshots by eye against the mockup, and run `yarn test`. Expected: all pass.
- [ ] **Step 5: Commit:** `git commit -am "feat: canvas lobby and low-poly backdrops"`

---

### Task 11: 404, meta, accessibility, and social image

**Files:**
- Create: `src/pages/404.astro`, `public/og.png`, `tests/a11y.spec.ts`
- Modify: `AppShell.astro` (meta tags), `tokens.css` (only if the contrast check fails)

**Interfaces:**
- `AppShell` adds:
  - `<meta name="description">` and `<link rel="canonical">` (default `new URL(Astro.url.pathname, Astro.site)`).
  - `og:title`, `og:description`, `og:image` (`/og.png`), `og:type=website` and `twitter:card=summary_large_image`.
  - `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` and `<link rel="icon" href="/favicon.ico">`.
  - A preload of Noto Sans 800 italic (latin subset) via `import url from "@fontsource/noto-sans/files/noto-sans-latin-800-italic.woff2?url"`.
- `.dock` gets `padding-bottom: env(safe-area-inset-bottom)`.
- `404.astro`: `screen="notfound"`, title "Not found". A panel with the `h1` "Not found", the text "That page doesn't exist.", and a yellow `Button href="/"` "Back to Home". No dock item is current.

- [ ] **Step 1: Write the failing tests** in `tests/a11y.spec.ts`:

```ts
for (const r of ROUTES) test(`axe ${r}`, async ({ page }) => {
  await page.goto(r);
  const res = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa"]).analyze();
  expect(res.violations).toEqual([]);
});
test("404 page", async ({ page }) => {
  const res = await page.goto("/nope/"); expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Not found");
});
test("one h1 and a skip link per route", async ({ page }) => {
  for (const r of ROUTES) { await page.goto(r);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('a[href="#main"]')).toHaveCount(1); }
});
```

- [ ] **Step 2:** Run them. Expected: FAIL (no 404). Axe may also flag `--ink-2` contrast.
- [ ] **Step 3:** Implement. If axe reports `color-contrast` on `--ink-2`, darken `--ink-2` in `tokens.css` just enough to pass AA. Change nothing else.
- [ ] **Step 4:** Generate the social image: run `yarn build && yarn preview --port 4321 &`, then `yarn playwright screenshot --viewport-size=1200,630 http://localhost:4321/ public/og.png`, then stop the preview server.
- [ ] **Step 5:** Run `yarn test`. Expected: all pass. Update the visual baselines if the contrast fix changed them.
- [ ] **Step 6: Commit:** `git add -A && git commit -m "feat: 404, meta tags, a11y fixes and social image"`

---

### Task 12: Docs and ship prep

**Files:**
- Modify: `README.md` (stack badge and description: Astro, no React), `design/README.md` ("Recommended stack" section → one line pointing to the spec)

- [ ] **Step 1:** Update both READMEs.
- [ ] **Step 2:** Run `yarn format && yarn build && yarn test`. Expected: clean build, all tests pass in all three projects.
- [ ] **Step 3:** Run `du -sh dist` and check the gzipped JS per page with `find dist -name "*.js" -exec gzip -c {} \; | wc -c`. Expected: under 15 KB of JavaScript in total.
- [ ] **Step 4: Commit:** `git commit -am "docs: update READMEs for the Astro rebuild"`
- [ ] **Step 5: Hand off to the user.** Merging to `main`, `yarn deploy`, and pushing the `v1-react` tag are outward-facing, so ask before doing any of them. After deploying, spot-check https://www.cicadahub.dev on a phone.
