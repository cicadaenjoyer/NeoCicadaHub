// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.cicadahub.dev",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  // The avatar is fetched from GitHub at build time (src/lib/github-avatar.ts).
  image: { domains: ["avatars.githubusercontent.com"] },
});
