# CicadaHub v5 rebuild: Astro port design

**Date:** 2026-11-17
**Source of truth for the look:** `design/mockups/v5/index.html` + `design/mockups/v5/assets/`
**Replaces:** the Vite + React SPA in `src/` (live at www.cicadahub.dev)

## 1. Intent

cicadahub.dev is Abraham's portfolio. The v5 mockup restyles it after Blue Archive's lobby UI, reworked for visitors who have never played the game: a lobby home with a story dialogue box and choice buttons, a permanent labeled bottom menu, and white-panel sub-screens for Projects, Work, About and Contact. This spec turns that single-file mockup into the production site.

The site is mostly static text and images. The rebuild should ship as plain HTML with small, targeted scripts, so it loads fast for recruiters and other first-time visitors.

## 2. Goals, non-goals, anti-goals

**Goals**
- Pixel-faithful port of v5 at phone (390), tablet (820), laptop (1440) and desktop (1920) widths.
- Every screen and every project has its own URL that can be shared.
- Content (projects, jobs, skills, taglines, bio) lives in typed data files, not in markup. A malformed entry fails the build.
- The site works without JavaScript: all content is readable and all links work. JavaScript only adds the carousel, gallery, popup, tabs, typewriter and copy button.
- Lighthouse performance and accessibility of at least 95 on mobile.

**Non-goals**
- Background music (v5 removed it), the About photo gallery (removed), and the review chrome (the device switcher at the top of the mockup).
- Dark mode. The game UI has none, and the mockup sets `color-scheme: light` on purpose.
- A CMS, a blog, analytics, or a contact form.

**Anti-goals** (failure even if it technically works)
- Any Blue Archive asset (characters, logos, art, sprites) in the repo or on the site. All art stays original, per `design/README.md`.
- Game-only UI with no meaning on a portfolio, such as resource counters with "+", notices, "new" badges or decorative dots that look clickable. v5 removed these on purpose; do not reintroduce them.
- Skew or perspective on images or body text. Skew is allowed only on buttons and tabs, where the mockup counter-skews the label.
- Japanese text anywhere on the site (title subtitles, the About card label). It was removed after review.
- Repeating the name and avatar in the Home top bar. The lobby portrait already shows them; the top bar shows the screen title on every screen.
- Upscaling the avatar with blurring. It is pixel art and must render at integer scales with `image-rendering: pixelated`.

## 3. Constraints

- Hosting stays on **GitHub Pages** with the custom domain `www.cicadahub.dev`. The `gh-pages` branch currently holds a `CNAME` file.
- Package manager: **yarn** (existing `yarn.lock`). Local Node: 22.14.
- Fully static output (`output: "static"`). There is no server.
- External links (GitHub, LinkedIn) open in a new tab with `rel="noopener"` and an accessible "(opens in a new tab)" label, as in the mockup.

## 4. Approaches considered

| | Approach | Trade-off |
|---|---|---|
| A | Astro + React islands (Embla, Headless UI) | About 45 KB of React runtime on interactive pages. Keeps the repo a React codebase. |
| **B (chosen)** | **Astro with no UI framework; interactivity as `<script>` modules inside `.astro` components** | Smallest JavaScript. Close to a direct port, since the mockup's DOM code already works. The repo stops being React. |
| C | One React app island inside a single Astro page, keeping the mockup's hash routing | Fastest port, but loses separate URLs, plain-HTML first paint and the point of using Astro. Rejected. |

The user chose Astro, then chose B over A.

