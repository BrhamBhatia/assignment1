import { defineConfig, devices } from "@playwright/test";

// Use PORT 3001 if you are running Docker (host:3001 -> container:3000)
// Otherwise, if you're running `npm run dev`, set BASE_URL=http://localhost:3000 before running tests.
const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
