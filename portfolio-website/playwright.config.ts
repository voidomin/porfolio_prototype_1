import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

/* ──────────────────────────────────────────────────────────
   Dedicated port (3100), not 3000/3001: this session hit a real
   collision more than once from an unrelated leftover dev server
   on 3000 — a dedicated E2E port never depends on what else
   happens to be running locally.

   webServer: CI always builds+runs the real production server
   (DEVELOPMENT.md already flags dev-vs-prod build differences
   biting this session twice); local runs use `next dev` for fast
   iteration and can reuse an already-running one.
   ────────────────────────────────────────────────────────── */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Capped, not left at the default (CPU core count): several specs mount
  // the real WebGL hero scene, and running many of those contexts at once
  // under software rendering (no real GPU in CI, and this session's own
  // dev environment) caused near-total timeout failures — confirmed
  // directly by re-running the exact same suite serially and seeing all
  // but 3 genuine issues disappear. Now running 3 browser projects instead
  // of 1 makes this contention proportionally worse — an occasional single
  // test still flakes under full local parallelism (confirmed: passes in
  // isolation, and passes when the full suite is simply re-run), which
  // `retries: 1` below covers for CI rather than chasing further.
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // The site registers a real service worker (ServiceWorkerRegister.tsx),
    // production-builds only — which is exactly why this never surfaced
    // locally against `next dev`, only against CI's real `next build &&
    // next start`. Once a page is service-worker-controlled, WebKit's
    // page.route() silently stops intercepting its fetch() calls — a
    // documented Playwright/WebKit limitation, confirmed directly here by
    // reproducing with CI=1 locally and watching the mocked contact-form
    // route never fire. None of these tests exercise offline/PWA behavior,
    // so blocking registration entirely is the correct fix, not a
    // workaround for a real product bug.
    serviceWorkers: "block",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? `npm run build && npm run start -- -p ${PORT}`
      : `npm run dev -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