## 5. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro (current major), `output: "static"` | `site: "https://www.cicadahub.dev"` |
| Page transitions | Astro `<ClientRouter />` (View Transitions) | Top bar, dock and backdrop persist across navigations, so it feels like the mockup's app shell. |
| Content | Astro content collections, `file()` / `glob()` loaders, Zod schemas | `src/content.config.ts` |
| Styling | Plain CSS: a global token sheet plus scoped `<style>` blocks in components | The mockup's CSS (custom properties, `color-mix`, container queries) ports almost line for line. No Tailwind: it would mean rewriting working CSS for no gain. |
| Fonts | `@fontsource/noto-sans`, self-hosted | The only typeface. No Japanese font is needed because the site has no Japanese text. |
| Icons | `simple-icons` npm package, read at build time | Replaces `assets/icons.js` / `window.SI`. Ships zero client JS. |
| Images | `astro:assets` (`<Image>` / `<Picture>`), except the avatar | WebP/AVIF, intrinsic sizes, lazy loading. |
| Type checking | TypeScript strict, `astro check` | |
| Lint/format | Prettier + `prettier-plugin-astro` | Replaces the React-specific ESLint config. |
| Tests | Playwright: a smoke test and screenshot test per route at 390, 820 and 1440 widths, plus an axe accessibility check | |
| Extras | `@astrojs/sitemap` | |

**Removed dependencies:** react, react-dom, @vitejs/plugin-react, @headlessui/react, embla-carousel-react, react-icons, typewriter-effect, eslint-plugin-react-*, and @types/react*.

## 6. Routes

| Route | Screen | Top-bar title |
|---|---|---|
| `/` | Home (lobby) | Home (no back button) |
| `/projects/` | Projects list + detail of the first project (by `order`) | Projects |
| `/projects/[slug]/` | Projects list + detail of `slug` (`tabi`, `cdb`, `dice`) | Projects |
| `/work/` | Work history | Work |
| `/about/` | Profile card + Bio/Skills tabs | About |
| `/contact/` | Chat-style contact options | Contact |
| `/404` | Styled "not found" panel with a Home button | Not found |

- `/projects/` and `/projects/tabi/` render the same view. `/projects/` sets `<link rel="canonical">` to the first project's URL.
- Project rows in the list are plain `<a>` links to `/projects/[slug]/`, with `aria-current="page"` on the active row. This replaces the mockup's `aria-pressed` buttons.
- On widths under 1024px, a project page is reached through `#detail`, so the detail panel scrolls into view. The rows link to `/projects/[slug]/#detail`.
- Dock items are `<a>` links with `aria-current="page"` set at build time from `Astro.url.pathname`.
- **Back button:** if `history.length > 1` and `document.referrer` is same-origin, call `history.back()`. Otherwise navigate to `/`. This replaces the mockup's `depth` counter.

## 7. Project structure

```
astro.config.mjs
public/
  CNAME                      # www.cicadahub.dev
  favicon.ico
src/
  content.config.ts          # collections + Zod schemas
  content/
    projects/{tabi,cdb,dice}.md   # frontmatter + description body
    jobs.json
    skills.json
    site.json                # name, role, taglines, contact links, email, facts
    bio.md
  assets/
    avatar-32.png
    logos/{morevang,idtech,rit}.png
    projects/tabi/*.webp, projects/cdb/*, projects/dice/*.webp
  styles/
    tokens.css               # :root custom properties from mockup lines 11-25
    global.css               # reset, focus ring, .sr, .px, reduced-motion
    ui.css                   # shared primitives: .panel .sbar .hl .btn .chip .round .facts
  layouts/
    AppShell.astro           # .app grid: Backdrop, TopBar, <main class="view"> <slot/>, Dock, ClientRouter
  components/
    shell/TopBar.astro  shell/Dock.astro  shell/Backdrop.astro  shell/BackButton.astro
    ui/Button.astro  ui/Chip.astro  ui/SectionBar.astro  ui/Facts.astro  ui/Avatar.astro
    home/DialogueBox.astro  home/Choices.astro  home/FeaturedBanner.astro  home/NowCard.astro
    projects/ProjectList.astro  projects/ProjectDetail.astro  projects/Gallery.astro  projects/BannerArt.astro
    work/JobCard.astro  work/JobDialog.astro
    about/ProfileCard.astro  about/AboutTabs.astro  about/SkillGrid.astro
    contact/ChatThread.astro  contact/ContactOption.astro  contact/CopyEmail.astro
  pages/
    index.astro  projects/index.astro  projects/[slug].astro
    work.astro  about.astro  contact.astro  404.astro
tests/
  smoke.spec.ts
```

## 8. Content model

Defined in `src/content.config.ts`. Field names follow the mockup's data arrays (`index.html` lines 544-573).

