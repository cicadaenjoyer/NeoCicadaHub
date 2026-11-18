import { defineConfig, devices } from "@playwright/test";

const chrome = devices["Desktop Chrome"];

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: "line",
  use: { baseURL: "http://localhost:4321" },
  webServer: {
    // `exec` replaces the shell with the server, so Playwright can stop it.
    command: "./node_modules/.bin/astro build && exec node tests/serve.mjs 4321",
    url: "http://localhost:4321",
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    { name: "phone", use: { ...chrome, viewport: { width: 390, height: 844 } } },
    { name: "tablet", use: { ...chrome, viewport: { width: 820, height: 1180 } } },
    { name: "laptop", use: { ...chrome, viewport: { width: 1440, height: 900 } } },
  ],
});
