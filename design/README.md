# CicadaHub redesign: design drafts

Mockups for the next version of the site, styled after the Blue Archive game UI. These are **drafts for review**, not production code. The production site is built from them in Astro (see [Stack](#stack)).

## What's here

| Path | What it is |
|---|---|
| `mockups/v5/index.html` + `mockups/v5/assets/` | **Current draft (v5).** Lobby with a story dialogue box and choice buttons, a permanent bottom menu, and full-resolution images. Assets are separate files, so open it through a local server or the published preview. |
| `mockups/cicadahub-v4-hub-lobby.html` | Previous draft (v4.1). Lobby based on the game's hub screen. |
| `mockups/cicadahub-v3-game-lobby.html` | Earlier draft (v3), based on the game's main lobby with a bottom menu. Kept for comparison. |
| `mockups/screenshots/` | v4.1 rendered at desktop (1600 px), tablet (820 px) and phone (400 px) for every screen, plus the Work popup. |

Each mockup is a single self-contained HTML file. Open it in a browser; no build step is needed. The switcher at the top previews the page as **Fit / Phone / Tablet / Laptop / Desktop**, and the layout responds through CSS container queries.

## Version history

| Version | Direction | What changed after review |
|---|---|---|
| v1 | Generic "game UI" from memory | Read as Overwatch: condensed uppercase type and saturated slanted tiles. Dropped. |
| v2 | Rebuilt from real screenshots (chat window, story select, schedule) | Mostly white panels, navy bold-italic titles with a yellow underline bar, cyan and yellow buttons. Avatar was still front and center. |
| v3 | Main lobby layout with corner-pinned UI and a bottom menu | Avatar removed in favor of a drawn wallpaper. Live GitHub avatar, real tech logos, project galleries. Chat reply feature removed. Fixed the bug where the Work popup opened below the page. |
| v4 / v4.1 | **Hub screen layout** (the user's preferred reference) | Flat white top bar, profile bubble and speech bubble on the left, a tilted cluster of picture cards on the right, no bottom menu. v4.1 fixes problems found in the screenshots (card images, bubble height, vertical centering). |
| v5 | **Rework for visitors who don't know the game** | Bottom menu with icon and label on every screen. Removed game-only parts with no meaning on a portfolio: resource counters with "+", Notice, "1 new" badges, the wallpaper toggle and decorative dots. Every action is a labeled button (Details, View project, Copy address, Open ↗). No perspective or skew on images or body text. Screenshots load at full resolution and fit their frame instead of being cropped. The avatar was rebuilt as a clean 32×32 PNG and is shown at integer scales. Colors and shapes were checked against the game's own Common UI sprite atlas, and the type uses the game's body font (Noto Sans). Background music and the About photo gallery were removed to keep the site focused on projects. After review, the Home top bar shows a plain "Home" title like the other screens instead of repeating the name and avatar, and all Japanese text (screen-title subtitles, the About card label) was removed along with the M PLUS 1p font. |

## Visual rules (sampled from game screenshots)

- **Background:** pale sky gradient (`#a9d5f8` fading to near-white) with faint low-poly triangles. The lobby uses an original drawn city-over-the-sea scene with day, sunset and night versions.
- **Panels:** mostly white or pale blue-grey (`#f3f7f8`), small corner radius, soft shadow. Section labels are slanted grey bars.
- **Type:** Noto Sans. Titles are bold, sometimes italic, in navy (`#2d4663`), with a yellow highlighter bar (`#fff27a`) under popup titles.
- **Buttons:** light cyan (`#67d3f5`) for normal actions, yellow (`#ffe45e`) with navy text for the main action, grey when disabled. Slightly slanted.
- **Top bar:** flat white strip with resources (icon, value, thin cyan "+") separated by slanted dividers, and a large navy round back button that overhangs the bar.
- **Chat:** pink header (`#fb8ea1`), slate sidebar (`#4c5b70`), dark slate message bubbles.
- **No game assets:** all art, icons and the wallpaper are original. The game's characters, logos and art must not appear on the site.

## Content decisions

- **Profile picture** loads live from `https://github.com/cicadaenjoyer.png`, so it follows whatever icon is set on GitHub. The mockups also embed a saved copy because the artifact preview blocks outside images; the real site doesn't need it.
- **Projects** each have a thumbnail plus an image gallery above the description. Tabi uses the screenshots from its README; C Database uses frames from `cdb_demo.gif`.
- **About** shows real tech logos (from Simple Icons, the same set `react-icons/si` uses), not text abbreviations.
- **Contact** shows LinkedIn, email with a copy button, and GitHub. There is no reply feature.

## Stack

The site was rebuilt from these mockups in Astro with no UI framework. See [the rebuild spec](../docs/superpowers/specs/2026-11-17-astro-rebuild-design.md) for the stack and how each part of the mockup was ported.

## References

The game screenshots used as references are **not committed**, because they're copyrighted. They came from:

- Steam store screenshots: `https://store.steampowered.com/api/appdetails?appids=3557620`
- Blue Archive Wiki: `Schedule.jpg`, `Special_comissions_screenshot.jpg`, `Arena_Screenshot.png`, `Potential_unlock_interface.png`
- Two in-game screenshots provided by the site owner (the main lobby and the hub screen)