```ts
projects (glob "src/content/projects/*.md"):
  title: string
  line: string                       // one-line summary
  order: number
  thumb: image()
  tone: "light" | "dark" | "navy"    // gallery stage background
  platform: string
  team: string
  stack: string[]
  link: string.url().optional()      // absent → "Code is private" + note
  images: { src: image(), caption: string }[]   (min 1)
  featured: { art: "tabi" | "shot", shot?: image() }  // banner composition
  body → description paragraph

jobs (file "src/content/jobs.json"):
  id, title, org, logo: image(), current: boolean, order: number,
  tools: string[], desc: string

skills (file "src/content/skills.json"):
  id, label, icon: string  // simple-icons slug, e.g. "typescript"
                           // brand color comes from simple-icons' hex

site (file "src/content/site.json"): single entry
  name, role, employer, tagline (static subtitle under the name), taglines: string[],
  email, github, linkedin, facts: { label, value }[]
```

- Copy comes from the **mockup's wording**, which is an edited version of `src/assets/constants.ts`. Bio text comes from the mockup's About pane (lines 464-466).
- The Zod `image()` helper means a missing or mistyped image path fails the build.

## 9. Porting map

### 9.1 Mockup → components

| Mockup (v5 `index.html`) | Becomes | Notes |
|---|---|---|
| `:root` tokens (L11-25) | `styles/tokens.css` | Copy verbatim. Update `--f-*` to the Fontsource family names. Drop `--f-jp` and the "M PLUS 1p" fallback (already removed in the mockup). |
| `.studio`, `.stage`, `.device` (L40-57, L357-370, L777-795) | **Dropped** | Review chrome only. The real `.app` fills the viewport (`height: 100dvh`). |
| `.app` grid + `container: app` (L60-63) | `AppShell.astro` | Keep `container: app / inline-size`. Every `@container app (...)` rule keeps working unchanged. |
| `.top`, `.back`, `.ttl`, `.caps`, `.cap` | `TopBar.astro` + `BackButton.astro` | Takes a `title` prop. There is no Japanese subtitle. Every screen, Home included, shows the title. The back button is rendered on every screen except Home. (The name-and-avatar chip on Home was removed after review as redundant with the lobby portrait.) |
| `.dock` (L92-102, L511-519) | `Dock.astro` | `transition:persist` so it doesn't re-render. Update `aria-current` on `astro:after-swap`. |
| `canvas#bg` + `lobby()`/`poly()` (L727-775) | `Backdrop.astro` | See §9.3. |
| Home `.s-home` (L139-192, L396-429) | `pages/index.astro` + `home/*` | Two-column at ≥640 and ≥1024, as in the mockup. |
| Banner slides + `art` map (L600-626) | `FeaturedBanner.astro` + `BannerArt.astro` | Built from `projects` sorted by `order`. Each slide is an `<a href="/projects/[slug]/">`, not a button. |
| Projects `.s-projects` (L194-232, L628-674) | `ProjectList.astro` + `ProjectDetail.astro` + `Gallery.astro` | Detail markup is server-rendered per route. Only image switching stays on the client. |
| Work `.s-work` (L234-242, L676-698) | `JobCard.astro` + `JobDialog.astro` | See §10.3. |
| About `.s-about` (L244-267, L443-473, L700-705) | `ProfileCard.astro` + `AboutTabs.astro` + `SkillGrid.astro` | |
| Contact `.s-contact` (L269-289, L475-508, L707-713) | `ChatThread.astro` + `ContactOption.astro` + `CopyEmail.astro` | |
| `.modal` / `.win` (L291-303, L715-725) | Native `<dialog>` styled with `.win` classes | See §10.3. |
| Container queries (L305-353) | Move each rule into the scoped `<style>` of the component it targets | Shared rules (`.btn`, `.facts`) stay in `ui.css`. |

### 9.2 Current `src/` → fate

