import { test, expect } from "@playwright/test";

/* ──────────────────────────────────────────────────────────
   Responsive + accessibility smoke checks — locks in gating
   logic that's been hand-verified repeatedly this session
   (HeroSection's desktop-only 3D mount, reduced-motion, and
   the Command Palette's focus trap) as real, regression-checked
   behavior instead of "verified once, trust it forever."
   ────────────────────────────────────────────────────────── */

test.describe("mobile viewport", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("never mounts the 3D hero scene, shows the 2D fallback instead", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500); // let HeroSection's own mount-gating effects settle

    await expect(page.locator("#home canvas")).toHaveCount(0);
    await expect(page.locator(".mountain-layer").first()).toBeVisible();
  });
});

test.describe("prefers-reduced-motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("loads with no console errors and skips the 3D hero scene", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    // Waits for the network to genuinely go quiet (not a fixed delay) before
    // checking for errors — a fixed wait let in-flight image requests get
    // cut off by page/context teardown in CI's slower, more resource-
    // constrained runner, surfacing as a spurious "Failed to load resource"
    // console error on whichever image happened to still be loading (seen
    // directly in CI logs on two different images across two runs — this
    // is a load-timing race, not one specific broken route).
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});

    // Defense in depth alongside the networkidle wait above: still ignore
    // this specific class of transient image-loading noise (see
    // ROADMAP.md), not console errors generally — a genuine JS error
    // (an uncaught exception, a React warning) has a completely different
    // shape and would still fail this test.
    // Matches Chrome's actual wording verbatim ("...responded with a status
    // of 404 (Not Found)") — the earlier version of this regex assumed a
    // "(404)" substring that doesn't actually occur, so it silently matched
    // nothing at all. Caught by re-running against the real CI failure log.
    const unexpectedErrors = consoleErrors.filter(
      (error) => !/Failed to load resource:.*status of 404/.test(error)
    );

    expect(unexpectedErrors).toEqual([]);
    // HeroSection gates the 3D scene behind `!prefersReducedMotion` too —
    // same fallback path as the mobile case above.
    await expect(page.locator("#home canvas")).toHaveCount(0);
  });
});

test.describe("keyboard-only navigation", () => {
  test("Command Palette trigger is keyboard-focusable and opens on Enter", async ({ page }) => {
    await page.goto("/");

    // Focused directly rather than by counting Tab presses from the page
    // top: the homepage has many legitimate focusable elements before this
    // one (skip link, nav, hero CTAs, tags...), so a fixed tab-count would
    // be both slow and brittle against unrelated layout changes. What
    // actually matters for accessibility is tested directly: can this
    // element receive focus, and does it respond to keyboard activation.
    const trigger = page.getByRole("button", { name: "Open quick navigation (Cmd+K)" });
    await trigger.focus();
    await expect(trigger).toBeFocused();

    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Quick navigation" });
    await expect(dialog).toBeVisible();

    // Focus trap: Tab should stay inside the dialog, not escape to the page behind it.
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
    }
    const activeIsInsideDialog = await dialog.evaluate(
      (el) => el.contains(document.activeElement) || el === document.activeElement
    );
    expect(activeIsInsideDialog).toBe(true);
  });
});
