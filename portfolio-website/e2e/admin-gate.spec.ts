import { test, expect } from "@playwright/test";

/* ──────────────────────────────────────────────────────────
   Admin security gate — src/middleware.ts 404s the entire
   /admin and /api/admin surface unless ENABLE_ADMIN is set.
   This is the single most security-relevant behavior in the
   app and had zero test coverage before this. Assumes the
   default/CI posture: ENABLE_ADMIN unset. Does not attempt to
   test the admin CMS itself (file writes + git commits are too
   stateful/risky to automate) — see ROADMAP.md.
   ────────────────────────────────────────────────────────── */

test.describe("admin surface is gated when ENABLE_ADMIN is unset", () => {
  test("/admin/upload returns 404", async ({ page }) => {
    // waitUntil: "commit" — the middleware's 404 has an empty, chunked-
    // encoding body (no Content-Length), and Firefox specifically never
    // fires the default "load" event for it, hanging until the test
    // times out. Confirmed directly (curled the raw response, then
    // reproduced/fixed the hang in isolation). "commit" is also the more
    // correct choice for what this test actually checks — the response
    // status, not any rendered content — regardless of the Firefox quirk.
    const response = await page.goto("/admin/upload", { waitUntil: "commit" });
    expect(response?.status()).toBe(404);
  });

  test("/api/admin/pending returns 404", async ({ request }) => {
    const response = await request.get("/api/admin/pending");
    expect(response.status()).toBe(404);
  });

  test("/api/admin/commit returns 404 even for a POST", async ({ request }) => {
    const response = await request.post("/api/admin/commit", { data: {} });
    expect(response.status()).toBe(404);
  });
});