| Current | Fate |
|---|---|
| `src/assets/constants.ts` | Replaced by `src/content/*`, with v5 wording. |
| `src/components/**` (React), `App.tsx`, `main.tsx`, `index.css`, `App.css`, `src/styles/**`, `hooks/WindowDimensions.ts` | Deleted. Kept in history under the tag `v1-react` (create the tag before deleting). |
| `src/assets/audio/*.mp3`, `MVPlayer.tsx` | Deleted. Music is a non-goal. |
| `src/assets/images/about/gallery_*.jpg` | Deleted. The gallery is a non-goal. |
| `src/assets/images/home/*` (headshot.gif, audio-wave gifs) | Deleted. Replaced by `avatar-32.png`. |
| `src/assets/images/work/*.png`, `projects/*` | Superseded by the full-resolution v5 assets in `design/mockups/v5/assets/`. |
| `index.html`, `vite.config.ts`, `tsconfig.*.json`, `eslint.config.js` | Replaced by Astro equivalents. |
| `public/favicon.ico` | Kept. |
| `TODO.md` | Deleted. Every item in it is either done by this rebuild or out of scope. |
| `design/` | Kept unchanged as the design reference. |

### 9.3 Backdrop

The mockup draws two original scenes on a `<canvas>`: `lobby` (sky, clouds, skyline, sea) for Home and `poly` (low-poly triangles) for sub-screens. Both use a seeded RNG, so their output depends only on viewport size.

