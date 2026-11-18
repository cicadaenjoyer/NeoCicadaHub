import { defineConfig, devices } from "@playwright/test";

const chrome = devices["Desktop Chrome"];

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: "line",
  use: { baseURL: "http://localhost:4321" },
  webServer: {
    command: "yarn astro build && yarn astro preview --port 4321",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: "phone", use: { ...chrome, viewport: { width: 390, height: 844 } } },
    { name: "tablet", use: { ...chrome, viewport: { width: 820, height: 1180 } } },
    { name: "laptop", use: { ...chrome, viewport: { width: 1440, height: 900 } } },
  ],
});
