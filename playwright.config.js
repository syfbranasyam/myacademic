import { defineConfig, devices } from '@playwright/test'

/*
 * Playwright config (revision Phase 9).
 *
 * - testDir: tests/e2e
 * - Chromium only — installing Firefox + Webkit triples the browser footprint
 *   for no meaningful coverage gain on a prototype.
 * - Single worker: our app has in-memory state that resets on refresh, and the
 *   SweetAlert modal is single-instance. Serial execution avoids races.
 * - webServer: starts the Vite dev server on port 5173. If it's already
 *   running (e.g. during dev), reuseExistingServer skips a duplicate start.
 */

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 8000,
    navigationTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})