**Decision (builder's call):** keep the canvas drawing code as a module in `Backdrop.astro`, ported almost verbatim.
- The canvas gets `transition:persist`. It redraws on `astro:after-swap`, picking the scene from a `data-screen` attribute on `<html>`, and on `ResizeObserver`.
- The no-JS and first-paint fallback is the CSS gradient already on `.app` (`linear-gradient(180deg, var(--sky), var(--mist))`).
- `devicePixelRatio` stays capped at 2, as in the mockup.

## 10. Interactive behaviors

All scripts are `<script>` tags inside the owning `.astro` component, so Astro bundles and deduplicates them. **Under `<ClientRouter />`, module scripts run once, not on every navigation.** Every component script must therefore:

1. Wrap its setup in `document.addEventListener("astro:page-load", init)`.
2. Look up its own root element (`data-*` hook). If the root isn't on the current page, return early.
3. Clean up timers and listeners on `astro:before-swap`, or attach listeners to elements that get replaced anyway.

### 10.1 Typewriter tagline (`DialogueBox.astro`)
- The server renders `taglines[0]` into `<p class="tag">`, so no-JS visitors see text.
- On load: pick a random tagline and type it at 35 ms per character (mockup L596-598). With `prefers-reduced-motion`, set the text instantly.
- `aria-live="polite"` sits on a visually hidden copy that gets the full line once, so screen readers don't hear each character.

### 10.2 Featured banner (`FeaturedBanner.astro`)
- All slides are server-rendered. Every slide except the first gets `hidden`.
- Previous/next buttons and dots call `slideTo(i)` and restart the timer (L612-626).
- Auto-advance every 6 s. Disabled under reduced motion. Paused on `mouseenter` and `focusin`, resumed on `mouseleave` and `focusout`. **Cleared on `astro:before-swap`**: the mockup instead checks `data-screen === "home"`, which won't exist here.
- Under 640px the arrows are hidden (L341). Dots and swipe remain. A swipe uses `pointerdown`/`pointerup` with a delta threshold of 40px or more.

### 10.3 Work details popup (`JobCard.astro` + `JobDialog.astro`)
- Each job renders its own `<dialog class="win">` holding the full description and tools list. The "Details" button calls `dialog.showModal()`.
- A native `<dialog>` provides the focus trap, `Esc` to close, top-layer stacking and inert background. That replaces the mockup's `openModal` / `closeModal` / `lastFocus` code (L716-725).
- A backdrop click closes it (check `event.target === dialog`), and so does `[data-close]`. Style `::backdrop` with `color-mix(in srgb, var(--navy-3) 55%, transparent)`.
- "See my projects" in the footer is an `<a href="/projects/">`.
- Close any open dialog on `astro:before-swap`.

### 10.4 Project gallery (`Gallery.astro`)
- The server renders the first image in `.gstage`, plus thumbnails, caption and `1 / n` counter. All image URLs come from `astro:assets` and are written into `data-` attributes, or into the thumbnails' own `<img>` elements.
- Previous/next and thumbnail clicks swap `src`, `alt`, caption, counter and `aria-current` (L637-642, L669-673). Left and right arrow keys work while the stage has focus.
- Single-image projects (Dice) render no arrows or thumbnails, as in the mockup.

### 10.5 About tabs (`AboutTabs.astro`)
- ARIA tabs pattern, as in the mockup (L457-471), plus arrow-key and Home/End roving focus.
- Without JS, both panes show stacked. The script adds `hidden` to the inactive pane.

### 10.6 Copy email (`CopyEmail.astro`)
- Port L708-713: `navigator.clipboard.writeText`, then show "Copied!". On failure, select the text and show "Selected, press Ctrl+C". Reset after 2 s.
- Also render a `mailto:` link so the address stays usable without JS.

### 10.7 Dock and top bar
- Dock and backdrop use `transition:persist`. The top bar does not, because its title changes per page and it's cheap to re-render.
- The mockup's `@keyframes enter` slide-in (L108-109) becomes the `transition:animate` for `<main>`: a custom animation that fades from 0.4 opacity and moves 12px in from the right. Reduced motion disables it.

## 11. Styling details

- Port CSS **by copying, not rewriting**. Class names can stay. Scoped styles in Astro add a hash attribute, so short names like `.ttl` and `.go` won't collide.
- `body` loses the review-chrome padding. `.app` becomes `height: 100dvh` with the grid `auto minmax(0,1fr) auto`, and `.view` is the only scroll container.
  - **Builder's call:** `.view` scrolling instead of the document means ClientRouter's scroll restoration won't apply. Reset `.view.scrollTop = 0` on `astro:after-swap`, except when the URL has `#detail`.
- Add `padding-bottom: env(safe-area-inset-bottom)` to `.dock`, and `viewport-fit=cover` in the viewport meta.
- Fonts: `@import "@fontsource/noto-sans/{400,500,600,700,800,700-italic,800-italic}.css"`. Preload Noto Sans 800 italic, the title face.
- Avatar: `<img src={avatar.src} width="128" height="128" class="px">` with `image-rendering: pixelated`. **Do not pass it through `<Image>`**, because resampling would blur it. Prefer integer multiples of 32 (96, 128, 160). The one exception is the 44px Contact thread avatar, which is kept as in the mockup.
- Skill tiles use the simple-icons path and hex at build time, rendered as inline `<svg>` with `role="img"` and `aria-label`.

## 12. Assets

Move from `design/mockups/v5/assets/` into `src/assets/`. **Copy, don't move**, so the mockup still works.

| Asset | Destination | Handling |
|---|---|---|
| `avatar-32.png` | `src/assets/avatar-32.png` | Raw, pixelated (§11) |
| `logo-*.png` | `src/assets/logos/` | `<Image>` |
| `tabi-*.webp`, `dice-1.webp`, `cdb-1/2.webp` | `src/assets/projects/<slug>/` | `<Image>` with `widths`/`sizes`. The gallery stage uses `object-fit: contain` (full image, never cropped). |
| `cdb-demo.gif` (1.2 MB) | `src/assets/projects/cdb/demo.mp4` + `.webm` | **Builder's call:** convert with ffmpeg and render as `<video autoplay muted loop playsinline>` with the first frame as `poster`. That's roughly 10× smaller. Keep the GIF only if the conversion looks worse. |
| `icons.js` | Dropped | Replaced by the `simple-icons` package |

The social preview image `og.png` (1200×630) is built once from the Home screen and placed in `public/`. Builder's call.

## 13. Accessibility

- Keep the mockup's existing semantics: labeled icon buttons, `aria-current` on dock and rows, the `.sr` utility, the `:focus-visible` ring in cyan, and `prefers-reduced-motion` turning off animations and transitions.
- Each page has one `<h1>`. On sub-screens, the top-bar title is the `<h1>`. On Home the `<h1>` is the name in `.hello`, so the top-bar "Home" title renders as a non-heading element with the same styling.
- Add a skip link ("Skip to content" → `#main`) as the first focusable element.
- Contrast: re-check `--ink-2` (`#66788d`) on `--panel-2` (`#f4f8fa`) for small text with axe. If it fails AA, darken `--ink-2` slightly rather than changing the layout.

## 14. Build, test, deploy

```jsonc
"scripts": {
  "dev": "astro dev",
  "build": "astro check && astro build",
  "preview": "astro preview",
  "test": "playwright test",
  "format": "prettier --write .",
  "deploy": "yarn build && gh-pages -d dist"
}
```

- `public/CNAME` holds `www.cicadahub.dev`, so every deploy keeps the custom domain. Today the domain survives only because the file already sits on the `gh-pages` branch.
- Playwright runs against `astro preview`. For each route at 390, 820 and 1440 widths it checks: no console errors, no horizontal overflow (`scrollWidth <= clientWidth`), the axe check passes, and the full-page screenshot matches its baseline.
- Optional follow-up, not required for launch: a GitHub Actions workflow running `withastro/action` on pushes to `main`, replacing manual `yarn deploy`.

> **Update (after implementation):** deployment moved to GitHub Actions (`.github/workflows/deploy.yml`) at the user's request. It type-checks, runs the Playwright suite and uploads `dist/` as a Pages artifact on every push to `main` (plus a weekly rebuild to re-sync the avatar). Pull requests get the same checks without deploying. The `gh-pages` branch deploy and `yarn deploy` script were removed. This also avoids GitHub Pages' Jekyll step, which drops Astro's `_astro/` folder. Screenshot tests run locally only, because CI runners have different fallback fonts.

## 15. Build order

Each step ends in a working `astro dev`.

1. **Branch and scaffold.** Tag the current `main` as `v1-react`. Create the branch `astro-rebuild` from `redesign-mockups`. Remove the Vite/React files. Scaffold Astro and add `public/CNAME`.
2. **Tokens and shell.** Add `tokens.css`, `global.css`, `ui.css` and fonts. Build `AppShell`, `TopBar`, `Dock` and `BackButton`. Create all routes as empty panels. Add ClientRouter with persist.
3. **Content layer.** Write `content.config.ts`, copy the assets, convert the data to Markdown and JSON, and run `astro check` until it is clean.
4. **Screens, static first.** Build Home, Projects (both routes), Work, About and Contact as server-rendered markup and CSS, with no scripts yet. Compare side by side with the mockup at all four widths.
5. **Scripts.** Add §10.1-10.7 in that order, each following the `astro:page-load` pattern.
6. **Backdrop** (§9.3).
7. **Polish.** 404 page, meta tags, sitemap, `og.png`, the CDB video conversion, and the contrast check.
8. **Tests.** Playwright smoke and screenshot suite with baselines committed.
9. **Ship.** Merge to `main`, run `yarn deploy`, and spot-check the live site on a phone.

## 16. Decisions made in this spec (not discussed with the user)

These are the builder's calls, listed so the user can veto them:

- The rebuild happens in this repo, replacing `src/`. React history is preserved under the `v1-react` tag.
- Hosting stays on GitHub Pages with `gh-pages`; GitHub Actions is optional later.
- Plain CSS ported from the mockup, not Tailwind. Prettier, not Biome. No Vitest, because there is no unit-level logic worth testing.
- `/projects/` shows the first project. Project rows and banner slides are links, not buttons.
- A native `<dialog>` replaces the custom modal.
- The canvas backdrop is kept rather than pre-rendered.
- The CDB demo becomes a looping video.
- ~~The avatar is the local 32×32 PNG from v5.~~ Changed after implementation at the user's request: the avatar is fetched from GitHub at build time (`src/lib/github-avatar.ts`), optimised and served locally, with the 32×32 pixel PNG as the fallback when GitHub can't be reached. The user will replace the GitHub picture with original art (the anti-goal on game art still applies).
- Fonts are self-hosted, not loaded from Google Fonts.
- Contact email stays `abehernandez@work.com`, as on the current live site.
- `design/README.md`'s "Recommended stack" section is outdated (Howler, React islands, Tailwind). Update it to point to this spec when the rebuild lands.
