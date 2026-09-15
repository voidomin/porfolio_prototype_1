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
    const response = await page.goto("/admin/upload");
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
