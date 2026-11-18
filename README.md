# NeoCicadaHub

My personal portfolio site, built with Astro and TypeScript. The look is inspired by Blue Archive's lobby UI, with all-original art.

![GitHub repo size](https://img.shields.io/github/repo-size/cicadaenjoyer/NeoCicadaHub)
![GitHub last commit](https://img.shields.io/github/last-commit/cicadaenjoyer/NeoCicadaHub)
![GitHub issues](https://img.shields.io/github/issues/cicadaenjoyer/NeoCicadaHub)
![GitHub license](https://img.shields.io/github/license/cicadaenjoyer/NeoCicadaHub)
![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-orange?logo=astro)

[www.cicadahub.dev](https://www.cicadahub.dev)

## Development

Requires Node 24 (see `.nvmrc`).

| Command       | What it does                                                            |
| ------------- | ----------------------------------------------------------------------- |
| `yarn dev`    | Start the dev server                                                    |
| `yarn build`  | Type-check and build the static site into `dist/`                       |
| `yarn test`   | Build, then run the Playwright suite at phone, tablet and laptop widths |
| `yarn format` | Format with Prettier                                                    |
| `yarn deploy` | Build and publish `dist/` to GitHub Pages                               |

Pushing to `main` deploys the site: GitHub Actions (`.github/workflows/deploy.yml`) type-checks, runs the Playwright suite and publishes `dist/` to GitHub Pages. Pull requests get the same checks without deploying, and a weekly rebuild keeps the GitHub avatar in sync. Screenshot tests run locally only.

Content lives in `src/content/` (projects, jobs, skills, site info and bio). Design notes and the original mockups are in `design/`, and the rebuild spec is in `docs/superpowers/specs/`.
